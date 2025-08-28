// Advanced JavaScript & Web Development Quiz - MCQ and True/False only
const advancedJSQuiz = {
  title: "Advanced JavaScript & Web Development",
  description: "Test your expertise in modern JavaScript, React, Node.js, and web development best practices. Covers ES6+, async programming, closures, promises, and advanced concepts.",
  category: "Technology",
  timeLimit: 30,
  questions: [
    {
      questionText: "What is the output of the following code?\n\nconsole.log(typeof null);\nconsole.log(typeof undefined);\nconsole.log(typeof NaN);",
      questionType: "multiple-choice",
      options: [
        { text: "null, undefined, number", isCorrect: false },
        { text: "object, undefined, number", isCorrect: true },
        { text: "null, undefined, NaN", isCorrect: false },
        { text: "object, object, number", isCorrect: false }
      ],
      points: 3,
      explanation: "typeof null returns 'object' (a well-known JavaScript quirk), typeof undefined returns 'undefined', and typeof NaN returns 'number' because NaN is a special numeric value."
    },
    {
      questionText: "Arrow functions have their own 'this' binding.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 2,
      explanation: "Arrow functions do NOT have their own 'this' binding. They inherit 'this' from the enclosing lexical scope, which is one of their key differences from regular functions."
    },
    {
      questionText: "Which ES6 feature allows you to combine multiple arrays into one?",
      questionType: "multiple-choice",
      options: [
        { text: "Array.push()", isCorrect: false },
        { text: "Spread operator (...)", isCorrect: true },
        { text: "Array.join()", isCorrect: false },
        { text: "Array.slice()", isCorrect: false }
      ],
      points: 2,
      explanation: "The spread operator (...) can be used to combine arrays: [...arr1, ...arr2]. The concat() method also works but the spread operator is more modern ES6 syntax."
    },
    {
      questionText: "Promises in JavaScript can only be in one state at a time.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "A Promise can only be in one of three states: pending, fulfilled (resolved), or rejected. Once settled (fulfilled or rejected), it cannot change state."
    },
    {
      questionText: "What does 'async/await' syntax help with in JavaScript?",
      questionType: "multiple-choice",
      options: [
        { text: "Making synchronous code asynchronous", isCorrect: false },
        { text: "Writing asynchronous code that looks synchronous", isCorrect: true },
        { text: "Improving performance of loops", isCorrect: false },
        { text: "Creating new threads", isCorrect: false }
      ],
      points: 3,
      explanation: "async/await is syntactic sugar over Promises that allows you to write asynchronous code that looks and behaves more like synchronous code, making it easier to read and debug."
    },
    {
      questionText: "The event loop in JavaScript is single-threaded.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "JavaScript's event loop is indeed single-threaded, meaning it can only execute one piece of code at a time. However, it can handle asynchronous operations through callbacks, promises, and the event queue."
    },
    {
      questionText: "Which method creates a new array with all elements that pass a test implemented by a provided function?",
      questionType: "multiple-choice",
      options: [
        { text: "map()", isCorrect: false },
        { text: "filter()", isCorrect: true },
        { text: "reduce()", isCorrect: false },
        { text: "forEach()", isCorrect: false }
      ],
      points: 2,
      explanation: "filter() creates a new array with all elements that pass the test implemented by the provided function. map() transforms elements, reduce() accumulates values, forEach() just iterates."
    },
    {
      questionText: "Destructuring assignment can be used with both arrays and objects.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "Destructuring can be used with both arrays [a, b] = [1, 2] and objects {name, age} = {name: 'John', age: 30} to extract values into distinct variables."
    },
    {
      questionText: "What is a closure in JavaScript?",
      questionType: "multiple-choice",
      options: [
        { text: "A way to close a function", isCorrect: false },
        { text: "A function that has access to outer scope variables", isCorrect: true },
        { text: "A method to prevent variable access", isCorrect: false },
        { text: "A type of loop in JavaScript", isCorrect: false }
      ],
      points: 3,
      explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This is a fundamental concept in JavaScript."
    },
    {
      questionText: "Template literals in ES6 use backticks (`) instead of quotes.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "Template literals use backticks (`) and allow for string interpolation with ${expression} syntax, as well as multi-line strings."
    },
    {
      questionText: "Which Node.js module is used for file system operations?",
      questionType: "multiple-choice",
      options: [
        { text: "http", isCorrect: false },
        { text: "fs", isCorrect: true },
        { text: "path", isCorrect: false },
        { text: "url", isCorrect: false }
      ],
      points: 2,
      explanation: "The 'fs' (file system) module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions."
    },
    {
      questionText: "The Virtual DOM in React improves performance by minimizing direct DOM manipulation.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 3,
      explanation: "The Virtual DOM is a programming concept where a 'virtual' representation of the UI is kept in memory and synced with the 'real' DOM, optimizing performance by minimizing expensive DOM manipulations."
    },
    {
      questionText: "What is the main difference between 'let' and 'const' in ES6?",
      questionType: "multiple-choice",
      options: [
        { text: "let is block-scoped, const is function-scoped", isCorrect: false },
        { text: "let can be reassigned, const cannot", isCorrect: true },
        { text: "let is hoisted, const is not", isCorrect: false },
        { text: "There is no difference", isCorrect: false }
      ],
      points: 2,
      explanation: "Both let and const are block-scoped, but let allows reassignment while const creates a binding that cannot be reassigned (though objects/arrays can still be mutated)."
    },
    {
      questionText: "Higher-order functions are functions that take other functions as arguments or return functions.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 3,
      explanation: "Higher-order functions are functions that either take functions as arguments or return functions as results. Examples include map(), filter(), reduce(), and custom functions that return other functions."
    },
    {
      questionText: "What does the 'bind()' method do in JavaScript?",
      questionType: "multiple-choice",
      options: [
        { text: "Combines two functions together", isCorrect: false },
        { text: "Creates a new function with a specific 'this' context", isCorrect: true },
        { text: "Binds a variable to a value permanently", isCorrect: false },
        { text: "Connects two objects together", isCorrect: false }
      ],
      points: 3,
      explanation: "bind() creates a new function that, when called, has its 'this' keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called."
    },
    {
      questionText: "CSS-in-JS solutions like styled-components provide better performance than traditional CSS.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 2,
      explanation: "CSS-in-JS solutions generally have a performance overhead compared to traditional CSS because they need to be processed at runtime. However, they offer benefits like component scoping, dynamic styling, and better maintainability."
    },
    {
      questionText: "Which statement about JavaScript modules (ES6) is correct?",
      questionType: "multiple-choice",
      options: [
        { text: "All exports must be at the top of the file", isCorrect: false },
        { text: "You can have multiple default exports per module", isCorrect: false },
        { text: "Imports are hoisted to the top of the module", isCorrect: true },
        { text: "Modules run in non-strict mode by default", isCorrect: false }
      ],
      points: 3,
      explanation: "ES6 module imports are hoisted, meaning they are processed before any other code in the module runs. Modules also run in strict mode by default and can only have one default export."
    },
    {
      questionText: "The 'Symbol' data type in ES6 is primarily used to create unique identifiers.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 3,
      explanation: "Symbols are a primitive data type introduced in ES6 that create unique identifiers. They are often used as object property keys to avoid naming collisions."
    }
  ]
};

module.exports = advancedJSQuiz;
