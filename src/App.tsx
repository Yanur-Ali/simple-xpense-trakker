import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Initialize the app
    const prepare = async () => {
      try {
        // Keep the splash screen visible while we prepare the app
        if ((window as any).Capacitor) {
          // Only hide after a small delay to prevent flicker
          setTimeout(async () => {
            await SplashScreen.hide();
            setAppIsReady(true);
          }, 500);
        } else {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn('Error preparing app:', e);
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    // Only run in Capacitor environment
    if (!(window as any).Capacitor) return;

    const handleAppStateChange = ({ isActive }: { isActive: boolean }) => {
      console.log("App state changed. Is active:", isActive);
    };

    const handleAppUrlOpen = ({ url }: { url: string }) => {
      console.log("App opened with URL:", url);
    };

    CapacitorApp.addListener("appStateChange", handleAppStateChange);
    CapacitorApp.addListener("appUrlOpen", handleAppUrlOpen);

    return () => {
      if ((window as any).Capacitor) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);

  if (!appIsReady) {
    return null; // Show nothing while preparing app
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="expense-tracker-theme">
          <AuthProvider>
            <UserProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/add-transaction" element={<AddTransaction />} />
                      <Route path="/history" element={<TransactionHistory />} />
                      <Route path="/statistics" element={<Statistics />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
