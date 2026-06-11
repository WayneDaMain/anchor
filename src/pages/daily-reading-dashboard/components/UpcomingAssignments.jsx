import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingAssignments = ({ upcomingDays, onViewTimeline }) => {
  const getCalendarDate = (dateObj) => {
    try {
      const date = new Date(dateObj);
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = date.toLocaleDateString('en-US', { day: 'numeric' });
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
      return { month, day, weekday };
    } catch {
      return { month: '---', day: '--', weekday: '' };
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Upcoming Readings
        </h2>
        <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
        </div>
      </div>

      <div className="space-y-3">
        {upcomingDays?.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border rounded-xl">
            <p className="text-xs text-muted-foreground">No upcoming assignments</p>
          </div>
        ) : (
          upcomingDays?.map((day) => {
            const dateInfo = getCalendarDate(day?.date);
            return (
              <div
                key={day?.id}
                className="group border border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-250 rounded-xl p-3 md:p-4 flex items-start gap-3 md:gap-4 hover:translate-x-1"
              >
                {/* Calendar Date Badge */}
                <div className="w-12 h-[52px] bg-card border border-border rounded-xl flex flex-col items-center justify-between overflow-hidden flex-shrink-0 shadow-sm">
                  <div className="bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-wider w-full text-center py-0.5 border-b border-border/80">
                    {dateInfo.month}
                  </div>
                  <div className="text-base font-bold text-foreground leading-none pb-1.5 pt-1">
                    {dateInfo.day}
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {dateInfo.weekday}
                    </p>
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent whitespace-nowrap">
                      {day?.totalChapters} chapters
                    </span>
                  </div>
                  <div className="space-y-1">
                    {day?.assignments?.map((assignment, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground font-medium truncate">
                        {assignment?.book} {assignment?.chapterRange}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/80 space-y-3">
        <button
          onClick={onViewTimeline}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-border bg-transparent text-muted-foreground hover:text-accent hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center justify-center gap-2"
        >
          <Icon name="Scroll" size={14} />
          <span>View Full Timeline</span>
        </button>
        <p className="text-[10px] md:text-xs text-center text-muted-foreground">
          Plan your reading ahead and stay on track
        </p>
      </div>
    </div>
  );
};

export default UpcomingAssignments;
