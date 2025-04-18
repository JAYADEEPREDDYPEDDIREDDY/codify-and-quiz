
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Edit, Trash, Users, List } from "lucide-react";
import { Quiz, QuizCategory } from "@/lib/types";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quizzes, results, getQuizResults, deleteQuiz } = useQuiz();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("quizzes");

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to view this page.",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      deleteQuiz(id);
      toast({
        title: "Quiz Deleted",
        description: "The quiz has been deleted successfully.",
      });
    }
  };

  const handleEditQuiz = (id: string) => {
    navigate(`/admin/edit-quiz/${id}`);
  };

  const handleCreateQuiz = () => {
    navigate("/admin/create-quiz");
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage quizzes, users, and view results
            </p>
          </div>
          <Button onClick={handleCreateQuiz}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="quizzes">
              <List className="mr-2 h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="results">
              <Users className="mr-2 h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes" className="space-y-4 mt-6">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No quizzes available. Create your first quiz!
                      </TableCell>
                    </TableRow>
                  ) : (
                    quizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.category}</TableCell>
                        <TableCell>{quiz.questions.length}</TableCell>
                        <TableCell>{quiz.duration} min</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditQuiz(quiz.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            {quizzes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No quizzes available yet.</p>
              </div>
            ) : (
              quizzes.map((quiz) => {
                const quizResults = getQuizResults(quiz.id);
                return (
                  <Card key={quiz.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{quiz.title}</CardTitle>
                      <CardDescription>
                        {quizResults.length} {quizResults.length === 1 ? "participant" : "participants"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {quizResults.length === 0 ? (
                        <p className="text-muted-foreground">No results available for this quiz yet.</p>
                      ) : (
                        <div className="rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead>Time Taken</TableHead>
                                <TableHead>Completed At</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {quizResults.map((result) => (
                                <TableRow key={result.id}>
                                  <TableCell className="font-medium">{result.userId}</TableCell>
                                  <TableCell>
                                    {result.score} / {result.maxScore}
                                  </TableCell>
                                  <TableCell>
                                    {Math.round((result.score / result.maxScore) * 100)}%
                                  </TableCell>
                                  <TableCell>
                                    {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
                                  </TableCell>
                                  <TableCell>
                                    {new Date(result.completedAt).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
