
import { useState } from "react";
import { Budget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

interface AddBudgetDialogProps {
  onAddBudget: (budget: Budget) => void;
}

export const AddBudgetDialog = ({ onAddBudget }: AddBudgetDialogProps) => {
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

    onAddBudget(newBudget);
    setOpen(false);
    setCategory("");
    setAmount("");
    setPeriod("monthly");

    toast({
      title: "Budget added",
      description: `${category} budget of $${amountNumber} added successfully!`
    });
  };

  return (
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
  );
};
