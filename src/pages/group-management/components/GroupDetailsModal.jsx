import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { compressImage } from '../../../utils/imageHelpers';

const GroupDetailsModal = ({ group, onClose, initialTab = 'members' }) => {
  const { currentUser } = useAuth();
  const [currentGroup, setCurrentGroup] = useState(group);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const [groupPhotoUploading, setGroupPhotoUploading] = useState(false);
  const groupFileRef = useRef(null);

  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to end and delete this group? This action is permanent and cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'groups', currentGroup.id));
      onClose();
    } catch (err) {
      console.error("Failed to delete group:", err);
      alert("Failed to delete group. Please try again.");
    }
  };

  const handleShareInModal = async (e) => {
    if (e) e.stopPropagation();
    const shareText = `Join my Bible reading group "${currentGroup?.name}" on Anchor! Invite Code: ${currentGroup?.inviteCode}`;
    const shareData = {
      title: 'Join Anchor Bible Reading Group',
      text: shareText,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  useEffect(() => {
    if (!group?.id) return;
    const groupRef = doc(db, 'groups', group.id);
    const unsubscribeGroup = onSnapshot(groupRef, (snap) => {
      if (snap.exists()) {
        setCurrentGroup({ id: snap.id, ...snap.data() });
      }
    });
    return unsubscribeGroup;
  }, [group?.id]);

  const handleGroupPhotoUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setGroupPhotoUploading(true);
    try {
      const base64Url = await compressImage(file, 400, 200, 0.7);

      const groupDocRef = doc(db, 'groups', currentGroup.id);
      await updateDoc(groupDocRef, { photoURL: base64Url });
    } catch (err) {
      console.error('Failed to upload group photo:', err);
    } finally {
      setGroupPhotoUploading(false);
      e.target.value = '';
    }
  };

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!group) return;

    // 1. Subscribe to members list
    const membersQuery = collection(db, 'groups', group.id, 'members');
    const unsubscribeMembers = onSnapshot(membersQuery, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(list);
    });

    // 2. Subscribe to messages (ordered by timestamp)
    const messagesQuery = query(
      collection(db, 'groups', group.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribeMessages = onSnapshot(messagesQuery, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(list);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeMessages();
    };
  }, [group.id]);

  // Auto-scroll chat to the bottom when messages load
  useEffect(() => {
    if (activeTab === 'discussion') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Mark messages as read by saving lastReadChat timestamp in localStorage
  useEffect(() => {
    if (activeTab === 'discussion' && currentGroup?.id) {
      localStorage.setItem(`lastReadChat_${currentGroup.id}`, new Date().toISOString());
      window.dispatchEvent(new Event('storage'));
    }
  }, [activeTab, currentGroup?.id, messages]);

  if (!group) return null;

  // Calculate collective average progress
  const averageProgress = members.length > 0
    ? Math.round(
      members.reduce((acc, m) => acc + ((m.daysCompleted || 0) / currentGroup.totalDays * 100), 0) / members.length
    )
    : 0;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messageText = newMessage.trim();
    try {
      await addDoc(collection(db, 'groups', currentGroup.id, 'messages'), {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email.split('@')[0],
        senderPhoto: currentUser.photoURL || null,
        text: messageText,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');

      // Send group chat message push notification via worker
      try {
        const pushRes = await fetch('https://anchor-email-worker.emaxstone12.workers.dev/group-message-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            groupId: currentGroup.id,
            groupName: currentGroup.name,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email.split('@')[0],
            text: messageText
          })
        });
        if (!pushRes.ok) {
          const errBody = await pushRes.text();
          console.warn(`Group push notification failed (${pushRes.status}):`, errBody);
        }
      } catch (pushErr) {
        console.warn('Failed to trigger group message push notification:', pushErr);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Sort members by daysCompleted descending (leaderboard)
  const sortedMembers = [...members].sort((a, b) => (b.daysCompleted || 0) - (a.daysCompleted || 0));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-card border border-border rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col relative overflow-hidden"
          onClick={(e) => e?.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-card border-b border-border p-4 md:p-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center flex-shrink-0">
                {currentGroup?.photoURL ? (
                  <img src={currentGroup.photoURL} alt={currentGroup.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="Users" size={24} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-heading font-extrabold text-foreground">
                  {currentGroup?.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentGroup?.planName} · Code: <strong className="text-accent tracking-wider">{currentGroup?.inviteCode}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="Close modal"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border px-4 flex-shrink-0 bg-muted/20">
            {[
              { id: 'members', label: 'Members Progress' },
              { id: 'discussion', label: 'Discussion' },
              { id: 'info', label: 'Group Info' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs md:text-sm font-semibold border-b-2 transition-all -mb-[2px] ${activeTab === tab.id
                    ? 'border-accent text-accent font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 min-h-0">
            {activeTab === 'info' && (
              <div className="space-y-5">
                {/* Group Photo Section */}
                <div className="flex items-center gap-4 p-4 bg-muted/20 border border-border rounded-xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center flex-shrink-0 relative">
                    {currentGroup?.photoURL ? (
                      <img src={currentGroup.photoURL} alt={currentGroup.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Users" size={28} className="text-muted-foreground" />
                    )}
                    {groupPhotoUploading && (
                      <div className="absolute inset-0 bg-card/70 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Group Photo</h4>
                    {currentGroup?.creatorId === currentUser?.uid ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          ref={groupFileRef}
                          onChange={handleGroupPhotoUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => groupFileRef.current?.click()}
                          disabled={groupPhotoUploading}
                          className="text-xs font-semibold text-accent hover:underline disabled:opacity-50"
                        >
                          Change Group Photo
                        </button>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">Only the creator can change the photo</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">About the Fellowship</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{currentGroup?.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Scope</span>
                    <span className="text-xs font-bold text-foreground truncate block">{currentGroup?.plan?.scope || 'Entire Bible'}</span>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Style</span>
                    <span className="text-xs font-bold text-foreground truncate block">{currentGroup?.plan?.readingStyle || 'Canonical'}</span>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Duration</span>
                    <span className="text-xs font-bold text-foreground truncate block">{currentGroup?.duration}</span>
                  </div>
                </div>

                {/* Collective Progress Bar */}
                <div className="bg-muted/10 border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Collective Progress</span>
                    <span className="text-sm font-bold text-accent">{averageProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${averageProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This represents the average completion rate across all {members.length} members.
                  </p>
                </div>

                {/* Share Fellowship Invite */}
                <div className="bg-muted/10 border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Invite Fellowship Members</span>
                    <p className="text-xs text-muted-foreground truncate">Invite code: <strong className="text-foreground tracking-wider">{currentGroup?.inviteCode}</strong></p>
                  </div>
                  <button
                    onClick={handleShareInModal}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all duration-200 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Icon name={shareCopied ? "Check" : "Share2"} size={13} className={shareCopied ? "text-emerald-500" : ""} />
                    <span>{shareCopied ? "Copied!" : "Share Link"}</span>
                  </button>
                </div>

                {/* Creator Options */}
                {currentGroup?.creatorId === currentUser?.uid && (
                  <div className="bg-muted/10 border border-border rounded-xl p-4 space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Creator Options</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-foreground block">Enable Group Chat</span>
                        <span className="text-[10px] text-muted-foreground">Allow fellowship members to discuss in the group chat tab.</span>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const isEnabled = currentGroup?.isChatEnabled !== false;
                            const groupDocRef = doc(db, 'groups', currentGroup.id);
                            await updateDoc(groupDocRef, { isChatEnabled: !isEnabled });
                          } catch (err) {
                            console.error("Failed to toggle chat:", err);
                          }
                        }}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${currentGroup?.isChatEnabled !== false ? 'bg-accent' : 'bg-muted border border-border'
                          }`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`w-5 h-5 rounded-full shadow-sm bg-white ${currentGroup?.isChatEnabled !== false ? 'ml-auto' : 'ml-0'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="border-t border-border pt-4">
                      <button
                        onClick={handleDeleteGroup}
                        className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Icon name="Trash2" size={14} />
                        <span>End & Discard Group</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Member</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completion</span>
                </div>
                <div className="space-y-2">
                  {sortedMembers.map((member, idx) => {
                    const isMe = member.uid === currentUser?.uid;
                    const completion = currentGroup.totalDays ? Math.round((member.daysCompleted / currentGroup.totalDays) * 100) : 0;
                    return (
                      <div
                        key={member.uid}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all ${isMe
                            ? 'border-accent/30 bg-accent/5 font-semibold'
                            : 'border-border bg-card'
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank Icon or Initials Avatar */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase ${idx === 0
                              ? 'bg-amber-500/10 text-amber-500'
                              : isMe
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                            {idx === 0 ? '👑' : member.displayName.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {member.displayName} {isMe && <span className="text-[10px] font-semibold text-accent">(You)</span>}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Day {member.daysCompleted || 0} of {currentGroup.totalDays}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="text-xs font-extrabold text-foreground min-w-[32px] text-right">
                            {completion}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="flex flex-col h-[45vh] min-h-0 bg-muted/10 border border-border rounded-xl">
                {currentGroup?.isChatEnabled === false ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <Icon name="MessageSquare" size={32} className="text-muted-foreground/60 mb-2" />
                    <p className="text-sm font-bold text-foreground">Discussion Disabled</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      The group creator has disabled the discussion chat for this group.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Messages list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                          <Icon name="MessageSquare" size={24} className="text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">No messages yet. Send a note of encouragement!</p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isMyMsg = msg.senderId === currentUser?.uid;
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col max-w-[80%] ${isMyMsg ? 'ml-auto items-end' : 'items-start'}`}
                            >
                              <span className="text-[10px] font-bold text-muted-foreground mb-0.5 px-1">
                                {msg.senderName}
                              </span>
                              <div className={`p-3 rounded-2xl text-xs ${isMyMsg
                                  ? 'bg-accent text-accent-foreground rounded-tr-none'
                                  : 'bg-card border border-border rounded-tl-none text-foreground'
                                }`}>
                                <p className="leading-relaxed break-words">{msg.text}</p>
                              </div>
                              <span className="text-[9px] text-muted-foreground/60 mt-0.5 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Send Input */}
                    <form
                      onSubmit={handleSendMessage}
                      className="p-3 border-t border-border flex gap-2 bg-card rounded-b-xl flex-shrink-0"
                    >
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-background border border-border rounded-xl px-3.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        type="submit"
                        className="w-8 h-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-all flex-shrink-0"
                      >
                        <Icon name="Send" size={14} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GroupDetailsModal;