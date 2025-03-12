
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/UserContext";
import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="expense-tracker-theme">
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-transaction" element={<AddTransaction />} />
                  <Route path="/history" element={<TransactionHistory />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
