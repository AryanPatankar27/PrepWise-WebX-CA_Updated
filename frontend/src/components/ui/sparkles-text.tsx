import React, { CSSProperties, useCallback, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  size: number;
  rotation: number;
}

const SparkleIcon = ({ color, size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" {...props}>
    <path
      d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
      fill={color}
    />
  </svg>
);

const Sparkle = ({ color, size, x, y, rotation, delay }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ top: y, left: x }}
    initial={{ scale: 0, rotate: rotation }}
    animate={{ scale: [0, 1, 0], rotate: [rotation, rotation + 180] }}
    transition={{
      duration: 1,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <SparkleIcon color={color} size={size} />
  </motion.div>
);

const SparklesText = ({ children }) => {
  const [sparkles, setSparkles] = useState([]);
  const colors = ["#FFD700", "#FFA500", "#FF69B4"];
  
  const generateSparkle = useCallback(() => ({
    id: crypto.randomUUID(),
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 10,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5
  }), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(sparkles => {
        const newSparkle = generateSparkle();
        return [...sparkles.slice(1), newSparkle];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [generateSparkle]);

  useEffect(() => {
    const initialSparkles = Array.from({ length: 20 }, generateSparkle);
    setSparkles(initialSparkles);
  }, [generateSparkle]);

  return (
    <div className="relative inline-block">
      {sparkles.map(sparkle => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
      <strong className="relative z-10 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600">
        {children}
      </strong>
    </div>
  );
};

export default SparklesText;