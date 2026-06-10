import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticalSummary = ({ statistics }) => {
  const {
    averageDailyProgress,
    projectedCompletion,
    totalReadingDays,
    upcomingMilestone
  } = statistics;

  const stats = [
    {
      icon: 'Calendar',
      label: 'Total Reading Days',
      value: totalReadingDays,
      description: 'Days with completed readings',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: 'TrendingUp',
      label: 'Daily Average',
      value: `${averageDailyProgress} chapters`,
      description: 'Average chapters per day',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: 'CalendarCheck',
      label: 'Projected Completion',
      value: projectedCompletion,
      description: 'Estimated finish date',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: 'Star',
      label: 'Next Milestone',
      value: upcomingMilestone?.name,
      description: `${upcomingMilestone?.remaining} chapters away`,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Statistical Summary
        </h2>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="var(--color-accent)" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className="bg-background rounded-lg p-4 md:p-5 lg:p-6 border border-border transition-gentle hover:shadow-md"
          >
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  {stat?.label}
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-1 break-words">
                  {stat?.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {stat?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 md:mt-8 p-4 md:p-5 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-3">
          <Icon name="TrendingUp" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base font-medium text-foreground mb-1">
              Excellent Consistency
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Your reading pace is steady. At this rate, you'll complete your plan by {projectedCompletion}. Keep maintaining this rhythm!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalSummary;