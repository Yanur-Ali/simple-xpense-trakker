
import { motion } from "framer-motion";
import { BalanceCard } from "@/components/ui/balance-card";
import { TransactionCard } from "@/components/ui/transaction-card";
import { ExpenseChart } from "@/components/ui/expense-chart";
import { getExpenseData, getTotalBalance, sampleTransactions } from "@/lib/sample-data";

const Dashboard = () => {
  const { income, expenses } = getTotalBalance();
  const totalBalance = income - expenses;
  const expenseData = getExpenseData();
  
  // Get recent transactions (last 5)
  const recentTransactions = [...sampleTransactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
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
      
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
          <button className="text-sm text-primary font-medium hover:underline">
            View All
          </button>
        </div>
        
        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction.id}
              transaction={transaction}
              currency="$"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
