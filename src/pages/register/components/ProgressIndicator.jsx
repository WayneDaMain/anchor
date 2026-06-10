import React from 'react';

const ProgressIndicator = () => {
  const steps = [
    { number: 1, label: 'Create Account', active: true },
    { number: 2, label: 'Setup Reading Plan', active: false }
  ];

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-center space-x-4">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.number}>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium transition-gentle ${
                  step?.active
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step?.number}
              </div>
              <span
                className={`hidden sm:inline text-sm md:text-base font-medium transition-gentle ${
                  step?.active ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step?.label}
              </span>
            </div>
            {index < steps?.length - 1 && (
              <div className="w-12 md:w-16 h-0.5 bg-muted" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;