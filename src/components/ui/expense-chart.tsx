
import { useEffect, useState } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip 
} from "recharts";
import { cn } from "@/lib/utils";

export interface ExpenseData {
  category: string;
  value: number;
  color: string;
}

interface ExpenseChartProps {
  data: ExpenseData[];
  className?: string;
}

export function ExpenseChart({ data, className }: ExpenseChartProps) {
  const [animationFinished, setAnimationFinished] = useState(false);
  const hasData = data.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-medium mb-1">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            ${payload[0].value.toFixed(2)} ({Math.round(payload[0].percent * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("rounded-xl glass-card p-5 w-full", className)}>
      <h3 className="text-base font-medium mb-3">Expenses by Category</h3>
      
      <div className="h-[300px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={1}
                dataKey="value"
                nameKey="category"
                isAnimationActive={true}
                animationDuration={800}
                label={({ name, percent }) => 
                  animationFinished ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                layout="horizontal" 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No expense data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
