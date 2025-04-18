
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import QuizForm from "@/components/QuizForm";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/lib/types";

const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuizById, updateQuiz } = useQuiz();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to view this page.",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast]);

  // Load quiz data
  useEffect(() => {
    if (id) {
      const foundQuiz = getQuizById(id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        toast({
          variant: "destructive",
          title: "Quiz not found",
          description: "The requested quiz could not be found.",
        });
        navigate("/admin");
      }
    }
  }, [id, getQuizById, navigate, toast]);

  const handleSubmit = (quizData: Omit<Quiz, "id">) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      updateQuiz(id, quizData);
      toast({
        title: "Quiz Updated",
        description: "The quiz has been updated successfully.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Updating Quiz",
        description: "There was an error updating the quiz. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading quiz data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Quiz</h1>
          <p className="text-muted-foreground">
            Update quiz details and questions
          </p>
        </div>
        
        <QuizForm 
          initialQuiz={quiz} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </Layout>
  );
};

export default EditQuiz;
