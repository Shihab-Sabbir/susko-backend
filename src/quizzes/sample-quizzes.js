export const sampleQuizzes = {
  general: [
    {
      id: "g1q1",
      text: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: 0,
      category: "general",
      timeLimit: 20, // seconds per question
      points: 10,
      difficulty: "easy",
      imageUrl: null, // optional image for question
    },
    {
      id: "g1q2",
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      category: "general",
      points: 10,
    },
  ],
  science: [
    {
      id: "s1q1",
      text: "What planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      category: "science",
      points: 10,
    },
    {
      id: "s1q2",
      text: "What is the chemical symbol for water?",
      options: ["H2O", "O2", "CO2", "NaCl"],
      correctAnswer: 0,
      category: "science",
      points: 10,
    },
  ],
  history: [
    {
      id: "h1q1",
      text: "Who was the first President of the United States?",
      options: [
        "George Washington",
        "Thomas Jefferson",
        "Abraham Lincoln",
        "John Adams",
      ],
      correctAnswer: 0,
      category: "history",
      points: 10,
    },
    {
      id: "h1q2",
      text: "In which year did World War II end?",
      options: ["1945", "1939", "1918", "1965"],
      correctAnswer: 0,
      category: "history",
      points: 10,
    },
  ],
  geography: [
    {
      id: "geo1q1",
      text: "Which is the largest continent by area?",
      options: ["Asia", "Africa", "North America", "Europe"],
      correctAnswer: 0,
      category: "geography",
      points: 10,
    },
    {
      id: "geo1q2",
      text: "Which country has the most natural lakes?",
      options: ["Canada", "Brazil", "Russia", "United States"],
      correctAnswer: 0,
      category: "geography",
      points: 10,
    },
  ],
};


export const gameConfig = {
  teams: {
    red: { id: 1, name: "Red Team", color: "#FF4136" },
    blue: { id: 2, name: "Blue Team", color: "#0074D9" },
    green: { id: 3, name: "Green Team", color: "#2ECC40" },
    yellow: { id: 4, name: "Yellow Team", color: "#FFDC00" }
  },
  defaultTimeLimit: 20,
  minPlayersPerTeam: 1,
  maxPlayersPerTeam: 10,
  pointsMultiplier: {
    fast: 1.5,
    medium: 1.0,
    slow: 0.5
  }
};
