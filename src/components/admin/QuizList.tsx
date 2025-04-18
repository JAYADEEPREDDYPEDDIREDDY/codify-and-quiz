
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/context/QuizContext";
import { Skeleton } from "@/components/ui/skeleton";

const QuizList = () => {
  const navigate = useNavigate();
  const { quizzes, deleteQuiz } = useQuiz();
  const { toast } = useToast();

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

  return (
    <div className="rounded-lg border w-full">
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
  );
};

export default QuizList;
