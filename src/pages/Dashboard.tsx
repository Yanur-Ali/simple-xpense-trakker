
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BalanceCard } from "@/components/ui/balance-card";
import { TransactionCard } from "@/components/ui/transaction-card";
import { ExpenseChart } from "@/components/ui/expense-chart";
import { BudgetSection } from "@/components/budget/BudgetSection";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch income total
        const { data: incomeData, error: incomeError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'income');
          
        if (incomeError) throw incomeError;
        
        // Fetch expense total
        const { data: expenseData, error: expenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'expense');
          
        if (expenseError) throw expenseError;
        
        // Calculate totals
        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
        
        setIncome(totalIncome);
        setExpenses(totalExpenses);
        
        // Fetch expense data grouped by category
        const { data: expenseByCategoryData, error: categoryError } = await supabase
          .from('transactions')
          .select('amount, categories(name, color)')
          .eq('user_id', user.id)
          .eq('type', 'expense');
          
        if (categoryError) throw categoryError;
        
        // Process expense by category for chart
        const categoryMap = new Map();
        
        expenseByCategoryData.forEach(item => {
          const category = item.categories.name;
          const color = item.categories.color;
          const amount = Number(item.amount);
          
          if (categoryMap.has(category)) {
            categoryMap.set(category, {
              value: categoryMap.get(category).value + amount,
              color: color
            });
          } else {
            categoryMap.set(category, { value: amount, color: color });
          }
        });
        
        const chartData = Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          value: data.value,
          color: data.color
        }));
        
        setExpenseData(chartData);
        
        // Fetch recent transactions
        const { data: recentData, error: recentError } = await supabase
          .from('transactions')
          .select(`
            id, 
            type, 
            amount, 
            date, 
            note,
            categories(name)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5);
          
        if (recentError) throw recentError;
        
        // Format recent transactions
        const formattedRecent = recentData.map(item => ({
          id: item.id,
          type: item.type,
          amount: Number(item.amount),
          category: item.categories.name,
          date: new Date(item.date),
          note: item.note
        }));
        
        setRecentTransactions(formattedRecent);
        
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
