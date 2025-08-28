// Sample quiz data with various question types
const sampleQuizzes = [
  {
    title: "JavaScript Fundamentals",
    description: "Master the core concepts of JavaScript including variables, data types, functions, scope, and basic programming constructs. Perfect for beginners and those looking to solidify their JavaScript foundation.",
    category: "Technology",
    timeLimit: 20,
    questions: [
      {
        questionText: "Which of the following is NOT a primitive data type in JavaScript?",
        questionType: "multiple-choice",
        options: [
          { text: "String", isCorrect: false },
          { text: "Object", isCorrect: true },
          { text: "Boolean", isCorrect: false },
          { text: "Number", isCorrect: false }
        ],
        points: 2,
        explanation: "Object is a non-primitive (reference) data type in JavaScript. The primitive types are: string, number, boolean, undefined, null, symbol, and bigint."
      },
      {
        questionText: "JavaScript is case-sensitive.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ],
        points: 1,
        explanation: "JavaScript is case-sensitive, meaning 'Variable' and 'variable' are treated as different identifiers."
      },
      {
        questionText: "What will be the output of: console.log(typeof null)?",
        questionType: "multiple-choice",
        options: [
          { text: "'null'", isCorrect: false },
          { text: "'undefined'", isCorrect: false },
          { text: "'object'", isCorrect: true },
          { text: "'number'", isCorrect: false }
        ],
        points: 3,
        explanation: "This is a well-known JavaScript quirk. typeof null returns 'object' due to a historical bug that has been kept for backward compatibility."
      },
      {
        questionText: "Variables declared with 'var' are function-scoped.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ],
        points: 2,
        explanation: "Variables declared with 'var' are function-scoped, while 'let' and 'const' are block-scoped."
      },
      {
        questionText: "Which method is used to add one or more elements to the end of an array?",
        questionType: "multiple-choice",
        options: [
          { text: "pop()", isCorrect: false },
          { text: "push()", isCorrect: true },
          { text: "shift()", isCorrect: false },
          { text: "unshift()", isCorrect: false }
        ],
        points: 2,
        explanation: "push() adds elements to the end of an array. pop() removes from the end, shift() removes from the beginning, and unshift() adds to the beginning."
      },
      {
        questionText: "JavaScript supports automatic type conversion (type coercion).",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ],
        points: 2,
        explanation: "JavaScript performs automatic type conversion when values of different types are used together, like '5' + 3 = '53'."
      },
      {
        questionText: "What is the correct way to declare a function in JavaScript?",
        questionType: "multiple-choice",
        options: [
          { text: "function = myFunction() {}", isCorrect: false },
          { text: "function myFunction() {}", isCorrect: true },
          { text: "declare function myFunction() {}", isCorrect: false },
          { text: "def myFunction() {}", isCorrect: false }
        ],
        points: 2,
        explanation: "Functions in JavaScript are declared using the 'function' keyword followed by the function name and parentheses."
      },
      {
        questionText: "The '===' operator checks both value and type.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ],
        points: 2,
        explanation: "The '===' operator (strict equality) checks both value and type, while '==' only checks value after type coercion."
      },
      {
        questionText: "Which of the following will create a global variable in JavaScript?",
        questionType: "multiple-choice",
        options: [
          { text: "var globalVar = 'hello';", isCorrect: false },
          { text: "let globalVar = 'hello';", isCorrect: false },
          { text: "const globalVar = 'hello';", isCorrect: false },
          { text: "All of the above when declared outside any function", isCorrect: true }
        ],
        points: 3,
        explanation: "Any variable declared outside of a function (in global scope) becomes a global variable, regardless of whether you use var, let, or const."
      },
      {
        questionText: "JavaScript arrays can hold different data types in the same array.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ],
        points: 2,
        explanation: "JavaScript arrays are dynamic and can hold multiple data types: [1, 'hello', true, null, {name: 'John'}] is a valid array."
      },
      {
        questionText: "What does the 'this' keyword refer to in JavaScript?",
        questionType: "multiple-choice",
        options: [
          { text: "Always refers to the global object", isCorrect: false },
          { text: "Always refers to the function itself", isCorrect: false },
          { text: "Depends on how the function is called", isCorrect: true },
          { text: "Always refers to the parent object", isCorrect: false }
        ],
        points: 3,
        explanation: "The 'this' keyword's value depends on the execution context - how and where the function is called, not where it's defined."
      },
      {
        questionText: "JavaScript functions are first-class objects.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false }
        ],
        points: 2,
        explanation: "Functions in JavaScript are first-class objects, meaning they can be stored in variables, passed as arguments, returned from functions, and have properties."
      },
      {
        questionText: "Which statement about JavaScript hoisting is correct?",
        questionType: "multiple-choice",
        options: [
          { text: "Only var declarations are hoisted", isCorrect: false },
          { text: "Only function declarations are hoisted", isCorrect: false },
          { text: "Both var and function declarations are hoisted", isCorrect: true },
          { text: "Hoisting doesn't exist in JavaScript", isCorrect: false }
        ],
        points: 3,
        explanation: "Both 'var' declarations and function declarations are hoisted to the top of their scope, but let/const are also hoisted but remain in a 'temporal dead zone'."
      },
      {
        questionText: "The 'NaN' (Not a Number) is equal to itself: NaN === NaN returns true.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true }
        ],
        points: 3,
        explanation: "NaN is the only value in JavaScript that is not equal to itself. NaN === NaN returns false. Use Number.isNaN() to check for NaN."
      },
      {
        questionText: "What is the output of: console.log(0.1 + 0.2 === 0.3)?",
        questionType: "multiple-choice",
        options: [
          { text: "true", isCorrect: false },
          { text: "false", isCorrect: true },
          { text: "undefined", isCorrect: false },
          { text: "Error", isCorrect: false }
        ],
        points: 3,
        explanation: "Due to floating-point precision issues, 0.1 + 0.2 equals 0.30000000000000004, not exactly 0.3, so the comparison returns false."
      }
    ]
  }
];

// Helper function to create quiz with a user ID
const createSampleQuiz = (userId) => {
  return sampleQuizzes.map(quiz => ({
    ...quiz,
    createdBy: userId,
    isPublished: true
  }));
};

module.exports = {
  sampleQuizzes,
  createSampleQuiz
};
