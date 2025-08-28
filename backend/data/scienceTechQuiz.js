// Science & Technology Comprehensive Quiz - MCQ and True/False only
const scienceTechQuiz = {
  title: "Science & Technology Mastery",
  description: "A comprehensive quiz covering physics, chemistry, biology, computer science, and modern technology. Test your scientific knowledge across multiple disciplines including fundamental concepts and cutting-edge developments.",
  category: "Science",
  timeLimit: 28,
  questions: [
    {
      questionText: "What is the speed of light in a vacuum?",
      questionType: "multiple-choice",
      options: [
        { text: "299,792,458 m/s", isCorrect: true },
        { text: "300,000,000 m/s", isCorrect: false },
        { text: "186,000 miles/s", isCorrect: false },
        { text: "3 × 10^8 km/s", isCorrect: false }
      ],
      points: 2,
      explanation: "The speed of light in a vacuum is exactly 299,792,458 meters per second, which is approximately 3 × 10^8 m/s."
    },
    {
      questionText: "DNA stands for Deoxyribonucleic Acid.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 1,
      explanation: "DNA indeed stands for Deoxyribonucleic Acid, which is the hereditary material in humans and almost all other organisms."
    },
    {
      questionText: "Which element has the chemical symbol 'Au'?",
      questionType: "multiple-choice",
      options: [
        { text: "Silver", isCorrect: false },
        { text: "Gold", isCorrect: true },
        { text: "Aluminum", isCorrect: false },
        { text: "Argon", isCorrect: false }
      ],
      points: 2,
      explanation: "Gold has the chemical symbol 'Au', derived from the Latin word 'aurum' meaning gold. Silver is 'Ag', Aluminum is 'Al', and Argon is 'Ar'."
    },
    {
      questionText: "Python is a multi-paradigm programming language.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "Python supports multiple programming paradigms including object-oriented, procedural, and functional programming styles, making it a multi-paradigm language."
    },
    {
      questionText: "What is the SI unit for measuring force?",
      questionType: "multiple-choice",
      options: [
        { text: "Joule (J)", isCorrect: false },
        { text: "Newton (N)", isCorrect: true },
        { text: "Watt (W)", isCorrect: false },
        { text: "Pascal (Pa)", isCorrect: false }
      ],
      points: 2,
      explanation: "Force is measured in Newtons (N). Joules measure energy, Watts measure power, and Pascals measure pressure."
    },
    {
      questionText: "The human body contains more bacterial cells than human cells.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "Recent research suggests that bacterial cells in the human body roughly equal or slightly outnumber human cells, challenging the old 10:1 ratio myth."
    },
    {
      questionText: "What is the most abundant gas in Earth's atmosphere?",
      questionType: "multiple-choice",
      options: [
        { text: "Oxygen", isCorrect: false },
        { text: "Carbon Dioxide", isCorrect: false },
        { text: "Nitrogen", isCorrect: true },
        { text: "Argon", isCorrect: false }
      ],
      points: 2,
      explanation: "Nitrogen makes up about 78% of Earth's atmosphere, followed by oxygen at about 21%, argon at 0.93%, and carbon dioxide at 0.04%."
    },
    {
      questionText: "The Heisenberg Uncertainty Principle applies only to electrons.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 3,
      explanation: "The Heisenberg Uncertainty Principle applies to all particles, not just electrons. It states that you cannot simultaneously know both the position and momentum of any particle with perfect accuracy."
    },
    {
      questionText: "What does 'HTTP' stand for?",
      questionType: "multiple-choice",
      options: [
        { text: "HyperText Transfer Protocol", isCorrect: true },
        { text: "HyperText Transmission Protocol", isCorrect: false },
        { text: "HyperLink Transfer Protocol", isCorrect: false },
        { text: "HyperText Technical Protocol", isCorrect: false }
      ],
      points: 2,
      explanation: "HTTP stands for HyperText Transfer Protocol, which is the foundation of data communication on the World Wide Web."
    },
    {
      questionText: "Nuclear bonds are a type of chemical bond.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 2,
      explanation: "Nuclear bonds don't exist in chemistry. The main types of chemical bonds are ionic, covalent, and metallic bonds. Nuclear forces operate within the atomic nucleus, not between atoms."
    },
    {
      questionText: "Which type of AI currently exists and is widely used today?",
      questionType: "multiple-choice",
      options: [
        { text: "General AI (AGI)", isCorrect: false },
        { text: "Narrow AI (ANI)", isCorrect: true },
        { text: "Super AI (ASI)", isCorrect: false },
        { text: "Quantum AI", isCorrect: false }
      ],
      points: 3,
      explanation: "Narrow AI (ANI) is what exists today - AI designed for specific tasks like image recognition, language translation, or game playing. General AI doesn't exist yet."
    },
    {
      questionText: "Photosynthesis produces oxygen as a byproduct.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "During photosynthesis, plants use carbon dioxide and water to produce glucose and oxygen. The oxygen is released as a byproduct, which is essential for most life on Earth."
    },
    {
      questionText: "What is the theoretical boundary around a black hole called?",
      questionType: "multiple-choice",
      options: [
        { text: "Schwarzschild Radius", isCorrect: false },
        { text: "Event Horizon", isCorrect: true },
        { text: "Singularity", isCorrect: false },
        { text: "Photon Sphere", isCorrect: false }
      ],
      points: 3,
      explanation: "The Event Horizon is the theoretical boundary around a black hole beyond which no light or other radiation can escape. The Schwarzschild Radius is the distance from the center, and the Singularity is the center point."
    },
    {
      questionText: "TCP/IP stands for Transmission Control Protocol/Internet Protocol.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "TCP/IP indeed stands for Transmission Control Protocol/Internet Protocol, which is the fundamental communication protocol suite for the internet."
    },
    {
      questionText: "Which renewable energy source converts kinetic energy of moving air?",
      questionType: "multiple-choice",
      options: [
        { text: "Solar Power", isCorrect: false },
        { text: "Hydroelectric Power", isCorrect: false },
        { text: "Wind Power", isCorrect: true },
        { text: "Geothermal Power", isCorrect: false }
      ],
      points: 2,
      explanation: "Wind power converts the kinetic energy of moving air using turbines. Solar uses photovoltaic cells, hydroelectric uses water flow, and geothermal uses Earth's internal heat."
    },
    {
      questionText: "The periodic table is arranged by atomic mass.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 2,
      explanation: "The modern periodic table is arranged by atomic number (number of protons), not atomic mass. This was a key insight that resolved inconsistencies in earlier mass-based arrangements."
    },
    {
      questionText: "What is the powerhouse of the cell called?",
      questionType: "multiple-choice",
      options: [
        { text: "Nucleus", isCorrect: false },
        { text: "Mitochondria", isCorrect: true },
        { text: "Ribosome", isCorrect: false },
        { text: "Endoplasmic Reticulum", isCorrect: false }
      ],
      points: 2,
      explanation: "Mitochondria are called the powerhouse of the cell because they generate most of the cell's ATP (energy). The nucleus controls the cell, ribosomes make proteins, and the ER transports materials."
    },
    {
      questionText: "Moore's Law states that computer processing power doubles every two years.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 3,
      explanation: "Moore's Law, formulated by Intel co-founder Gordon Moore, observes that the number of transistors on a microchip doubles about every two years, effectively doubling computing power."
    },
    {
      questionText: "Which gas is primarily responsible for the greenhouse effect on Earth?",
      questionType: "multiple-choice",
      options: [
        { text: "Oxygen", isCorrect: false },
        { text: "Nitrogen", isCorrect: false },
        { text: "Carbon Dioxide", isCorrect: true },
        { text: "Hydrogen", isCorrect: false }
      ],
      points: 2,
      explanation: "While water vapor is actually the most significant greenhouse gas, carbon dioxide is the primary anthropogenic greenhouse gas responsible for climate change due to human activities."
    },
    {
      questionText: "Quantum computers use quantum bits (qubits) that can exist in superposition.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 3,
      explanation: "Quantum computers use qubits that can exist in superposition, meaning they can be in multiple states simultaneously (both 0 and 1), unlike classical bits which are either 0 or 1."
    }
  ]
};

module.exports = scienceTechQuiz;
