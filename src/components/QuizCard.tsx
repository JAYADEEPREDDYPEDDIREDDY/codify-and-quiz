
import React from "react";
import { Link } from "react-router-dom";
import { Clock, Code, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types";

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const mcqCount = quiz.questions.filter(q => q.type === "mcq").length;
  const codingCount = quiz.questions.filter(q => q.type === "coding").length;

  return (
    <Card className="quiz-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{quiz.title}</CardTitle>
            <CardDescription className="mt-2">{quiz.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            {quiz.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{quiz.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            <span>{mcqCount} MCQs</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>{codingCount} Coding</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={`/quiz/${quiz.id}`}>
          <Button>Start Quiz</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
