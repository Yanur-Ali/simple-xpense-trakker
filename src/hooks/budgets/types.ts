
import { Budget } from "@/lib/types";

export interface BudgetHookReturn {
  budgets: Budget[];
  loading: boolean;
  error: Error | null;
  addBudget: (budget: Budget) => Promise<void>;
  editBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}
