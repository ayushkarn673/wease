import * as React from "react";
import { cn } from "@/lib/utils";

export default function AuthCard({ children, className }) {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {children}
    </div>
  );
}
