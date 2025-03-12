
import { motion } from "framer-motion";

export const EmptyBudgetState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-6 border border-dashed rounded-lg"
    >
      <p className="text-muted-foreground">
        No budgets yet. Add your first budget to start tracking expenses.
      </p>
    </motion.div>
  );
};
