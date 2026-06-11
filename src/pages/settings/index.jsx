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

  useEffect(() => {
    if (currentUser?.emailSettings) {
      setMorningReminders(currentUser.emailSettings.morningReminders !== false);
      setStreakWarnings(currentUser.emailSettings.streakWarnings !== false);
      setMorningHour(currentUser.emailSettings.morningHour || 7);
      setWarningHour(currentUser.emailSettings.warningHour || 21);
    }
  }, [currentUser?.emailSettings]);

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

  const handleMorningHourChange = async (e) => {
    const hr = parseInt(e.target.value);
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

  const handleWarningHourChange = async (e) => {
    const hr = parseInt(e.target.value);
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 pb-20 md:pb-8">
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile, account, and preferences</p>
          </div>
        </FadeIn>

        <div className="space-y-8">

          {/* ── Profile Photo ── */}
          <FadeIn delay={0.15}>
            <section className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-5">Profile Photo</h2>
              <div className="flex items-center gap-5">
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
            <section className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-5">Personal Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
            <section className="bg-card rounded-2xl border border-border p-6 space-y-5">
              <h2 className="text-lg font-heading font-semibold text-foreground">Email Notifications</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Timezone detected: <strong className="text-foreground">{currentUser?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</strong></p>
              
              <div className="space-y-4">
                {/* Morning Reminder Toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-foreground block">Morning Daily Bread Alert</span>
                    <span className="text-xs text-muted-foreground">Receive your assigned Bible chapters directly in your inbox to start the day.</span>
                    {morningReminders && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Delivery time:</span>
                        <select
                          value={morningHour}
                          onChange={handleMorningHourChange}
                          className="px-2.5 py-1 border border-border rounded-lg bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? '12:00 AM' : i === 12 ? '12:00 PM' : i > 12 ? `${i - 12}:00 PM` : `${i}:00 AM`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleMorning(!morningReminders)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center flex-shrink-0 ${
                      morningReminders ? 'bg-accent' : 'bg-muted border border-border'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-sm bg-white transition-all duration-200 ${
                        morningReminders ? 'ml-auto' : 'ml-0'
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
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Delivery time:</span>
                        <select
                          value={warningHour}
                          onChange={handleWarningHourChange}
                          className="px-2.5 py-1 border border-border rounded-lg bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? '12:00 AM' : i === 12 ? '12:00 PM' : i > 12 ? `${i - 12}:00 PM` : `${i}:00 AM`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleStreak(!streakWarnings)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center flex-shrink-0 ${
                      streakWarnings ? 'bg-accent' : 'bg-muted border border-border'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-sm bg-white transition-all duration-200 ${
                        streakWarnings ? 'ml-auto' : 'ml-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── Account ── */}
          <FadeIn delay={0.25}>
            <section className="bg-card rounded-2xl border border-border p-6">
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
            <section className="bg-card rounded-2xl border border-red-200 p-6">
              <h2 className="text-lg font-heading font-semibold text-red-600 mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Sign Out</p>
                    <p className="text-xs text-muted-foreground">Log out of your account on this device</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-gentle ${
                      logoutConfirm
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border border-red-200 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {logoutConfirm ? 'Confirm Logout' : 'Log Out'}
                  </button>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-gentle">
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
