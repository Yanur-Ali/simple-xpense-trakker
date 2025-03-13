
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
                className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                  field.value === category.name ? "bg-primary/10 transform scale-105" : ""
                }`}
                onClick={() => {
                  console.log("Category selected:", category.name);
                  field.onChange(category.name);
                }}
              >
                <div className="w-full cursor-pointer flex justify-center">
                  <CategorySticker
                    category={category.name}
                    color={category.color}
                    selected={field.value === category.name}
                  />
                </div>
                <span className={`text-xs text-center font-medium truncate w-full ${
                  field.value === category.name ? "text-primary font-semibold" : ""
                }`}>
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
