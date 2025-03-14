import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppUser } from "@/lib/types";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error("Invalid email or password");
      }
      
      const loggedInUser: AppUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        theme: "light",
        currency: "USD"
      };
      
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      const registeredUser: AppUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        theme: "light",
        currency: "USD"
      };
      
      setUser(registeredUser);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
