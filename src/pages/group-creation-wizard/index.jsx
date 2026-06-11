import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import AnimatedButton from '../../components/animations/AnimatedButton';
import OnboardingHeader from '../../components/ui/OnboardingHeader';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';

import ScopeSelection from '../plan-creation-wizard/components/ScopeSelection';
import DurationSelection from '../plan-creation-wizard/components/DurationSelection';
import StyleSelection from '../plan-creation-wizard/components/StyleSelection';

import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { compressImage } from '../../utils/imageHelpers';

const GroupCreationWizard = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [groupPhotoFile, setGroupPhotoFile] = useState(null);
  const [groupPhotoPreview, setGroupPhotoPreview] = useState(null);

  const handleGroupPhotoChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setValidationError('Group photo must be under 3 MB');
      return;
    }

    setGroupPhotoFile(file);
    setGroupPhotoPreview(URL.createObjectURL(file));
    setValidationError('');
  };

  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    selectedScope: '',
    selectedBooks: [],
    selectedDuration: '',
    customDays: '',
    selectedStyle: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Enforce single group membership check
  if (currentUser?.activeGroupId) {
    return (
      <PageTransition className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl relative text-center">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-foreground mb-3 tracking-tight">
            Already in a Group
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
            You are currently a member of another group. You must leave that group before you can create or join a new one.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/group-management')}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-accent hover:bg-accent/90 text-white shadow-sm transition-all"
            >
              Go to Group Management
            </button>
            <button
              onClick={() => navigate('/daily-reading-dashboard')}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold border border-border hover:bg-muted/50 transition-all text-foreground"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleFieldChange = (field, value) => {
    setGroupData(prev => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const handleBookToggle = (book, checked) => {
    const updatedBooks = checked
      ? [...groupData?.selectedBooks, book]
      : groupData?.selectedBooks?.filter(b => b !== book);
    setGroupData(prev => ({ ...prev, selectedBooks: updatedBooks }));
    setValidationError('');
  };

  const calculateEstimates = () => {
    const scopeChapters = {
      'entire': 1189,
      'old-testament': 929,
      'new-testament': 260,
      'custom': groupData?.selectedBooks?.length * 20 || 0
    };

    const totalChapters = scopeChapters?.[groupData?.selectedScope] || 0;
    const totalDays = groupData?.selectedDuration === 'custom'
      ? parseInt(groupData?.customDays) || 0
      : {
          '3-months': 90,
          '6-months': 180,
          '1-year': 365,
          '2-years': 730
        }?.[groupData?.selectedDuration] || 0;

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

  const validateStep = () => {
    setValidationError('');

    if (currentStep === 1) {
      if (!groupData.name.trim()) {
        setValidationError('Group name is required');
        return false;
      }
      if (!groupData.description.trim()) {
        setValidationError('Group description is required');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!groupData?.selectedScope) {
        setValidationError('Please select a reading scope to continue');
        return false;
      }
      if (groupData?.selectedScope === 'custom' && groupData?.selectedBooks?.length === 0) {
        setValidationError('Please select at least one book for the custom plan');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!groupData?.selectedDuration) {
        setValidationError('Please select a duration to continue');
        return false;
      }
      if (groupData?.selectedDuration === 'custom') {
        const days = parseInt(groupData?.customDays);
        if (!days || days < 30) {
          setValidationError('Please enter at least 30 days for custom duration');
          return false;
        }
      }
    }

    if (currentStep === 4) {
      if (!groupData?.selectedStyle) {
        setValidationError('Please select a reading style to continue');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 5) {
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

  const handleCreateGroup = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      setValidationError('');
      try {
        const durationDays = groupData.selectedDuration === 'custom'
          ? parseInt(groupData.customDays)
          : {
              '3-months': 90,
              '6-months': 180,
              '1-year': 365,
              '2-years': 730
            }[groupData.selectedDuration] || 365;

        const groupRef = doc(collection(db, 'groups'));
        const groupId = groupRef.id;
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        let photoURL = null;
        if (groupPhotoFile) {
          try {
            photoURL = await compressImage(groupPhotoFile, 400, 200, 0.7);
          } catch (uploadErr) {
            console.error('Failed to compress group photo:', uploadErr);
          }
        }

        const planName = groupData.selectedScope === 'entire'
          ? 'Entire Bible Plan'
          : groupData.selectedScope === 'old-testament'
          ? 'Old Testament Plan'
          : groupData.selectedScope === 'new-testament'
          ? 'New Testament Plan'
          : 'Custom Plan';

        const newGroupDoc = {
          id: groupId,
          name: groupData.name,
          description: groupData.description,
          isPrivate: groupData.isPrivate,
          inviteCode: inviteCode,
          photoURL: photoURL || null,
          creatorId: currentUser.uid,
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          planName: planName,
          duration: groupData.selectedDuration === 'custom' ? `${groupData.customDays} days` : groupData.selectedDuration.replace('-', ' '),
          totalDays: durationDays,
          completedChapters: 0,
          totalChapters: estimates.totalChapters,
          memberCount: 1,
          plan: {
            name: planName,
            scope: groupData.selectedScope === 'entire' ? 'Entire Bible' : (groupData.selectedScope === 'old-testament' ? 'Old Testament' : (groupData.selectedScope === 'new-testament' ? 'New Testament' : 'Custom')),
            selectedBooks: groupData.selectedBooks,
            readingStyle: groupData.selectedStyle === 'canonical' ? 'Canonical' : (groupData.selectedStyle === 'chronological' ? 'Chronological' : 'Historical'),
            startDate: new Date().toISOString(),
            totalDays: durationDays
          }
        };

        // Write Group
        await setDoc(groupRef, newGroupDoc);

        // Add creator as member
        const memberRef = doc(db, 'groups', groupId, 'members', currentUser.uid);
        await setDoc(memberRef, {
          uid: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || null,
          daysCompleted: 0,
          completedDates: [],
          joinedAt: new Date().toISOString()
        });

        // Set user's active group
        await updateUserProfile({ activeGroupId: groupId });

        // Trigger group joined email notification
        try {
          fetch('https://anchor-email-worker.emaxstone12.workers.dev/group-joined', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName || currentUser.email.split('@')[0],
              groupName: groupData.name
            })
          });
        } catch (emailErr) {
          console.warn('Failed to send group joined email:', emailErr.message);
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        navigate('/group-management');
      } catch (err) {
        setValidationError('Failed to create group. Please try again.');
        console.error(err);
        setIsSubmitting(false);
      }
    }
  };

  const getScopeLabel = () => {
    const labels = {
      'entire': 'Entire Bible',
      'old-testament': 'Old Testament',
      'new-testament': 'New Testament',
      'custom': `${groupData?.selectedBooks?.length || 0} Selected Books`
    };
    return labels?.[groupData?.selectedScope] || 'Not selected';
  };

  const getDurationLabel = () => {
    if (groupData?.selectedDuration === 'custom') {
      return `${groupData?.customDays} days`;
    }
    const labels = {
      '3-months': '3 Months (90 days)',
      '6-months': '6 Months (180 days)',
      '1-year': '1 Year (365 days)',
      '2-years': '2 Years (730 days)'
    };
    return labels?.[groupData?.selectedDuration] || 'Not selected';
  };

  const getStyleLabel = () => {
    const labels = {
      'canonical': 'Canonical Style',
      'chronological': 'Chronological Style',
      'historical': 'Historical Style'
    };
    return labels?.[groupData?.selectedStyle] || 'Not selected';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2">
                Setup Group Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your group name, description, and decide if it's public or private
              </p>
            </div>
            <div className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
              <Input
                label="Group Name"
                type="text"
                placeholder="e.g. Daily Bible Fellowship"
                value={groupData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-gentle resize-none"
                  rows="4"
                  placeholder="Describe your reading community's focus and goal..."
                  value={groupData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  required
                />
              </div>
              <div className="pt-2">
                <Checkbox
                  label="Private Group"
                  description="Only members with the invitation code will be able to join."
                  checked={groupData.isPrivate}
                  onChange={(e) => handleFieldChange('isPrivate', e.target.checked)}
                />
              </div>

              {/* Group Photo Section */}
              <div className="border-t border-border pt-4 mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Group Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    {groupPhotoPreview ? (
                      <img src={groupPhotoPreview} alt="Group Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Users" size={28} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGroupPhotoChange}
                      className="hidden"
                      id="group-photo-upload"
                    />
                    <label
                      htmlFor="group-photo-upload"
                      className="inline-flex items-center px-4 py-2 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-muted/50 cursor-pointer transition-gentle"
                    >
                      Choose Photo
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Square JPG or PNG, max 3 MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <ScopeSelection
            selectedScope={groupData?.selectedScope}
            onScopeChange={(scope) => handleFieldChange('selectedScope', scope)}
            selectedBooks={groupData?.selectedBooks}
            onBookToggle={handleBookToggle}
          />
        );
      case 3:
        return (
          <DurationSelection
            selectedDuration={groupData?.selectedDuration}
            onDurationChange={(dur) => handleFieldChange('selectedDuration', dur)}
            customDays={groupData?.customDays}
            onCustomDaysChange={(days) => handleFieldChange('customDays', days)}
          />
        );
      case 4:
        return (
          <StyleSelection
            selectedStyle={groupData?.selectedStyle}
            onStyleChange={(style) => handleFieldChange('selectedStyle', style)}
          />
        );
      case 5:
        return (
          <div className="space-y-6 md:space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2">
                Review Group Reading Plan
              </h2>
              <p className="text-sm text-muted-foreground">
                Confirm your group settings and reading plan configurations
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-border pb-4">
                <h4 className="text-xs uppercase tracking-wider text-accent font-bold mb-1">Group Details</h4>
                <p className="text-lg font-bold text-foreground">{groupData.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{groupData.description}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-3 rounded-full bg-accent/15 text-[10px] font-bold text-accent">
                  <Icon name={groupData.isPrivate ? "Lock" : "Unlock"} size={10} />
                  {groupData.isPrivate ? 'Private Group (Invite Only)' : 'Public Group'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="BookOpen" size={18} className="text-accent" />
                    <h3 className="text-sm font-semibold text-foreground">Reading Scope</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">{getScopeLabel()}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Calendar" size={18} className="text-accent" />
                    <h3 className="text-sm font-semibold text-foreground">Duration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">{getDurationLabel()}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Settings" size={18} className="text-accent" />
                    <h3 className="text-sm font-semibold text-foreground">Style</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">{getStyleLabel()}</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/25 rounded-2xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Estimated Reading Load</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-3 border border-border/80">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Total Chapters</span>
                  <span className="text-xl font-bold text-foreground">{estimates?.totalChapters}</span>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border/80">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Total Days</span>
                  <span className="text-xl font-bold text-foreground">{estimates?.totalDays}</span>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border/80">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Daily Chapters</span>
                  <span className="text-xl font-bold text-foreground">{estimates?.chaptersPerDay}</span>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border/80">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Daily Time</span>
                  <span className="text-xl font-bold text-foreground">~{estimates?.estimatedMinutes}m</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <OnboardingHeader currentStep={currentStep} totalSteps={5} />
      <PageTransition className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {validationError && (
            <FadeIn delay={0.1}>
              <div className="mb-6 bg-destructive/10 border border-destructive rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-destructive">{validationError}</p>
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.2}>
            <div className="mb-8 md:mb-12">
              {renderStepContent()}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
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
                  Step {currentStep} of 5
                </span>
              </div>

              {currentStep < 5 ? (
                <AnimatedButton
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  Next
                  <Icon name="ChevronRight" size={20} />
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onClick={handleCreateGroup}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Group
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
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse animate-duration-1000" />
              <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2 animate-pulse">
              Creating Your Fellowship Group
            </h3>
            <p className="text-sm text-muted-foreground">
              We are configuring the shared reading plan and generating secure invite tokens...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCreationWizard;
