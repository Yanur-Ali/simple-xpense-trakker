
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import SearchBar from "@/components/transactions/SearchBar";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import DeleteDialog from "@/components/transactions/DeleteDialog";
import ClearHistoryDialog from "@/components/transactions/ClearHistoryDialog";
import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
  const [clearHistoryDialogOpen, setClearHistoryDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  
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

  const handleClearHistory = () => {
    setClearHistoryDialogOpen(true);
  };

  const confirmClearHistory = async () => {
    try {
      setIsClearingHistory(true);
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTransactions([]);
      toast.success("Transaction history cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear transaction history");
    } finally {
      setIsClearingHistory(false);
      setClearHistoryDialogOpen(false);
    }
  };

  const handleExportTransactions = () => {
    try {
      // Convert transactions to JSON string
      const dataStr = JSON.stringify(transactions, null, 2);
      
      // Create a Blob with the data
      const blob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      // Append to the body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Failed to export transactions");
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleExportTransactions}
              title="Export Transactions"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-1">
          View and search your past transactions
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-4">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <TransactionFilters 
          tab={tab}
          setTab={setTab}
          onClearHistory={handleClearHistory}
        />

        <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-4">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), "MMMM yyyy")}</span>
        </div>
      </motion.div>
      
      <TransactionsList 
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteClick}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

      {/* Clear History Confirmation Dialog */}
      <ClearHistoryDialog
        isOpen={clearHistoryDialogOpen}
        onOpenChange={setClearHistoryDialogOpen}
        onConfirm={confirmClearHistory}
        isClearing={isClearingHistory}
      />
    </motion.div>
  );
};

export default TransactionHistory;
