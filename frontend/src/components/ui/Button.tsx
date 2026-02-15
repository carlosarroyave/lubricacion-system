"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger";
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", icon, children, ...props }, ref) => {
    const variantClasses = {
      default: "glass-button",
      ghost: "glass-button-ghost text-gray-700",
      danger: "glass-button-danger",
    };

    return (
      <button
        className={cn(
          "px-4 py-2 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
