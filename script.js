console.log('🔌 script.js loaded as ES module');

// Safety guard for DOM lookups in early loads
document.addEventListener('DOMContentLoaded', () => {
  // no-op: your existing listeners can stay as-is
});

(async () => {
  
  // 1) Dynamic ES-module imports
  const THREE = await import('https://esm.sh/three@0.153.0');
  const { OBJLoader } = await import('https://esm.sh/three@0.153.0/examples/jsm/loaders/OBJLoader.js');
  const { OrbitControls } = await import('https://esm.sh/three@0.153.0/examples/jsm/controls/OrbitControls.js');

  // Viewer-only globals/aliases
  const TEX_KEY = 'mm_tex_choice';           // 'basic' | 'advanced'
  const MUSCLE_INFO = window.MUSCLE_INFO || {};

  const body  = document.body;

  let isDragging = false;

  // --- optional theme toggle (guarded) ---
// --- Theme Toggle ---
  // Updated IDs to match the index.html link tags
  const darkSheet  = document.getElementById('dark-theme-sheet');
  const lightSheet = document.getElementById('light-theme-sheet');
  const themeToggleBtn  = document.getElementById('themeToggle');
  
  if (themeToggleBtn && darkSheet && lightSheet) {
    // 1. Initial Load: Check localStorage
    const savedTheme = localStorage.getItem('theme');
    // If user prefers dark or system setting is dark, start dark
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      darkSheet.disabled = false;
      lightSheet.disabled = true;
    } else {
      // Default to light (lightSheet is already enabled in HTML, darkSheet is disabled)
      darkSheet.disabled = true;
      lightSheet.disabled = false;
    }
    
    // 2. Click Handler: Toggle
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyDark = !darkSheet.disabled;
      
      // Toggle the state
      darkSheet.disabled = isCurrentlyDark;
      lightSheet.disabled = !isCurrentlyDark;
      
      const nextTheme = isCurrentlyDark ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      console.log(`Theme toggled to: ${nextTheme}`);
    });
  }

  // ---------- Three.js Scene setup ----------
  const container = document.getElementById('three-container');
  if (!container) return console.error('Missing #three-container');

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0.6, 0.6, 2.3,);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // sRGB output path for richer colors
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  container.appendChild(renderer.domElement);

  scene.add(
    new THREE.HemisphereLight(0xffffff, 0x444444, 0.6),
    (() => { const dl = new THREE.DirectionalLight(0xffffff, 0.8); dl.position.set(5,10,7.5); return dl; })()
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.zoomSpeed    = 0.7;
  controls.minDistance  = 0.5;
  controls.maxDistance  = 4;

  // --- Hover tooltip setup ---
  const mmTip = document.createElement('div');
  mmTip.className = 'mm-tooltip';
  document.body.appendChild(mmTip);
  function showTip(text, x, y) {
    mmTip.textContent = text;
    mmTip.style.left = x + 'px';
    mmTip.style.top  = y + 'px';
    mmTip.classList.add('show');
  }
  function hideTip() { mmTip.classList.remove('show'); }

  // Loaders & state
  const texLoader  = new THREE.TextureLoader();
  const objLoader  = new OBJLoader();
  const raycaster  = new THREE.Raycaster();
  const pointer    = new THREE.Vector2();
  let model        = null;
  const loader = new THREE.TextureLoader();
  const boneTex = loader.load('Ecorche_Bones.png', t => {
  t.encoding = THREE.sRGBEncoding;  // match your color workflow
  t.wrapS = t.wrapT = THREE.RepeatWrapping; // keep default if atlas
});

// Keep a global so you can toggle later
const BoneOverlay = { enabled: false, mix: 1.0, mode: 'multiply' }; // mix 0..1

function addBoneOverlay(mat) {
  if (!mat || mat.userData._hasBoneOverlay) return;

  mat.onBeforeCompile = (shader) => {
    // uniforms we can tweak later
    shader.uniforms.uBoneTex = { value: boneTex };
    shader.uniforms.uBoneMix = { value: BoneOverlay.enabled ? BoneOverlay.mix : 0.0 };
    shader.uniforms.uBoneMode = { value: 0 }; // 0=multiply, 1=overlay, 2=add

    // add a sampler + helper at the top of fragment shader
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `
        #include <common>
        uniform sampler2D uBoneTex;
        uniform float uBoneMix;
        uniform int uBoneMode;

        vec3 blendOverlay(vec3 base, vec3 blend) {
          return mix(2.0*base*blend, 1.0 - 2.0*(1.0-base)*(1.0-blend), step(0.5, base));
        }
        `
      )
      // right after diffuse color is computed, mix in bone texture using the same UVs
      .replace(
        '#include <map_fragment>',
        `
        #include <map_fragment>
        vec3 boneRGB = texture2D(uBoneTex, vMapUv).rgb;
        #if defined( USE_MAP )
          // baseColor = texelColor.xyz already computed by <map_fragment>
          vec3 mixed;
          if (uBoneMode == 0) {
            mixed = diffuseColor.rgb * boneRGB;                // multiply
          } else if (uBoneMode == 1) {
            mixed = blendOverlay(diffuseColor.rgb, boneRGB);   // overlay
          } else {
            mixed = diffuseColor.rgb + boneRGB - 1.0;          // add
          }
          diffuseColor.rgb = mix(diffuseColor.rgb, mixed, uBoneMix);
        #endif
        `
      );

    // stash so we can update later
    mat.userData.shader = shader;
  };

  mat.needsUpdate = true;
  mat.userData._hasBoneOverlay = true;
}

