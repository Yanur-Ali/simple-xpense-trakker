
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppUser } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string, isPhone?: boolean) => Promise<void>;
  register: (name: string, emailOrPhone: string, password: string, isPhone?: boolean) => Promise<void>;
  logout: () => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to convert Supabase User to our AppUser format
const mapUserToAppUser = (user: User | null, session: Session | null): AppUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || user.phone || 'User',
    email: user.email || '',
    theme: "light",
    currency: "USD"
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        
        if (data?.session) {
          const appUser = mapUserToAppUser(data.session.user, data.session);
          setUser(appUser);
        }
      } catch (error) {
        console.error("Unexpected error during session fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const appUser = mapUserToAppUser(session.user, session);
          setUser(appUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrPhone: string, password: string, isPhone = false) => {
    setIsLoading(true);
    try {
      let response;
      
      if (isPhone) {
        response = await supabase.auth.signInWithPassword({
          phone: emailOrPhone,
          password
        });
      } else {
        response = await supabase.auth.signInWithPassword({
          email: emailOrPhone,
          password
        });
      }
      
      const { data, error } = response;
      
      if (error) throw error;
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, emailOrPhone: string, password: string, isPhone = false) => {
    setIsLoading(true);
    try {
      let response;
      
      if (isPhone) {
        response = await supabase.auth.signUp({
          phone: emailOrPhone,
          password,
          options: {
            data: { name }
          }
        });
      } else {
        response = await supabase.auth.signUp({
          email: emailOrPhone,
          password,
          options: {
            data: { name }
          }
        });
      }
      
      const { data, error } = response;
      
      if (error) throw error;
      
      toast.success(isPhone 
        ? "Registration successful! We'll send you an OTP to verify your phone number." 
        : "Registration successful! Check your email to confirm your account.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone
      });
      
      if (error) throw error;
      
      toast.success("OTP sent to your phone number!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      
      if (error) throw error;
      
      toast.success("Phone number verified successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
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
        sendOtp,
        verifyOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
