import React from 'react';
import Icon from '../../../components/AppIcon';

const PlanPreview = ({ planData }) => {
  const calculateEstimates = () => {
    const scopeChapters = {
      'entire': 1189,
      'old-testament': 929,
      'new-testament': 260,
      'custom': planData?.selectedBooks?.length * 20 || 0
    };

    const totalChapters = scopeChapters?.[planData?.selectedScope] || 0;
    const totalDays = planData?.selectedDuration === 'custom'
      ? parseInt(planData?.customDays) || 0
      : {
        '3-months': 90,
        '6-months': 180,
        '1-year': 365,
        '2-years': 730
      }?.[planData?.selectedDuration] || 0;

    const chaptersPerDay = totalDays > 0 ? Math.ceil(totalChapters / totalDays) : 0;
    const estimatedMinutes = chaptersPerDay * 4;

    return {
      totalChapters,
      totalDays,
      chaptersPerDay,
      estimatedMinutes
    };
  };

  const estimates = calculateEstimates();

  const getScopeLabel = () => {
    const labels = {
      'entire': 'Entire Bible',
      'old-testament': 'Old Testament',
      'new-testament': 'New Testament',
      'custom': `${planData?.selectedBooks?.length || 0} Selected Books`
    };
    return labels?.[planData?.selectedScope] || 'Not selected';
  };

  const getDurationLabel = () => {
    if (planData?.selectedDuration === 'custom') {
      return `${planData?.customDays} days`;
    }
    const labels = {
      '3-months': '3 Months (90 days)',
      '6-months': '6 Months (180 days)',
      '1-year': '1 Year (365 days)',
      '2-years': '2 Years (730 days)'
    };
    return labels?.[planData?.selectedDuration] || 'Not selected';
  };

  const getStyleLabel = () => {
    const labels = {
      'sequential': 'Sequential Reading',
      'balanced': 'Balanced Reading'
    };
    return labels?.[planData?.selectedStyle] || 'Not selected';
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
          Review Your Reading Plan
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Confirm your selections before creating your personalized reading plan
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="BookOpen" size={20} className="text-accent" />
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                Reading Scope
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground pl-7">
              {getScopeLabel()}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={20} className="text-accent" />
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                Duration
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground pl-7">
              {getDurationLabel()}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="ArrowRight" size={20} className="text-accent" />
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                Reading Style
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground pl-7">
              {getStyleLabel()}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-accent/5 border-2 border-accent rounded-lg p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Estimated Reading Load
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="BookMarked" size={20} className="text-accent" />
              <span className="caption text-muted-foreground">Total Chapters</span>
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {estimates?.totalChapters}
            </p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CalendarDays" size={20} className="text-accent" />
              <span className="caption text-muted-foreground">Total Days</span>
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {estimates?.totalDays}
            </p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="FileText" size={20} className="text-accent" />
              <span className="caption text-muted-foreground">Daily Chapters</span>
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {estimates?.chaptersPerDay}
            </p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={20} className="text-accent" />
              <span className="caption text-muted-foreground">Daily Time</span>
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              ~{estimates?.estimatedMinutes}m
            </p>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base text-foreground mb-2">
              <strong>What happens next?</strong>
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              Your personalized reading plan will be generated with daily chapter assignments. You can start immediately and track your progress as you complete each day's reading. Remember, you can always pause and resume anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPreview;