
import { useState } from "react";
import { Budget } from "@/lib/types";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { AddBudgetDialog } from "./AddBudgetDialog";
import { EmptyBudgetState } from "./EmptyBudgetState";
import { BudgetList } from "./BudgetList";

const sampleBudgets: Budget[] = [
  {
    id: "1",
    category: "Food",
    amount: 500,
    period: "monthly",
    currentUsage: 350
  },
  {
    id: "2",
    category: "Transport",
    amount: 200,
    period: "monthly",
    currentUsage: 150
  },
  {
    id: "3",
    category: "Entertainment",
    amount: 150,
    period: "monthly",
    currentUsage: 100
  }
];

export const BudgetSection = () => {
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const { toast } = useToast();

  const handleAddBudget = (newBudget: Budget) => {
    setBudgets([...budgets, newBudget]);
  };

  const handleEditBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    toast({
      title: "Budget deleted",
      description: "Budget has been removed successfully"
    });
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

      {budgets.length === 0 ? (
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
