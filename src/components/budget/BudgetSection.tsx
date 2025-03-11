
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle } from "lucide-react";
import { Budget } from "@/lib/types";
import { motion } from "framer-motion";

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
  }
];

export const BudgetSection = () => {
  const [budgets] = useState<Budget[]>(sampleBudgets);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Budgets</h2>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="w-4 h-4" />
          Add Budget
        </Button>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{budget.category}</span>
              <span className="text-muted-foreground">
                ${budget.currentUsage} / ${budget.amount}
              </span>
            </div>
            <Progress
              value={(budget.currentUsage / budget.amount) * 100}
              className="h-2"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};
