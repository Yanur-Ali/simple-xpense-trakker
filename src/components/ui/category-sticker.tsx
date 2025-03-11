
import React from "react";
import { Carrot, Car, Coffee, Pizza, ShoppingBag, LucideIcon, Home, Plane, Briefcase, Tv, ChevronRight, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export type CategoryIcon = 
  | "food" 
  | "transport" 
  | "shopping" 
  | "home" 
  | "travel" 
  | "entertainment" 
  | "work" 
  | "coffee"
  | "dining"
  | "gift"
  | "other";

interface CategoryStickerProps {
  category: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const iconMap: Record<CategoryIcon, LucideIcon> = {
  food: Carrot,
  transport: Car,
  shopping: ShoppingBag,
  home: Home,
  travel: Plane,
  entertainment: Tv,
  work: Briefcase,
  coffee: Coffee,
  dining: Pizza,
  gift: Gift,
  other: ChevronRight
};

const CategorySticker: React.FC<CategoryStickerProps> = ({
  category,
  color,
  selected = false,
  onClick,
  className,
  size = "md"
}) => {
  // Normalize category to match our icon map
  const normalizedCategory = category.toLowerCase() as CategoryIcon;
  const IconComponent = iconMap[normalizedCategory] || iconMap.other;
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16"
  };
  
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 28
  };

  return (
    <div 
      className={cn(
        sizeClasses[size],
        "flex items-center justify-center rounded-full cursor-pointer transition-all duration-200",
        selected && "ring-4 ring-offset-2 ring-offset-background",
        "hover:scale-105",
        className
      )}
      style={{ backgroundColor: color, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      onClick={onClick}
    >
      <IconComponent 
        size={iconSizes[size]} 
        className="text-white" 
      />
    </div>
  );
};

export default CategorySticker;
