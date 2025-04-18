
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, BookOpen } from "lucide-react";

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserResults, quizzes } = useQuiz();

  if (!user) {
    navigate("/login");
    return null;
  }

  const userResults = getUserResults(user.id).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    return quiz?.title || "Unknown Quiz";
  };

  const getQuizCategory = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    return quiz?.category || "Unknown";
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
          <p className="text-muted-foreground mt-2">
            View your quiz history and performance
          </p>
        </div>

        {userResults.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">No quiz results yet</h3>
                <p className="text-muted-foreground">
                  You haven't completed any quizzes yet. Head to the dashboard to start a quiz.
                </p>
                <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {userResults.map((result) => {
              const percentage = Math.round((result.score / result.maxScore) * 100);
              const scoreColorClass = getScoreColor(percentage);
              
              return (
                <Card key={result.id} className="overflow-hidden">
                  <div className={`h-2 ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{getQuizTitle(result.quizId)}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Badge variant="outline">{getQuizCategory(result.quizId)}</Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(result.completedAt).toLocaleDateString()} at{" "}
                            {new Date(result.completedAt).toLocaleTimeString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className={`text-2xl font-bold ${scoreColorClass}`}>
                        {result.score} / {result.maxScore}
                        <span className="text-sm ml-2">({percentage}%)</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Time Taken</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDuration(result.timeTaken)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Performance</p>
                          <p className="text-sm text-muted-foreground">
                            {percentage >= 80
                              ? "Excellent"
                              : percentage >= 60
                              ? "Good"
                              : "Needs Improvement"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => navigate(`/quiz/${result.quizId}`)}
                    >
                      Retake Quiz
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
