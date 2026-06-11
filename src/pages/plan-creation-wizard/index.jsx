import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import AnimatedButton from '../../components/animations/AnimatedButton';
import OnboardingHeader from '../../components/ui/OnboardingHeader';
import { useAuth } from '../../contexts/AuthContext';

import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import ScopeSelection from './components/ScopeSelection';
import DurationSelection from './components/DurationSelection';
import StyleSelection from './components/StyleSelection';
import PlanPreview from './components/PlanPreview';

const PlanCreationWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, updateActivePlan } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const overwriteConfirmed = location.state?.overwriteConfirmed;
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(!!currentUser?.activePlan && !overwriteConfirmed);

  const [planData, setPlanData] = useState({
    selectedScope: '',
    selectedBooks: [],
    selectedDuration: '',
    customDays: '',
    selectedStyle: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  if (showOverwriteWarning) {
    return (
      <PageTransition className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl relative text-center">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-foreground mb-3 tracking-tight">
            Active Reading Plan Found
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
            You currently have an active plan: <strong>{currentUser?.activePlan?.name}</strong>. 
            Starting a new plan will replace it and reset all progress statistics.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/daily-reading-dashboard')}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold border border-border hover:bg-muted/50 transition-all text-foreground"
            >
              Keep Existing & Go Back
            </button>
            <button
              onClick={() => setShowOverwriteWarning(false)}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-destructive hover:bg-destructive/90 text-white shadow-sm transition-all"
            >
              Replace with New Plan
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleScopeChange = (scope) => {
    setPlanData({ ...planData, selectedScope: scope });
    setValidationError('');
  };

  const handleBookToggle = (book, checked) => {
    const updatedBooks = checked
      ? [...planData?.selectedBooks, book]
      : planData?.selectedBooks?.filter(b => b !== book);
    setPlanData({ ...planData, selectedBooks: updatedBooks });
    setValidationError('');
  };

  const handleDurationChange = (duration) => {
    setPlanData({ ...planData, selectedDuration: duration });
    setValidationError('');
  };

  const handleCustomDaysChange = (days) => {
    setPlanData({ ...planData, customDays: days });
    setValidationError('');
  };

  const handleStyleChange = (style) => {
    setPlanData({ ...planData, selectedStyle: style });
    setValidationError('');
  };



  const validateStep = () => {
    setValidationError('');

    if (currentStep === 1) {
      if (!planData?.selectedScope) {
        setValidationError('Please select a reading scope to continue');
        return false;
      }
      if (planData?.selectedScope === 'custom' && planData?.selectedBooks?.length === 0) {
        setValidationError('Please select at least one book for your custom plan');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!planData?.selectedDuration) {
        setValidationError('Please select a duration to continue');
        return false;
      }
      if (planData?.selectedDuration === 'custom') {
        const days = parseInt(planData?.customDays);
        if (!days || days < 30) {
          setValidationError('Please enter at least 30 days for your custom duration');
          return false;
        }
        if (days > 3650) {
          setValidationError('Custom duration cannot exceed 3650 days (10 years)');
          return false;
        }
      }
    }

    if (currentStep === 3) {
      if (!planData?.selectedStyle) {
        setValidationError('Please select a reading style to continue');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationError('');
    }
  };

  const handleCreatePlan = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      setValidationError('');
      try {
        const durationDays = planData.selectedDuration === 'custom' 
          ? parseInt(planData.customDays) 
          : {
              '3-months': 90,
              '6-months': 180,
              '1-year': 365,
              '2-years': 730
            }[planData.selectedDuration] || 365;
        
        const newPlan = {
          name: planData.selectedScope === 'entire' ? 'Entire Bible Reading Plan' : (planData.selectedScope === 'old-testament' ? 'Old Testament Plan' : (planData.selectedScope === 'new-testament' ? 'New Testament Plan' : 'Custom Reading Plan')),
          scope: planData.selectedScope === 'entire' ? 'Entire Bible' : (planData.selectedScope === 'old-testament' ? 'Old Testament' : (planData.selectedScope === 'new-testament' ? 'New Testament' : 'Custom')),
          selectedBooks: planData.selectedBooks,
          readingStyle: planData.selectedStyle === 'canonical' ? 'Canonical' : (planData.selectedStyle === 'chronological' ? 'Chronological' : 'Historical'),
          translation: 'NIV',
          startDate: new Date().toISOString(),
          totalDays: durationDays,
          progressStats: {
            daysCompleted: 0,
            chaptersCompleted: 0,
            booksCompleted: 0,
            currentStreak: 0
          }
        };

        await updateActivePlan(newPlan);

        // Trigger plan started email notification
        try {
          fetch('https://anchor-email-worker.emaxstone12.workers.dev/plan-started', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: currentUser.email,
              name: currentUser.displayName || currentUser.fullName || 'there',
              planName: newPlan.name
            })
          });
        } catch (emailErr) {
          console.warn('Failed to send plan started email:', emailErr.message);
        }

        // 800ms artificial delay for a premium transition effect
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate('/daily-reading-dashboard');
      } catch (err) {
        setValidationError('Failed to save reading plan. Please try again.');
        console.error(err);
        setIsSubmitting(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScopeSelection
            selectedScope={planData?.selectedScope}
            onScopeChange={handleScopeChange}
            selectedBooks={planData?.selectedBooks}
            onBookToggle={handleBookToggle}
          />
        );
      case 2:
        return (
          <DurationSelection
            selectedDuration={planData?.selectedDuration}
            onDurationChange={handleDurationChange}
            customDays={planData?.customDays}
            onCustomDaysChange={handleCustomDaysChange}
          />
        );
      case 3:
        return (
          <StyleSelection
            selectedStyle={planData?.selectedStyle}
            onStyleChange={handleStyleChange}
          />
        );
      case 4:
        return <PlanPreview planData={planData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <OnboardingHeader currentStep={currentStep} totalSteps={4} />
      <PageTransition className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <FadeIn delay={0.1}>
            <ProgressIndicator currentStep={currentStep} totalSteps={4} />
          </FadeIn>

          {validationError && (
            <FadeIn delay={0.2}>
              <div className="mb-6 bg-destructive/10 border border-destructive rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-destructive">{validationError}</p>
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.3}>
            <div className="mb-8 md:mb-12">
              {renderStepContent()}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className={`w-full sm:w-auto border border-border bg-background text-foreground px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  (currentStep === 1 || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-card active:scale-[0.98]'
                }`}
              >
                <Icon name="ChevronLeft" size={20} />
                Back
              </button>

              <div className="flex items-center space-x-2">
                <span className="caption text-muted-foreground hidden md:block">
                  Step {currentStep} of 4
                </span>
              </div>

              {currentStep < 4 ? (
                <AnimatedButton
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                  <Icon name="ChevronRight" size={20} />
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onClick={handleCreatePlan}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Create Plan
                      <Icon name="Check" size={20} />
                    </>
                  )}
                </AnimatedButton>
              )}
            </div>
          </FadeIn>
        </div>
      </PageTransition>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center max-w-sm text-center px-4">
            <div className="relative mb-6">
              {/* Outer glowing ring */}
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse animate-duration-1000" />
              {/* Spinner */}
              <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2 animate-pulse">
              Generating Your Reading Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              We're tailoring your daily reading assignments. This will only take a moment...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanCreationWizard;