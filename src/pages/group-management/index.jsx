import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import FadeIn from '../../components/animations/FadeIn';
import StaggerContainer from '../../components/animations/StaggerContainer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import AppFooter from '../../components/ui/AppFooter';
import GroupCard from './components/GroupCard';
import DiscoverGroupCard from './components/DiscoverGroupCard';
import GroupDetailsModal from './components/GroupDetailsModal';
import CreateGroupModal from './components/CreateGroupModal';
import JoinByCodeModal from './components/JoinByCodeModal';
import EmptyState from './components/EmptyState';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  deleteDoc, 
  increment,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase';

const GroupManagement = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('my-groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [myGroups, setMyGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      // Fetch discover groups (all public groups)
      const q = query(collection(db, 'groups'), where('isPrivate', '==', false));
      const snap = await getDocs(q);
      const publicGroups = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDiscoverGroups(publicGroups);

      // Fetch active group
      if (currentUser?.activeGroupId) {
        const activeDoc = await getDoc(doc(db, 'groups', currentUser.activeGroupId));
        if (activeDoc.exists()) {
          const memberDoc = await getDoc(doc(db, 'groups', currentUser.activeGroupId, 'members', currentUser.uid));
          const memberData = memberDoc.exists() ? memberDoc.data() : { daysCompleted: 0 };
          setMyGroups([{
            id: activeDoc.id,
            ...activeDoc.data(),
            completedChapters: memberData.daysCompleted * 3, // display stats
            memberProgress: memberData
          }]);
        } else {
          setMyGroups([]);
        }
      } else {
        setMyGroups([]);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [currentUser?.activeGroupId]);

  const planFilterOptions = [
    { value: '', label: 'All Plans' },
    { value: 'entire', label: 'Entire Bible' },
    { value: 'old-testament', label: 'Old Testament' },
    { value: 'new-testament', label: 'New Testament' }
  ];

  const handleViewDetails = (group) => {
    setSelectedGroup(group);
    setShowDetailsModal(true);
  };

  const handleLeaveGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await deleteDoc(doc(db, 'groups', groupId, 'members', currentUser.uid));
        await updateDoc(doc(db, 'groups', groupId), {
          memberCount: increment(-1)
        });
        await updateUserProfile({ activeGroupId: null });
      } catch (err) {
        console.error('Error leaving group:', err);
        alert('Failed to leave group. Please try again.');
      }
    }
  };

  const handleJoinGroup = async (group) => {
    if (currentUser?.activeGroupId) {
      alert('You can only be in one group at a time. Please leave your current group first.');
      return;
    }

    if (group?.isPrivate) {
      setShowJoinCodeModal(true);
      return;
    }

    try {
      const memberRef = doc(db, 'groups', group.id, 'members', currentUser.uid);
      await setDoc(memberRef, {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email.split('@')[0],
        photoURL: currentUser.photoURL || null,
        daysCompleted: 0,
        completedDates: [],
        joinedAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'groups', group.id), {
        memberCount: increment(1)
      });

      await updateUserProfile({ activeGroupId: group.id });
    } catch (err) {
      console.error('Error joining group:', err);
      alert('Failed to join group. Please try again.');
    }
  };

  const handleJoinByCode = async (code) => {
    if (currentUser?.activeGroupId) {
      alert('You can only be in one group at a time. Please leave your current group first.');
      return;
    }

    try {
      const q = query(collection(db, 'groups'), where('inviteCode', '==', code.trim().toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert('Invalid invite code. Please check and try again.');
        return;
      }

      const groupDoc = snap.docs[0];
      const group = { id: groupDoc.id, ...groupDoc.data() };

      const memberRef = doc(db, 'groups', group.id, 'members', currentUser.uid);
      await setDoc(memberRef, {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email.split('@')[0],
        photoURL: currentUser.photoURL || null,
        daysCompleted: 0,
        completedDates: [],
        joinedAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'groups', group.id), {
        memberCount: increment(1)
      });

      await updateUserProfile({ activeGroupId: group.id });
      setShowJoinCodeModal(false);
    } catch (err) {
      console.error('Error joining by code:', err);
      alert('Failed to join group. Please try again.');
    }
  };

  const filteredMyGroups = myGroups?.filter((group) =>
    group?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    group?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const filteredDiscoverGroups = discoverGroups?.filter((group) => {
    const matchesSearch = group?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      group?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = !filterPlan || group?.planName?.toLowerCase()?.includes(filterPlan?.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <PageTransition>
      <Header />
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <FadeIn delay={0.1}>
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Group Management
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Join reading communities and track collective progress together
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-center space-x-2 border-b border-border">
                <button
                  onClick={() => setActiveTab('my-groups')}
                  className={`px-4 py-3 font-medium transition-gentle relative ${
                  activeTab === 'my-groups' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`
                  }>
                  My Groups
                  {activeTab === 'my-groups' &&
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  }
                </button>
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`px-4 py-3 font-medium transition-gentle relative ${
                  activeTab === 'discover' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`
                  }>
                  Discover
                  {activeTab === 'discover' &&
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  }
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Key"
                  onClick={() => setShowJoinCodeModal(true)}
                  className="flex-shrink-0">
                  <span className="hidden sm:inline">Join by Code</span>
                  <span className="sm:hidden">Code</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => {
                    if (currentUser?.activeGroupId) {
                      alert('You can only be in one group at a time. Please leave your current group first.');
                    } else {
                      navigate('/group-creation-wizard');
                    }
                  }}>
                  <span className="hidden sm:inline">Create Group</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon
                      name="Search"
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full pl-10 pr-4 py-2 md:py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
                {activeTab === 'discover' && (
                  <div className="w-full sm:w-48">
                    <Select
                      options={planFilterOptions}
                      value={filterPlan}
                      onChange={(e) => setFilterPlan(e?.target?.value)}
                      placeholder="Filter by plan"
                    />
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {activeTab === 'my-groups' && (
            <>
              {filteredMyGroups?.length > 0 ? (
                <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredMyGroups?.map((group) => (
                    <GroupCard
                      key={group?.id}
                      group={group}
                      onViewDetails={handleViewDetails}
                      onLeaveGroup={handleLeaveGroup}
                    />
                  ))}
                </StaggerContainer>
              ) : (
                <FadeIn delay={0.4}>
                  <EmptyState
                    title="No Groups Yet"
                    description="Join or create a group to start reading with others"
                    actionText="Create Your First Group"
                    onAction={() => {
                      if (currentUser?.activeGroupId) {
                        alert('You can only be in one group at a time.');
                      } else {
                        navigate('/group-creation-wizard');
                      }
                    }}
                  />
                </FadeIn>
              )}
            </>
          )}

          {activeTab === 'discover' && (
            <>
              {filteredDiscoverGroups?.length > 0 ? (
                <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredDiscoverGroups?.map((group) => (
                    <DiscoverGroupCard
                      key={group?.id}
                      group={group}
                      onJoinGroup={handleJoinGroup}
                    />
                  ))}
                </StaggerContainer>
              ) : (
                <FadeIn delay={0.4}>
                  <EmptyState
                    title="No Groups Found"
                    description="Try adjusting your search or filters"
                    actionText="Clear Filters"
                    onAction={() => {
                      setSearchQuery('');
                      setFilterPlan('');
                    }}
                  />
                </FadeIn>
              )}
            </>
          )}
        </div>
      </div>

      {showDetailsModal && selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          onClose={() => setShowDetailsModal(false)}
        />
      )}



      {showJoinCodeModal && (
        <JoinByCodeModal
          onClose={() => setShowJoinCodeModal(false)}
          onJoin={handleJoinByCode}
        />
      )}

      <AppFooter />
      <MobileBottomNav />
    </PageTransition>
  );
};

export default GroupManagement;