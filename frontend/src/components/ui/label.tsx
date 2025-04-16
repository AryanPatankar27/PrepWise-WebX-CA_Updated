"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-foreground/90",
        muted: "text-muted-foreground",
        error: "text-destructive font-semibold",
        success: "text-green-600 dark:text-green-500",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
      weight: {
        default: "font-medium",
        normal: "font-normal",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "default",
      required: false,
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  optional?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, weight, required, optional, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants({ variant, size, weight, required, className }),
      "group relative inline-flex items-center gap-1 hover:opacity-90",
    )}
    {...props}
  >
    {props.children}
    {optional && (
      <span className="text-xs text-muted-foreground font-normal ml-1">
        (Optional)
      </span>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export default Label