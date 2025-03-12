
import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";

const currencies = [
  { label: "USD - US Dollar", value: "USD", symbol: "$" },
  { label: "EUR - Euro", value: "EUR", symbol: "€" },
  { label: "GBP - British Pound", value: "GBP", symbol: "£" },
  { label: "JPY - Japanese Yen", value: "JPY", symbol: "¥" },
  { label: "CAD - Canadian Dollar", value: "CAD", symbol: "C$" },
  { label: "AUD - Australian Dollar", value: "AUD", symbol: "A$" },
  { label: "INR - Indian Rupee", value: "INR", symbol: "₹" },
  { label: "CNY - Chinese Yuan", value: "CNY", symbol: "¥" },
];

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  currency: z.string().min(1, "Please select a currency"),
  theme: z.enum(["light", "dark", "system"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const { name, email, currency, updateUserPreferences } = useUser();
  
  const defaultValues: Partial<ProfileFormValues> = {
    name,
    email,
    currency,
    theme: theme as "light" | "dark" | "system",
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });
  
  function onSubmit(data: ProfileFormValues) {
    console.log("Profile updated:", data);
    
    // Update theme if changed
    if (data.theme !== theme) {
      setTheme(data.theme);
    }
    
    // Update user preferences in context
    updateUserPreferences({
      name: data.name,
      email: data.email,
      currency: data.currency,
      theme: data.theme,
    });
    
    // Show success toast
    toast.success("Profile updated successfully!");
  }
  
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your account settings</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex justify-center mb-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </motion.div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              <div className="flex items-center gap-2">
                                <span>{currency.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              <span>Light</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              <span>Dark</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <span>System</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your preferred theme
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </motion.div>
        </form>
      </Form>
      
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your data is stored securely and never shared with third parties.
            </p>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <p className="text-sm">Export Data</p>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
