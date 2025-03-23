
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";

import { getTransactions, getExpenseData, initializeTransactions } from "@/lib/sample-data";
import { shortFormatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseChart, ExpenseData } from "@/components/ui/expense-chart";

// Convert sample data to chart data
const processChartData = () => {
  // Initialize transactions if needed
  initializeTransactions(false);
  
  // Get transactions from global store
  const transactions = getTransactions();
  
  // Group transactions by date for the last 14 days
  const today = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);
  
  const lastTwoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (13 - i));
    return date;
  });
  
  return lastTwoWeeks.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTransactions = transactions.filter(t => 
      t.date.toISOString().split('T')[0] === dateStr
    );
    
    return {
      date: date,
      expenses: dayTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
      income: dayTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    };
  });
};

// Process category data
const processCategoryData = (): ExpenseData[] => {
  // Initialize transactions if needed
  initializeTransactions(false);
  
  // Get transactions from global store
  const transactions = getTransactions();
  
  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(item => item.category === transaction.category);
      
      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        acc.push({
          category: transaction.category,
          value: transaction.amount,
          color: getCategoryColor(transaction.category),
        });
      }
      
      return acc;
    }, [] as ExpenseData[]);
  
  return expensesByCategory;
};

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Food": "#FF6B6B",
    "Transport": "#4ECDC4",
    "Entertainment": "#FFD166",
    "Shopping": "#6A0572",
    "Health": "#1A936F",
    "Bills": "#3A86FF",
    "Education": "#8338EC",
    "Travel": "#FB5607",
    "Salary": "#09D6A0",
    "Investments": "#118AB2",
  };
  
  return colors[category] || "#808080";
};

const Statistics = () => {
  const [chartData] = useState(processChartData());
  const [categoryData] = useState(processCategoryData());
  const [timeRange, setTimeRange] = useState("week");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg border border-border shadow-md">
          <p className="font-medium">{shortFormatDate(new Date(label))}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Statistics</h1>
        <p className="text-muted-foreground text-sm">Analyze your spending habits</p>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center p-1 bg-secondary rounded-lg">
            <Button
              variant={timeRange === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange("week")}
              className="flex-1 font-medium"
            >
              Week
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange("month")}
              className="flex-1 font-medium"
            >
              Month
            </Button>
            <Button
              variant={timeRange === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange("year")}
              className="flex-1 font-medium"
            >
              Year
            </Button>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cash Flow</CardTitle>
                <CardDescription>Income vs. Expenses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      barGap={0}
                      barCategoryGap={8}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => shortFormatDate(new Date(date))}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        iconType="circle" 
                        iconSize={8}
                        formatter={(value) => <span style={{ fontSize: '12px'}}>{value}</span>}
                      />
                      <Bar dataKey="income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="expenses" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Spending Trends</CardTitle>
                <CardDescription>Your expense patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => shortFormatDate(new Date(date))}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="hsl(var(--expense))" 
                        name="Expenses"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <ExpenseChart data={categoryData} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Statistics;
