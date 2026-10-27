/**
 * Cloudflare D1 Database API Client for Anchor
 * Replaces direct Firebase Firestore SDK calls with edge D1 SQLite API.
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://anchor-email-worker.emaxstone12.workers.dev';

export const d1Api = {
  // ── 1. Users ──
  getUser: async (userId) => {
    try {
      const res = await fetch(`${WORKER_URL}/api/users/${encodeURIComponent(userId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn('d1Api.getUser error:', err.message);
      return null;
    }
  },

  upsertUser: async (userId, data) => {
    const res = await fetch(`${WORKER_URL}/api/users/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`upsertUser failed: ${await res.text()}`);
    return await res.json();
  },

  deleteUser: async (userId) => {
    const res = await fetch(`${WORKER_URL}/api/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`deleteUser failed: ${await res.text()}`);
    return await res.json();
  },

  // ── 2. Groups ──
  getPublicGroups: async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/groups`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error('d1Api.getPublicGroups error:', err);
      return [];
    }
  },

  getGroupByInviteCode: async (code) => {
    const res = await fetch(`${WORKER_URL}/api/groups/by-code/${encodeURIComponent(code.trim().toUpperCase())}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  getGroup: async (groupId) => {
    if (!groupId) return null;
    try {
      const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn(`d1Api.getGroup error for ${groupId}:`, err.message);
      return null;
    }
  },

  createGroup: async (data) => {
    const res = await fetch(`${WORKER_URL}/api/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`createGroup failed: ${await res.text()}`);
    return await res.json();
  },

  updateGroup: async (groupId, data) => {
    const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`updateGroup failed: ${await res.text()}`);
    return await res.json();
  },

  deleteGroup: async (groupId) => {
    const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`deleteGroup failed: ${await res.text()}`);
    return await res.json();
  },

  // ── 3. Group Members ──
  getGroupMembers: async (groupId) => {
    if (!groupId) return [];
    try {
      const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/members`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error(`d1Api.getGroupMembers error for ${groupId}:`, err);
      return [];
    }
  },

  getMemberProgress: async (groupId, userId) => {
    if (!groupId || !userId) return null;
    try {
      const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.warn(`d1Api.getMemberProgress error:`, err.message);
      return null;
    }
  },

  updateMemberProgress: async (groupId, userId, data) => {
    const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`updateMemberProgress failed: ${await res.text()}`);
    return await res.json();
  },

  joinGroup: async (groupId, userId, data = {}) => {
    const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });
    if (!res.ok) throw new Error(`joinGroup failed: ${await res.text()}`);
    return await res.json();
  },

  leaveGroup: async (groupId, userId) => {
    const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error(`leaveGroup failed: ${await res.text()}`);
    return await res.json();
  },

  // ── 4. Group Chat Messages ──
  getGroupMessages: async (groupId, after = null) => {
    if (!groupId) return [];
    try {
      const url = new URL(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/messages`);
      if (after) url.searchParams.set('after', after);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error(`d1Api.getGroupMessages error:`, err);
      return [];
    }
  },

  sendGroupMessage: async (groupId, data) => {
    const res = await fetch(`${WORKER_URL}/api/groups/${encodeURIComponent(groupId)}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`sendGroupMessage failed: ${await res.text()}`);
    return await res.json();
  }
};

export default d1Api;
