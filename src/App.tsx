import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz/:id" element={<Quiz />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/results" element={<Results />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/create-quiz" element={<CreateQuiz />} />
              <Route path="/admin/edit-quiz/:id" element={<EditQuiz />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
