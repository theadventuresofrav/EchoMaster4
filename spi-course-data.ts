
export const spiCoursesExpanded = {
  "courses": [
    {
      "id": "spi-main",
      "title": "ARDMS SPI Examination Review",
      "description": "A comprehensive review course for the Sonography Principles & Instrumentation (SPI) examination.",
      "modules": [
        {
          "id": 1,
          "title": "Propagation Speed & Acoustic Variables",
          "description": "Understanding the fundamental principles of sound waves in different media.",
          "topics": [
            {
              "id": "1-1",
              "title": "Acoustic Variables",
              "content": "Sound waves are mechanical, longitudinal waves that require a medium to travel. The four key acoustic variables are Pressure, Density, Temperature, and Particle Motion. These variables change as the sound wave passes through a medium. Pressure is measured in Pascals (Pa), Density in kg/cm³, Temperature in degrees, and Particle Motion (distance) in cm or mm.",
              "keyPoints": ["Mechanical, longitudinal wave", "Requires a medium", "Four variables: Pressure, Density, Temperature, Particle Motion"],
              "examFocus": "Know the four acoustic variables and that they are what define a sound wave."
            },
            {
              "id": "1-2",
              "title": "Propagation Speed",
              "content": "Propagation speed is the speed at which a sound wave travels through a medium. It is determined ONLY by the properties of the medium, specifically its stiffness (or bulk modulus) and density. Speed increases with stiffness and decreases with density. The average speed of sound in soft tissue is 1540 m/s or 1.54 mm/µs. Sound travels fastest in solids, slower in liquids, and slowest in gases.",
              "keyPoints": ["Determined by medium only", "Stiffness and density are key factors", "Average in soft tissue: 1540 m/s", "Solids > Liquids > Gases"],
              "examFocus": "Memorize the propagation speed in soft tissue and the hierarchy of speeds in different media (bone > soft tissue > fat > lung)."
            },
            {
              "id": "1-3",
              "title": "Frequency and Wavelength",
              "content": "Frequency (f) is the number of cycles per second (Hertz). Wavelength (λ) is the length of one cycle. They are inversely related: λ = c / f, where c is the propagation speed. In ultrasound, higher frequency transducers produce shorter wavelengths, which lead to better axial resolution but less penetration.",
              "keyPoints": ["Inversely related", "Higher frequency = shorter wavelength", "Wavelength affects axial resolution"],
              "examFocus": "Understand the inverse relationship between frequency and wavelength and its impact on image quality."
            }
          ],
           "quiz": {
            "questions": [
              {
                "questionText": "What is the average propagation speed of sound in soft tissue?",
                "options": ["1.54 m/s", "1540 cm/s", "1540 m/s", "1.54 mm/s"],
                "correctAnswer": "1540 m/s",
                "explanation": "The average propagation speed in soft tissue is a fundamental value in ultrasound physics, standardized as 1540 m/s, which is equivalent to 1.54 mm/µs."
              },
              {
                "questionText": "Which of the following properties of a medium has the greatest influence on propagation speed?",
                "options": ["Frequency", "Stiffness", "Viscosity", "Temperature"],
                "correctAnswer": "Stiffness",
                "explanation": "Propagation speed is determined by the medium's stiffness (bulk modulus) and density. Of the two, stiffness has a much larger effect. Speed increases significantly with increased stiffness."
              }
            ]
          }
        },
        {
          "id": 2,
          "title": "Fundamentals of Ultrasound Transducers",
          "description": "Exploring the components and principles of ultrasound transducers, including the piezoelectric effect.",
          "topics": [
            {
              "id": "2-1",
              "title": "Piezoelectric Effect",
              "content": "The piezoelectric effect is the ability of certain materials (like PZT - lead zirconate titanate) to create a voltage when they are mechanically deformed (pressure is applied). The reverse piezoelectric effect is also used, where an applied voltage causes the material to change shape, creating a sound wave. This is the fundamental principle of ultrasound transducers.",
              "keyPoints": ["Pressure creates voltage", "Voltage creates pressure (shape change)", "PZT is a common piezoelectric material"],
              "examFocus": "Differentiate between the direct and reverse piezoelectric effects."
            },
            {
              "id": "2-2",
              "title": "Transducer Components",
              "content": "A transducer consists of several key components: the piezoelectric crystal (element), a matching layer to reduce impedance mismatch between the crystal and skin, a backing/damping material to shorten the pulse and improve axial resolution, and a case/insulator.",
              "keyPoints": ["Crystal (PZT)", "Matching layer (improves transmission)", "Backing material (improves resolution)", "Case"],
              "examFocus": "Know the function of the matching layer and the backing material."
            },
            {
              "id": "2-3",
              "title": "Operating Frequency and Bandwidth",
              "content": "The main or operating frequency of a transducer is determined by the thickness of the piezoelectric crystal. A thinner crystal produces a higher frequency. Bandwidth refers to the range of frequencies present in a pulse. A short pulse (created by damping) has a wide bandwidth, which is desirable for imaging.",
              "keyPoints": ["Crystal thickness determines frequency", "Thinner crystal = higher frequency", "Short pulse = wide bandwidth"],
              "examFocus": "Understand the relationship between crystal thickness and frequency, and between pulse length and bandwidth."
            }
          ],
           "quiz": {
            "questions": [
              {
                "questionText": "What is the primary purpose of the matching layer on a transducer?",
                "options": ["To focus the beam", "To dampen the crystal", "To reduce the acoustic impedance mismatch", "To increase the frequency"],
                "correctAnswer": "To reduce the acoustic impedance mismatch",
                "explanation": "The matching layer has an impedance between that of the crystal and the skin, which reduces the reflection of sound at the skin's surface and allows more sound to be transmitted into the body."
              },
              {
                "questionText": "A shorter, dampened ultrasound pulse results in:",
                "options": ["Better penetration", "A narrow bandwidth", "Better axial resolution", "A lower frequency"],
                "correctAnswer": "Better axial resolution",
                "explanation": "The backing material shortens the spatial pulse length (SPL). A shorter SPL allows the system to distinguish between two structures that are very close together along the beam's path, which is the definition of axial resolution."
              }
            ]
          }
        }
      ]
    }
  ]
}
