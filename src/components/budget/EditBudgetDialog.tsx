
import { useState, useEffect } from "react";
import { Budget } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

interface EditBudgetDialogProps {
  budget: Budget;
  onSaveBudget: (updatedBudget: Budget) => void;
}

export const EditBudgetDialog = ({ budget, onSaveBudget }: EditBudgetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(budget.category);
  const [amount, setAmount] = useState(budget.amount.toString());
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(budget.period);
  const { toast } = useToast();

  // Update form when budget changes
  useEffect(() => {
    setCategory(budget.category);
    setAmount(budget.amount.toString());
    setPeriod(budget.period);
  }, [budget]);

  const handleSaveBudget = () => {
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

    const updatedBudget: Budget = {
      ...budget,
      category,
      amount: amountNumber,
      period,
    };

    onSaveBudget(updatedBudget);
    setOpen(false);

    toast({
      title: "Budget updated",
      description: `${category} budget has been updated successfully!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
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
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveBudget}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
