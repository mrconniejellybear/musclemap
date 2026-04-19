/* === UI CORE — no three.js, just panels/rail/resizer ===================== */
console.info('✅ UI core executing');

/* ===== MUSCLE DATA + RENDERERS + INDEX BUILDER ======================== */
/* 1) Data (extend this with all your real entries) */
window.MUSCLE_INFO = window.MUSCLE_INFO || {
  trapezius: {
    title: 'Trapezius (traps)', img: 'Trapezius_back.png', 
    description: "The trapezius are two (L and R) flat, superficial muscles that cover the upper posterior thorax and neck. It's name comes from its trapezoid like shape.", head: 'While the traps do not have mutiple heads, they are divided horizontally into three areas: The upper, middle, and lower fiber regions, as pictured.', function: 'Scapular elevation, retraction, and depression; assists with neck extension and posture.', exercises: ['Barbell Shrug', 'Face Pull', 'Cable Row'], explanation: 'Because this muscle retracts and elevates the scapulae, rowing and shrugging movements keep it under tension through scapular motion and load.'
  },
  deltoid: {
    title: 'Deltoid (Shoulder)', img: 'Deltoid_muscle_animation2.gif', 
    description: "When a person says they're training their shoulders, they're really referring their deltoids. Named after the Greek letter delta (Δ), deltoids are a triangular muscle that cap the shoulder.", head: 'There are three heads of the deltiod: the anterior, lateral, and posterior.', function: 'Shoulder abduction (lateral), flexion/internal rotation (anterior), extension/external rotation (posterior).', exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly'], explanation: "Because this muscle abducts and rotates the shoulder, each of the three deltoid heads can be worked through pressing a nd raise movements. Because this muscle abducts and rotates the shoulder, pressing and raise patterns load specific heads across the range of motion."

  }, 
  supraspinatus: {
    title: 'Supraspinatus (rotator cuff)', img: 'Supraspinatus_muscle_back.png', 
    description: 'This muscle gets its name from its position “above the spine” of the scapula. It is a deep, superior rotator cuff muscle.', head: 'No distinct heads; single deep muscle.', function: 'Initiates shoulder abduction and stabilizes the glenohumeral joint.', exercises: ['Cable Scaption', 'Band External Rotation (neutral)', 'Light DB Lateral Raise (first 30°)'], explanation: 'Because this muscle initiates abduction and stabilizes the humeral head, gentle scaption and controlled lateral work load it safely.'
  }, 
  infraspinatus: {
    title: 'Infraspinatus (rotator cuff)', img: 'Infraspinatus_muscle_back.png', 
    description: 'This muscle gets its name from its position “below the spine” of the scapula. It is a posterior rotator cuff muscle.', head: 'No distinct heads; single deep muscle.', function: 'External rotation of the shoulder; humeral head stabilization.', exercises: ['Cable External Rotation', 'Side-Lying ER', 'Face Pull (ER bias)'], explanation: 'Because this muscle externally rotates the humerus, ER-focused movements maintain tension through rotation under load.'
  }, 
  teres_minor: {
    title: 'Teres Minor (rotator cuff)', img: '640px-Teres_minor_muscle_back3.png', 
    description: 'This muscle gets its name from being a small, rounded muscle on the posterior scapula.', head: 'No distinct heads; small cuff muscle.', function: 'External rotation and adduction of the shoulder; stabilizes the shoulder joint.', exercises: ['Cable External Rotation', 'Band ER Walkout', 'Face Pull (ER bias)'], explanation: 'Because this muscle assists in external rotation, ER drills with constant tension target its stabilizing role.'
  }, 
  subscapularis: {
    title: 'Subscapularis (Rotator Cuff)', img: 'Subscapularis_muscle_back.png', 
    description: 'This muscle gets its name from its location on the anterior (subscapular) surface of the scapula.', head: 'No distinct heads; large anterior cuff muscle.', function: 'Internal rotation of the shoulder and anterior stabilization of the humeral head.', exercises: ['Cable Internal Rotation', 'Isometric IR Hold', 'Bottoms-Up KB Hold'], explanation: 'Because this muscle internally rotates and stabilizes the shoulder, IR and anti-rotation drills load it safely.'
  },
  teres_major: {
    title: 'Teres Major', img: 'Teres_major_muscle_back.png', 
    description: 'This muscle gets its name from being a larger rounded muscle near the scapula’s inferior angle.', head: 'No distinct heads; single posterior muscle.', 
    function: 'Shoulder extension, adduction, and internal rotation; assists latissimus.', exercises: ['Lat Pulldown (neutral)', 'Straight-Arm Pulldown', 'Dumbbell Row'], explanation: 'Because this muscle extends and adducts the shoulder, pulldown and row patterns place it under tension through the long arm path.'
  }, 
  pectoralis_major: {
    title: 'Pectoralis Major', img: 'pecpic.jpg', 
    description: 'Derived from Latin "pectus," meaning breast, the pectoralis majors are two wide chest muscles located just beneath the breast tissue. Together with the pectoralis minor, these muscles make up what we call the chest.', head: 'The pectoralis major is comprised of two heads: the Clavicluar, (upper), and the Sternocostal (lower)', function: 'Pectoralis major are responsible for horizontal adduction, shoulder flexion, and extension from flexion; internal rotation.', exercises: 
    ['Flar Bench press (Dumbbell, barbell, machine)', 
      'Incline (15% - 45%) Bench Press (Dumbbell, barbell, machine)', 
      'Pec fly (Dumbbell, cable, machine'], explanation: 'Because the pectoralis adducts the humerus across the body, pressing and fly motions keep continuous tension through the movement.'
  }, 
  pectoralis_minor: {
    title: 'Pectoralis Minor', img: '640px-Pectoralis_minor_muscle_frontal.png', 
    description: 'The Pectoralis Minor gets its name from being the smaller pectoral muscle beneath pec major. It is located beneath the pectoralis major, and can not be seen without looking beneath the major. Can be seen vy removing the outer layer in the viewer.', head: 'Unlike the major, the pectoralis minor does not have multiple heads.', function: 'Scapular protraction and depression; assists with rib elevation in breathing.', exercises: ['Push-Up Plus', 'Cable Press with Protraction', 'Scap Push-Up'], explanation: 'Because this muscle protracts the scapula, cues that reach and round the upper back bias its activation under load.'
  },
  sternocleidomastoid: {
    title:'Sternocleidomastoid', img: 'Sternomastoid_muscle_animation_small2.gif',
  },  
  serratus_anterior: {
    title: 'Serratus Anterior', img: '640px-Serratus_anterior_muscles_back.png', 
    description: 'The Serratus Anterior is a fan-shaped muscle on the surface of the top half of the ribcage. Its main part lies deep under the scapula and pectoral muscles. Its name comes from the serrated appearance it makes along the ribs.', 
    head: 'No distinct heads; series of digitations on the ribs.', 
    function: 'Scapular protraction and upward rotation; stabilizes the scapula against the thorax.', 
    exercises: ['Push-Up Plus', 'Wall Slide (reach)', 'Landmine Press'], 
    explanation: 'Because this muscle protracts and upwardly rotates the scapula, reach-focused presses and plus reps load it well.'
  }, 
  latissimus_dorsi: {
    title: 'Latissimus Dorsi (Lats)', 
    img: 'Latissimus_dorsi_muscle_back.png', 
    description: 'The Latissimus Dorsi, often called "lats," span the entire width of the lower to middle back. They have the largest surface area of any muscle in the human body, but are beat by the glutes in terms of mass. Like many muscles, the name latissimus comes from Latin, meaning "broadest".',
    head: 'Despite its size, the Latissimus Dorsi does not have multiple heads. It is a uniform muscle.', 
    function: 'Shoulder extension, adduction, and internal rotation; trunk/ pelvic contribution in powerful pulls.', 
    exercises: ['Pull-Up', 'Lat Pulldown', 'Single-Arm DB Row'], 
    explanation: 'Because this muscle adducts and extends the humerus, vertical pulls and rows keep strong tension along its fibers.'
  },
  erector_spinae: {
    title: 'Erector Spinae', 
    img: 'erector_spinae.jpg', 
    description: 'The erector spinae is a large, superficial muscle that comprises the intermediate layer of the intrinsic (deep) back muscles. Its name comes from its purpose in erecting the spine vertically. The erector spinae extend on either side of the vertebral column, between the base of the cranium and pelvis. It is divided into three groups, from medial to lateral.', 
    head: 'Iliocostalis, longissimus, and spinalis columns.', 
    function: 'Spinal extension and anti-flexion stability; posture control.',
    exercises: ['Back Extension', 'Romanian Deadlift', 'Good Morning'], 
    explanation: 'Because this group resists spinal flexion, hip hinges and extensions train it isometrically and concentrically.'
  },  
  rectus_abdominis: {
    title: 'Rectus Abdominis (Abs)', img: 'abs.jpg', description: 'This muscle gets its name from its straight (rectus) vertical fiber orientation on the abdomen.', head: 'No distinct heads; tendinous intersections create “six-pack” segments.', function: 'Trunk flexion and posterior pelvic tilt; anti-extension core stability.', exercises: ['Crunch', 'Reverse Crunch', 'Cable Ab Pulldown'], explanation: 'Because this muscle flexes the trunk and resists extension, flexion and anti-extension drills maintain tension effectively.'
  },  
  external_oblique: {
    title: 'External Oblique', img: 'external_oblique.jpg', description: 'This muscle gets its name from its external, diagonal fiber orientation along the lateral abdomen.', head: 'No distinct heads; broad sheet muscle.', function: 'Trunk rotation, lateral flexion, and anti-rotation stability; assists forced exhalation.', exercises: ['Cable Woodchop', 'Side Plank', 'Bicycle Crunch'], explanation: 'Because this muscle rotates and stabilizes the trunk, anti-rotation and chop patterns challenge it under tension.'
  },
  transversus_abdominis: {
    title: 'Transversus Abdominis', img: 'transversus_abdominis.jpg', description: 'This muscle gets its name from its transverse (horizontal) fibers encircling the abdomen.', head: 'No distinct heads; deepest abdominal layer.', function: 'Abdominal bracing and spinal stability; compresses abdominal contents.', exercises: ['Dead Bug', 'Pallof Press', 'Plank (bracing focus)'], explanation: 'Because this muscle braces the core, isometric anti-movement drills create sustained tension for stability.'
  },
  biceps_brachii: {
    title: 'Biceps Brachii', img: 'Biceps_brachii_muscle06.png', 
    description: 'Aptly named, the has two heads splitting vertically along on the inner arm, parallel to the torso. When in the bicep undergoes concentric contraction (curling), the muscle shortens and bulges outward, creating the iconic "bicep peak."', 
    head: 'The bicep has one long head on the outside (red), and one short head on the inside (green).', 
    function: 'The biceps brachii supinate the forarm, and are its primary flexor.', 
    exercises: ['Bicep Curl (Dumbell, Cable, Barbell, etc.)', 'Hammer Curl', 'Peacher Curl', 'Chin-ups', 'Pull-ups (Favors the back)'], 
    explanation: 'Because this muscle flexes the elbow and supinates, curling with supination and long-lever positions maintains tension.'
  },
  brachialis: {
    title: 'Brachialis', img: 'Brachialis_muscle02.png', 
    description: 'The brachialis muscle gets its name from its location on the arm (brachium). It can be found in the anteroinferior area of the arm and lies deeper than the biceps brachialis muscle.',
    head: 'No distinct heads; deep elbow flexor.', 
    function: 'The brachialis is an important flexor muscle of the forearm at the elbow.The brachialis provides elbow flexion at any positions, making it a "pure flexor" of the forearm.', 
    exercises: ['Hammer Curl', 'Reverse Curl', 'Cable Curl (neutral)'], explanation: 'Because this muscle flexes the elbow independent of grip, neutral and pronated curls bias it strongly.'
  },
  brachioradialis: {
    title: 'Brachioradialis', img: 'brachioradialis.jpg', 
    description: 'This muscle gets its name from spanning the arm (brachium) to the radius.', head: 'No distinct heads; superficial forearm flexor.', function: 'Elbow flexion strongest in neutral (thumbs-up) grip; assists pronation/supination to neutral.', exercises: ['Hammer Curl', 'Cable Rope Curl', 'EZ-Bar Curl (neutral)'], explanation: 'Because this muscle favors a neutral grip, hammer-style curls load it through its strongest range.'
  },
  triceps: {
    title: 'Triceps Brachii', img: '640px-Triceps_brachii_muscle07.png', 
    description: 'Like its sibling, the bicep, the tricep brachiis gets their name from their number of heads.', head: 'Long, lateral, and medial heads.', function: 'Elbow extension; long head assists shoulder extension and adduction.', exercises: ['Cable Pressdown', 'Tricep Kickback', 'Skullcrushers','Overhead Tricep Extension', 'Close-Grip Bench'], explanation: 'Because this muscle extends the elbow, pressdowns and overhead extensions keep constant tension across heads.'
  },
  pronator_teres: {
    title: 'Pronator Teres', img: 'pronator_teres.jpg', 
    description: 'This muscle gets its name from its rounded shape that pronates the forearm.', head: 'Humeral and ulnar heads.', function: 'Forearm pronation and weak elbow flexion.', exercises: ['Cable Pronation', 'Hammer Curl to Pronation', 'Reverse Curl (pronation emphasis)'], explanation: 'Because this muscle pronates the forearm, resisted rotation drills apply targeted tension.'
  },
  flexor_carpi_radialis: {
    title: 'Flexor Carpi Radialis', img: 'flexor_carpi_radialis.jpg', 
    description: 'This muscle gets its name from flexing the wrist on the radial side.', head: 'No distinct heads; superficial forearm flexor.', function: 'Wrist flexion and radial deviation.', exercises: ['Cable Wrist Curl', 'DB Wrist Curl (radial bias)', 'EZ-Bar Wrist Flexion'], explanation: 'Because this muscle flexes and radially deviates the wrist, wrist curls with a radial bias increase loading.'
  },
  palmaris_longus: {
    title: 'Palmaris Longus', img: 'palmaris_longus.jpg', 
    description: 'This muscle gets its name from its long tendon to the palm; absent in some people.', head: 'No distinct heads; superficial forearm flexor.', function: 'Assists wrist flexion and tenses palmar aponeurosis.', exercises: ['Cable Wrist Curl', 'Grip Squeeze Holds', 'Light DB Wrist Flexion'], explanation: 'Because this muscle assists wrist flexion, light wrist-flexion work and grip tasks create tension along its tendon.'
  },
  flexor_carpi_ulnaris: {
    title: 'Flexor Carpi Ulnaris', img: 'flexor_carpi_ulnaris.jpg', description: 'This muscle gets its name from flexing the wrist on the ulnar side.', head: 'Humeral and ulnar heads.', function: 'Wrist flexion and ulnar deviation.', exercises: ['Reverse Wrist Curl (ulnar bias)', 'Cable Wrist Flexion', 'Farmer’s Carry (neutral wrist)'], explanation: 'Because this muscle flexes and ulnar-deviates the wrist, ulnar-biased wrist work stresses its line of pull.'
  }, 
  flexor_digitorum_superficialis: {
    title: 'Flexor Digitorum Superficialis', img: 'flexor_digitorum_superficialis.jpg', description: 'This muscle gets its name from flexing the fingers at a superficial layer.', head: 'Humero-ulnar and radial heads.', function: 'Flexes proximal interphalangeal joints and assists wrist flexion.', exercises: ['Plate Pinch', 'Towel Grip Hang', 'Cable Finger Curl'], explanation: 'Because this muscle flexes the fingers, gripping and finger-curl tasks load it through the forearm.'
  },
  flexor_digitorum_profundus: {
    title: 'Flexor Digitorum Profundus', img: '640px-Inferior_view_of_flexor_digitorum_longus_muscle_-_animation.gif', description: 'This muscle gets its name from being the deep finger flexor.', head: 'No distinct heads; deep forearm flexor.', function: 'Flexes distal interphalangeal joints; assists wrist flexion.', exercises: ['Thick-Bar Hold', 'Captains of Crush', 'Finger Curl (heavy)'], explanation: 'Because this muscle flexes the fingertips, heavy grip and finger-curl work load it through long tendons.'
  }, 
  flexor_pollicis_longus: {
    title: 'Flexor Pollicis Longus', img: 'flexor_pollicis_longus.jpg', description: 'This muscle gets its name from flexing the thumb (pollex).', head: 'No distinct heads; deep forearm flexor.', function: 'Flexes thumb interphalangeal joint; assists wrist flexion.', exercises: ['Thumb Pinch Carry', 'Rubber-Band Thumb Flexion', 'Cable Thumb Curl'], explanation: 'Because this muscle flexes the thumb, targeted pinch and flexion drills maintain specific tension.'
  },
  supinator: {
    title: 'Supinator', img: 'supinator.jpg', description: 'This muscle gets its name from its role in supinating the forearm.', head: 'Superficial and deep layers.', function: 'Forearm supination; stabilizes the proximal radioulnar joint.', exercises: ['Cable Supination', 'Hammer-to-Supinated Curl', 'Light DB Supination Drill'], explanation: 'Because this muscle supinates the forearm, resisted rotation into palm-up positions loads it directly.'
  }, 
  extensor_carpi_radialis_longus: {
    title: 'Extensor Carpi Radialis Longus', img: 'extensor_carpi_radialis_longus.jpg', description: 'This muscle gets its name from extending the wrist on the radial side with a long belly.', head: 'No distinct heads; superficial forearm extensor.', function: 'Wrist extension and radial deviation.', exercises: ['Reverse Wrist Curl', 'DB Wrist Extension', 'Cable Wrist Extension'], explanation: 'Because this muscle extends the wrist, reverse wrist curls sustain tension along the radial side.'
  },  
  extensor_carpi_radialis_brevis: {
    title: 'Extensor Carpi Radialis Brevis', img: 'extensor_carpi_radialis_brevis.jpg', description: 'This muscle gets its name from extending the wrist on the radial side with a short belly.', head: 'No distinct heads; superficial forearm extensor.', function: 'Wrist extension and radial deviation; stabilizes wrist in gripping.', exercises: ['Reverse Wrist Curl', 'Grip + Wrist Extension Superset', 'Cable Wrist Extension'], explanation: 'Because this muscle stabilizes and extends the wrist, extension work paired with gripping challenges it.'
  },
  extensor_carpi_ulnaris: {
    title: 'Extensor Carpi Ulnaris', img: 'extensor_carpi_ulnaris.jpg', description: 'This muscle gets its name from extending the wrist on the ulnar side.', head: 'No distinct heads; superficial forearm extensor.', function: 'Wrist extension and ulnar deviation.', exercises: ['Reverse Wrist Curl (ulnar bias)', 'Cable Wrist Extension', 'Farmer’s Carry (neutral wrist)'], explanation: 'Because this muscle extends and ulnar-deviates the wrist, extension with ulnar bias increases loading.'
  },
  extensor_digitorum: {
    title: 'Extensor Digitorum', img: 'extensor_digitorum.jpg', description: 'This muscle gets its name from extending the digits (fingers).', head: 'No distinct heads; common extensor for fingers 2–5.', function: 'Finger extension at MCP joints; assists wrist extension.', exercises: ['Rubber-Band Finger Extension', 'Reverse Finger Curl', 'Light Cable Finger Ext.'], explanation: 'Because this muscle extends the fingers, banded finger extension and reverse curls load it directly.'
  },
  extensor_pollicis_longus: {
    title: 'Extensor Pollicis Longus', img: 'extensor_pollicis_longus.jpg', description: 'This muscle gets its name from extending the thumb with a long tendon.', head: 'No distinct heads; deep forearm extensor.', function: 'Extends thumb interphalangeal joint; assists wrist extension.', exercises: ['Thumb Extension Band', 'Cable Thumb Lift', 'Isometric Thumb Raise'], explanation: 'Because this muscle extends the thumb, isolated thumb-lift and band work target it precisely.'
  },
  abductor_pollicis_longus: {
    title: 'Abductor Pollicis Longus', img: 'abductor_pollicis_longus.jpg', description: 'This muscle gets its name from abducting the thumb with a long tendon.', head: 'No distinct heads; deep forearm muscle.', function: 'Thumb abduction at the carpometacral joint; assists wrist radial deviation.', exercises: ['Band Thumb Abduction', 'Cable Thumb Out', 'Isometric Thumb Spread'], explanation: 'Because this muscle abducts the thumb, lateral thumb-out drills keep its tendon under tension.'
  },
  gluteus_maximus: {
    title: 'Gluteus Maximus (glutes)', 
    img: '640px-Gluteus_maximus_3D.gif', 
    description: 'The Gluteus Maximus, often called the "glutes," are one of four muscles that make up the buttocks, including the gluteus medius, gluteus minimus, and tensor fasciae latae. It is the most superficial of all gluteal muscles, and has the largest mass of any muscle in the body.', 
    head: 'Upper and lower fiber regions; broad single muscle.', 
    function: 'Hip extension and external rotation; powerful hip drive.', 
    exercises: ['Barbell Hip Thrust', 'Back Squat', 'Romanian Deadlift'], 
    explanation: 'Because this muscle extends the hip, hinges, squats, and bridges keep continuous tension through hip drive.'
  },
  gluteus_medius: {
    title: 'Gluteus Medius', img: 'Gluteus_medius_muscle08.png', description: 'This muscle gets its name from being the middle-sized gluteal muscle on the lateral hip.', head: 'Anterior, middle, and posterior fiber regions.', function: 'Hip abduction and pelvic stabilization; assists internal/external rotation by fibers.', exercises: ['Cable Hip Abduction', 'Side-Lying Abduction', 'Banded Walks'], explanation: 'Because this muscle abducts and stabilizes the pelvis, abduction and lateral-band drills load it well.'
  },
  tensor: {
    title: 'Tensor Fasciae Latae (TFL)', img: 'tensor_fasciae_latae.jpg', description: 'This muscle gets its name from “tensing the fascia lata,” on the lateral hip.', head: 'No distinct heads; small lateral hip muscle.', function: 'Hip flexion, abduction, and internal rotation; tensions the IT band.', exercises: ['Banded Hip Abduction (slight flexion)', 'Cable Hip Flexion', 'Monster Walks'], explanation: 'Because this muscle flexes/abducts the hip, abduction with slight flexion biases its line of pull.'
  }, 
  iliopsoas: {
    title: 'Iliopsoas (Hip Flexors)', img: 'iliopsoas.jpg', description: 'This muscle group gets its name from the iliacus and psoas major joining to flex the hip.', head: 'Iliacus and psoas major (and psoas minor when present).', function: 'Primary hip flexion; assists trunk flexion.', exercises: ['Hanging Leg Raise (hip flexion)', 'Cable March', 'Seated Knee Raise'], explanation: 'Because this group flexes the hip, knee-raise and high-hip drills load it dynamically.'
  },
  piriformis: {
    title: 'Piriformis', img: 'Piriformis_large.gif', description: 'This muscle gets its name from its pear-like shape (piri = pear).', head: 'No distinct heads; deep external rotator.', function: 'Hip external rotation; abduction in flexed hip.', exercises: ['Clamshell', 'Band External Rotation', 'Cable Hip ER'], explanation: 'Because this muscle externally rotates the hip, ER drills with bands or cables create targeted tension.'
  },
  adductor_longus: {
    title: 'Adductor Longus', img: 'Adductor_longus.gif', description: 'This muscle gets its name from its long belly that adducts the thigh.', head: 'No distinct heads; superficial adductor.', function: 'Hip adduction and flexion; assists medial stabilization.', exercises: ['Adductor Machine', 'Copenhagen Plank', 'Cable Hip Adduction'], explanation: 'Because this muscle adducts the hip, inward-draw motions and isometric planks load it effectively.'
  },
  adductor_magnus: {
    title: 'Adductor Magnus', img: 'Adductor_magnus.gif', description: 'This muscle gets its name from being the great/large (magnus) adductor of the thigh.', head: 'Adductor portion and hamstring portion.', function: 'Hip adduction; posterior fibers assist hip extension.', exercises: ['Sumo Deadlift', 'Cable Hip Adduction', 'Wide-Stance Squat'], explanation: 'Because this muscle adducts and can extend the hip, wide pulling and adduction create tension across its portions.'
  },
  gracilis: {
    title: 'Gracilis', img: 'Gracilis.gif', description: 'This muscle gets its name from its slender (gracile) form along the medial thigh.', head: 'No distinct heads; long strap-like muscle.', function: 'Hip adduction and knee flexion with internal rotation.', exercises: ['Adductor Machine (light)', 'Copenhagen Plank (knee)', 'Cable Adduction'], explanation: 'Because this muscle adducts and assists knee flexion, inward pulls and isometrics load its long line.'
  },
  sartorius: {
    title: 'Sartorius', img: 'Sartorius_3D.gif', 
    description: 'This muscle gets its name from “tailor’s muscle,” crossing the thigh in a strap-like fashion.', head: 'No distinct heads; longest muscle in the body.', function: 'Hip flexion, abduction, and external rotation; knee flexion.', exercises: ['Step-Up (external rotation cue)', 'Cable March', 'Walking Lunge'], explanation: 'Because this muscle crosses hip and knee, multi-planar step and lunge patterns maintain functional tension.'
  },
  rectus_femoris: {
    title: 'Rectus Femoris (Quads)', 
    img: 'Rectus_femoris_3D.gif', 
    description: 'The Quadriceps Femoris are one of four muscles that comrpise the informal "quads," hence its name, which means "four-headed muscle” in Latin. They are the strongest muscle in the human body. It is located in the anterior compartment of the thigh.', 
    head: 'While the Rectus Femoris does not have multiple heads, it is one of four muscles that comprise the quads, (Also: vastus medialis, vastus lateralis, and vastus intermedius)', 
    function: 'The function of the quadriceps femoris muscle is to extend the leg at the knee joint and to flex the thigh at the hip joint.', 
    exercises: ['Back Squat', 'Leg Extension', 'Walking Lunge'], 
    explanation: 'Because this muscle extends the knee and flexes the hip, squats and extensions load it across both joints.'
  }, 
  vastus_lateralis: {
    title: 'Vastus Lateralis (Quads)', img: 'Vastus_lateralis.gif', 
    description: 'This muscle gets its name from its large (vastus) size on the lateral thigh; part of the quadriceps.', head: 'While the Rectus Femoris does not have multiple heads, it is, however, one of four muscles that comprise what we call the quads; including the Vastus Lateralis, Vastus Medialus, and .', function: 'Primary knee extension; lateral patellar tracking support.', exercises: ['Leg Press', 'Hack Squat', 'Leg Extension'], explanation: 'Because this muscle extends the knee, machine presses and extensions sustain direct tension.'
  }, 
  vastus_medialis: {
    title: 'Vastus Medialis (Quads)', img: 'Vastus_medialis.gif', description: 'This muscle gets its name from its large size on the medial thigh; part of the quadriceps.', head: 'No distinct heads; includes VMO distal fibers.', function: 'Knee extension; patellar stabilization near lockout.', exercises: ['Sissy Squat', 'Leg Extension (peak squeeze)', 'Heel-Elevated Squat'], explanation: 'Because this muscle contributes near terminal extension, slow lockouts and peak squeezes load it well.'
  }, 
  iliotibal_band: {title: 'iliotibal',

  },
  biceps_femoris_long_head: {
    title: 'Biceps Femoris', img: 'Biceps_femoris.gif', description: 'This muscle gets its name from having two heads on the back of the thigh; long head is biarticular.', head: 'Long head (biarticular).', function: 'Hip extension and knee flexion; external rotation of the tibia.', exercises: ['Romanian Deadlift', 'Nordic Curl', 'Glute-Ham Raise'], explanation: 'Because this muscle spans hip and knee, hip hinges and knee-flexion curls keep it under long-lever tension.'
  },
  semitendinosus: {
    title: 'Semitendinosus', img: 'Semitendinosus.png', description: 'This muscle gets its name from its long cord-like tendon on the posterior thigh.', head: 'No distinct heads; part of medial hamstrings.', function: 'Hip extension and knee flexion; internal rotation of the tibia.', exercises: ['Romanian Deadlift', 'Lying Leg Curl', 'Nordic Curl'], explanation: 'Because this muscle flexes the knee and extends the hip, hinges and curls load its medial line.'
  },
  semimembranosus: {
    title: 'Semimembranosus', img: 'Semimembranosus.gif', description: 'This muscle gets its name from its broad membranous tendon.', head: 'No distinct heads; part of medial hamstrings.', function: 'Hip extension and knee flexion; internal rotation of the tibia.', exercises: ['Stiff-Leg Deadlift', 'Seated Leg Curl', 'Glute-Ham Raise'], explanation: 'Because this muscle extends the hip and flexes the knee, combined hinge and curl work challenges it fully.'
  },
  tibialis_anterior: {
    title: 'Tibialis Anterior (shins)', img: 'tibialis_anterior.jpg', description: 'This muscle gets its name from its location along the anterior tibia.', head: 'No distinct heads; anterior lower-leg muscle.', function: 'Dorsiflexion and inversion of the foot; supports arch.', exercises: ['Toe Raise (wall or machine)', 'Banded Dorsiflexion', 'Tib Bar Raises'], explanation: 'Because this muscle dorsiflexes the ankle, toe-raise patterns keep it under direct tension.'
  },
  extensor_digitorum_longus: {
    title: 'Extensor Digitorum Longus', img: 'extensor_digitorum_longus.jpg', description: 'This muscle gets its name from extending the toes (digits) with a long tendon group.', head: 'No distinct heads; anterior compartment.', function: 'Extends toes 2–5 and assists dorsiflexion.', exercises: ['Banded Toe Extension', 'Ankle Dorsiflexion with Toe Focus', 'Isometric Toe Lift'], explanation: 'Because this muscle extends the toes, banded toe lifts and dorsiflexion drills apply specific tension.'
  },
  fibularis_longus: {
    title: 'Fibularis Longus (peroneus)', img: 'fibularis_longus.jpg', description: 'This muscle gets its name from its long path along the fibula on the lateral leg.', head: 'No distinct heads; lateral compartment.', function: 'Eversion and plantarflexion; supports the transverse arch.', exercises: ['Banded Eversion', 'Cable Ankle Eversion', 'Single-Leg Balance (eversion bias)'], explanation: 'Because this muscle everts the foot, resisted eversion maintains tension along its lateral line.'
  },
  gastrocnemius: {
    title: 'Gastrocnemius (Calf)', img: 'Gastrocnemius_muscle_-_animation.gif', description: 'This muscle gets its name from its “stomach of the leg” bulge; superficial calf.', head: 'Medial and lateral heads.', function: 'Plantarflexion of the ankle; assists knee flexion.', exercises: ['Standing Calf Raise', 'Donkey Calf Raise', 'Single-Leg Calf Raise'], explanation: 'Because this muscle crosses knee and ankle, straight-knee calf raises place it under maximal stretch-tension.'
  },
  soleus: {
    title: 'Soleus', img: 'Triceps_surae_-_animation.gif', description: 'This muscle gets its name from its fish-like shape (solea).', head: 'No distinct heads; deep to gastrocnemius.', function: 'Plantarflexion of the ankle; postural endurance muscle.', exercises: ['Seated Calf Raise', 'Bent-Knee Calf Raise', 'Farmer’s Carry on Toes'], explanation: 'Because this muscle works with a bent knee, seated calf raises isolate it under sustained tension.'
  },
  tibialis_posterior: {
    title: 'Tibialis Posterior', img: 'tibialis_posterior.jpg', description: 'This muscle gets its name from its position posterior to the tibia.', head: 'No distinct heads; deep posterior compartment.', function: 'Inversion and plantarflexion; key support for the medial arch.', exercises: ['Banded Inversion', 'Heel Raise with Inversion', 'Short Foot Drill'], explanation: 'Because this muscle inverts and supports the arch, inversion-biased calf work and foot drills load it specifically.'
  },
  flexor_digitorum_longus: {
    title: 'Flexor Digitorum Longus', img: 'flexor_digitorum_longus.jpg', description: 'This muscle gets its name from flexing the toes (digits) with a long tendon path.', head: 'No distinct heads; deep posterior compartment.', function: 'Flexes toes 2–5; assists plantarflexion and supports the arch.', exercises: ['Towel Curl', 'Marble Pick-Up', 'Isometric Toe Flexion'], explanation: 'Because this muscle flexes the toes and supports the arch, toe-curl drills provide direct tension.'
  }
}
  
  /* 2) Renderers for the tab content */
  function renderMuscleInfo(info){
    const $ = (id)=>document.getElementById(id);
    ($('muscleName')||{}).textContent = info.title || 'Muscle';
    const img = $('muscleImage');
    if (img){
      if (info.img){ img.src = info.img; img.alt = `${info.title} illustration`; img.style.display='block'; }
      else { img.removeAttribute('src'); img.alt=''; img.style.display='none'; }
    }
    const desc = $('info-desc'); if (desc) desc.textContent = info.description || 'Description coming soon.';
    const head = $('info-head'); if (head) head.textContent = info.head || '';
    const func = $('info-func'); if (func) func.textContent = info.function || '';
  }
  function renderMuscleExercises(info){
    const ul = document.getElementById('exerciseList');
    if (!ul) return;
    ul.innerHTML = (info.exercises||[]).map(x=>`<li>${x}</li>`).join('') || `<li>No exercises yet.</li>`;

    const explanation = document.getElementById('explanation');
    if(explanation) explanation.textContent = info.explanation || '';
  }
  
  /* 3) Open the info panel for a given key */
  window.openSidebarWith = function(key){
    const info = (window.MUSCLE_INFO || {})[key];
    // If missing, synthesize a readable title so the page still opens.
    const fallback = (k)=>({ title: k.replace(/[_-]/g,' ').replace(/\b\w/g,m=>m.toUpperCase()), description:'Coming soon.' });
    const data = info || fallback(key);
  
    renderMuscleInfo(data);
    renderMuscleExercises(data);
    
  
    // Let the viewer know (to highlight/zoom)
    window.dispatchEvent(new CustomEvent('mm:selected', { detail:{ name:key }}));

    
  };

  
  const navbar = document.querySelector('.navbar');

