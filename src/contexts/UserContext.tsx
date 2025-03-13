
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface UserContextType {
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  theme: "light" | "dark" | "system";
  updateUserPreferences: (data: Partial<UserPreferences>) => void;
}

interface UserPreferences {
  name: string;
  email: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

const getCurrencySymbol = (currencyCode: string): string => {
  const currencyMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    INR: "₹",
    CNY: "¥",
  };
  
  return currencyMap[currencyCode] || "$";
};

const defaultContext: UserContextType = {
  name: "John Doe",
  email: "john.doe@example.com",
  currency: "USD",
  currencySymbol: "$",
  theme: "light",
  updateUserPreferences: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    // Try to load preferences from localStorage
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      try {
        return JSON.parse(savedPreferences);
      } catch (error) {
        console.error("Failed to parse saved preferences:", error);
      }
    }
    
    // If no saved preferences or parsing failed, use defaults
    return {
      name: user?.name || defaultContext.name,
      email: user?.email || defaultContext.email,
      currency: defaultContext.currency,
      theme: defaultContext.theme,
    };
  });

  // Update preferences when user changes
  useEffect(() => {
    if (user) {
      setUserPreferences(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const updateUserPreferences = (data: Partial<UserPreferences>) => {
    setUserPreferences(prev => {
      const updated = {
        ...prev,
        ...data
      };
      
      // Save to localStorage
      localStorage.setItem("userPreferences", JSON.stringify(updated));
      
      return updated;
    });
    console.log("Updated user preferences:", { ...userPreferences, ...data });
  };

  const value = {
    ...userPreferences,
    currencySymbol: getCurrencySymbol(userPreferences.currency),
    updateUserPreferences,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
