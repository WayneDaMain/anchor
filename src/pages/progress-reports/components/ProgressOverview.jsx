import React from 'react';

const ProgressOverview = ({ progressData }) => {
  const { completionPercentage, totalChapters, chaptersRead, currentStreak, longestStreak } = progressData;

  const stats = [
    {
      label: 'Chapters Read',
      value: chaptersRead,
      total: totalChapters
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`
    },
    {
      label: 'Longest Streak',
      value: `${longestStreak} days`
    },
    {
      label: 'Completion',
      value: `${completionPercentage}%`
    }
  ];

  return (
    <div className="bg-card rounded-[2rem] border border-border/80 p-5 md:p-6 shadow-sm">
      <div className="mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-heading font-extrabold text-foreground tracking-tight">
          Detailed Metrics
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className="bg-background/40 rounded-xl p-3 md:p-4 border border-border/60 transition-gentle hover:shadow-sm"
          >
            <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              {stat?.label}
            </p>
            <p className="text-lg md:text-xl font-heading font-extrabold text-foreground leading-none">
              {stat?.value}
              {stat?.total && (
                <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1">
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