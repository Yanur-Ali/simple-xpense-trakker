
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Budget, AppUser } from "@/lib/types";
import { BudgetHookReturn } from "./types";

export function useMockBudgets(user: AppUser): BudgetHookReturn {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Using mock data for AppUser");
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get mock budgets from localStorage if available
        const storedBudgets = localStorage.getItem(`budgets-${user.id}`);
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          // Default empty state
          setBudgets([]);
        }
      } catch (err) {
        console.error("Error fetching mock budgets:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast({
          title: "Failed to load budgets",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgets();
  }, [user, toast]);

  const addBudget = async (newBudget: Budget) => {
    try {
      // Generate a unique ID
      const budgetId = `budget-${Date.now()}`;
      const newBudgetWithId = {
        ...newBudget,
        id: budgetId,
        currentUsage: 0
      };
      
      // Update state
      setBudgets(prevBudgets => {
        const updatedBudgets = [...prevBudgets, newBudgetWithId];
        // Save to localStorage
        localStorage.setItem(`budgets-${user.id}`, JSON.stringify(updatedBudgets));
        return updatedBudgets;
      });
      
      toast({
        title: "Budget added",
        description: "Budget has been added successfully"
      });
    } catch (err) {
      console.error("Error adding mock budget:", err);
      toast({
        title: "Failed to add budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const editBudget = async (updatedBudget: Budget) => {
    try {
      // Update state
      setBudgets(prevBudgets => {
        const updatedBudgets = prevBudgets.map(budget => 
          budget.id === updatedBudget.id ? updatedBudget : budget
        );
        // Save to localStorage
        localStorage.setItem(`budgets-${user.id}`, JSON.stringify(updatedBudgets));
        return updatedBudgets;
      });
      
      toast({
        title: "Budget updated",
        description: "Budget has been updated successfully"
      });
    } catch (err) {
      console.error("Error updating mock budget:", err);
      toast({
        title: "Failed to update budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      // Update state
      setBudgets(prevBudgets => {
        const updatedBudgets = prevBudgets.filter(budget => budget.id !== id);
        // Save to localStorage
        localStorage.setItem(`budgets-${user.id}`, JSON.stringify(updatedBudgets));
        return updatedBudgets;
      });
      
      toast({
        title: "Budget deleted",
        description: "Budget has been removed successfully"
      });
    } catch (err) {
      console.error("Error deleting mock budget:", err);
      toast({
        title: "Failed to delete budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return {
    budgets,
    loading,
    error,
    addBudget,
    editBudget,
    deleteBudget
  };
}
