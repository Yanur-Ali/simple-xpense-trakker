
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import CategorySticker from "@/components/ui/category-sticker";
import { sampleCategories } from "@/lib/sample-data";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.string().min(1, "Please enter an amount"),
  category: z.string().min(1, "Please select a category"),
  date: z.date(),
  note: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface CategorySelectorProps {
  form: UseFormReturn<TransactionForm>;
  transactionType: "expense" | "income";
}

const CategorySelector = ({ form, transactionType }: CategorySelectorProps) => {
  const filteredCategories = sampleCategories.filter(category => 
    (transactionType === "expense" && category.name !== "Salary" && category.name !== "Investments") ||
    (transactionType === "income" && (category.name === "Salary" || category.name === "Investments"))
  );

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 gap-3 py-2">
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="flex flex-col items-center gap-1"
              >
                <div 
                  onClick={() => {
                    console.log("Category selected:", category.name);
                    field.onChange(category.name);
                  }}
                  className="w-full cursor-pointer"
                >
                  <CategorySticker
                    category={category.name}
                    color={category.color}
                    selected={field.value === category.name}
                  />
                </div>
                <span className="text-xs font-medium text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorySelector;