function setBoneOverlayEnabled(on) {
  BoneOverlay.enabled = on;
  scene.traverse(o => {
    if (o.isMesh) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => {
        if (!m?.userData?.shader) return;
        m.userData.shader.uniforms.uBoneMix.value = on ? BoneOverlay.mix : 0.0;
      });
    }
  });
}



// Optional: switch blend mode (multiply/overlay/add)
function setBoneBlendMode(mode) {
  // 0=multiply, 1=overlay, 2=add
  const modeIdx = { multiply:0, overlay:1, add:2 }[mode] ?? 0;
  BoneOverlay.mode = mode;
  scene.traverse(o => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach(m => m?.userData?.shader && (m.userData.shader.uniforms.uBoneMode.value = modeIdx));
  });
}


// Apply to all textured meshes you want to support
scene.traverse(o => {
  if (o.isMesh) {
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach(m => {
      if (m && (m.map || m.userData.forceOverlay)) addBoneOverlay(m);
    });
  }
});



  // Selection state (persistent highlight)
  let selectedMesh = null;
  let selectedPrevEmissive = 0x000000;
  const HOVER_COLOR  = 0x777777;   // tweak if you want lighter/darker
  const SELECT_COLOR = 0x66ccff;
    // --- ISOLATION MODE ---
    let isIsolationActive = false;
    const isolateBtn = document.getElementById('isolate-btn');
  
    function isolateMesh(meshToIsolate) {
      if (!model) return;
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = (child === meshToIsolate) ? 1.0 : 0.15;
          child.material.needsUpdate = true;
        }
      });
    }
  
    function clearIsolation() {
      if (!model) return;
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.needsUpdate = true;
        }
      });
    }
  
    isolateBtn?.addEventListener('click', () => {
      isIsolationActive = !isIsolationActive;
      isolateBtn.classList.toggle('is-active', isIsolationActive);
      
      if (isIsolationActive) {
        if (selectedMesh) {
          isolateMesh(selectedMesh);
        } else {
          // If nothing is selected, don't stay in isolation mode
          isIsolationActive = false; 
          isolateBtn.classList.remove('is-active');
        }
      } else {
        clearIsolation();
      }
    });

  // --- Preload textures & cache ---
  const textureURLs = ['Ecorche_Muscles.png','Ecorche_Muscles_Color_Codes.png'];
  const textureCache = new Map();
  let pendingTextureURL = null; // apply after model loads, if needed

  function loadTex(url) {
    return new Promise((resolve, reject) => {
      texLoader.load(
        url,
        (tex) => {
          if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
          const anis = renderer.capabilities.getMaxAnisotropy?.() || 1;
          tex.anisotropy = anis;
          textureCache.set(url, tex);
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }
  Promise.all(textureURLs.map(loadTex))
    .then(() => console.log('✅ Textures preloaded'))
    .catch(err => console.warn('Texture preload issue:', err));

// -------------------------------------------------------------
  // NEW: Helper to toggle the spinner
  // -------------------------------------------------------------
  const loaderEl = document.getElementById('texture-loader');
  function toggleLoader(show) {
    if (!loaderEl) return;
    if (show) loaderEl.classList.remove('hidden');
    else loaderEl.classList.add('hidden');
  }

  // -------------------------------------------------------------
  // REPLACEMENT: applyTexture with loading logic
  // -------------------------------------------------------------
  function applyTexture(url) {
    // 1. Show Loader immediately
    toggleLoader(true);

    const useTex = (tex) => {
      // Safety check: if model isn't ready yet
      if (!model) { 
        pendingTextureURL = url; 
        toggleLoader(false); // Hide spinner, we are just queuing it
        return; 
      }

      model.traverse(ch => {
        if (ch.isMesh) {
          ch.material.map = tex;
          ch.material.needsUpdate = true;
        }
      });
      
      // 2. Hide Loader once applied
      // A small 100ms delay ensures the UI doesn't flash too quickly
      setTimeout(() => toggleLoader(false), 100);
    };

    const cached = textureCache.get(url);
    if (cached) {
      useTex(cached);
    } else {
      loadTex(url)
        .then(useTex)
        .catch(err => {
          console.error('Texture load error', err);
          toggleLoader(false); // Important: Hide spinner even if it fails!
        });
    }
  }

  // initial texture (remember choice)
  const savedTex = localStorage.getItem(TEX_KEY) || 'basic';
  applyTexture(savedTex === 'advanced'
    ? 'Ecorche_Muscles_Color_Codes.png'
    : 'Ecorche_Muscles.png');
  // reflect in radios
  const savedRadio = document.querySelector(`input[name="texture"][value="${savedTex}"]`);
  if (savedRadio) savedRadio.checked = true;

  // Load model
  objLoader.load(
    'Ecorche_by_AlexLashko.obj',
    obj => {
      model = obj;
      // center model
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);
      obj.traverse(ch => {
        if (ch.isMesh) {
          ch.material = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.1, color: 0xffffff });
        }
      });
      scene.add(obj);


      // if a texture was requested before model loaded, apply it now
      if (pendingTextureURL) {
        const tex = textureCache.get(pendingTextureURL);
        if (tex) applyTexture(pendingTextureURL);
        pendingTextureURL = null;
      }
    },
    xhr => console.log(`Model ${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`),
    err => console.error('OBJ load error', err)
  );

// MODIFIED BLOCK TO FIX ID CONFLICT
  // ---------- Texture Toggle Logic ----------
  const textureToggleBtn = document.getElementById('texture-toggle-btn'); // New, unique ID for the button
  const textureLabel = document.getElementById('texture-label');     // New, unique ID for the text
  const TEXKEY = 'mm_tex_choice';

  // Helper to update the UI (label text and button's ARIA state)
  function updateTextureUI(isAdvanced) {
    if (textureLabel) {
      textureLabel.textContent = isAdvanced ? 'High-Contrast Model' : 'Striated Model';
    }
    if (textureToggleBtn) {
      textureToggleBtn.setAttribute('aria-pressed', String(isAdvanced));
    }
  }

  // Sets the texture state, saves it, and updates the model/UI
  function setTextureChoice(choice) {
    localStorage.setItem(TEXKEY, choice);
    const isAdvanced = choice === 'advanced';
    
    const url = isAdvanced
      ? 'Ecorche_Muscles_Color_Codes.png'
      : 'Ecorche_Muscles.png';
    
    if (typeof applyTexture === 'function') {
        applyTexture(url);
    } else {
        console.warn("applyTexture function not found.");
    }
    updateTextureUI(isAdvanced);
  }

  // Restore state from localStorage on page load
  const initialTex = localStorage.getItem(TEXKEY) || 'basic';
  setTextureChoice(initialTex);
  
  // Attach the click event listener ONLY to the button
  textureToggleBtn?.addEventListener('click', () => {
    const currentChoice = localStorage.getItem(TEXKEY) || 'basic';
    const nextChoice = currentChoice === 'basic' ? 'advanced' : 'basic';
    setTextureChoice(nextChoice);
  });
  // ---------- End Texture Toggle Logic ----------



  // ---------- Selection + Zoom helpers ----------
  function getMeshForKey(key) {
    if (!model || !key) return null;
    const k = key.toLowerCase();
    let hit = null;
    model.traverse(ch => {
      if (hit || !ch.isMesh) return;
      const name = (ch.name || '').toLowerCase();
      if (name.includes(k)) hit = ch;
    });
    return hit;
  }
  function highlightMesh(mesh) {
    // clear previous
    if (selectedMesh && selectedMesh.material?.emissive) {
      selectedMesh.material.emissive.setHex(selectedPrevEmissive);
    }
    selectedMesh = mesh || null;
    if (selectedMesh?.material?.emissive) {
      selectedPrevEmissive = selectedMesh.material.emissive.getHex();
      selectedMesh.material.emissive.setHex(SELECT_COLOR);
    }
     // If isolation mode is active when a new mesh is selected, update the isolation
     if (isIsolationActive && selectedMesh) {
      isolateMesh(selectedMesh);
    } else if (isIsolationActive && !selectedMesh) {
      // If we de-select, turn off isolation
      isIsolationActive = false;
      isolateBtn.classList.remove('is-active');
      clearIsolation();
    }
  }
  function selectMeshByKey(key) {
    const m = getMeshForKey(key);
    if (!m) return false;
    highlightMesh(m);
    // ensure hover doesn't override selection
    if (m && m !== currentHover && currentHover?.material?.emissive) {
      currentHover.material.emissive.setHex(0x000000);
    }
    return true;
  }
  // Smoothly fit/zoom camera to a mesh (OrbitControls-friendly)
 // Smoothly fit/zoom camera to a mesh AND rotate to face it
 function zoomToMesh(mesh, opts = {}) {
  if (!mesh || !camera) return;
  const { duration = 900, fitRatio = 1.35, reorient = false } = opts; // Added reorient flag

  const box = new THREE.Box3().setFromObject(mesh);
  const sphere = box.getBoundingSphere(new THREE.Sphere());

  const startPos = camera.position.clone();
  const startTarget = controls ? controls.target.clone() : new THREE.Vector3();
  const endTarget = sphere.center.clone();

  // --- NEW LOGIC: CALCULATE "FRONT" FACING ANGLE ---
  let dir;
  if (reorient) {
    // Calculate direction from World Origin (0,0,0) -> Muscle Center
    // This creates a vector pointing "outward" from the body through the muscle
    const worldOrigin = new THREE.Vector3(0, 0, 0);
    dir = new THREE.Vector3().subVectors(sphere.center, worldOrigin).normalize();
    
    // Edge case safety: if muscle is exactly at center, default to current camera angle
    if (dir.lengthSq() === 0) {
      dir = startPos.clone().sub(startTarget).normalize();
    }
  } else {
    // OLD LOGIC: Keep the current camera angle (don't rotate around)
    dir = startPos.clone().sub(startTarget).normalize();
  }

  // Determine distance needed to fit the object
  // (Math: fits the sphere radius within the camera's field of view)
  const dist = sphere.radius * fitRatio / Math.sin(THREE.MathUtils.degToRad(camera.fov * 0.5));
  
  // Calculate final camera position along that direction vector
  const endPos = endTarget.clone().add(dir.multiplyScalar(dist));

  const t0 = performance.now();
  function animateZoom() {
    const t = Math.min(1, (performance.now() - t0) / duration);
    // ease in-out formula
    const e = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;

    camera.position.lerpVectors(startPos, endPos, e);
    if (controls) {
      controls.target.lerpVectors(startTarget, endTarget, e);
      controls.update();
    }
    // Ensure camera looks at the target throughout the animation
    camera.lookAt(controls ? controls.target : endTarget);
    
    if (t < 1) requestAnimationFrame(animateZoom);
  }
  animateZoom();
}
  function autoZoomToKey(key, opts) {
    const m = getMeshForKey(key);
    if (m) zoomToMesh(m, opts);
  }

// ---- Hover highlight + tooltip (Smarter "Drill-Through" Version) ----
let currentHover = null;
container.addEventListener('pointermove', e => {

  if (e.buttons === 1) { 
    isDragging = true;
  }
  
  if (isDragging) {
    hideTip();
    if (currentHover && currentHover !== selectedMesh && currentHover.material?.emissive) {
      currentHover.material.emissive.setHex(0x000000);
    }
    currentHover = null;
    return; 
  }

  if (!model) return;
  
  const rect = container.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  
  // Get ALL things the ray passes through
  const hits = raycaster.intersectObject(model, true);

  // NEW LOGIC: Find the first hit that actually has a dictionary entry
  let validHit = null;
  let validKey = null;

  for (const hit of hits) {
    const mesh = hit.object;
    const meshName = (mesh.name || '').toLowerCase();
    // Try to find a matching key for this specific hit
    const foundKey = Object.keys(MUSCLE_INFO).find(k => meshName.includes(k));
    
    if (foundKey) {
      validHit = mesh;
      validKey = foundKey;
      break; // Stop looking, we found the closest VALID muscle
    }
  }

  if (validHit) {
    const mesh = validHit;

    if (currentHover !== mesh) {
      // Clear previous hover if it wasn't the selected one
      if (currentHover && currentHover !== selectedMesh && currentHover.material?.emissive) {
        currentHover.material.emissive.setHex(0x000000);
      }
      // Highlight new hover (unless it's already selected)
      if (mesh !== selectedMesh && mesh.material?.emissive) {
        mesh.material.emissive.setHex(HOVER_COLOR);
      }
      currentHover = mesh;
    }

    // Show tooltip using the valid key we found
    showTip(MUSCLE_INFO[validKey].title, e.clientX + 12, e.clientY + 12);

  } else {
    // We hit nothing, OR we only hit unlabelled junk
    if (currentHover && currentHover !== selectedMesh && currentHover.material?.emissive) {
      currentHover.material.emissive.setHex(0x000000);
    }
    currentHover = null;
    hideTip();
  }
});
  // Hide tooltip when pointer leaves the viewer
  container.addEventListener('pointerleave', hideTip);

  container.addEventListener('pointerdown', e => {
    isDragging = false;
  });
  
  // 2. New pointerup listener: This now handles all click/select logic.
  container.addEventListener('pointerup', e => {
    // ---------------------------------------------------------
    // NEW: Ignore clicks if they landed on a Button or the Control Panels
    // ---------------------------------------------------------
    if (e.target.closest('button') || 
        e.target.closest('.controls') || 
        e.target.closest('.viewer-hud-right')) {
      return; 
    }
    // If we dragged, 'isDragging' will be true. Do nothing.
    if (isDragging) return;
  
    // If we're here, it was a 'click' (no move).
    // Now we do the raycast to select or deselect.
    if (!model) return;
    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(model, true);
  
    if (hits.length) {
      // Clicked on a mesh: Select it
      const mesh = hits[0].object;
      
      // Only re-select and zoom if it's a *different* muscle
      if (mesh !== selectedMesh) {
        highlightMesh(mesh);
  
        const meshName = (mesh.name || '').toLowerCase();
        const key = Object.keys(MUSCLE_INFO).find(k => meshName.includes(k));
        if (key) {
          openSidebarWith(key);
          autoZoomToKey(key, { duration: 900, fitRatio: 1.35 });
        }
      }
      
    } else {
      // Clicked on the background: Deselect
      highlightMesh(null);
      
      // Call the new function (from Step 2) to clear the panel
      if (window.clearSidebar) {
        window.clearSidebar();
      }
    }
  });

// ---- Zoom Button Logic ----
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');

zoomInBtn?.addEventListener('click', () => {
  // dollyIn moves the camera closer (decreases radius)
  controls.dollyIn(1.2); 
  controls.update();
});

zoomOutBtn?.addEventListener('click', () => {
  // dollyOut moves the camera further away (increases radius)
  controls.dollyOut(1.2);
  controls.update();
});

  // ---- Center / Reset Button Logic ----
  const centerBtn = document.getElementById('center-btn');
  
  centerBtn?.addEventListener('click', () => {
    // 1. Reset Camera to the initial load position defined at the top of your script
    camera.position.set(0.6, 0.6, 2.3);
    
    // 2. Reset the target the camera is looking at.
    // (Users may have panned away, so we must force it back to world origin 0,0,0)
    controls.target.set(0, 0, 0);
    
    // 3. Update controls to apply the changes immediately
    controls.update();
  });
  // ---- Sync UI Selection to 3D Model ----
  // This listens for when a user clicks the Index or Search
  window.addEventListener('mm:selected', (e) => {
    const key = e.detail?.name;
    if (!key) return;

    // 1. Find and Highlight the mesh
    selectMeshByKey(key);

    // 2. Zoom camera to the mesh
    autoZoomToKey(key, { duration: 900, fitRatio: 1.35 });
  });

  // ---- Handle resize for renderer/camera ----
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // ---- Animate ----
  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();
})();
