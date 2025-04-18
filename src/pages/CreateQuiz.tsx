
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import QuizForm from "@/components/QuizForm";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/lib/types";

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createQuiz } = useQuiz();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (quizData: Omit<Quiz, "id">) => {
    setIsSubmitting(true);
    
    try {
      createQuiz(quizData);
      toast({
        title: "Quiz Created",
        description: "The quiz has been created successfully.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Creating Quiz",
        description: "There was an error creating the quiz. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Quiz</h1>
          <p className="text-muted-foreground">
            Create a new quiz with multiple-choice and coding questions
          </p>
        </div>
        
        <QuizForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
};

export default CreateQuiz;
