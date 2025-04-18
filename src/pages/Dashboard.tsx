
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import QuizCard from "@/components/QuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizCategory } from "@/lib/types";

const CATEGORIES: QuizCategory[] = [
  "DSA", 
  "JavaScript", 
  "DBMS", 
  "React", 
  "Python", 
  "System Design"
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { quizzes, getUserResults } = useQuiz();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredQuizzes = selectedCategory === "all" 
    ? quizzes 
    : quizzes.filter(quiz => quiz.category === selectedCategory);

  const completedQuizzes = user ? getUserResults(user.id).map(result => result.quizId) : [];
  const pendingQuizzes = filteredQuizzes.filter(quiz => !completedQuizzes.includes(quiz.id));
  const completedFilteredQuizzes = filteredQuizzes.filter(quiz => completedQuizzes.includes(quiz.id));

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Browse available quizzes or continue where you left off
          </p>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quiz Categories</h2>
              <TabsList>
                <TabsTrigger 
                  value="all" 
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </TabsTrigger>
                {CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={selectedCategory} className="mt-6">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No quizzes available in this category yet.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {pendingQuizzes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Available Quizzes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingQuizzes.map(quiz => (
                          <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {completedFilteredQuizzes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Completed Quizzes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedFilteredQuizzes.map(quiz => (
                          <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
