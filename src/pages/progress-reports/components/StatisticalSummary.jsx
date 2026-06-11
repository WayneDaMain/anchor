import React from 'react';

const StatisticalSummary = ({ statistics }) => {
  const {
    averageDailyProgress,
    projectedCompletion,
    totalReadingDays,
    upcomingMilestone
  } = statistics;

  const stats = [
    {
      label: 'Total Reading Days',
      value: totalReadingDays,
      description: 'Days with completed readings'
    },
    {
      label: 'Daily Average',
      value: `${averageDailyProgress} chapters`,
      description: 'Average chapters per day'
    },
    {
      label: 'Projected Completion',
      value: projectedCompletion,
      description: 'Estimated finish date'
    },
    {
      label: 'Next Milestone',
      value: upcomingMilestone?.name,
      description: `${upcomingMilestone?.remaining} chapters away`
    }
  ];

  return (
    <div className="bg-card rounded-[2rem] border border-border/80 p-5 md:p-6 shadow-sm">
      <div className="mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-heading font-extrabold text-foreground tracking-tight">
          Statistical Summary
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className="bg-background/40 rounded-xl p-4 border border-border/60 transition-gentle hover:shadow-sm"
          >
            <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              {stat?.label}
            </p>
            <p className="text-lg md:text-xl font-heading font-extrabold text-foreground leading-tight">
              {stat?.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat?.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 p-4 bg-accent/5 rounded-xl border border-accent/15">
        <p className="text-sm font-semibold text-foreground mb-0.5">
          Excellent Consistency
        </p>
        <p className="text-xs text-muted-foreground">
          Your reading pace is steady. At this rate, you'll complete your plan by {projectedCompletion}. Keep maintaining this rhythm!
        </p>
      </div>
    </div>
  );
};

export default StatisticalSummary;