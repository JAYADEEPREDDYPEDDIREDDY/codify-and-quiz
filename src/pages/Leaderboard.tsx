
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Medal } from "lucide-react";

interface RankedUser {
  userId: string;
  name: string;
  totalScore: number;
  quizzesTaken: number;
  avgScore: number;
}

const Leaderboard: React.FC = () => {
  const { results } = useQuiz();

  const leaderboardData: RankedUser[] = React.useMemo(() => {
    // Group results by userId
    const userResults: Record<string, { totalScore: number; quizzesTaken: number; scores: number[] }> = {};
    
    results.forEach((result) => {
      if (!userResults[result.userId]) {
        userResults[result.userId] = {
          totalScore: 0,
          quizzesTaken: 0,
          scores: [],
        };
      }
      
      userResults[result.userId].totalScore += result.score;
      userResults[result.userId].quizzesTaken += 1;
      userResults[result.userId].scores.push(result.score / result.maxScore * 100);
    });
    
    // Convert to array and calculate average scores
    return Object.entries(userResults)
      .map(([userId, data]) => ({
        userId,
        name: `User ${userId}`, // In a real app, fetch user names from a user service
        totalScore: data.totalScore,
        quizzesTaken: data.quizzesTaken,
        avgScore: data.quizzesTaken > 0 
          ? data.scores.reduce((sum, score) => sum + score, 0) / data.quizzesTaken 
          : 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore || b.avgScore - a.avgScore);
  }, [results]);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            Top performers across all quizzes
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Global Rankings</CardTitle>
            <CardDescription>Based on total points earned and average scores</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No quiz results available yet.
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Quizzes Taken</TableHead>
                      <TableHead className="text-right">Total Score</TableHead>
                      <TableHead className="text-right">Avg. Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((user, index) => (
                      <TableRow key={user.userId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <Medal className={`h-5 w-5 mr-1 ${getMedalColor(index)}`} />
                            ) : (
                              <span className="w-5 text-center mr-1">{index + 1}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{user.quizzesTaken}</TableCell>
                        <TableCell className="text-right font-medium">{user.totalScore}</TableCell>
                        <TableCell className="text-right">
                          {user.avgScore.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;
