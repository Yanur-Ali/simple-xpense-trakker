
import { Budget } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface BudgetItemProps {
  budget: Budget;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BudgetItem = ({ budget, onEdit, onDelete }: BudgetItemProps) => {
  const percentage = (budget.currentUsage / budget.amount) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 bg-card p-3 rounded-lg border"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{budget.category}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            ${budget.currentUsage.toFixed(2)} / ${budget.amount.toFixed(2)}
          </span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => onEdit(budget.id)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => onDelete(budget.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
      <Progress
        value={percentage}
        className={`h-2.5 ${getProgressColor(percentage)}`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{budget.period}</span>
        <span>{percentage.toFixed(0)}% used</span>
      </div>
    </motion.div>
  );
};
