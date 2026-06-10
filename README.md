# Anchor — Bible Reading Tracker

> A structured, social Bible reading companion. Build personal plans, join group fellowships, track progress, and read the Bible — all in one place.

**Part of the [Scriptura](https://biblescriptura.com) ecosystem** · [Folio](https://folio.biblescriptura.com) · [Read Bible](https://web.biblescriptura.com)

---

## ✨ Features

### 📖 Personal Reading Plans
- Multi-step **Plan Creation Wizard** — choose scope (Entire Bible, Old/New Testament, or custom books), duration (3 months → 2 years), and reading style (Canonical, Chronological, or Historical)
- Daily assignments auto-generated from your plan with a clean chapter checklist
- **Rest & Reflection days** handled gracefully — no locked screens on 0-chapter days
- **One reading day per calendar day** — completing today's assignment locks the next day until midnight, preventing skipping ahead
- Full **reading timeline modal** to see every day of your plan at a glance
- Upcoming assignments panel showing the next 3 days

### 👥 Group Reading Plans
- **Group Creation Wizard** — same multi-step flow as personal plans, plus group name, description, and public/private privacy toggle
- Upload a **group photo** during creation or change it later
- Auto-generated **6-character invite code** for private groups
- Join public groups from Discover, or enter an invite code
- **One group at a time** rule enforced — leave before joining a new one
- **Dashboard context switcher** — toggle between Personal and Group reading contexts to log progress for each independently
- Real-time **member leaderboard** sorted by completion
- **Group Discussion Chat** with real-time Firestore sync and unread message badges
- Group Settings tab: creators can **End Group Plan**; members can **Exit Group Plan**

### 📊 Progress Tracking
- Live stats: days completed, chapters read, books finished, current streak
- **Participation calendar** — visual heatmap of every day you read (grey = missed, coloured = participated)
- Overall progress bar on the Progress page
- Milestone achievement chip on the dashboard

### 🙏 Verse of the Day
- Daily verse displayed on the dashboard via the [API.Bible](https://scripture.api.bible/) API

### 📚 Read & Research Integration
- **Read Bible Online** shortcut on today's reading card → opens [web.biblescriptura.com](https://web.biblescriptura.com)
- **Research** nav link → opens [Folio](https://folio.biblescriptura.com) for Bible study and research

### 🎨 Design & UX
- Dark/light theme toggle
- **Poppins** font throughout
- Glassmorphic floating header with pill nav
- Framer Motion page transitions and micro-animations
- Mobile bottom nav + responsive desktop layout
- App footer with ecosystem links (Scriptura & Folio)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 7 |
| Styling | Tailwind CSS 3 + custom CSS |
| Routing | React Router v6 |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| File Storage | Firebase Storage |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React Context (AuthContext) |
| Font | Poppins (Google Fonts) |

---

## 📋 Prerequisites

- Node.js v18 or higher
- A Firebase project with **Auth**, **Firestore**, and **Storage** enabled
- An [API.Bible](https://scripture.api.bible/) API key (for Verse of the Day)

---

## ⚙️ Environment Variables

Create a `.env` file at the project root (`.env` is git-ignored):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_BIBLE_KEY=
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (runs on port 4028)
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
anchor/
├── public/
│   ├── anchor.png          # App logo
│   ├── scriptura.png       # Scriptura ecosystem logo
│   └── folio.png           # Folio ecosystem logo
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Header.jsx          # Floating pill nav header
│   │   │   ├── AppFooter.jsx       # In-app footer with ecosystem links
│   │   │   └── MobileBottomNav.jsx
│   │   └── animations/             # PageTransition, FadeIn, etc.
│   ├── contexts/
│   │   └── AuthContext.jsx         # Auth, plan updates, profile management
│   ├── pages/
│   │   ├── daily-reading-dashboard/  # Main dashboard + today's assignment
│   │   ├── plan-creation-wizard/     # Personal plan setup (5 steps)
│   │   ├── group-creation-wizard/    # Group plan setup (5 steps)
│   │   ├── group-management/         # My Groups, Discover, GroupDetailsModal
│   │   ├── progress-reports/         # Stats, calendar, milestones
│   │   └── settings/                 # Profile, photo, theme
│   ├── utils/
│   │   └── planHelpers.js           # Bible book data + timeline generator
│   ├── firebase.js                  # Firebase app initialisation
│   └── Routes.jsx                   # All app routes
├── .env                             # Local environment variables (git-ignored)
├── tailwind.config.js
└── vite.config.mjs
```

---

## 🔥 Firestore Data Model

```
users/{userId}
  activePlan: { name, scope, totalDays, progressStats, completedChapters, ... }
  activeGroupId: string | null

groups/{groupId}
  name, description, isPrivate, inviteCode, photoURL
  creatorId, plan: { scope, readingStyle, totalDays, ... }
  memberCount, completedChapters, totalChapters

  members/{userId}
    displayName, photoURL, daysCompleted, completedDates, completedChapters

  messages/{messageId}
    senderId, senderName, text, timestamp
```

---

## 🌐 Ecosystem

Anchor is part of the **Scriptura** family of Bible tools:

| Product | Description | URL |
|---|---|---|
| **Anchor** | Bible reading plans & tracking | *this app* |
| **Scriptura** | Full Bible reading experience | [biblescriptura.com](https://biblescriptura.com) |
| **Folio** | Bible research & journaling | [folio.biblescriptura.com](https://folio.biblescriptura.com) |

---

© 2025 Anchor · Built with ❤️ on [Rocket.new](https://rocket.new)
