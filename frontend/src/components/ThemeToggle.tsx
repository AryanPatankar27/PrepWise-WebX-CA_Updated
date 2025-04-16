import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from "../components/ui/button"
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground 
                focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:outline-none
                transition-colors duration-200"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative h-full w-full">
        <Sun 
          className="absolute inset-0 h-[1.2rem] w-[1.2rem] m-auto
                     transition-all duration-500 ease-in-out
                     dark:rotate-[-180deg] dark:scale-0 dark:opacity-0
                     rotate-0 scale-100 opacity-100" 
          strokeWidth={1.5}
        />
        <Moon 
          className="absolute inset-0 h-[1.2rem] w-[1.2rem] m-auto
                     transition-all duration-500 ease-in-out
                     rotate-180 scale-0 opacity-0
                     dark:rotate-0 dark:scale-100 dark:opacity-100" 
          strokeWidth={1.5}
        />
      </div>
      <span className="sr-only">
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </span>
    </Button>
  )
}

export default ThemeToggle;