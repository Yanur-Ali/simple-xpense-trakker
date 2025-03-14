
import { Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TransactionFiltersProps {
  tab: string;
  setTab: (tab: string) => void;
  onClearHistory: () => void;
}

const TransactionFilters = ({ tab, setTab, onClearHistory }: TransactionFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <Tabs defaultValue={tab} className="w-full" onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex ml-2 space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onClearHistory}
          title="Clear History"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" title="More Filters">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
