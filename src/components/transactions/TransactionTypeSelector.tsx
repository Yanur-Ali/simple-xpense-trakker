
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionTypeSelectorProps {
  transactionType: "expense" | "income";
  onTypeChange: (type: "expense" | "income") => void;
}

const TransactionTypeSelector = ({
  transactionType,
  onTypeChange,
}: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1.5 bg-secondary rounded-lg">
      <Button
        type="button"
        variant={transactionType === "expense" ? "default" : "ghost"}
        className={cn(
          "flex-1 font-medium",
          transactionType === "expense" && "bg-expense hover:bg-expense/90",
        )}
        onClick={() => onTypeChange("expense")}
      >
        Expense
      </Button>
      <Button
        type="button"
        variant={transactionType === "income" ? "default" : "ghost"}
        className={cn(
          "flex-1 font-medium",
          transactionType === "income" && "bg-income hover:bg-income/90",
        )}
        onClick={() => onTypeChange("income")}
      >
        Income
      </Button>
    </div>
  );
};

export default TransactionTypeSelector;
