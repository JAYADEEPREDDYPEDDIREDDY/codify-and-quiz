
// Type definitions for our application

// User types
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Quiz types
export type QuestionType = "mcq" | "coding";
export type QuizCategory = "DSA" | "JavaScript" | "DBMS" | "React" | "Python" | "System Design";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: Option[];
}

export interface CodingQuestion extends BaseQuestion {
  type: "coding";
  defaultCode: string;
  language: string;
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }[];
}

export type Question = MCQQuestion | CodingQuestion;

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  duration: number; // in minutes
  questions: Question[];
  createdBy: string;
}

// Result types
export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  points: number;
  userAnswer?: string | string[];
  userCode?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  maxScore: number;
  timeTaken: number; // in seconds
  completedAt: Date;
  results: QuestionResult[];
}
