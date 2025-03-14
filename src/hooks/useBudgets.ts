import { User } from "@supabase/supabase-js";
import { AppUser } from "@/lib/types";
import { useSupabaseBudgets } from "./budgets/useSupabaseBudgets";
import { useMockBudgets } from "./budgets/useMockBudgets";
import { BudgetHookReturn } from "./budgets/types";

// Accept either Supabase User or our AppUser type
export function useBudgets(user: User | AppUser | null): BudgetHookReturn {
  if (!user) {
    // Return empty implementation if no user
    return {
      budgets: [],
      loading: false,
      error: null,
      addBudget: async () => {},
      editBudget: async () => {},
      deleteBudget: async () => {}
    };
  }
  
  // Check if this is our AppUser type by looking for the 'theme' property
  if ('theme' in user) {
    return useMockBudgets(user);
  }
  
  // Otherwise use Supabase implementation
  return useSupabaseBudgets(user);
}
