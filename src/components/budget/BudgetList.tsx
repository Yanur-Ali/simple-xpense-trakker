
import { Budget } from "@/lib/types";
import { BudgetItem } from "./BudgetItem";
import { motion } from "framer-motion";

interface BudgetListProps {
  budgets: Budget[];
  onEditBudget: (updatedBudget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetList = ({ budgets, onEditBudget, onDeleteBudget }: BudgetListProps) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
    >
      {budgets.map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          onEdit={onEditBudget}
          onDelete={onDeleteBudget}
        />
      ))}
    </motion.div>
  );
};
