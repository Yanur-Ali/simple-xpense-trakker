
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TransactionFiltersProps {
  tab: string;
  setTab: (tab: string) => void;
}

const TransactionFilters = ({ tab, setTab }: TransactionFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <Tabs defaultValue={tab} className="w-full" onValueChange={setTab}>
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
  );
};

export default TransactionFilters;
