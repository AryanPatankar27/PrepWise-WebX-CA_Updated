
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
export default function Particles({
  className = "",
  quantity = 50,
  staticity = 50,
  ease = 50,
  refresh = false,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  useEffect(() => {
    if (!canvasRef.current) return;
    context.current = canvasRef.current.getContext("2d");
  }, []);
  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current)
      return;
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    const ctx = context.current;
    const setSize = () => {
      if (!container || !canvas || !ctx) return;
      canvasSize.current.w = container.offsetWidth;
      canvasSize.current.h = container.offsetHeight;
      canvas.width = canvasSize.current.w * dpr;
      canvas.height = canvasSize.current.h * dpr;
      canvas.style.width = `${canvasSize.current.w}px`;
      canvas.style.height = `${canvasSize.current.h}px`;
      ctx.scale(dpr, dpr);
    };
    setSize();
    const Circle = function (
      this: any,
      x: number,
      y: number,
      dx: number,
      dy: number,
      r: number
    ) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.r = r;
      this.draw = function () {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fill();
      };
      this.update = function () {
        if (this.x + this.r > canvasSize.current.w || this.x - this.r < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.r > canvasSize.current.h || this.y - this.r < 0) {
          this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
      };
    };
    const init = () => {
      circles.current = [];
      for (let i = 0; i < quantity; i++) {
        const r = Math.random() * 1 + 1;
        const x = Math.random() * (canvasSize.current.w - r * 2) + r;
        const y = Math.random() * (canvasSize.current.h - r * 2) + r;
        const dx = (Math.random() - 0.5) * ease * 0.01;
        const dy = (Math.random() - 0.5) * ease * 0.01;
        circles.current.push(new (Circle as any)(x, y, dx, dy, r));
      }
    };
    const animate = () => {
      if (!ctx) return;
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
      circles.current.forEach((circle) => {
        circle.update();
      });
    };
    init();
    animate();
    window.addEventListener("resize", setSize);
    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, [quantity, staticity, ease, refresh, dpr]);
  return (
    <div
      ref={canvasContainerRef}
      className={cn("fixed inset-0 -z-10", className)}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}