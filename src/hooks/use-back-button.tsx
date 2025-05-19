import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run in Capacitor environment
    if (!(window as any).Capacitor) return;

    let backButtonListener: any = null;

    const setupListener = async () => {
      try {
        // Register the back button handler
        backButtonListener = await App.addListener('backButton', () => {
          // If we're at a root page, exit the app
          if (location.pathname === '/' || location.pathname === '/dashboard') {
            App.exitApp();
          } else {
            // Otherwise go back in history
            navigate(-1);
          }
          return false; // Prevent default behavior
        });
      } catch (error) {
        console.error('Error setting up back button listener:', error);
      }
    };

    setupListener();

    // Clean up the listener when component unmounts
    return () => {
      if ((window as any).Capacitor && backButtonListener) {
        try {
          backButtonListener.remove();
        } catch (error) {
          console.error('Error removing back button listener:', error);
        }
      }
    };
  }, [navigate, location.pathname]);
}
