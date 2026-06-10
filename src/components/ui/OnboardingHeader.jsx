import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const OnboardingHeader = ({ currentStep = 1, totalSteps = 4 }) => {
  const location = useLocation();

  const isRegisterPage = location?.pathname === '/register';
  const isPlanWizard = location?.pathname === '/plan-creation-wizard';
  const isGroupWizard = location?.pathname === '/group-creation-wizard';

  const getStepInfo = () => {
    if (isRegisterPage) {
      return { current: 1, total: 2, label: 'Create Account' };
    }
    if (isPlanWizard) {
      return { current: currentStep, total: totalSteps, label: 'Setup Reading Plan' };
    }
    if (isGroupWizard) {
      return { current: currentStep, total: totalSteps, label: 'Setup Group Plan' };
    }
    return null;
  };

  const stepInfo = getStepInfo();

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-navigation max-w-4xl mx-auto bg-card/90 backdrop-blur-md border border-border/80 rounded-full shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/landing-page" className="flex items-center space-x-2.5">
              <div className="text-primary flex items-center justify-center">
                <Icon name="Anchor" size={24} color="var(--color-primary)" />
              </div>
              <span className="text-lg font-heading font-extrabold text-foreground tracking-tight">Anchor</span>
            </Link>

            {stepInfo && (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="caption text-muted-foreground text-xs font-semibold">
                    Step {stepInfo?.current} of {stepInfo?.total}
                  </span>
                  <span className="text-xs font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded-full uppercase tracking-wider">{stepInfo?.label}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: stepInfo.total }).map((_, index) => {
                    const stepNum = index + 1;
                    return (
                      <div
                        key={stepNum}
                        className={`h-2 rounded-full transition-gentle ${
                          stepNum <= stepInfo?.current
                            ? 'w-8 bg-accent' : 'w-2 bg-muted'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <Link
              to="/landing-page"
              className="p-1.5 rounded-full hover:bg-muted/40 transition-gentle text-muted-foreground hover:text-foreground"
              aria-label="Exit onboarding"
            >
              <Icon name="X" size={16} />
            </Link>
          </div>
        </div>
      </header>
      <div className="h-24" />
    </>
  );
};

export default OnboardingHeader;