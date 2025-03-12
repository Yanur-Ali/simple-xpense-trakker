
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

const AppLayout = () => {
  // Setup back button handling for Capacitor on mobile
  useEffect(() => {
    const handleBackButton = () => {
      // Handle back button press on mobile
      // You could navigate back or show a confirmation dialog
      console.log("Back button pressed");
    };

    if ((window as any).Capacitor) {
      CapacitorApp.addListener("backButton", handleBackButton);
    }

    return () => {
      if ((window as any).Capacitor) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background antialiased">
      <main className="flex-1 pb-24 pt-4 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Safe area padding for mobile devices */}
        <div className="h-safe-top"></div>
        <Outlet />
      </main>
      <div className="safe-area-bottom"></div>
      <Navigation />
    </div>
  );
};

export default AppLayout;
