// React Hooks Deep Dive Quiz - MCQ and True/False only
const reactHooksQuiz = {
  title: "React Hooks Deep Dive",
  description: "Master React Hooks including useState, useEffect, useContext, useReducer, and custom hooks. Test your understanding of modern React development patterns and best practices.",
  category: "Technology",
  timeLimit: 25,
  questions: [
    {
      questionText: "Which React Hook is used to add state to functional components?",
      questionType: "multiple-choice",
      options: [
        { text: "useEffect", isCorrect: false },
        { text: "useState", isCorrect: true },
        { text: "useContext", isCorrect: false },
        { text: "useReducer", isCorrect: false }
      ],
      points: 2,
      explanation: "useState is the React Hook that allows you to add state to functional components. It returns an array with the current state value and a setter function."
    },
    {
      questionText: "useEffect runs after every render by default.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "By default, useEffect runs after every completed render, both after the first render and after every update."
    },
    {
      questionText: "How do you prevent useEffect from running on every render?",
      questionType: "multiple-choice",
      options: [
        { text: "Use useCallback instead", isCorrect: false },
        { text: "Provide a dependency array as the second argument", isCorrect: true },
        { text: "Use useMemo instead", isCorrect: false },
        { text: "It's not possible to prevent this", isCorrect: false }
      ],
      points: 3,
      explanation: "By providing a dependency array as the second argument to useEffect, it will only re-run when one of the dependencies has changed."
    },
    {
      questionText: "An empty dependency array [] in useEffect makes it run only once.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "An empty dependency array [] tells React that the effect doesn't depend on any values from props or state, so it never needs to re-run."
    },
    {
      questionText: "Which Hook would you use to access context in a functional component?",
      questionType: "multiple-choice",
      options: [
        { text: "useContext", isCorrect: true },
        { text: "useReducer", isCorrect: false },
        { text: "useCallback", isCorrect: false },
        { text: "useMemo", isCorrect: false }
      ],
      points: 2,
      explanation: "useContext is the Hook that allows functional components to consume context values that were provided by a Context.Provider."
    },
    {
      questionText: "useReducer is always better than useState for managing state.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 2,
      explanation: "useReducer is not always better. Use useState for simple state and useReducer for complex state logic with multiple sub-values or when state logic is complex."
    },
    {
      questionText: "What does useCallback return?",
      questionType: "multiple-choice",
      options: [
        { text: "A memoized value", isCorrect: false },
        { text: "A memoized callback function", isCorrect: true },
        { text: "A state value", isCorrect: false },
        { text: "An effect cleanup function", isCorrect: false }
      ],
      points: 3,
      explanation: "useCallback returns a memoized callback function that only changes if one of the dependencies has changed. This is useful for preventing unnecessary re-renders."
    },
    {
      questionText: "Custom Hooks must start with the prefix 'use'.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "Custom Hooks must start with 'use' - this is a naming convention that tells React this function follows the rules of Hooks."
    },
    {
      questionText: "Which Hook is used to optimize expensive calculations?",
      questionType: "multiple-choice",
      options: [
        { text: "useCallback", isCorrect: false },
        { text: "useEffect", isCorrect: false },
        { text: "useMemo", isCorrect: true },
        { text: "useReducer", isCorrect: false }
      ],
      points: 3,
      explanation: "useMemo is used to memoize expensive calculations. It only recalculates when one of its dependencies has changed."
    },
    {
      questionText: "Hooks can be called conditionally inside React components.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 3,
      explanation: "Hooks must always be called in the same order. They cannot be called inside loops, conditions, or nested functions. This is the 'Rules of Hooks'."
    },
    {
      questionText: "What does the cleanup function in useEffect do?",
      questionType: "multiple-choice",
      options: [
        { text: "It runs before the component mounts", isCorrect: false },
        { text: "It runs before the effect runs again or before unmount", isCorrect: true },
        { text: "It runs only when the component unmounts", isCorrect: false },
        { text: "It has no specific purpose", isCorrect: false }
      ],
      points: 3,
      explanation: "The cleanup function runs before the effect runs again (to clean up the previous effect) and before the component unmounts."
    },
    {
      questionText: "useLayoutEffect runs synchronously after all DOM mutations.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 3,
      explanation: "useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, making it useful for DOM measurements."
    },
    {
      questionText: "Which pattern is recommended for updating state based on previous state?",
      questionType: "multiple-choice",
      options: [
        { text: "setState(newValue)", isCorrect: false },
        { text: "setState(prevState => prevState + 1)", isCorrect: true },
        { text: "setState(state + 1)", isCorrect: false },
        { text: "All patterns are equivalent", isCorrect: false }
      ],
      points: 3,
      explanation: "Using the functional update pattern setState(prevState => prevState + 1) ensures you're working with the latest state value, especially important with async updates."
    },
    {
      questionText: "useRef can be used to access DOM elements directly.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "useRef returns a mutable ref object whose .current property can be used to access DOM elements directly when passed to the ref attribute."
    },
    {
      questionText: "What happens if you forget to include a state variable in useEffect's dependency array?",
      questionType: "multiple-choice",
      options: [
        { text: "React will throw an error", isCorrect: false },
        { text: "The effect might use stale state values", isCorrect: true },
        { text: "Nothing, it works the same way", isCorrect: false },
        { text: "The effect will never run", isCorrect: false }
      ],
      points: 3,
      explanation: "If you don't include state variables in the dependency array, the effect might capture stale values from previous renders, leading to bugs."
    },
    {
      questionText: "Custom Hooks can use other Hooks inside them.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false }
      ],
      points: 2,
      explanation: "Custom Hooks can call other Hooks, including built-in Hooks like useState, useEffect, and other custom Hooks. This is how you compose functionality."
    },
    {
      questionText: "Which Hook would you use for complex state logic involving multiple sub-values?",
      questionType: "multiple-choice",
      options: [
        { text: "useState", isCorrect: false },
        { text: "useReducer", isCorrect: true },
        { text: "useContext", isCorrect: false },
        { text: "useMemo", isCorrect: false }
      ],
      points: 3,
      explanation: "useReducer is preferable when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one."
    },
    {
      questionText: "React Hooks can only be used in functional components.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: true }
      ],
      points: 2,
      explanation: "React Hooks can be used in functional components and in custom Hooks. They cannot be used in class components, but custom Hooks can be called from functional components."
    }
  ]
};

module.exports = reactHooksQuiz;
