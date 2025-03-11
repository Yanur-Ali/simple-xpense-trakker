
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  totalBalance: number;
  income: number;
  expenses: number;
  currency: string;
  className?: string;
}

export function BalanceCard({
  totalBalance,
  income,
  expenses,
  currency,
  className,
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden glass-card p-6 w-full",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
          <p className="text-3xl font-bold tracking-tight">
            {currency} {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-income/10">
                <ArrowUpIcon className="w-3 h-3 text-income" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Income</span>
            </div>
            <p className="text-xl font-semibold">
              {currency} {income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-expense/10">
                <ArrowDownIcon className="w-3 h-3 text-expense" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Expenses</span>
            </div>
            <p className="text-xl font-semibold">
              {currency} {expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
