
export interface Transaction {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  date: Date;
  note?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  currentUsage: number;
}
