import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ progressData }) => {
  const { completionPercentage, totalChapters, chaptersRead, currentStreak, longestStreak } = progressData;

  const stats = [
    {
      icon: 'BookOpen',
      label: 'Chapters Read',
      value: chaptersRead,
      total: totalChapters,
      color: 'text-accent'
    },
    {
      icon: 'Flame',
      label: 'Current Streak',
      value: `${currentStreak} days`,
      color: 'text-accent'
    },
    {
      icon: 'Trophy',
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      color: 'text-accent'
    },
    {
      icon: 'Target',
      label: 'Completion',
      value: `${completionPercentage}%`,
      color: 'text-accent'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Detailed Metrics
        </h2>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className="bg-background rounded-lg p-3 md:p-4 border border-border transition-gentle hover:shadow-md"
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2 md:mb-3 ${stat?.color} bg-current/10`}>
              <Icon name={stat?.icon} size={16} className={stat?.color} />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat?.label}</p>
            <p className="text-base md:text-lg lg:text-xl font-semibold text-foreground whitespace-nowrap">
              {stat?.value}
              {stat?.total && (
                <span className="text-xs md:text-sm text-muted-foreground ml-1">
                  / {stat?.total}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;