
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Budget } from "@/lib/types";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const { toast } = useToast();

  const handleAddBudget = () => {
    if (!category || !amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const newBudget: Budget = {
      id: Date.now().toString(),
      category,
      amount: amountNumber,
      period,
      currentUsage: 0
    };

    setBudgets([...budgets, newBudget]);
    setOpen(false);
    setCategory("");
    setAmount("");
    setPeriod("monthly");

    toast({
      title: "Budget added",
      description: `${category} budget of $${amountNumber} added successfully!`
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Budgets</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="w-4 h-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Food, Transport, Entertainment"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(value) => setPeriod(value as any)}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBudget}>Add Budget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No budgets yet. Add your first budget to start tracking expenses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.currentUsage / budget.amount) * 100;
            return (
              <div key={budget.id} className="space-y-2 bg-card p-3 rounded-lg border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{budget.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      ${budget.currentUsage.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
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
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

