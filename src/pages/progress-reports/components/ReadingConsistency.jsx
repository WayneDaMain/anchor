import React, { useState } from 'react';


const ReadingConsistency = ({ consistencyData }) => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const { months } = consistencyData;

  const currentMonth = months?.[selectedMonth];
  const daysInMonth = currentMonth?.days?.length;
  const daysRead = currentMonth?.days?.filter(day => day?.read)?.length;
  const consistencyRate = Math.round((daysRead / daysInMonth) * 100);

  const getIntensityClass = (read) => {
    if (!read) return 'bg-muted';
    return 'bg-accent';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Reading Consistency
        </h2>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {months?.map((month, index) => (
            <button
              key={index}
              onClick={() => setSelectedMonth(index)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-gentle flex-shrink-0 ${
                selectedMonth === index
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {month?.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-background rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Consistency Rate</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent">
              {consistencyRate}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Days Read</p>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
              {daysRead} / {daysInMonth}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2 md:space-y-3">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {weekDays?.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {currentMonth?.days?.map((day, index) => (
            <div
              key={index}
              className={`aspect-square rounded-md md:rounded-lg ${getIntensityClass(day?.read)} 
                transition-gentle hover:scale-110 cursor-pointer relative group`}
              title={`${day?.date}: ${day?.read ? 'Read' : 'Not read'}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs md:text-sm font-medium ${
                  day?.read ? 'text-accent-foreground' : 'text-muted-foreground'
                }`}>
                  {day?.day}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 md:mt-6 flex items-center justify-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-accent rounded" />
          <span className="text-xs md:text-sm text-muted-foreground">Read</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-muted rounded" />
          <span className="text-xs md:text-sm text-muted-foreground">Not Read</span>
        </div>
      </div>
    </div>
  );
};

export default ReadingConsistency;