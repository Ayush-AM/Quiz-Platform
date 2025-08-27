export const quizData = {
  1: {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts",
    category: "Programming",
    timeLimit: 30,
    questions: [
      {
        id: 1,
        question: "What is the output of: console.log(typeof null)?",
        options: ["undefined", "object", "null", "number"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "unshift()", "pop()", "shift()"],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "What is the result of: '5' + 2?",
        options: ["7", "52", "NaN", "Error"],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What does JSON.stringify() do?",
        options: [
          "Parses JSON to JavaScript object",
          "Converts JavaScript object to JSON string",
          "Validates JSON data",
          "None of the above"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Which operator is used for strict equality comparison?",
        options: ["==", "===", "=", "!="],
        correctAnswer: 1
      },
      {
        id: 6,
        question: "Which method converts a JSON string to an object?",
        options: ["JSON.parse()", "JSON.stringify()", "Object.assign()", "toJSON()"],
        correctAnswer: 0
      },
      {
        id: 7,
        question: "What is the result of: Boolean('')?",
        options: ["true", "false", "undefined", "null"],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "Which keyword declares a block-scoped variable?",
        options: ["var", "let", "const", "static"],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "What does Array.prototype.map() return?",
        options: ["A new array", "A modified original array", "An object", "A number"],
        correctAnswer: 0
      },
      {
        id: 10,
        question: "How do you create a promise that immediately resolves?",
        options: ["new Promise(resolve => resolve())", "Promise.new()", "Promise.create()", "resolve()"],
        correctAnswer: 0
      }
    ]
  },
  2: {
    title: "React Hooks Deep Dive",
    description: "Master React Hooks and state management",
    category: "Web Development",
    timeLimit: 25,
    questions: [
      {
        id: 1,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What is the correct way to update state based on previous state?",
        options: [
          "setState(state + 1)",
          "setState(prevState => prevState + 1)",
          "setState(this.state + 1)",
          "setState(current + 1)"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "When is useEffect called?",
        options: [
          "Only on mount",
          "After every render",
          "Only on unmount",
          "Never automatically"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What is the purpose of the dependency array in useEffect?",
        options: [
          "To store local variables",
          "To control when the effect runs",
          "To optimize performance",
          "To store component state"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Which hook lets you access context values?",
        options: ["useMemo", "useCallback", "useContext", "useRef"],
        correctAnswer: 2
      },
      {
        id: 6,
        question: "Which hook is best for storing a mutable value that persists across renders?",
        options: ["useState", "useRef", "useEffect", "useReducer"],
        correctAnswer: 1
      },
      {
        id: 7,
        question: "useMemo is primarily used to...",
        options: ["memoize expensive calculations", "fetch data", "render children", "subscribe to events"],
        correctAnswer: 0
      },
      {
        id: 8,
        question: "In useEffect, returning a function is used for...",
        options: ["updating state", "cleanup", "rendering", "memoization"],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "Which hook is suitable for complex state transitions?",
        options: ["useState", "useReducer", "useRef", "useLayoutEffect"],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "useCallback returns...",
        options: ["a memoized function", "a memoized value", "a ref object", "JSX"],
        correctAnswer: 0
      }
    ]
  },
  3: {
    title: "CSS Grid & Flexbox",
    description: "Learn modern CSS layout techniques",
    category: "Web Design",
    timeLimit: 40,
    questions: [
      {
        id: 1,
        question: "Which property makes a container a grid container?",
        options: [
          "display: grid",
          "display: flex",
          "position: grid",
          "grid: true"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "What is the default flex direction?",
        options: ["column", "row", "row-reverse", "column-reverse"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Which property is used to create columns in CSS Grid?",
        options: [
          "grid-template-rows",
          "grid-template-columns",
          "grid-columns",
          "grid-rows"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What does 'justify-content: space-between' do in Flexbox?",
        options: [
          "Centers all items",
          "Spaces items evenly with space between them",
          "Aligns items to the start",
          "Aligns items to the end"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Which unit is specifically designed for CSS Grid?",
        options: ["px", "em", "rem", "fr"],
        correctAnswer: 3
      },
      {
        id: 6,
        question: "What is the purpose of 'gap' property in Grid?",
        options: [
          "Sets margin between items",
          "Sets padding in items",
          "Sets spacing between grid cells",
          "Sets border around grid"
        ],
        correctAnswer: 2
      },
      {
        id: 7,
        question: "Which property controls alignment along the cross axis in Flexbox?",
        options: ["justify-content", "align-items", "align-content", "place-items"],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "How do you create a grid with 3 equal columns?",
        options: [
          "grid-template-columns: 3fr",
          "grid-template-columns: repeat(3, 1fr)",
          "grid-columns: 3 1fr",
          "columns: 3"
        ],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "Which property lets grid items span multiple columns?",
        options: ["grid-area", "grid-column", "grid-span", "column-span"],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "In Flexbox, which property wraps items to the next line?",
        options: ["flex-direction", "flex-flow", "flex-wrap", "wrap-items"],
        correctAnswer: 2
      }
    ]
  },
  4: {
    title: "Python Programming",
    description: "Get started with Python basics",
    category: "Programming",
    timeLimit: 35,
    questions: [
      {
        id: 1,
        question: "What is the correct way to create a list in Python?",
        options: [
          "list = []",
          "list = {}",
          "list = ()",
          "list = new List()"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "How do you add comments in Python?",
        options: [
          "// Comment",
          "/* Comment */",
          "# Comment",
          "<!-- Comment -->"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "What is the output of: len('Hello World')?",
        options: ["10", "11", "12", "Error"],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Which of these is NOT a Python data type?",
        options: ["int", "str", "char", "float"],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "What does the range(5) function return?",
        options: [
          "Numbers from 1 to 5",
          "Numbers from 0 to 4",
          "Numbers from 0 to 5",
          "Numbers from 1 to 4"
        ],
        correctAnswer: 1
      },
      {
        id: 6,
        question: "Which keyword defines a function in Python?",
        options: ["func", "def", "lambda", "function"],
        correctAnswer: 1
      },
      {
        id: 7,
        question: "What is a correct way to format strings in Python 3?",
        options: ["format('x')", "f'Hello {name}'", "'%s' % name", "string.format(name)"],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "Which data structure is immutable?",
        options: ["list", "dict", "tuple", "set"],
        correctAnswer: 2
      },
      {
        id: 9,
        question: "What does 'PEP' stand for in Python?",
        options: ["Python Execution Plan", "Python Enhancement Proposal", "Package Entry Point", "Performance Evaluation Plan"],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "Which operator is used for exponentiation?",
        options: ["^", "**", "exp()", "pow"],
        correctAnswer: 1
      }
    ]
  }
};
