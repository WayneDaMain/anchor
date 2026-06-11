import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import AppFooter from '../../components/ui/AppFooter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, uploadProfilePhoto, updateUserProfile, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Profile fields (local state until Firestore write is wired)
  const [displayName, setDisplayName] = useState(currentUser?.fullName || currentUser?.displayName || '');
  const [nameSaved, setNameSaved] = useState(false);

  // Email Notification settings
  const [morningReminders, setMorningReminders] = useState(currentUser?.emailSettings?.morningReminders !== false);
  const [streakWarnings, setStreakWarnings] = useState(currentUser?.emailSettings?.streakWarnings !== false);
  const [morningHour, setMorningHour] = useState(currentUser?.emailSettings?.morningHour || 7);
  const [warningHour, setWarningHour] = useState(currentUser?.emailSettings?.warningHour || 21);

  // Custom time picker states & refs
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showWarningPicker, setShowWarningPicker] = useState(false);
  const morningPickerRef = useRef(null);
  const warningPickerRef = useRef(null);

  useEffect(() => {
    if (currentUser?.emailSettings) {
      setMorningReminders(currentUser.emailSettings.morningReminders !== false);
      setStreakWarnings(currentUser.emailSettings.streakWarnings !== false);
      setMorningHour(currentUser.emailSettings.morningHour || 7);
      setWarningHour(currentUser.emailSettings.warningHour || 21);
    }
  }, [currentUser?.emailSettings]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (morningPickerRef.current && !morningPickerRef.current.contains(event.target)) {
        setShowMorningPicker(false);
      }
      if (warningPickerRef.current && !warningPickerRef.current.contains(event.target)) {
        setShowWarningPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatHour = (h) => {
    if (h === 0) return '12:00 AM';
    if (h === 12) return '12:00 PM';
    return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
  };

  const handleToggleMorning = async (val) => {
    setMorningReminders(val);
    try {
      await updateUserProfile({
        emailSettings: {
          morningReminders: val,
          streakWarnings,
          morningHour,
          warningHour
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStreak = async (val) => {
    setStreakWarnings(val);
    try {
      await updateUserProfile({
        emailSettings: {
          morningReminders,
          streakWarnings: val,
          morningHour,
          warningHour
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMorningHourChange = async (hr) => {
    setMorningHour(hr);
    try {
      await updateUserProfile({
        emailSettings: {
          morningReminders,
          streakWarnings,
          morningHour: hr,
          warningHour
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleWarningHourChange = async (hr) => {
    setWarningHour(hr);
    try {
      await updateUserProfile({
        emailSettings: {
          morningReminders,
          streakWarnings,
          morningHour,
          warningHour: hr
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = 'Settings — Anchor';
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setPhotoError('');

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo must be under 5 MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file');
      return;
    }

    setPhotoUploading(true);
    try {
      await uploadProfilePhoto(file);
    } catch (err) {
      setPhotoError('Upload failed. Please try again.');
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    try {
      await updateUserProfile({ fullName: displayName.trim() });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save display name:', err);
    }
  };

  const handleLogout = async () => {
    if (!logoutConfirm) {
      setLogoutConfirm(true);
      return;
    }
    try {
      await logout();
      navigate('/login');
    } catch {
      // ignore
    }
  };

  return (
    <PageTransition className="min-h-screen bg-background">
      <Header />
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 pb-20 md:pb-8">
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile, account, and preferences</p>
          </div>
        </FadeIn>

        <div className="space-y-8">

          {/* ── Profile Photo ── */}
          <FadeIn delay={0.15}>
            <section className="bg-card rounded-2xl border border-border p-4 sm:p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-5">Profile Photo</h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={32} className="text-muted-foreground" />
                    )}
                  </div>
                  {photoUploading && (
                    <div className="absolute inset-0 rounded-full bg-card/70 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                  >
                    {photoUploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  {photoError && (
                    <p className="text-xs text-red-500 mt-2">{photoError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 5 MB.</p>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── Personal Info ── */}
          <FadeIn delay={0.2}>
            <section className="bg-card rounded-2xl border border-border p-4 sm:p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-5">Personal Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your name"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveName}
                      disabled={!displayName.trim()}
                    >
                      {nameSaved ? '✓ Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-muted-foreground text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Email cannot be changed</p>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── Email Notifications ── */}
          <FadeIn delay={0.22}>
            <section className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-5">
              <h2 className="text-lg font-heading font-semibold text-foreground">Email Notifications</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Timezone detected: <strong className="text-foreground">{currentUser?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</strong></p>

              <div className="space-y-4">
                {/* Morning Reminder Toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-foreground block">Morning Daily Bread Alert</span>
                    <span className="text-xs text-muted-foreground">Receive your assigned Bible chapters directly in your inbox to start the day.</span>
                    {morningReminders && (
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Icon name="Clock" size={12} />
                          <span>Delivery time:</span>
                        </span>

                        <div className="flex items-center gap-1 bg-muted/40 p-1 border border-border rounded-xl">
                          {/* Hour Selector */}
                          <div className="relative" ref={morningPickerRef}>
                            <button
                              type="button"
                              onClick={() => setShowMorningPicker(!showMorningPicker)}
                              className="px-2.5 py-1 text-foreground text-xs font-semibold hover:bg-muted/80 rounded-lg flex items-center gap-1 transition-all select-none"
                            >
                              <span>{morningHour === 0 || morningHour === 12 ? 12 : morningHour > 12 ? morningHour - 12 : morningHour}:00</span>
                              <Icon name="ChevronDown" size={10} className={`text-muted-foreground transition-transform ${showMorningPicker ? 'rotate-180' : ''}`} />
                            </button>

                            {showMorningPicker && (
                              <div className="absolute left-0 mt-1.5 w-24 max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50 py-1 scrollbar-none animate-in fade-in slide-in-from-top-1 duration-150">
                                {Array.from({ length: 12 }, (_, i) => {
                                  const displayHr = i + 1; // 1 to 12
                                  const isPm = morningHour >= 12;
                                  const targetH = isPm
                                    ? (displayHr === 12 ? 12 : displayHr + 12)
                                    : (displayHr === 12 ? 0 : displayHr);

                                  const isSelected = (morningHour === 0 || morningHour === 12 ? 12 : morningHour > 12 ? morningHour - 12 : morningHour) === displayHr;

                                  return (
                                    <button
                                      key={displayHr}
                                      type="button"
                                      onClick={() => {
                                        handleMorningHourChange(targetH);
                                        setShowMorningPicker(false);
                                      }}
                                      className={`w-full px-3 py-1 text-left text-xs rounded hover:bg-muted active:scale-95 transition-all ${isSelected ? 'bg-accent/15 text-accent font-semibold' : 'text-foreground'
                                        }`}
                                    >
                                      {displayHr}:00
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="w-[1px] h-3 bg-border" />

                          {/* AM/PM Segment */}
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (morningHour >= 12) {
                                  handleMorningHourChange(morningHour === 12 ? 0 : morningHour - 12);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none ${morningHour < 12
                                  ? 'bg-card text-foreground shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              AM
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (morningHour < 12) {
                                  handleMorningHourChange(morningHour === 0 ? 12 : morningHour + 12);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none ${morningHour >= 12
                                  ? 'bg-card text-foreground shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              PM
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleMorning(!morningReminders)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center flex-shrink-0 ${morningReminders ? 'bg-accent' : 'bg-muted border border-border'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-sm bg-white transition-all duration-200 ${morningReminders ? 'ml-auto' : 'ml-0'
                        }`}
                    />
                  </button>
                </div>

                <div className="border-t border-border/80 my-3" />

                {/* Evening Streak Reminder Toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-foreground block">Evening Streak Warning</span>
                    <span className="text-xs text-muted-foreground">Get alerted if you are at risk of breaking your reading streak.</span>
                    {streakWarnings && (
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Icon name="Clock" size={12} />
                          <span>Delivery time:</span>
                        </span>

                        <div className="flex items-center gap-1 bg-muted/40 p-1 border border-border rounded-xl">
                          {/* Hour Selector */}
                          <div className="relative" ref={warningPickerRef}>
                            <button
                              type="button"
                              onClick={() => setShowWarningPicker(!showWarningPicker)}
                              className="px-2.5 py-1 text-foreground text-xs font-semibold hover:bg-muted/80 rounded-lg flex items-center gap-1 transition-all select-none"
                            >
                              <span>{warningHour === 0 || warningHour === 12 ? 12 : warningHour > 12 ? warningHour - 12 : warningHour}:00</span>
                              <Icon name="ChevronDown" size={10} className={`text-muted-foreground transition-transform ${showWarningPicker ? 'rotate-180' : ''}`} />
                            </button>

                            {showWarningPicker && (
                              <div className="absolute left-0 mt-1.5 w-24 max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50 py-1 scrollbar-none animate-in fade-in slide-in-from-top-1 duration-150">
                                {Array.from({ length: 12 }, (_, i) => {
                                  const displayHr = i + 1; // 1 to 12
                                  const isPm = warningHour >= 12;
                                  const targetH = isPm
                                    ? (displayHr === 12 ? 12 : displayHr + 12)
                                    : (displayHr === 12 ? 0 : displayHr);

                                  const isSelected = (warningHour === 0 || warningHour === 12 ? 12 : warningHour > 12 ? warningHour - 12 : warningHour) === displayHr;

                                  return (
                                    <button
                                      key={displayHr}
                                      type="button"
                                      onClick={() => {
                                        handleWarningHourChange(targetH);
                                        setShowWarningPicker(false);
                                      }}
                                      className={`w-full px-3 py-1 text-left text-xs rounded hover:bg-muted active:scale-95 transition-all ${isSelected ? 'bg-accent/15 text-accent font-semibold' : 'text-foreground'
                                        }`}
                                    >
                                      {displayHr}:00
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="w-[1px] h-3 bg-border" />

                          {/* AM/PM Segment */}
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (warningHour >= 12) {
                                  handleWarningHourChange(warningHour === 12 ? 0 : warningHour - 12);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none ${warningHour < 12
                                  ? 'bg-card text-foreground shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              AM
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (warningHour < 12) {
                                  handleWarningHourChange(warningHour === 0 ? 12 : warningHour + 12);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none ${warningHour >= 12
                                  ? 'bg-card text-foreground shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              PM
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleStreak(!streakWarnings)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center flex-shrink-0 ${streakWarnings ? 'bg-accent' : 'bg-muted border border-border'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-sm bg-white transition-all duration-200 ${streakWarnings ? 'ml-auto' : 'ml-0'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── Account ── */}
          <FadeIn delay={0.25}>
            <section className="bg-card rounded-2xl border border-border p-4 sm:p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-5">Account</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Sign-in Method</p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email & Password'}
                    </p>
                  </div>
                  <Icon
                    name={currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Mail' : 'Key'}
                    size={18}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-1">Account Created</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.metadata?.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── Danger Zone ── */}
          <FadeIn delay={0.3}>
            <section className="bg-card rounded-2xl border border-red-200 p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Sign Out</p>
                    <p className="text-xs text-muted-foreground">Log out of your account on this device</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-gentle text-center ${logoutConfirm
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border border-red-200 text-red-600 hover:bg-red-50'
                      }`}
                  >
                    {logoutConfirm ? 'Confirm Logout' : 'Log Out'}
                  </button>
                </div>
                <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-gentle text-center">
                    Delete
                  </button>
                </div>
              </div>
            </section>
          </FadeIn>

        </div>
      </main>
      <AppFooter />
      <MobileBottomNav />
    </PageTransition>
  );
};

export default Settings;
