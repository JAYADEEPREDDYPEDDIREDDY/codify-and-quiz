
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="text-base">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-6">
              <div className="rounded bg-muted px-3 py-1 inline-block mb-1">
                <span className="capitalize text-muted-foreground font-medium">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Go to Dashboard
              </Button>
              <Button onClick={() => navigate("/results")} variant="outline">
                View Results
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
