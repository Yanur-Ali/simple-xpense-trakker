
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CategorySticker from "@/components/ui/category-sticker";
import { sampleCategories } from "@/lib/sample-data";

const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.string().min(1, "Please enter an amount"),
  category: z.string().min(1, "Please select a category"),
  date: z.date(),
  note: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

const AddTransaction = () => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  
  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      date: new Date(), // Current date is set automatically
      note: "",
    },
  });
  
  const onSubmit = (data: TransactionForm) => {
    console.log("Transaction submitted:", data);
    
    // Show success toast
    toast.success("Transaction added successfully!", {
      description: `${data.type === "expense" ? "Expense" : "Income"} of $${data.amount} for ${data.category}`,
    });
    
    // Wait a moment then navigate to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Filter categories based on transaction type
  const filteredCategories = sampleCategories.filter(category => 
    (transactionType === "expense" && category.name !== "Salary" && category.name !== "Investments") ||
    (transactionType === "income" && (category.name === "Salary" || category.name === "Investments"))
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto pb-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 mb-3 -ml-2 text-muted-foreground"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Transaction</h1>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex gap-2 p-1.5 bg-secondary rounded-lg">
          <Button
            type="button"
            variant={transactionType === "expense" ? "default" : "ghost"}
            className={cn(
              "flex-1 font-medium",
              transactionType === "expense" && "bg-expense hover:bg-expense/90",
            )}
            onClick={() => {
              setTransactionType("expense");
              form.setValue("type", "expense");
              form.setValue("category", "");
            }}
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
            onClick={() => {
              setTransactionType("income");
              form.setValue("type", "income");
              form.setValue("category", "");
            }}
          >
            Income
          </Button>
        </div>
      </motion.div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={itemVariants}>
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
                        autoFocus // Automatically focus on amount field
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-4 gap-3 py-2">
                      {filteredCategories.map((category) => (
                        <div 
                          key={category.id} 
                          className="flex flex-col items-center gap-1"
                        >
                          <CategorySticker
                            category={category.name}
                            color={category.color}
                            selected={field.value === category.name}
                            onClick={() => field.onChange(category.name)}
                          />
                          <span className="text-xs font-medium text-center">
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
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
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="text-sm text-muted-foreground mb-4">
              Date: {format(new Date(), "MMM d, yyyy")} (Today)
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button type="submit" className="w-full" size="lg">
              Save Transaction
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AddTransaction;
