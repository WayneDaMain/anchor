import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Scope', icon: 'BookOpen' },
    { number: 2, label: 'Duration', icon: 'Calendar' },
    { number: 3, label: 'Style', icon: 'ArrowRight' },
    { number: 4, label: 'Review', icon: 'CheckCircle' }
  ];

  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-gentle ${
                  step?.number < currentStep
                    ? 'bg-accent text-accent-foreground'
                    : step?.number === currentStep
                    ? 'bg-accent text-accent-foreground ring-4 ring-accent/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step?.number < currentStep ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step?.icon} size={20} />
                )}
              </div>
              <span
                className={`caption mt-2 hidden sm:block ${
                  step?.number <= currentStep
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {step?.label}
              </span>
            </div>
            {index < steps?.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 md:mx-4">
                <div
                  className={`h-full transition-gentle ${
                    step?.number < currentStep ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mt-4 sm:hidden">
        <span className="caption text-muted-foreground">
          Step {currentStep} of {totalSteps}: {steps?.[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;