
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuiz } from "@/context/QuizContext";

const QuizResults = () => {
  const { quizzes, getQuizResults } = useQuiz();

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default QuizResults;
