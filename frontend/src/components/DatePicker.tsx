import React, { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface DatePickerProps {
  selected?: Date
  onSelect: (date: Date) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({ selected, onSelect }) => {
  const [currentDate, setCurrentDate] = useState(selected || new Date())
  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (date: Date) => {
    onSelect(date)
    setIsOpen(false)
  }

  const handleMonthChange = (increment: number) => {
    setCurrentDate(prevDate => increment > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1))
  }

  const handleYearChange = (year: number) => {
    setCurrentDate(prevDate => new Date(year, prevDate.getMonth(), 1))
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={cn(
          "w-[280px] justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground transition-colors",
          "focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:outline-none",
          !selected && "text-muted-foreground"
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {selected ? format(selected, 'PPP') : <span>Select a date</span>}
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-[320px] rounded-lg border bg-card p-4 shadow-lg transition-opacity animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-accent hover:text-accent-foreground rounded-full"
              onClick={() => handleMonthChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="bg-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
              >
                {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="text-sm font-medium">{format(currentDate, 'MMMM')}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-accent hover:text-accent-foreground rounded-full"
              onClick={() => handleMonthChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, dayIdx) => {
              const isSelected = selected && isSameDay(day, selected)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isDayToday = isToday(day)

              return (
                <Button
                  key={day.toString()}
                  onClick={() => handleDateSelect(day)}
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 p-0 font-normal text-sm transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:outline-none",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isDayToday && !isSelected && "border border-primary text-primary",
                    "rounded-full"
                  )}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker;