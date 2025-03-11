
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { DollarSign, X } from "lucide-react";

import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import TransactionTypeSelector from "@/components/transactions/TransactionTypeSelector";
import CategorySelector from "@/components/transactions/CategorySelector";

const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.string().min(1, "Please enter an amount"),
  category: z.string().min(1, "Please select a category"),
  date: z.date(),
  note: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const EditTransactionModal = ({
  transaction,
  isOpen,
  onClose,
  onSave,
}: EditTransactionModalProps) => {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      date: new Date(),
      note: "",
    },
  });

  // Update form when transaction changes
  useEffect(() => {
    if (transaction) {
      setTransactionType(transaction.type);
      form.reset({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date,
        note: transaction.note || "",
      });
    }
  }, [transaction, form]);

  const onSubmit = (data: TransactionForm) => {
    if (!transaction) return;
    
    onSave({
      ...transaction,
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      note: data.note,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        {transaction && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TransactionTypeSelector 
                transactionType={transactionType}
                onTypeChange={(type) => {
                  setTransactionType(type);
                  form.setValue("type", type);
                  form.setValue("category", "");
                }}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-9 text-lg"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CategorySelector form={form} transactionType={transactionType} />
              
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a note..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-sm text-muted-foreground mb-4">
                Date: {format(transaction.date, "MMM d, yyyy")}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;
