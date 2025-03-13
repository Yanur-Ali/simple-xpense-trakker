
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { AddBudgetDialog } from "./AddBudgetDialog";
import { EmptyBudgetState } from "./EmptyBudgetState";
import { BudgetList } from "./BudgetList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Budget } from "@/lib/types";

export const BudgetSection = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchBudgets = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Error fetching budgets:", error);
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

  const handleAddBudget = async (newBudget: Budget) => {
    if (!user) return;
    
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
      setBudgets([...budgets, {
        id: data.id,
        category: newBudget.category,
        amount: newBudget.amount,
        period: newBudget.period,
        currentUsage: 0
      }]);
      
      toast({
        title: "Budget added",
        description: "Budget has been added successfully"
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Failed to add budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleEditBudget = async (updatedBudget: Budget) => {
    if (!user) return;
    
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
      setBudgets(budgets.map(budget => 
        budget.id === updatedBudget.id ? updatedBudget : budget
      ));
      
      toast({
        title: "Budget updated",
        description: "Budget has been updated successfully"
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Failed to update budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update state
      setBudgets(budgets.filter(budget => budget.id !== id));
      
      toast({
        title: "Budget deleted",
        description: "Budget has been removed successfully"
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Failed to delete budget",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Budgets</h2>
        <AddBudgetDialog onAddBudget={handleAddBudget} />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">Loading budgets...</p>
        </div>
      ) : budgets.length === 0 ? (
        <EmptyBudgetState />
      ) : (
        <BudgetList 
          budgets={budgets} 
          onEditBudget={handleEditBudget} 
          onDeleteBudget={handleDeleteBudget}
        />
      )}
    </motion.div>
  );
};
