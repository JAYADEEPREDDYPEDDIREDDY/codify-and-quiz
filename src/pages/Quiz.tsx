
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import MCQQuestion from "@/components/MCQQuestion";
import CodingQuestion from "@/components/CodingQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QuestionResult, Quiz as QuizType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuizById, submitQuizResult } = useQuiz();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<QuizType | undefined>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundQuiz = getQuizById(id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeLeft(foundQuiz.duration * 60); // Convert minutes to seconds
        setMaxScore(foundQuiz.questions.reduce((sum, q) => sum + q.points, 0));
      } else {
        toast({
          variant: "destructive",
          title: "Quiz not found",
          description: "The requested quiz could not be found.",
        });
        navigate("/dashboard");
      }
    }
  }, [id, getQuizById, navigate, toast]);

  // Timer logic
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleCodeChange = (questionId: string, code: string) => {
    setCodeAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const evaluateAnswers = (): QuestionResult[] => {
    if (!quiz) return [];
    
    return quiz.questions.map((question) => {
      if (question.type === "mcq") {
        const selectedOptionId = answers[question.id] as string;
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        const isCorrect = !!selectedOption?.isCorrect;
        
        return {
          questionId: question.id,
          isCorrect,
          points: isCorrect ? question.points : 0,
          userAnswer: selectedOptionId,
        };
      } else if (question.type === "coding") {
        const userCode = codeAnswers[question.id] || "";
        // Simple evaluation logic for demo - in real app would be based on actual test results
        const isCorrect = userCode.length > 50 && userCode.includes('return');
        
        return {
          questionId: question.id,
          isCorrect,
          points: isCorrect ? question.points : 0,
          userCode,
        };
      }
      
      // This is a type assertion to ensure we handle all question types
      const q = question as { id: string, points: number };
      return {
        questionId: q.id,
        isCorrect: false,
        points: 0,
      };
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    
    try {
      setSubmitting(true);
      const questionResults = evaluateAnswers();
      const totalScore = questionResults.reduce((sum, result) => sum + result.points, 0);
      
      const quizResult = {
        userId: user.id,
        quizId: quiz.id,
        score: totalScore,
        maxScore,
        timeTaken: quiz.duration * 60 - timeLeft,
        completedAt: new Date(),
        results: questionResults,
      };
      
      submitQuizResult(quizResult);
      
      setResults(questionResults);
      setScore(totalScore);
      setQuizCompleted(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting quiz",
        description: "There was an error submitting your quiz results. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading quiz...</p>
        </div>
      </Layout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Layout>
      {!quizStarted ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time: {quiz.duration} minutes</span>
            </div>
            <div>
              <p className="text-sm">Total Questions: {quiz.questions.length}</p>
              <p className="text-sm">
                Questions: {quiz.questions.filter(q => q.type === "mcq").length} MCQs, 
                {quiz.questions.filter(q => q.type === "coding").length} Coding
              </p>
              <p className="text-sm">Maximum Score: {maxScore}</p>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium">Instructions:</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Once started, the timer cannot be paused.</li>
                <li>Answer all questions before submitting.</li>
                <li>You can navigate between questions using the previous/next buttons.</li>
                <li>For coding questions, run your code to test before submission.</li>
                <li>The quiz will be automatically submitted when the time expires.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartQuiz}>Start Quiz</Button>
          </CardFooter>
        </Card>
      ) : quizCompleted ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>
              You've completed the {quiz.title} quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <p className="text-4xl font-bold gradient-text">
                {score} / {maxScore}
              </p>
              <p className="text-muted-foreground mt-2">
                You scored {Math.round((score / maxScore) * 100)}%
              </p>
            </div>
            
            <div className="space-y-6 mt-8">
              <h3 className="text-lg font-medium">Results Breakdown</h3>
              
              {quiz.questions.map((question, index) => {
                const result = results.find(r => r.questionId === question.id);
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <div className={result?.isCorrect ? "text-green-600" : "text-red-600"}>
                        {result?.isCorrect ? "Correct" : "Incorrect"} ({result?.points} / {question.points} points)
                      </div>
                    </div>
                    <p className="mb-4">{question.text}</p>
                    
                    {question.type === "mcq" && (
                      <MCQQuestion
                        question={question}
                        onAnswerChange={() => {}}
                        initialAnswer={answers[question.id] as string}
                        showResults={true}
                      />
                    )}
                    
                    {question.type === "coding" && (
                      <CodingQuestion
                        question={question}
                        onCodeChange={() => {}}
                        initialCode={codeAnswers[question.id]}
                        showResults={true}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`${timeLeft < 60 ? 'text-red-500 font-bold' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {currentQuestion.type === "mcq" ? (
                <MCQQuestion
                  question={currentQuestion}
                  onAnswerChange={(answer) => 
                    handleAnswerChange(currentQuestion.id, answer)
                  }
                  initialAnswer={answers[currentQuestion.id] as string}
                />
              ) : (
                <CodingQuestion
                  question={currentQuestion}
                  onCodeChange={(code) => 
                    handleCodeChange(currentQuestion.id, code)
                  }
                  initialCode={codeAnswers[currentQuestion.id]}
                />
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="gap-2">
                    Submit Quiz
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You're about to submit your quiz. Make sure you've answered all questions.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuizPage;
