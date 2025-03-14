
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Budget } from "@/lib/types";
import { User } from "@supabase/supabase-js";

import { BudgetHookReturn } from "./types";

export function useSupabaseBudgets(user: User): BudgetHookReturn {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('budgets')
          .select(`
            id,
            amount,
            period,
            categories(name)
          `)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Format budgets and calculate usage
        const formattedBudgets = await Promise.all(data.map(async (item) => {
          // Call the function to calculate current usage
          const { data: usageData, error: usageError } = await supabase
            .rpc('calculate_budget_usage', { budget_id: item.id });
            
          if (usageError) throw usageError;
          
          // Ensure period is one of the valid types
          const periodValue = (item.period === 'daily' || item.period === 'weekly' || item.period === 'monthly') 
            ? item.period as 'daily' | 'weekly' | 'monthly'
            : 'monthly'; // Default fallback
          
          return {
            id: item.id,
            category: item.categories.name,
            amount: Number(item.amount),
            period: periodValue,
            currentUsage: Number(usageData || 0)
          };
        }));
        
        setBudgets(formattedBudgets);
      } catch (err) {
        console.error("Error fetching budgets:", err);
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
      // Get category_id from name
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', newBudget.category)
        .single();
        
      if (categoryError) throw categoryError;
      
      // Insert budget
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category_id: categoryData.id,
          amount: newBudget.amount,
          period: newBudget.period
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to state with usage at 0
      setBudgets((prevBudgets) => [
        ...prevBudgets, 
        {
          id: data.id,
          category: newBudget.category,
          amount: newBudget.amount,
          period: newBudget.period,
          currentUsage: 0
        }
      ]);
      
      toast({
        title: "Budget added",
        description: "Budget has been added successfully"
      });
    } catch (err) {
      console.error("Error adding budget:", err);
      toast({
        title: "Failed to add budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const editBudget = async (updatedBudget: Budget) => {
    try {
      // Get category_id from name
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', updatedBudget.category)
        .single();
        
      if (categoryError) throw categoryError;
      
      // Update budget
      const { error } = await supabase
        .from('budgets')
        .update({
          category_id: categoryData.id,
          amount: updatedBudget.amount,
          period: updatedBudget.period
        })
        .eq('id', updatedBudget.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update state
      setBudgets((prevBudgets) => 
        prevBudgets.map(budget => 
          budget.id === updatedBudget.id ? updatedBudget : budget
        )
      );
      
      toast({
        title: "Budget updated",
        description: "Budget has been updated successfully"
      });
    } catch (err) {
      console.error("Error updating budget:", err);
      toast({
        title: "Failed to update budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update state
      setBudgets((prevBudgets) => 
        prevBudgets.filter(budget => budget.id !== id)
      );
      
      toast({
        title: "Budget deleted",
        description: "Budget has been removed successfully"
      });
    } catch (err) {
      console.error("Error deleting budget:", err);
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
