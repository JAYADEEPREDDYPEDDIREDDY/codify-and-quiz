
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, List, Users } from "lucide-react";
import QuizList from "@/components/admin/QuizList";
import QuizResults from "@/components/admin/QuizResults";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
            <QuizList />
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            <QuizResults />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
