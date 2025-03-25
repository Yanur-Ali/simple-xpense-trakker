
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import UserInfo from "../auth/UserInfo";
import { useBackButton } from "@/hooks/use-back-button";
import { useEffect } from "react";
import { StatusBar, Style } from '@capacitor/status-bar';

const AppLayout = () => {
  // Handle back button presses
  useBackButton();

  // Handle status bar color
  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        if ((window as any).Capacitor?.isPluginAvailable('StatusBar')) {
          await StatusBar.setStyle({ style: Style.Light });
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            await StatusBar.setStyle({ style: Style.Dark });
          }
        }
      } catch (error) {
        console.error('Error setting status bar style:', error);
      }
    };

    setupStatusBar();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserInfo />
      <main className="flex-1 px-4 pb-20 pt-4 mx-auto w-full max-w-md">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};

export default AppLayout;
