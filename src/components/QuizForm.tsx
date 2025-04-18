
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz, QuizCategory, Question, MCQQuestion, CodingQuestion } from "@/lib/types";
import { Plus, Trash, Code, ListChecks } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QuizFormProps {
  initialQuiz?: Quiz;
  onSubmit: (quiz: Omit<Quiz, "id">) => void;
  isSubmitting: boolean;
}

const CATEGORIES: QuizCategory[] = [
  "DSA", 
  "JavaScript", 
  "DBMS", 
  "React", 
  "Python", 
  "System Design"
];

const QuizForm: React.FC<QuizFormProps> = ({
  initialQuiz,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState(initialQuiz?.title || "");
  const [description, setDescription] = useState(initialQuiz?.description || "");
  const [category, setCategory] = useState<QuizCategory>(initialQuiz?.category || "DSA");
  const [duration, setDuration] = useState(initialQuiz?.duration?.toString() || "30");
  const [questions, setQuestions] = useState<Question[]>(initialQuiz?.questions || []);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addMCQuestion = () => {
    const newQuestion: MCQQuestion = {
      id: generateId(),
      text: "",
      type: "mcq",
      points: 5,
      options: [
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const addCodingQuestion = () => {
    const newQuestion: CodingQuestion = {
      id: generateId(),
      text: "",
      type: "coding",
      points: 10,
      language: "javascript",
      defaultCode: "// Write your code here",
      testCases: [
        {
          input: "",
          expectedOutput: "",
          isHidden: false,
        },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[index];
    
    if (currentQuestion.type === "mcq") {
      const mcqQuestion = currentQuestion as MCQQuestion;
      const updatedQuestion: MCQQuestion = { 
        ...mcqQuestion, 
        ...updates as Partial<MCQQuestion>,
        type: "mcq" // Ensure type remains "mcq"
      };
      updatedQuestions[index] = updatedQuestion;
    } else if (currentQuestion.type === "coding") {
      const codingQuestion = currentQuestion as CodingQuestion;
      const updatedQuestion: CodingQuestion = { 
        ...codingQuestion, 
        ...updates as Partial<CodingQuestion>,
        type: "coding" // Ensure type remains "coding"
      };
      updatedQuestions[index] = updatedQuestion;
    }
    
    setQuestions(updatedQuestions);
  };

  const updateMCQOption = (questionIndex: number, optionIndex: number, updates: Partial<MCQQuestion["options"][0]>) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as MCQQuestion;
    
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], ...updates };
    
    question.options = updatedOptions;
    
    setQuestions(updatedQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as MCQQuestion;
    
    question.options = question.options.map((option, idx) => ({
      ...option,
      isCorrect: idx === optionIndex,
    }));
    
    setQuestions(updatedQuestions);
  };

  const addTestCase = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as CodingQuestion;
    
    question.testCases = [
      ...question.testCases,
      {
        input: "",
        expectedOutput: "",
        isHidden: false,
      },
    ];
    
    setQuestions(updatedQuestions);
  };

  const updateTestCase = (questionIndex: number, testCaseIndex: number, updates: Partial<CodingQuestion["testCases"][0]>) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as CodingQuestion;
    
    const updatedTestCases = [...question.testCases];
    updatedTestCases[testCaseIndex] = { ...updatedTestCases[testCaseIndex], ...updates };
    
    question.testCases = updatedTestCases;
    
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const removeTestCase = (questionIndex: number, testCaseIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as CodingQuestion;
    
    if (question.testCases.length > 1) {
      const updatedTestCases = [...question.testCases];
      updatedTestCases.splice(testCaseIndex, 1);
      question.testCases = updatedTestCases;
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quizData: Omit<Quiz, "id"> = {
      title,
      description,
      category,
      duration: parseInt(duration),
      questions,
      createdBy: "1", // In a real app, this would be the current user's ID
    };
    onSubmit(quizData);
  };

  const isFormValid = () => {
    if (!title || !description || !category || !duration) return false;
    if (questions.length === 0) return false;
    
    // Check if all questions have required fields
    for (const question of questions) {
      if (!question.text) return false;
      
      if (question.type === "mcq") {
        const mcqQuestion = question as MCQQuestion;
        // Check if all options have text
        if (mcqQuestion.options.some(opt => !opt.text)) return false;
        // Check if at least one option is marked as correct
        if (!mcqQuestion.options.some(opt => opt.isCorrect)) return false;
      } else if (question.type === "coding") {
        const codingQuestion = question as CodingQuestion;
        // Check if there's at least one test case with input and expected output
        if (codingQuestion.testCases.some(tc => !tc.input || !tc.expectedOutput)) return false;
      }
    }
    
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>Basic information about the quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Data Structures Quiz"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Test your knowledge of fundamental data structures concepts"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as QuizCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                max={180}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMCQuestion}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              Add MCQ
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCodingQuestion}
            >
              <Code className="mr-2 h-4 w-4" />
              Add Coding Question
            </Button>
          </div>
        </div>
        
        {questions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-muted-foreground mb-4">No questions added yet.</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMCQuestion}
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  Add MCQ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCodingQuestion}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Add Coding Question
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base font-medium">
                    Question {qIndex + 1}
                    <span className="ml-2 text-xs text-muted-foreground border px-2 py-0.5 rounded">
                      {question.type === "mcq" ? "Multiple Choice" : "Coding"}
                    </span>
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label htmlFor={`q-${qIndex}-text`}>Question</Label>
                  <Textarea
                    id={`q-${qIndex}-text`}
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                    placeholder="Enter question text"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <Label htmlFor={`q-${qIndex}-points`}>Points</Label>
                    <Input
                      id={`q-${qIndex}-points`}
                      type="number"
                      min={1}
                      max={100}
                      value={question.points}
                      onChange={(e) => updateQuestion(qIndex, { points: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  
                  {question.type === "coding" && (
                    <div className="flex-1">
                      <Label htmlFor={`q-${qIndex}-language`}>Language</Label>
                      <Select
                        value={(question as CodingQuestion).language}
                        onValueChange={(value) => updateQuestion(qIndex, { language: value })}
                      >
                        <SelectTrigger id={`q-${qIndex}-language`}>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {question.type === "mcq" && (
                  <div className="space-y-3">
                    <Label>Options</Label>
                    {(question as MCQQuestion).options.map((option, oIndex) => (
                      <div key={option.id} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            value={option.text}
                            onChange={(e) => updateMCQOption(qIndex, oIndex, { text: e.target.value })}
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant={option.isCorrect ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCorrectOption(qIndex, oIndex)}
                        >
                          {option.isCorrect ? "Correct" : "Mark Correct"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === "coding" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`q-${qIndex}-default-code`}>Default Code</Label>
                      <Textarea
                        id={`q-${qIndex}-default-code`}
                        value={(question as CodingQuestion).defaultCode}
                        onChange={(e) => updateQuestion(qIndex, { defaultCode: e.target.value })}
                        placeholder="// Starter code for the question"
                        className="font-mono h-32"
                        required
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Test Cases</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTestCase(qIndex)}
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Add Test Case
                        </Button>
                      </div>
                      
                      {(question as CodingQuestion).testCases.map((testCase, tcIndex) => (
                        <Card key={tcIndex}>
                          <CardContent className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">Test Case {tcIndex + 1}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    id={`tc-${qIndex}-${tcIndex}-hidden`}
                                    checked={testCase.isHidden}
                                    onChange={(e) => updateTestCase(qIndex, tcIndex, { isHidden: e.target.checked })}
                                  />
                                  <Label htmlFor={`tc-${qIndex}-${tcIndex}-hidden`} className="text-xs">
                                    Hidden
                                  </Label>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-muted-foreground"
                                  onClick={() => removeTestCase(qIndex, tcIndex)}
                                  disabled={(question as CodingQuestion).testCases.length <= 1}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label htmlFor={`tc-${qIndex}-${tcIndex}-input`} className="text-xs">
                                  Input
                                </Label>
                                <Textarea
                                  id={`tc-${qIndex}-${tcIndex}-input`}
                                  value={testCase.input}
                                  onChange={(e) => updateTestCase(qIndex, tcIndex, { input: e.target.value })}
                                  placeholder="Input value"
                                  className="font-mono h-20 text-sm"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`tc-${qIndex}-${tcIndex}-output`} className="text-xs">
                                  Expected Output
                                </Label>
                                <Textarea
                                  id={`tc-${qIndex}-${tcIndex}-output`}
                                  value={testCase.expectedOutput}
                                  onChange={(e) => updateTestCase(qIndex, tcIndex, { expectedOutput: e.target.value })}
                                  placeholder="Expected output"
                                  className="font-mono h-20 text-sm"
                                  required
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting || !isFormValid()}>
          {isSubmitting ? "Saving..." : initialQuiz ? "Update Quiz" : "Create Quiz"}
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;
