import * as React from "react";

import { cn } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
}

function Input({ className, type, label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          error && "border-red-500 focus-visible:ring-red-500/20",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}

export { Input };
