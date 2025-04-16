"use client";

import { cn } from "../../lib/utils";
import React, { MouseEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: number;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  rippleOpacity?: number;
  fullWidth?: boolean;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      className,
      children,
      rippleColor = "rgb(255 255 255 / 0.4)",
      duration = 600,
      variant = 'default',
      size = 'md',
      isLoading = false,
      loadingText,
      rippleOpacity = 0.3,
      fullWidth = false,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) return;
      createRipple(event);
      onClick?.(event);
    };

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = { x, y, size, key: Date.now() };
      setButtonRipples((prevRipples) => [...prevRipples, newRipple]);
    };

    useEffect(() => {
      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1];
        const timeout = setTimeout(() => {
          setButtonRipples((prevRipples) =>
            prevRipples.filter((ripple) => ripple.key !== lastRipple.key),
          );
        }, duration);
        return () => clearTimeout(timeout);
      }
    }, [buttonRipples, duration]);

    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border-2 border-primary bg-transparent hover:bg-primary/10",
      ghost: "hover:bg-primary/10",
      link: "text-primary underline-offset-4 hover:underline"
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg"
    };

    return (
      <button
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variant and size styles
          variantStyles[variant],
          sizeStyles[size],
          // Full width style
          fullWidth && "w-full",
          // Custom classes
          className
        )}
        onClick={handleClick}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        <span className={cn(
          "relative z-10 inline-flex items-center gap-2",
          isLoading && "opacity-0"
        )}>
          {children}
        </span>
        
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </span>
        )}

        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
          {buttonRipples.map((ripple) => (
            <span
              className="absolute animate-ripple rounded-full"
              key={ripple.key}
              style={{
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                top: `${ripple.y}px`,
                left: `${ripple.x}px`,
                backgroundColor: rippleColor,
                opacity: rippleOpacity,
                transform: 'scale(0)',
              }}
            />
          ))}
        </span>
      </button>
    );
  },
);

RippleButton.displayName = "RippleButton";

export default RippleButton;