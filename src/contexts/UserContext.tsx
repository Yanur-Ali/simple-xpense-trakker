
import React, { createContext, useState, useContext, ReactNode } from "react";

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
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: defaultContext.name,
    email: defaultContext.email,
    currency: defaultContext.currency,
    theme: defaultContext.theme,
  });

  const updateUserPreferences = (data: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...data
    }));
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
