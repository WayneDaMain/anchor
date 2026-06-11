import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import AppFooter from '../../components/ui/AppFooter';
import TodayAssignment from './components/TodayAssignment';
import ProgressOverview from './components/ProgressOverview';
import UpcomingAssignments from './components/UpcomingAssignments';
import QuickActions from './components/QuickActions';
import MilestoneCard from './components/MilestoneCard';
import VerseOfTheDay from './components/VerseOfTheDay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { generateDailyTimeline, BIBLE_BOOKS_DATA, calculateStreak } from '../../utils/planHelpers';
import { onSnapshot, doc, updateDoc, increment, setDoc, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import GroupDetailsModal from '../group-management/components/GroupDetailsModal';

const DailyReadingDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, updateActivePlan, updateUserProfile } = useAuth();
  const [completedChapters, setCompletedChapters] = useState([]);

  const [currentDate] = useState(new Date());

  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  const [planContext, setPlanContext] = useState('personal');
  const [groupData, setGroupData] = useState(null);
  const [memberProgress, setMemberProgress] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(false);

  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [groupDetailsTab, setGroupDetailsTab] = useState('members');
  const [unreadCount, setUnreadCount] = useState(0);

  const handleOpenGroupDetails = (tabName) => {
    setGroupDetailsTab(tabName);
    setShowGroupDetailsModal(true);
    if (tabName === 'discussion') {
      setUnreadCount(0);
      if (currentUser?.activeGroupId) {
        localStorage.setItem(`lastReadChat_${currentUser.activeGroupId}`, new Date().toISOString());
      }
    }
  };

  useEffect(() => {
    if (planContext !== 'group' || !currentUser?.activeGroupId) {
      setUnreadCount(0);
      return;
    }

    const messagesQuery = query(
      collection(db, 'groups', currentUser.activeGroupId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snap) => {
      const lastRead = localStorage.getItem(`lastReadChat_${currentUser.activeGroupId}`) || '1970-01-01T00:00:00.000Z';
      const list = snap.docs.map(doc => doc.data());
      const unread = list.filter(msg => msg.timestamp > lastRead && msg.senderId !== currentUser.uid).length;
      setUnreadCount(unread);
    });

    return unsubscribe;
  }, [planContext, currentUser?.activeGroupId, currentUser?.uid]);

  useEffect(() => {
    if (planContext === 'personal') {
      setCompletedChapters(currentUser?.activePlan?.completedChapters || []);
    } else {
      setCompletedChapters(memberProgress?.completedChapters || []);
    }
  }, [planContext, currentUser?.activePlan?.completedChapters, memberProgress?.completedChapters]);

  useEffect(() => {
    if (!currentUser?.activeGroupId) {
      setGroupData(null);
      setMemberProgress(null);
      setPlanContext('personal');
      return;
    }

    setLoadingGroup(true);
    const groupRef = doc(db, 'groups', currentUser.activeGroupId);
    const memberRef = doc(db, 'groups', currentUser.activeGroupId, 'members', currentUser.uid);

    const unsubscribeGroup = onSnapshot(groupRef, async (docSnap) => {
      if (docSnap.exists()) {
        setGroupData(docSnap.data());
      } else {
        setGroupData(null);
        try {
          await updateUserProfile({ activeGroupId: null });
        } catch (err) {
          console.warn('Failed to auto-clear deleted activeGroupId:', err);
        }
      }
    });

    const unsubscribeMember = onSnapshot(memberRef, (docSnap) => {
      if (docSnap.exists()) {
        setMemberProgress(docSnap.data());
      } else {
        setMemberProgress(null);
      }
      setLoadingGroup(false);
    });

    return () => {
      unsubscribeGroup();
      unsubscribeMember();
    };
  }, [currentUser?.activeGroupId]);

  const handleCancelPlan = async () => {
    setIsCanceling(true);
    try {
      await updateActivePlan(null);
      setShowCancelConfirm(false);
    } catch (err) {
      console.error('Failed to cancel plan:', err);
    } finally {
      setIsCanceling(false);
    }
  };

  const activePlan = planContext === 'personal' ? (currentUser?.activePlan || null) : (groupData?.plan || null);
  const planData = activePlan;

  const completedDates = planContext === 'personal'
    ? (planData?.progressStats?.completedDates || [])
    : (memberProgress?.completedDates || []);

  const todayDateStr = new Date().toLocaleDateString('en-CA');
  const yesterdayDateStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-CA');
  const calculatedStreak = calculateStreak(completedDates, todayDateStr, yesterdayDateStr);

  const progressStats = planContext === 'personal' 
    ? {
        ...(planData?.progressStats || { daysCompleted: 0, chaptersCompleted: 0, booksCompleted: 0, completedDates: [] }),
        currentStreak: calculatedStreak
      }
    : {
        daysCompleted: memberProgress?.daysCompleted || 0,
        chaptersCompleted: (memberProgress?.daysCompleted || 0) * 3,
        booksCompleted: 0,
        currentStreak: calculatedStreak,
        completedDates: completedDates
      };

  // Generate real daily timeline using our new helper utility
  const timeline = planData ? generateDailyTimeline(planData) : [];

  // Today's reading is at the index matching `progressStats.daysCompleted`
  const currentDayIndex = progressStats.daysCompleted;
  const todayDayData = planData && currentDayIndex < timeline.length ? timeline[currentDayIndex] : null;

  // Format today's assignments for TodayAssignment component
  const todayAssignments = todayDayData ? todayDayData.groupedAssignments.map((g, idx) => ({
    id: `today-${idx}`,
    book: g.book,
    chapters: g.chapters.map(num => ({
      id: `${g.book.toLowerCase()}-${num}`,
      number: num
    }))
  })) : [];

  // Upcoming assignments are the next 3 days of the timeline
  const upcomingDays = planData ? timeline.slice(currentDayIndex + 1, currentDayIndex + 4).map(day => ({
    id: `up-${day.dayNumber}`,
    date: day.date,
    totalChapters: day.totalChapters,
    assignments: day.groupedAssignments.map(g => ({
      book: g.book,
      chapterRange: g.chapters.length === 1 ? `Chapter ${g.chapters[0]}` : `Chapters ${Math.min(...g.chapters)} - ${Math.max(...g.chapters)}`
    }))
  })) : [];

  const latestMilestone = planData ? {
    title: progressStats.daysCompleted === 0 ? 'First Milestone Unlocked!' : `Milestone Reached!`,
    description: progressStats.daysCompleted === 0 
      ? `Successfully created your reading plan: ${planData.name}!`
      : `You completed Day ${progressStats.daysCompleted} of your reading plan!`,
    date: new Date(planData.startDate)
  } : null;

  const allChapterIds = todayAssignments?.flatMap(a => a?.chapters?.map(c => c?.id));
  const isAllCompleted = allChapterIds?.length === 0 || (allChapterIds?.length > 0 && allChapterIds?.every(id => completedChapters?.includes(id)));

  const hasCompletedToday = progressStats.completedDates?.includes(todayDateStr);

  const handleChapterToggle = async (chapterId) => {
    const nextCompleted = completedChapters?.includes(chapterId)
      ? completedChapters.filter(id => id !== chapterId)
      : [...(completedChapters || []), chapterId];

    setCompletedChapters(nextCompleted);

    try {
      if (planContext === 'personal') {
        const updatedPlan = {
          ...planData,
          completedChapters: nextCompleted
        };
        await updateActivePlan(updatedPlan);
      } else {
        const memberRef = doc(db, 'groups', currentUser.activeGroupId, 'members', currentUser.uid);
        await setDoc(memberRef, {
          completedChapters: nextCompleted
        }, { merge: true });
      }
    } catch (err) {
      console.error('Failed to save chapter progress:', err);
    }
  };

  const handleMarkComplete = async () => {
    if (!isAllCompleted) {
      const nextCompleted = allChapterIds;
      setCompletedChapters(nextCompleted);
      
      try {
        if (planContext === 'personal') {
          const updatedPlan = {
            ...planData,
            completedChapters: nextCompleted
          };
          await updateActivePlan(updatedPlan);
        } else {
          const memberRef = doc(db, 'groups', currentUser.activeGroupId, 'members', currentUser.uid);
          await setDoc(memberRef, {
            completedChapters: nextCompleted
          }, { merge: true });
        }
      } catch (err) {
        console.error('Failed to save mark all complete:', err);
      }
      return;
    }

    setIsCanceling(true);
    try {
      const todayDateStr = new Date().toLocaleDateString('en-CA');
      const yesterdayDateStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-CA');
      const nextDaysCompleted = progressStats.daysCompleted + 1;
      const nextChaptersCompleted = progressStats.chaptersCompleted + todayAssignments.flatMap(a => a.chapters).length;
      
      const updatedDates = [...(progressStats.completedDates || [])];
      if (!updatedDates.includes(todayDateStr)) {
        updatedDates.push(todayDateStr);
      }

      if (planContext === 'personal') {
        // Calculate books completed
        const chaptersReadSoFar = timeline
          .slice(0, nextDaysCompleted)
          .flatMap(day => day.chaptersList);
        
        const readCounts = {};
        chaptersReadSoFar.forEach(ch => {
          readCounts[ch.book] = (readCounts[ch.book] || 0) + 1;
        });

        let nextBooksCompleted = 0;
        BIBLE_BOOKS_DATA.forEach(book => {
          if (readCounts[book.name] && readCounts[book.name] >= book.chapters) {
            nextBooksCompleted++;
          }
        });

        const updatedPlan = {
          ...planData,
          completedChapters: [],
          progressStats: {
            ...progressStats,
            daysCompleted: nextDaysCompleted,
            chaptersCompleted: nextChaptersCompleted,
            booksCompleted: nextBooksCompleted,
            completedDates: updatedDates,
            currentStreak: calculateStreak(updatedDates, todayDateStr, yesterdayDateStr)
          }
        };

        await updateActivePlan(updatedPlan);
      } else {
        // Log progress in group members collection
        const memberRef = doc(db, 'groups', currentUser.activeGroupId, 'members', currentUser.uid);
        await setDoc(memberRef, {
          daysCompleted: nextDaysCompleted,
          completedDates: updatedDates,
          completedChapters: []
        }, { merge: true });

        // Increment group collective progress completedChapters
        const groupRef = doc(db, 'groups', currentUser.activeGroupId);
        await updateDoc(groupRef, {
          completedChapters: increment(todayAssignments.flatMap(a => a.chapters).length)
        });
      }
      setCompletedChapters([]);
    } catch (err) {
      console.error('Failed to save day progress:', err);
    } finally {
      setIsCanceling(false);
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Reader';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <PageTransition className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 pb-20 md:pb-8">

        {/* ── Header ── */}
        <FadeIn delay={0.05}>
          <div className="mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                {planData && (
                  <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1.5">{today}</p>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-[2.5rem] font-heading font-extrabold text-foreground leading-tight">
                  Welcome back, {displayName}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1.5">
                  {planData ? `${planData.name} · Day ${progressStats.daysCompleted + 1} of ${planData.totalDays}` : 'No active reading plan'}
                </p>
              </div>
              <Button
                variant="default"
                size="default"
                onClick={() => {
                  if (planData) {
                    setShowOverwriteConfirm(true);
                  } else {
                    navigate('/plan-creation-wizard');
                  }
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md shadow-accent/20 dark:shadow-accent/40 transition-all border border-accent/20 flex items-center gap-2"
              >
                <Icon name="SquarePen" size={16} />
                <span>{planData ? 'New Plan' : 'Create Plan'}</span>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* ── Context Switcher Toggle ── */}
        {currentUser?.activeGroupId && groupData && (
          <FadeIn delay={0.08}>
            <div className="flex bg-muted/65 p-1 rounded-xl max-w-sm mb-6 border border-border/80">
              <button
                onClick={() => setPlanContext('personal')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  planContext === 'personal' 
                    ? 'bg-card text-accent shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Personal Plan
              </button>
              <button
                onClick={() => setPlanContext('group')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  planContext === 'group' 
                    ? 'bg-card text-accent shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {groupData.name} (Group)
              </button>
            </div>

            {/* Quick Access Group Chat Banner */}
            {planContext === 'group' && groupData?.isChatEnabled !== false && (
              <div className="mb-6 animate-fade-in max-w-sm">
                <button
                  onClick={() => handleOpenGroupDetails('discussion')}
                  className="w-full flex items-center justify-between p-3.5 bg-accent/5 hover:bg-accent/10 border border-accent/15 rounded-xl transition-all relative overflow-hidden group shadow-sm text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent relative flex-shrink-0">
                      <Icon name="MessageSquare" size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow-md">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">Group Discussion Chat</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Share notes and encourage fellow members</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              </div>
            )}
          </FadeIn>
        )}

        {/* ── Verse of the Day ── */}
        <FadeIn delay={0.1}>
          <div className="mb-8 md:mb-10">
            <VerseOfTheDay />
          </div>
        </FadeIn>

        {!planData ? (
          /* ── Empty state ── */
          <FadeIn delay={0.15}>
            <div className="relative flex flex-col items-center justify-center text-center py-16 md:py-20 px-6 bg-card border border-border/80 rounded-[2rem] shadow-sm max-w-4xl mx-auto mt-6">
              {/* Decorative bg circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <h2 className="relative text-2xl md:text-3xl font-heading font-extrabold text-[#1c142c] dark:text-foreground mb-3 tracking-tight">
                No reading plan yet
              </h2>
              <p className="relative text-sm md:text-base text-muted-foreground max-w-sm mb-10 leading-relaxed">
                Build a personalized Bible reading plan and track every chapter, streak, and milestone.
              </p>
              
              <div className="relative flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Button
                  variant="default"
                  onClick={() => navigate('/plan-creation-wizard')}
                  className="bg-[#0f4cba] hover:bg-[#0c3f9c] text-white shadow-md shadow-blue-500/10 px-6 py-3 rounded-xl font-semibold border-0 flex items-center gap-2"
                >
                  <Icon name="SquarePen" size={16} />
                  <span>Create a Reading Plan</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/group-management')}
                  className="border border-border bg-card text-foreground hover:bg-muted/50 hover:text-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Icon name="Users" size={16} />
                  <span>Browse Groups</span>
                </Button>
              </div>
            </div>
          </FadeIn>
        ) : progressStats.daysCompleted >= timeline.length ? (
          /* ── Plan Completed State ── */
          <FadeIn delay={0.15}>
            <div className="relative flex flex-col items-center justify-center text-center py-16 md:py-20 px-6 bg-card border border-border/80 rounded-[2rem] shadow-sm max-w-4xl mx-auto mt-6">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <Icon name="Trophy" size={40} className="text-accent" />
              </div>
              <h2 className="relative text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-3 tracking-tight">
                Congratulations!
              </h2>
              <p className="relative text-sm md:text-base text-muted-foreground max-w-md mb-10 leading-relaxed">
                You have successfully completed your {planData.name}. You've read all chapters and stayed committed to the end!
              </p>
              <div className="relative flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Button
                  variant="default"
                  onClick={() => {
                    if (planData) {
                      setShowOverwriteConfirm(true);
                    } else {
                      navigate('/plan-creation-wizard');
                    }
                  }}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md shadow-accent/20 dark:shadow-accent/40 px-6 py-3 rounded-xl font-semibold border border-accent/20 flex items-center gap-2"
                >
                  <Icon name="RotateCcw" size={16} />
                  <span>Start a New Plan</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(true)}
                  className="border border-border bg-card text-foreground hover:bg-muted/50 hover:text-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Clear Completed Plan</span>
                </Button>
              </div>
            </div>
          </FadeIn>
        ) : (
          /* ── Plan active ── */
          <>
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <TodayAssignment
                    currentDate={currentDate}
                    assignments={todayAssignments}
                    onChapterToggle={handleChapterToggle}
                    onMarkComplete={handleMarkComplete}
                    completedChapters={completedChapters}
                    isAllCompleted={isAllCompleted}
                    hasCompletedToday={hasCompletedToday}
                    lastCompletedDayData={progressStats.daysCompleted > 0 && progressStats.daysCompleted <= timeline.length ? timeline[progressStats.daysCompleted - 1] : null}
                    daysCompleted={progressStats.daysCompleted}
                    totalDays={planData?.totalDays || 0}
                  />

                  {/* Plan Details */}
                  <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-heading font-semibold text-foreground">Plan Details</h2>
                      <button 
                        onClick={() => setShowTimelineModal(true)}
                        className="text-muted-foreground hover:text-accent transition-colors focus:outline-none"
                        title="View reading timeline"
                      >
                        <Icon name="Info" size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: 'Scope', value: planData?.scope },
                        { label: 'Style', value: planData?.readingStyle },
                        { label: 'Started', value: planData?.startDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })?.format(new Date(planData.startDate)) : '' },
                      ].map(item => (
                        <div key={item.label} className="bg-muted/30 rounded-xl p-3.5">
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Cancel Plan Button */}
                    {planContext === 'personal' ? (
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        disabled={isCanceling}
                        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold border border-border bg-transparent text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Icon name="Trash2" size={16} />
                        <span>Cancel Reading Plan</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenGroupDetails('info')}
                        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold border border-accent/25 bg-accent/5 text-accent hover:bg-accent/10 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Icon name="Users" size={16} />
                        <span>Manage Group</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <ProgressOverview 
                    planData={planData} 
                    progressStats={progressStats} 
                    onClick={planContext === 'group' ? () => handleOpenGroupDetails('members') : null}
                  />
                  {latestMilestone && (
                    <MilestoneCard milestone={latestMilestone} />
                  )}
                  <UpcomingAssignments 
                    upcomingDays={upcomingDays} 
                    onViewTimeline={() => setShowTimelineModal(true)}
                  />
                  <QuickActions />
                </div>
              </div>
            </FadeIn>
          </>
        )}
      </main>
      <AppFooter />
      <MobileBottomNav />

      {/* View Full Timeline Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 lg:p-7 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Reading Plan Timeline
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {planData?.name} · {timeline.length} Days
                </p>
              </div>
              <button 
                onClick={() => setShowTimelineModal(false)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* Modal Body (Timeline List) */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 scrollbar-thin">
              {timeline.map((day) => {
                const isCompleted = day.dayNumber <= progressStats.daysCompleted;
                const isActive = day.dayNumber === progressStats.daysCompleted + 1;
                return (
                  <div 
                    key={day.dayNumber}
                    className={`p-3 md:p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      isActive 
                        ? 'border-accent bg-accent/5 shadow-sm font-semibold'
                        : isCompleted
                        ? 'border-border/40 bg-muted/10 opacity-70'
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Day badge */}
                      <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isActive 
                          ? 'bg-accent text-accent-foreground' 
                          : isCompleted 
                          ? 'bg-muted-foreground/10 text-muted-foreground'
                          : 'bg-card border border-border text-foreground shadow-sm'
                      }`}>
                        <span>Day</span>
                        <span className="text-base font-extrabold leading-none mt-0.5">{day.dayNumber}</span>
                      </div>
                      
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          isActive ? 'text-foreground font-bold' : isCompleted ? 'text-muted-foreground font-medium' : 'text-foreground'
                        }`}>
                          {day.assignmentsText}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                          <Icon name="Check" size={14} />
                        </div>
                      ) : isActive ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-semibold">
                          {day.totalChapters} Ch
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border/80 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Progress: {progressStats.daysCompleted} / {timeline.length} Days Completed
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTimelineModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Overwrite Active Plan Confirmation Modal */}
      {showOverwriteConfirm && (
        <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-foreground mb-3 tracking-tight">
              Start a New Reading Plan?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              You already have an active reading plan: <strong className="text-foreground">{planData?.name}</strong>.
              Starting a new plan will replace it and permanently reset all your progress statistics.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/plan-creation-wizard', { state: { overwriteConfirmed: true } })}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-destructive hover:bg-destructive/90 text-white shadow-sm transition-all"
              >
                Yes, Start New Plan
              </button>
              <button
                onClick={() => setShowOverwriteConfirm(false)}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold border border-border hover:bg-muted/50 transition-all text-foreground"
              >
                Keep Current Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reading Plan Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Trash2" size={32} />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-foreground mb-3 tracking-tight">
              Cancel Reading Plan?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Are you sure you want to cancel <strong className="text-foreground">{planData?.name}</strong>?
              This action cannot be undone and will permanently delete all your progress for this plan.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCancelPlan}
                disabled={isCanceling}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-destructive hover:bg-destructive/90 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isCanceling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Canceling...
                  </>
                ) : (
                  'Yes, Cancel Plan'
                )}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCanceling}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold border border-border hover:bg-muted/50 transition-all text-foreground disabled:opacity-50"
              >
                Keep My Plan
              </button>
            </div>
          </div>
        </div>
      )}
      {showGroupDetailsModal && groupData && (
        <GroupDetailsModal
          group={{ id: currentUser.activeGroupId, ...groupData }}
          onClose={() => setShowGroupDetailsModal(false)}
          initialTab={groupDetailsTab}
        />
      )}
    </PageTransition>
  );
};

export default DailyReadingDashboard;
