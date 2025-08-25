import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ReactNode } from "react";

interface ThemeAwareCardProps {
  children: ReactNode;
  className?: string;
  colorScheme?: "green" | "blue" | "orange" | "purple" | "red" | "yellow" | "gray";
  variant?: "gradient" | "solid" | "outline";
}

export function ThemeAwareCard({ 
  children, 
  className = "", 
  colorScheme = "gray",
  variant = "solid"
}: ThemeAwareCardProps) {
  const getCardClasses = () => {
    const baseClasses = "rounded-2xl";
    
    if (variant === "gradient") {
      const gradientClasses = {
        green: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800",
        blue: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800",
        orange: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800",
        purple: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800",
        red: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800",
        yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        gray: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-800"
      };
      return `${baseClasses} ${gradientClasses[colorScheme]} ${className}`;
    }
    
    return `${baseClasses} ${className}`;
  };

  return (
    <Card className={getCardClasses()}>
      {children}
    </Card>
  );
}