navbar.addEventListener('mouseenter', () => {
  navbar.classList.remove('is-leaving');
  navbar.classList.add('is-armed');        // grow L→R
});

navbar.addEventListener('mouseleave', () => {
  // run exit: keep armed, add leaving so it slides off to the right
  navbar.classList.add('is-leaving');

  // after the transform transition finishes, reset to initial (hidden)
  const onEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    navbar.classList.remove('is-armed', 'is-leaving');
    navbar.removeEventListener('transitionend', onEnd);
  };
  navbar.addEventListener('transitionend', onEnd);
});

  
  /* 4) Build the muscle index (list + search). */
(function buildIndex(){
  const UL = document.getElementById('mi-list');
  const Q  = document.getElementById('mi-search');
  if (!UL) return;

  const titleOf = (k,m)=>(m?.title)||k.replace(/[_-]/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
  function allItems(){
    return Object.entries(window.MUSCLE_INFO||{})
      .map(([key,m]) => ({ key, title: titleOf(key,m) }))
      .sort((a,b)=>a.title.localeCompare(b.title));
  }

  function render(list){
    UL.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const it of list){
      const li  = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = it.title;
      btn.dataset.key = it.key;
      btn.addEventListener('click', () => openSidebarWith(it.key));
      li.appendChild(btn); frag.appendChild(li);
    }
    UL.appendChild(frag);
  }

  function filter(q, items){
    const s = q.trim().toLowerCase();
    return !s ? items : items.filter(n => n.title.toLowerCase().includes(s));
  }

  // initial draw
  let ITEMS = allItems();
  render(ITEMS);

  // search
  Q?.addEventListener('input',(e)=>render(filter(e.target.value, ITEMS)));

  // keep highlight in sync
  addEventListener('mm:selected',(e)=>{
    const key = e.detail?.name;
    UL.querySelectorAll('button.is-active').forEach(el => el.classList.remove('is-active'));
    const match = [...UL.querySelectorAll('button')].find(b => b.dataset.key === key);
    if (match) {
      match.classList.add('is-active');
      match.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
  
  // Keyboard navigation for the index
  document.addEventListener('keydown', (e) => {
    const isSearchFocused = document.activeElement === Q;
    if (isSearchFocused && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const firstItem = UL.querySelector('button');
      if (firstItem) firstItem.focus();
      return;
    }
    
    if (document.activeElement.parentElement?.parentElement === UL || !isSearchFocused) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const current = document.activeElement;
        const next = current.parentElement.nextElementSibling?.querySelector('button');
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const current = document.activeElement;
        const prev = current.parentElement.previousElementSibling?.querySelector('button');
        if (prev) prev.focus();
        else if (!isSearchFocused) Q.focus();
      } else if (e.key === 'Enter' && document.activeElement.dataset.key) {
        openSidebarWith(document.activeElement.dataset.key);
      }
    }
  });


  // Viewer can send us all mesh names; we merge any we’re missing and rebuild once.
  window.addEventListener('mm:meshList', (e) => {
    const names = e.detail?.names || [];
    let added = 0;
    for (const raw of names){
      const k = raw.toLowerCase().replace(/[^a-z]/g,''); // normalized key
      if (!window.MUSCLE_INFO[k]){
        window.MUSCLE_INFO[k] = { title: titleOf(k) };
        added++;
      }
    }
    if (added){
      ITEMS = allItems();
      render(filter(Q.value, ITEMS));
      console.info(`📚 index merged ${added} new item(s) from model`);
    }
  });

  console.info(`📚 muscle index rendered: ${ITEMS.length} items`);
})();

(() => {
  const root  = document.documentElement;
  const body  = document.body;
  const panel = document.getElementById('panel');

  /* ---------------- panel width helpers (CSS var: --panel-w) --------- */
  function varPx(name, fallback=0){
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    if (!v) return fallback;
    if (v.endsWith('px')) return parseFloat(v);
    if (v.endsWith('vw')) return innerWidth * (parseFloat(v)/100);
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }
  const minPx = () => varPx('--panel-min', 260);
  const maxPx = () => varPx('--panel-max', Math.round(innerWidth * 0.5));

  function setPanelWidth(px){
    const w = Math.max(minPx(), Math.min(maxPx(), px|0));
    root.style.setProperty('--panel-w', `${w}px`);
    try { localStorage.setItem('mm.panel.width', `${w}px`); } catch {}
    dispatchEvent(new Event('resize'));
  }

  window.__mm = Object.assign(window.__mm || {}, { setPanelWidth });

  try { const saved = localStorage.getItem('mm.panel.width'); if (saved) root.style.setProperty('--panel-w', saved); } catch {}


  /* ---------------- late-bound resizer binding -------------------------- */
  function bindResizer(){
    const handle = document.getElementById('panel-resizer');
    if (!handle || !panel) return console.warn('no #panel-resizer or #panel');

    let startX = 0, startW = 0, active = false;

    function onDown(e){
      if (body.classList.contains('panel-closed')) return;
      active = true;
      startX = e.clientX;
      startW = panel.getBoundingClientRect().width;
      panel.classList.add('is-resizing');
      handle.setPointerCapture?.(e.pointerId);
      addEventListener('pointermove', onMove);
      addEventListener('pointerup', onUp, { once:true });
      e.preventDefault?.();
    }
    function onMove(e){
      if (active) setPanelWidth(startW - (e.clientX - startX));
    }
    function onUp(){ active = false; panel.classList.remove('is-resizing'); removeEventListener('pointermove', onMove); }

    handle.addEventListener('pointerdown', onDown);

    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        const cur = panel.getBoundingClientRect().width;
        setPanelWidth(cur + (e.key === 'ArrowLeft' ? 24 : -24)); 
        e.preventDefault();
      }
    });

    console.info('🟦 resizer bound');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindResizer, { once:true });
  } else { bindResizer(); }


  
})();
