
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, BarChart3, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/add-transaction", icon: PlusCircle, label: "Add" },
    { to: "/statistics", icon: BarChart3, label: "Stats" },
    { to: "/profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-2 pt-2 pb-6">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                "text-muted-foreground hover:text-foreground",
                isActive && "text-primary font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
