import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ParticipationCalendar = ({ completedDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the name of the month
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  // Get first day of the month and total days in the month
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Get total days in previous month (for padding)
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];

  // Pad previous month's days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      dayNum: prevMonthTotalDays - i,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  // Current month's days
  for (let i = 1; i <= totalDays; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      dayNum: i,
      isCurrentMonth: true,
      dateStr: dStr
    });
  }

  // Pad next month's days to form full rows of 7
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      dayNum: i,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-card rounded-2xl border border-border p-4 md:p-5 shadow-sm max-w-sm mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">
            Participation Calendar
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Days you completed your reading assignments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <span className="text-sm font-semibold text-foreground px-2">
            {monthName} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
 
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <span key={day} className="text-xs font-bold text-muted-foreground uppercase">
            {day}
          </span>
        ))}
      </div>
 
      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day.isCurrentMonth) {
            return (
              <div 
                key={`pad-${index}`} 
                className="aspect-square flex items-center justify-center text-xs text-muted-foreground/30 font-medium"
              >
                {day.dayNum}
              </div>
            );
          }
 
          const isCompleted = completedDates.includes(day.dateStr);
          const isToday = day.dateStr === todayStr;
          const isPast = day.dateStr < todayStr;
 
          let bgClass = 'bg-transparent text-foreground hover:bg-muted/50';
          if (isCompleted) {
            bgClass = 'bg-accent text-accent-foreground font-bold shadow-sm';
          } else if (isPast) {
            // Passed days without completion show as grey
            bgClass = 'bg-muted text-muted-foreground/50 border border-transparent';
          } else if (isToday) {
            bgClass = 'border border-accent text-accent font-semibold';
          }
 
          return (
            <div 
              key={day.dateStr}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all select-none relative ${bgClass}`}
            >
              <span>{day.dayNum}</span>
              {isCompleted && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-foreground/60" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-border/80 flex flex-wrap items-center gap-4 text-xs text-muted-foreground justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-accent" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-muted border border-border" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border border-accent" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default ParticipationCalendar;
