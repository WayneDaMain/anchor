-- Anchor D1 Database Schema
-- SQLite schema for users, groups, members, and chat messages

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  fullName TEXT,
  photoURL TEXT,
  timezone TEXT DEFAULT 'UTC',
  emailSettings TEXT, -- JSON string: { morningReminders, streakWarnings, morningHour, warningHour }
  activeGroupId TEXT,
  activePlan TEXT,     -- JSON string: { planId, name, completedChapters, progressStats }
  createdAt TEXT,
  updatedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_activeGroupId ON users(activeGroupId);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  planId TEXT,
  plan TEXT,           -- JSON string: plan details
  isPrivate INTEGER DEFAULT 0, -- 0 for public, 1 for private
  inviteCode TEXT,
  memberCount INTEGER DEFAULT 1,
  creatorId TEXT,
  creatorName TEXT,
  photoURL TEXT,
  isChatEnabled INTEGER DEFAULT 1,
  completedChapters INTEGER DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_groups_inviteCode ON groups(inviteCode);
CREATE INDEX IF NOT EXISTS idx_groups_isPrivate ON groups(isPrivate);

CREATE TABLE IF NOT EXISTS group_members (
  groupId TEXT NOT NULL,
  userId TEXT NOT NULL,
  displayName TEXT,
  photoURL TEXT,
  role TEXT DEFAULT 'member', -- 'creator', 'admin', 'member'
  daysCompleted INTEGER DEFAULT 0,
  completedDates TEXT,    -- JSON string array: ["2026-10-26"]
  completedChapters TEXT, -- JSON string array: ["GEN_1", "GEN_2"]
  currentStreak INTEGER DEFAULT 0,
  longestStreak INTEGER DEFAULT 0,
  joinedAt TEXT,
  updatedAt TEXT,
  PRIMARY KEY (groupId, userId),
  FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_group_members_groupId ON group_members(groupId);
CREATE INDEX IF NOT EXISTS idx_group_members_userId ON group_members(userId);

CREATE TABLE IF NOT EXISTS group_messages (
  id TEXT PRIMARY KEY,
  groupId TEXT NOT NULL,
  senderId TEXT NOT NULL,
  senderName TEXT NOT NULL,
  senderPhotoURL TEXT,
  text TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_group_messages_group_time ON group_messages(groupId, timestamp ASC);
