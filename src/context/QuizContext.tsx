
import React, { createContext, useContext, useState } from "react";
import { Quiz, QuizResult, Question, MCQQuestion, CodingQuestion, QuizCategory } from "@/lib/types";

interface QuizContextType {
  quizzes: Quiz[];
  results: QuizResult[];
  getQuizById: (id: string) => Quiz | undefined;
  getQuizzesByCategory: (category: QuizCategory) => Quiz[];
  submitQuizResult: (result: Omit<QuizResult, "id">) => void;
  getUserResults: (userId: string) => QuizResult[];
  getQuizResults: (quizId: string) => QuizResult[];
  // Admin functions
  createQuiz: (quiz: Omit<Quiz, "id">) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
}

const QuizContext = createContext<QuizContextType>({
  quizzes: [],
  results: [],
  getQuizById: () => undefined,
  getQuizzesByCategory: () => [],
  submitQuizResult: () => {},
  getUserResults: () => [],
  getQuizResults: () => [],
  createQuiz: () => {},
  updateQuiz: () => {},
  deleteQuiz: () => {},
});

// Mock quiz questions data
const mockMCQQuestions: MCQQuestion[] = [
  {
    id: "q1",
    text: "What is the time complexity of binary search?",
    type: "mcq",
    points: 5,
    options: [
      { id: "a", text: "O(1)", isCorrect: false },
      { id: "b", text: "O(log n)", isCorrect: true },
      { id: "c", text: "O(n)", isCorrect: false },
      { id: "d", text: "O(n log n)", isCorrect: false },
    ],
  },
  {
    id: "q2",
    text: "Which data structure uses LIFO principle?",
    type: "mcq",
    points: 5,
    options: [
      { id: "a", text: "Queue", isCorrect: false },
      { id: "b", text: "Stack", isCorrect: true },
      { id: "c", text: "Linked List", isCorrect: false },
      { id: "d", text: "Tree", isCorrect: false },
    ],
  }
];

const mockCodingQuestions: CodingQuestion[] = [
  {
    id: "c1",
    text: "Write a function to check if a string is a palindrome.",
    type: "coding",
    points: 10,
    language: "javascript",
    defaultCode: `function isPalindrome(str) {
  // Your code here
}

// Do not modify test cases
console.log(isPalindrome("racecar")); // should return true
console.log(isPalindrome("hello")); // should return false`,
    testCases: [
      {
        input: "racecar",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "hello",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "A man a plan a canal Panama",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
  },
  {
    id: "c2",
    text: "Write a function to find the maximum subarray sum.",
    type: "coding",
    points: 15,
    language: "javascript",
    defaultCode: `function maxSubarraySum(arr) {
  // Your code here
}

// Example test case
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // should return 6`,
    testCases: [
      {
        input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "[1, 2, 3, 4, 5]",
        expectedOutput: "15",
        isHidden: true,
      },
    ],
  },
];

// Mock quizzes
const mockQuizzes: Quiz[] = [
  {
    id: "quiz1",
    title: "Data Structures Basics",
    description: "Test your knowledge of fundamental data structures concepts.",
    category: "DSA",
    duration: 30,
    questions: [mockMCQQuestions[0], mockMCQQuestions[1], mockCodingQuestions[0]],
    createdBy: "1", // Admin user ID
  },
  {
    id: "quiz2",
    title: "JavaScript Fundamentals",
    description: "Test your understanding of JavaScript basics.",
    category: "JavaScript",
    duration: 45,
    questions: [
      {
        id: "jsq1",
        text: "What will be the output of: console.log(typeof null)?",
        type: "mcq",
        points: 5,
        options: [
          { id: "a", text: "null", isCorrect: false },
          { id: "b", text: "undefined", isCorrect: false },
          { id: "c", text: "object", isCorrect: true },
          { id: "d", text: "string", isCorrect: false },
        ],
      },
      mockCodingQuestions[1],
    ],
    createdBy: "1", // Admin user ID
  },
  {
    id: "quiz3",
    title: "Database Concepts",
    description: "Test your knowledge of database systems and SQL.",
    category: "DBMS",
    duration: 60,
    questions: [
      {
        id: "dbq1",
        text: "Which of these is NOT a type of SQL join?",
        type: "mcq",
        points: 5,
        options: [
          { id: "a", text: "INNER JOIN", isCorrect: false },
          { id: "b", text: "LEFT JOIN", isCorrect: false },
          { id: "c", text: "MIDDLE JOIN", isCorrect: true },
          { id: "d", text: "RIGHT JOIN", isCorrect: false },
        ],
      },
      {
        id: "dbq2",
        text: "Which SQL statement is used to create a new table?",
        type: "mcq",
        points: 5,
        options: [
          { id: "a", text: "CREATE TABLE", isCorrect: true },
          { id: "b", text: "NEW TABLE", isCorrect: false },
          { id: "c", text: "ADD TABLE", isCorrect: false },
          { id: "d", text: "INSERT TABLE", isCorrect: false },
        ],
      },
    ],
    createdBy: "1", // Admin user ID
  },
];

// Mock results
const mockResults: QuizResult[] = [];

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [results, setResults] = useState<QuizResult[]>(mockResults);

  const getQuizById = (id: string) => {
    return quizzes.find((quiz) => quiz.id === id);
  };

  const getQuizzesByCategory = (category: QuizCategory) => {
    return quizzes.filter((quiz) => quiz.category === category);
  };

  const submitQuizResult = (result: Omit<QuizResult, "id">) => {
    const newResult: QuizResult = {
      ...result,
      id: Math.random().toString(36).substring(2, 9),
    };
    setResults((prev) => [...prev, newResult]);
  };

  const getUserResults = (userId: string) => {
    return results.filter((result) => result.userId === userId);
  };

  const getQuizResults = (quizId: string) => {
    return results.filter((result) => result.quizId === quizId);
  };

  const createQuiz = (quiz: Omit<Quiz, "id">) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: Math.random().toString(36).substring(2, 9),
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes((prev) =>
      prev.map((quiz) => (quiz.id === id ? { ...quiz, ...updates } : quiz))
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        results,
        getQuizById,
        getQuizzesByCategory,
        submitQuizResult,
        getUserResults,
        getQuizResults,
        createQuiz,
        updateQuiz,
        deleteQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
