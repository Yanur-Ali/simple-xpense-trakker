
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BalanceCard } from "@/components/ui/balance-card";
import { TransactionCard } from "@/components/ui/transaction-card";
import { ExpenseChart } from "@/components/ui/expense-chart";
import { BudgetSection } from "@/components/budget/BudgetSection";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/lib/types";
import { getTransactions, getExpenseData, getTotalBalance, initializeTransactions } from "@/lib/sample-data";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Initialize with empty data by default (don't use sample data)
        initializeTransactions(false);
        
        // Get transactions from global store
        const allTransactions = getTransactions();
        
        // Calculate income/expense totals
        const balance = getTotalBalance();
        setIncome(balance.income);
        setExpenses(balance.expenses);
        
        // Get expense data for chart
        setExpenseData(getExpenseData());
        
        // Get recent transactions (last 5)
        const sortedTransactions = [...allTransactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentTransactions(sortedTransactions.slice(0, 5));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  const totalBalance = income - expenses;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-4"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Track your finances at a glance</p>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <BalanceCard
          totalBalance={totalBalance}
          income={income}
          expenses={expenses}
          currency="$"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <ExpenseChart data={expenseData} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <BudgetSection />
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
          <button className="text-sm text-primary font-medium hover:underline">
            View All
          </button>
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard 
                key={transaction.id}
                transaction={transaction}
                currency="$"
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Add your first transaction to get started</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
