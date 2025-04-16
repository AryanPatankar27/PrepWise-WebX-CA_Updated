import { useId } from "react";
import { cn } from "../../lib/utils";

interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  patternClassName?: string;
  variant?: "default" | "grid" | "scattered" | "diagonal";
  color?: string;
  secondaryColor?: string;
  opacity?: number;
  animate?: boolean;
  [key: string]: unknown;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  patternClassName,
  variant = "default",
  color = "currentColor",
  secondaryColor,
  opacity = 0.8,
  animate = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const patternId = `pattern-${id}`;
  const gradientId = `gradient-${id}`;

  const getPatternTransform = () => {
    switch (variant) {
      case "diagonal":
        return "rotate(45)";
      case "scattered":
        return `translate(${width * 0.1}, ${height * 0.1})`;
      default:
        return "";
    }
  };

  const renderDots = () => {
    switch (variant) {
      case "grid":
        return (
          <>
            <circle cx={cx} cy={cy} r={cr} />
            <circle cx={width - cx} cy={cy} r={cr} />
            <circle cx={cx} cy={height - cy} r={cr} />
            <circle cx={width - cx} cy={height - cy} r={cr} />
          </>
        );
      case "scattered":
        return (
          <>
            <circle cx={cx} cy={cy} r={cr} />
            <circle cx={width * 0.7} cy={height * 0.3} r={cr * 0.8} />
            <circle cx={width * 0.3} cy={height * 0.7} r={cr * 0.8} />
          </>
        );
      default:
        return <circle cx={cx} cy={cy} r={cr} />;
    }
  };

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300",
        animate && "animate-pulse",
        className
      )}
      {...props}
    >
      <defs>
        {secondaryColor && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        )}
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
          patternTransform={getPatternTransform()}
          className={patternClassName}
        >
          {renderDots()}
        </pattern>
      </defs>
      <rect 
        width="100%" 
        height="100%" 
        strokeWidth={0} 
        fill={secondaryColor ? `url(#${gradientId})` : color}
        opacity={opacity}
      />
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
        className="mix-blend-soft-light"
      />
    </svg>
  );
}

export default DotPattern;