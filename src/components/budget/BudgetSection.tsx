
import { motion } from "framer-motion";
import { AddBudgetDialog } from "./AddBudgetDialog";
import { EmptyBudgetState } from "./EmptyBudgetState";
import { BudgetList } from "./BudgetList";
import { LoadingState } from "./LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { useBudgets } from "@/hooks/useBudgets";

export const BudgetSection = () => {
  const { user } = useAuth();
  const { budgets, loading, addBudget, editBudget, deleteBudget } = useBudgets(user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Budgets</h2>
        <AddBudgetDialog onAddBudget={addBudget} />
      </div>

      {loading ? (
        <LoadingState />
      ) : budgets.length === 0 ? (
        <EmptyBudgetState />
      ) : (
        <BudgetList 
          budgets={budgets} 
          onEditBudget={editBudget} 
          onDeleteBudget={deleteBudget}
        />
      )}
    </motion.div>
  );
};
