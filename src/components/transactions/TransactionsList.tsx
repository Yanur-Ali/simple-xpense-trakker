
import { motion } from "framer-motion";
import { TransactionCard } from "@/components/ui/transaction-card";
import { Transaction } from "@/lib/types";

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionsList = ({ transactions, onEdit, onDelete }: TransactionsListProps) => {
  return (
    <motion.div variants={itemVariants} className="mt-4 space-y-3">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            currency="$"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      )}
    </motion.div>
  );
};

export default TransactionsList;
