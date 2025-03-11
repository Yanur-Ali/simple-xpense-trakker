
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { TransactionCard } from "@/components/ui/transaction-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import { Transaction } from "@/lib/types";

// Sample transactions data - would come from a database in a real app
const sampleTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    amount: 12.99,
    category: "Food",
    date: new Date(2023, 6, 15),
    note: "Lunch at Subway"
  },
  {
    id: "2",
    type: "expense",
    amount: 45.50,
    category: "Transport",
    date: new Date(2023, 6, 14),
    note: "Uber ride"
  },
  {
    id: "3",
    type: "income",
    amount: 2000,
    category: "Salary",
    date: new Date(2023, 6, 10),
  },
  {
    id: "4",
    type: "expense",
    amount: 9.99,
    category: "Entertainment",
    date: new Date(2023, 6, 8),
    note: "Netflix subscription"
  },
  {
    id: "5",
    type: "expense",
    amount: 35.25,
    category: "Shopping",
    date: new Date(2023, 6, 5),
    note: "T-shirt"
  }
];

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

const TransactionHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  // Filter transactions based on tab and search query
  const filteredTransactions = transactions
    .filter(transaction => {
      if (tab === "all") return true;
      return transaction.type === tab;
    })
    .filter(transaction => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        transaction.category.toLowerCase().includes(query) ||
        (transaction.note && transaction.note.toLowerCase().includes(query))
      );
    });

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    toast.success("Transaction updated successfully");
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
      toast.success("Transaction deleted successfully");
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto pb-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground mt-1">
          View and search your past transactions
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-full" onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="icon" className="ml-2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-4">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), "MMMM yyyy")}</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-4 space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              currency="$"
              onEdit={handleEditTransaction}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        )}
      </motion.div>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TransactionHistory;
