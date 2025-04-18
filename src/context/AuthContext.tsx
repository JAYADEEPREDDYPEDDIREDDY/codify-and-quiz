
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Mock users data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Student User",
    email: "student@example.com",
    password: "student123",
    role: "student" as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user with matching email and password
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("Email already exists");
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
      };
      
      // In a real app, we would save the user to the database here
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
