
import { useEffect, useState } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

export interface ExpenseData {
  category: string;
  value: number;
  color: string;
}

interface ExpenseChartProps {
  data: ExpenseData[];
  className?: string;
}

type ChartType = "pie" | "bar";

export function ExpenseChart({ data, className }: ExpenseChartProps) {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("pie");
  const hasData = data.length > 0;
  
  // Calculate the total value for percentage calculations
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add percentage to each data item
  const dataWithPercentage = data.map(item => ({
    ...item,
    percent: totalValue > 0 ? (item.value / totalValue) : 0
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = item.payload.percent * 100;
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-medium mb-1">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            ${item.value.toFixed(2)} ({percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("rounded-xl glass-card p-5 w-full", className)}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-medium">Expenses by Category</h3>
        <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as ChartType)}>
          <ToggleGroupItem value="pie" aria-label="Toggle pie chart">
            <PieChartIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="bar" aria-label="Toggle bar chart">
            <BarChart2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="h-[300px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={dataWithPercentage}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="category"
                  isAnimationActive={true}
                  animationDuration={800}
                  label={({ name, payload }) => {
                    if (!animationFinished) return '';
                    const percent = payload.percent * 100;
                    return `${name} ${percent.toFixed(1)}%`;
                  }}
                  labelLine={false}
                >
                  {dataWithPercentage.map((entry, index) => (
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
            ) : (
              <BarChart data={dataWithPercentage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
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
