import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const DurationSelection = ({ selectedDuration, onDurationChange, customDays, onCustomDaysChange }) => {
  const durationOptions = [
    {
      id: '3-months',
      title: '3 Months',
      description: 'Complete your reading in 90 days',
      days: 90,
      icon: 'Calendar',
      pace: 'Fast'
    },
    {
      id: '6-months',
      title: '6 Months',
      description: 'Steady progress over 180 days',
      days: 180,
      icon: 'CalendarDays',
      pace: 'Moderate'
    },
    {
      id: '1-year',
      title: '1 Year',
      description: 'Complete reading in 365 days',
      days: 365,
      icon: 'CalendarRange',
      pace: 'Comfortable'
    },
    {
      id: '2-years',
      title: '2 Years',
      description: 'Extended reading over 730 days',
      days: 730,
      icon: 'CalendarClock',
      pace: 'Relaxed'
    },
    {
      id: 'custom',
      title: 'Custom Duration',
      description: 'Set your own timeline',
      days: null,
      icon: 'Settings2',
      pace: 'Flexible'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
          Set Your Reading Duration
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Choose how long you'd like to take to complete your reading plan
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {durationOptions?.map((option) => (
          <button
            key={option?.id}
            onClick={() => onDurationChange(option?.id)}
            className={`p-6 md:p-8 rounded-lg border-2 transition-gentle text-left ${
              selectedDuration === option?.id
                ? 'border-accent bg-accent/5' :'border-border bg-card hover:border-accent/50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedDuration === option?.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon name={option?.icon} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
                  {option?.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-2">
                  {option?.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Icon name="Gauge" size={16} className="text-accent" />
                  <span className="caption text-accent font-medium">
                    {option?.pace} pace
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selectedDuration === 'custom' && (
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          <div className="max-w-md">
            <Input
              label="Number of Days"
              type="number"
              placeholder="Enter number of days"
              description="Minimum 30 days recommended for meaningful progress"
              value={customDays}
              onChange={(e) => onCustomDaysChange(e?.target?.value)}
              min="30"
              max="3650"
              required
            />
          </div>
        </div>
      )}
      <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base text-foreground">
              <strong>Note:</strong> Your daily reading load will be calculated based on your selected scope and duration. You can always adjust your pace later if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurationSelection;