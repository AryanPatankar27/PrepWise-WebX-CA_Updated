"use client";
import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
interface NeonColorsProps {
  firstColor: string;
  secondColor: string;
}
interface NeonGradientCardProps {
  as?: ReactElement;
  className?: string;
  children?: ReactNode;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: NeonColorsProps;
  glowIntensity?: number;
  animationSpeed?: number;
  contentClassName?: string;
  backgroundColor?: string;
  textColor?: string;
  [key: string]: any;
}
const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  className,
  children,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: "#ff00aa",
    secondColor: "#00FFF1",
  },
  glowIntensity = 0.8,
  animationSpeed = 3,
  contentClassName,
  backgroundColor = "#000000",
  textColor = "#FFFFFF",
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };
    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };
    updateDimensions();
    window.addEventListener("resize", debouncedUpdateDimensions);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedUpdateDimensions);
    };
  }, []);
  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);
  const dynamicStyles: CSSProperties = {
    "--border-size": `${borderSize}px`,
    "--border-radius": `${borderRadius}px`,
    "--neon-first-color": neonColors.firstColor,
    "--neon-second-color": neonColors.secondColor,
    "--card-width": `${dimensions.width}px`,
    "--card-height": `${dimensions.height}px`,
    "--card-content-radius": `${borderRadius - borderSize}px`,
    "--pseudo-element-width": `${dimensions.width + borderSize * 2}px`,
    "--pseudo-element-height": `${dimensions.height + borderSize * 2}px`,
    "--after-blur": `${dimensions.width / 3}px`,
    "--glow-intensity": glowIntensity,
    "--animation-speed": `${animationSpeed}s`,
    "--background-color": backgroundColor,
    "--text-color": textColor,
  } as CSSProperties;
  return (
    <div
      ref={containerRef}
      style={dynamicStyles}
      className={cn(
        "relative z-10 size-full rounded-[var(--border-radius)]",
        "transition-transform duration-300 ease-in-out hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative size-full min-h-[inherit] rounded-[var(--card-content-radius)]",
          "p-6",
          "before:absolute before:-left-[var(--border-size)] before:-top-[var(--border-size)]",
          "before:-z-10 before:block before:h-[var(--pseudo-element-height)]",
          "before:w-[var(--pseudo-element-width)] before:rounded-[var(--border-radius)]",
          "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]",
          "before:bg-[length:100%_200%] before:content-['']",
          "before:animate-[background-position-spin_var(--animation-speed)_linear_infinite]",
          "after:absolute after:-left-[var(--border-size)] after:-top-[var(--border-size)]",
          "after:-z-10 after:block after:h-[var(--pseudo-element-height)]",
          "after:w-[var(--pseudo-element-width)] after:rounded-[var(--border-radius)]",
          "after:blur-[var(--after-blur)] after:content-['']",
          "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))]",
          "after:bg-[length:100%_200%] after:opacity-[var(--glow-intensity)]",
          "after:animate-[background-position-spin_var(--animation-speed)_linear_infinite]",
          contentClassName
        )}
        style={{
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
export { NeonGradientCard };