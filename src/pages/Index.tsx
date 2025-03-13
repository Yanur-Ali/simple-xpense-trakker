
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Auto-redirect after a timeout only if already authenticated
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4">
            <motion.svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-primary-foreground"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </motion.svg>
          </div>
          <motion.h1 
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Smart Expense Tracker
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Manage your finances with ease and precision
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          {isAuthenticated ? (
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="px-8 gap-2 group"
            >
              Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="px-8 gap-2 group"
              >
                Sign In
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/register")}
                className="px-8 gap-2 group"
              >
                Sign Up
                <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
