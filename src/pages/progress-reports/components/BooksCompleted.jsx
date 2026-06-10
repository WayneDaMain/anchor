import React from 'react';
import Icon from '../../../components/AppIcon';

const BooksCompleted = ({ booksData }) => {
  const { oldTestament, newTestament, totalBooks } = booksData;

  const categories = [
    {
      name: 'Old Testament',
      completed: oldTestament?.completed,
      total: oldTestament?.total,
      color: 'bg-primary',
      icon: 'BookMarked'
    },
    {
      name: 'New Testament',
      completed: newTestament?.completed,
      total: newTestament?.total,
      color: 'bg-secondary',
      icon: 'Book'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Books Completed
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent">
            {totalBooks?.completed}
          </span>
          <span className="text-sm md:text-base text-muted-foreground">
            / {totalBooks?.total}
          </span>
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        {categories?.map((category, index) => {
          const percentage = Math.round((category?.completed / category?.total) * 100);
          
          return (
            <div key={index} className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 ${category?.color} rounded-lg flex items-center justify-center`}>
                    <Icon name={category?.icon} size={16} color="var(--color-primary-foreground)" />
                  </div>
                  <span className="text-sm md:text-base lg:text-lg font-medium text-foreground">
                    {category?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
                    {category?.completed}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    / {category?.total}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 md:h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${category?.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">{percentage}% complete</span>
                <span className="text-muted-foreground">
                  {category?.total - category?.completed} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 md:mt-8 p-3 md:p-4 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2 md:space-x-3">
          <Icon name="Award" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base font-medium text-foreground mb-1">
              Great Progress!
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              You've completed {totalBooks?.completed} books. Keep up the consistent reading to reach your goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksCompleted;