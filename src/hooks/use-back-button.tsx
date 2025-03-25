import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run in Capacitor environment
    if (!(window as any).Capacitor) return;

    const handleBackButton = () => {
      // If we're at a root page, exit the app
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        App.exitApp();
      } else {
        // Otherwise go back in history
        navigate(-1);
      }
      return false; // Prevent default behavior
    };

    // Register the back button handler
    const backButtonListener = App.addListener('backButton', handleBackButton);

    // Clean up the listener when component unmounts
    return () => {
      if ((window as any).Capacitor) {
        backButtonListener.remove();
      }
    };
  }, [navigate, location.pathname]);
}
