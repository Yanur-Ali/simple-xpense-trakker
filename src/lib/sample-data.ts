
import { Transaction, ExpenseCategory, Budget } from "./types";

export const sampleCategories: ExpenseCategory[] = [
  { id: "1", name: "Food", color: "#FF6B6B" },
  { id: "2", name: "Transport", color: "#4ECDC4" },
  { id: "3", name: "Entertainment", color: "#FFD166" },
  { id: "4", name: "Shopping", color: "#6A0572" },
  { id: "5", name: "Health", color: "#1A936F" },
  { id: "6", name: "Bills", color: "#3A86FF" },
  { id: "7", name: "Education", color: "#8338EC" },
  { id: "8", name: "Travel", color: "#FB5607" },
  { id: "9", name: "Salary", color: "#06D6A0" },
  { id: "10", name: "Investments", color: "#118AB2" },
];

export const sampleTransactions: Transaction[] = [
  {
    id: "t1",
    type: "expense",
    amount: 25.50,
    category: "Food",
    date: new Date(2023, 6, 1),
    note: "Dinner with friends",
  },
  {
    id: "t2",
    type: "expense",
    amount: 15.00,
    category: "Transport",
    date: new Date(2023, 6, 2),
  },
  {
    id: "t3",
    type: "income",
    amount: 2000.00,
    category: "Salary",
    date: new Date(2023, 6, 3),
  },
  {
    id: "t4",
    type: "expense",
    amount: 120.30,
    category: "Shopping",
    date: new Date(2023, 6, 4),
    note: "New shoes",
  },
  {
    id: "t5",
    type: "expense",
    amount: 50.00,
    category: "Entertainment",
    date: new Date(2023, 6, 5),
    note: "Movie tickets and popcorn",
  },
  {
    id: "t6",
    type: "expense",
    amount: 200.00,
    category: "Bills",
    date: new Date(2023, 6, 6),
    note: "Electricity bill",
  },
  {
    id: "t7",
    type: "income",
    amount: 500.00,
    category: "Investments",
    date: new Date(2023, 6, 7),
    note: "Dividend payment",
  },
  {
    id: "t8",
    type: "expense",
    amount: 75.50,
    category: "Health",
    date: new Date(2023, 6, 8),
    note: "Pharmacy",
  },
];

export const sampleBudgets: Budget[] = [
  {
    id: "b1",
    category: "Food",
    amount: 500,
    period: "monthly",
    currentUsage: 325.50,
  },
  {
    id: "b2",
    category: "Transport",
    amount: 200,
    period: "monthly",
    currentUsage: 115.00,
  },
  {
    id: "b3",
    category: "Entertainment",
    amount: 150,
    period: "monthly",
    currentUsage: 95.00,
  },
];

export const getExpenseData = () => {
  // Filter transactions to only expenses
  const expenses = sampleTransactions.filter(t => t.type === "expense");
  
  // Group by category and calculate total per category
  const expensesByCategory = expenses.reduce((acc, transaction) => {
    const existingCategory = acc.find(item => item.category === transaction.category);
    
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      const categoryInfo = sampleCategories.find(c => c.name === transaction.category);
      acc.push({
        category: transaction.category,
        value: transaction.amount,
        color: categoryInfo?.color || "#808080",
      });
    }
    
    return acc;
  }, [] as { category: string; value: number; color: string }[]);
  
  return expensesByCategory;
};

export const getTotalBalance = () => {
  return sampleTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );
};
