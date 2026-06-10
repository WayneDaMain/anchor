import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TodayAssignment = ({
  currentDate,
  assignments,
  onChapterToggle,
  onMarkComplete,
  completedChapters,
  isAllCompleted,
  hasCompletedToday,
  lastCompletedDayData
}) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })?.format(date);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-heading font-bold text-foreground mb-0.5">
            Today's Reading
          </h2>
          <p className="text-sm text-muted-foreground">{formatDate(currentDate)}</p>
        </div>
      </div>

      {hasCompletedToday ? (
        <div className="bg-accent/5 rounded-xl p-6 border border-accent/15 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle2" size={24} className="text-accent" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1.5">All Caught Up!</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
            You've completed your daily reading assignment for today. Excellent job staying consistent!
          </p>
          {lastCompletedDayData && (
            <div className="bg-background/50 border border-border/80 rounded-lg p-3 max-w-md mx-auto mb-4 text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Today's Completed Reading</span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                {lastCompletedDayData.assignmentsText || 'Rest & Reflection'}
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your next assignment will unlock tomorrow.
          </p>
        </div>
      ) : (
        <>
          {/* Assignments */}
          {assignments?.length === 0 ? (
            <div className="bg-accent/5 rounded-xl p-5 border border-accent/15 text-center mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Coffee" size={20} className="text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Rest & Reflection Day</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                No chapters are assigned for today. Use this time to catch up on missed readings, reflect, or pray!
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {assignments?.map((assignment) => (
                <div key={assignment?.id} className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{assignment?.book}</h3>
                        <p className="text-xs text-muted-foreground">
                          {assignment?.chapters?.length} {assignment?.chapters?.length === 1 ? 'chapter' : 'chapters'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-full">
                      {assignment?.chapters?.filter(ch => completedChapters?.includes(ch?.id))?.length}/{assignment?.chapters?.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {assignment?.chapters?.map((chapter) => (
                      <div
                        key={chapter?.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-gentle ${completedChapters?.includes(chapter?.id)
                          ? 'bg-accent/5 border border-accent/15'
                          : 'bg-background border border-transparent hover:border-border'
                          }`}
                      >
                        <Checkbox
                          checked={completedChapters?.includes(chapter?.id)}
                          onChange={() => onChapterToggle(chapter?.id)}
                          size="default"
                        />
                        <span className={`text-sm flex-1 ${completedChapters?.includes(chapter?.id)
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                          }`}>
                          Chapter {chapter?.number}
                        </span>
                        {completedChapters?.includes(chapter?.id) && (
                          <Icon name="CheckCircle2" size={16} className="text-accent" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mark complete */}
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={onMarkComplete}
            className={isAllCompleted ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
          >
            <span className="flex items-center justify-center gap-2">
              <Icon name={isAllCompleted ? "CheckCircle2" : "Check"} size={16} />
              {isAllCompleted
                ? (assignments?.length === 0 ? "Complete Rest Day" : "Complete Day's Reading")
                : 'Mark All Complete'}
            </span>
          </Button>
          {!isAllCompleted && assignments?.length > 0 && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              Check off individual chapters or mark all at once
            </p>
          )}

          {/* Read Bible shortcut — only when today is not yet completed */}
          {!isAllCompleted && (
            <a
              href="https://web.biblescriptura.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-accent/30 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <Icon name="BookOpen" size={15} />
              <span>Read Bible Online</span>
              <Icon name="ExternalLink" size={12} className="opacity-60 ml-0.5" />
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default TodayAssignment;
