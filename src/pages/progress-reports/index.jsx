import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import AppFooter from '../../components/ui/AppFooter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import ProgressOverview from './components/ProgressOverview';
import StatisticalSummary from './components/StatisticalSummary';
import ParticipationCalendar from './components/ParticipationCalendar';

const ProgressReports = () => {
  const { currentUser } = useAuth();
  const planData = currentUser?.activePlan || null;
  const hasPlan = !!planData;

  const progressStats = planData?.progressStats || { daysCompleted: 0, chaptersCompleted: 0, booksCompleted: 0, currentStreak: 0 };

  const progressData = {
    completionPercentage: planData?.totalDays ? Math.round((progressStats?.daysCompleted / planData?.totalDays) * 100) : 0,
    totalChapters: planData?.totalDays ? planData.totalDays * 3 : 150,
    chaptersRead: progressStats?.chaptersCompleted || 0,
    currentStreak: progressStats?.currentStreak || 0,
    longestStreak: progressStats?.currentStreak || 0
  };

  const statistics = {
    averageDailyProgress: 3,
    projectedCompletion: planData ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(new Date(planData.startDate).getTime() + planData.totalDays * 24 * 60 * 60 * 1000)) : '',
    totalReadingDays: progressStats?.daysCompleted || 0,
    upcomingMilestone: {
      name: 'Read first chapter!',
      remaining: 1
    }
  };

  return (
    <PageTransition className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 pb-20 md:pb-8">
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 lg:mb-10 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-heading font-extrabold text-foreground mb-2">
                Progress Reports
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Track your reading journey and celebrate your achievements
              </p>
            </div>

            <div className="flex items-center">
              <Link to="/daily-reading-dashboard">
                <Button
                  variant="outline"
                  className="border border-border/80 bg-card text-foreground hover:bg-muted/50 rounded-xl px-4 py-2 font-semibold text-sm flex items-center gap-2 shadow-sm"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {!hasPlan ? (
          <div className="space-y-12">
            <FadeIn delay={0.2}>
              <div className="relative flex flex-col items-center justify-center text-center py-16 md:py-20 px-6 bg-card border border-border/80 rounded-[2rem] shadow-sm max-w-4xl mx-auto">
                <h2 className="relative text-2xl md:text-3xl font-heading font-extrabold text-[#1c142c] dark:text-foreground mb-3 tracking-tight">
                  No progress to show yet
                </h2>
                <p className="relative text-sm md:text-base text-muted-foreground max-w-sm mb-8 leading-relaxed">
                  Create a reading plan and start reading to see your progress, streaks, and statistics here.
                </p>
                <Link to="/plan-creation-wizard">
                  <Button
                    variant="default"
                    className="bg-accent hover:bg-accent/90 text-white shadow-md shadow-accent/10 px-6 py-3 rounded-xl font-semibold border-0 flex items-center gap-2 text-sm justify-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Create a Reading Plan</span>
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Stats Grids shown at bottom */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Streaks */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-foreground ml-1">Streaks</h3>
                  <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="text-3xl font-extrabold text-foreground tracking-tight mb-1">0</div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Day Streak</p>
                    <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">Longest streak: 0 days</p>
                  </div>
                </div>

                {/* Chapters Read */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-foreground ml-1">Chapters Read</h3>
                  <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="text-3xl font-extrabold text-foreground tracking-tight mb-1">0</div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Chapters Completed</p>
                    <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">0% of your plan progress</p>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-foreground ml-1">Milestones</h3>
                  <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md min-h-[126px] flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">Next Milestone</p>
                      <h4 className="text-xs md:text-sm font-bold text-foreground leading-snug">Read your first chapter!</h4>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">Milestone is currently locked</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        ) : (
          /* ── Progress content renders here when plan exists ── */
          <div className="space-y-6 md:space-y-8 lg:space-y-12">
            {/* Standalone Overall Progress Bar Card */}
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground">
                    Overall Progress
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your reading completion percentage across the active plan
                  </p>
                </div>
                <span className="text-2xl font-heading font-extrabold text-accent">
                  {progressData.completionPercentage}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-muted rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${progressData.completionPercentage}%` }}
                />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                Completed {progressData.chaptersRead} of {progressData.totalChapters} chapters
              </p>
            </div>

            <ProgressOverview progressData={progressData} />
            <ParticipationCalendar completedDates={progressStats.completedDates || []} />
            <StatisticalSummary statistics={statistics} />
          </div>
        )}
      </main>

      <AppFooter />
      <MobileBottomNav />
    </PageTransition>
  );
};

export default ProgressReports;
