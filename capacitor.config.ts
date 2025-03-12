
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.345918dceec840cf819542ad69df7b3c',
  appName: 'easy-spend-snapshot',
  webDir: 'dist',
  server: {
    url: 'https://345918dc-eec8-40cf-8195-42ad69df7b3c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#999999"
    }
  }
};

export default config;
