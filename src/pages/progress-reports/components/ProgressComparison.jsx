import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProgressComparison = ({ comparisonData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const currentPeriod = comparisonData?.[selectedPeriod];

  const metrics = [
    {
      label: 'Chapters Read',
      current: currentPeriod?.chaptersRead,
      previous: currentPeriod?.previousChaptersRead,
      icon: 'BookOpen',
      color: 'text-accent'
    },
    {
      label: 'Reading Days',
      current: currentPeriod?.readingDays,
      previous: currentPeriod?.previousReadingDays,
      icon: 'Calendar',
      color: 'text-primary'
    },
    {
      label: 'Consistency Rate',
      current: `${currentPeriod?.consistencyRate}%`,
      previous: `${currentPeriod?.previousConsistencyRate}%`,
      icon: 'TrendingUp',
      color: 'text-success'
    }
  ];

  const calculateChange = (current, previous) => {
    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
    const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;
    
    if (previousNum === 0) return 0;
    return Math.round(((currentNum - previousNum) / previousNum) * 100);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Progress Comparison
        </h2>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart2" size={20} color="var(--color-success)" />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-6 md:mb-8 overflow-x-auto pb-2">
        {periods?.map((period) => (
          <button
            key={period?.id}
            onClick={() => setSelectedPeriod(period?.id)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-gentle flex-shrink-0 ${
              selectedPeriod === period?.id
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {period?.label}
          </button>
        ))}
      </div>
      <div className="space-y-4 md:space-y-6">
        {metrics?.map((metric, index) => {
          const change = calculateChange(metric?.current, metric?.previous);
          const isPositive = change > 0;
          const isNeutral = change === 0;

          return (
            <div
              key={index}
              className="bg-background rounded-lg p-4 md:p-5 border border-border"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 ${metric?.color} bg-current/10 rounded-lg flex items-center justify-center`}>
                    <Icon name={metric?.icon} size={16} className={metric?.color} />
                  </div>
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {metric?.label}
                  </span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                  isNeutral
                    ? 'bg-muted text-muted-foreground'
                    : isPositive
                    ? 'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                }`}>
                  <Icon
                    name={isNeutral ? 'Minus' : isPositive ? 'TrendingUp' : 'TrendingDown'}
                    size={14}
                  />
                  <span className="text-xs md:text-sm font-semibold">
                    {isNeutral ? '0' : Math.abs(change)}%
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Current Period</p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                    {metric?.current}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Previous Period</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-semibold text-muted-foreground">
                    {metric?.previous}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 md:mt-8 p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-2 md:space-x-3">
          <Icon name="TrendingUp" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base font-medium text-foreground mb-1">
              Personal Growth Focus
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Track your improvement over time. Celebrate progress, not perfection. Every step forward counts!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressComparison;