"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "grid gap-3 transition-all duration-200 ease-in-out",
        className
      )}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative aspect-square h-5 w-5 rounded-full border-2 border-slate-300",
        "text-primary ring-offset-background transition-all duration-200",
        "hover:border-primary/80 hover:shadow-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle 
          className={cn(
            "h-2.5 w-2.5 fill-primary text-primary",
            "scale-0 transition-transform duration-200",
            "group-data-[state=checked]:scale-100"
          )} 
        />
      </RadioGroupPrimitive.Indicator>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
        {props["aria-label"]}
      </span>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }