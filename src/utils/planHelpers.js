export const BIBLE_BOOKS_DATA = [
  // Old Testament
  { name: 'Genesis', chapters: 50, isOt: true },
  { name: 'Exodus', chapters: 40, isOt: true },
  { name: 'Leviticus', chapters: 27, isOt: true },
  { name: 'Numbers', chapters: 36, isOt: true },
  { name: 'Deuteronomy', chapters: 34, isOt: true },
  { name: 'Joshua', chapters: 24, isOt: true },
  { name: 'Judges', chapters: 21, isOt: true },
  { name: 'Ruth', chapters: 4, isOt: true },
  { name: '1 Samuel', chapters: 31, isOt: true },
  { name: '2 Samuel', chapters: 24, isOt: true },
  { name: '1 Kings', chapters: 22, isOt: true },
  { name: '2 Kings', chapters: 25, isOt: true },
  { name: '1 Chronicles', chapters: 29, isOt: true },
  { name: '2 Chronicles', chapters: 36, isOt: true },
  { name: 'Ezra', chapters: 10, isOt: true },
  { name: 'Nehemiah', chapters: 13, isOt: true },
  { name: 'Esther', chapters: 10, isOt: true },
  { name: 'Job', chapters: 42, isOt: true },
  { name: 'Psalms', chapters: 150, isOt: true },
  { name: 'Proverbs', chapters: 31, isOt: true },
  { name: 'Ecclesiastes', chapters: 12, isOt: true },
  { name: 'Song of Solomon', chapters: 8, isOt: true },
  { name: 'Isaiah', chapters: 66, isOt: true },
  { name: 'Jeremiah', chapters: 52, isOt: true },
  { name: 'Lamentations', chapters: 5, isOt: true },
  { name: 'Ezekiel', chapters: 48, isOt: true },
  { name: 'Daniel', chapters: 12, isOt: true },
  { name: 'Hosea', chapters: 14, isOt: true },
  { name: 'Joel', chapters: 3, isOt: true },
  { name: 'Amos', chapters: 9, isOt: true },
  { name: 'Obadiah', chapters: 1, isOt: true },
  { name: 'Jonah', chapters: 4, isOt: true },
  { name: 'Micah', chapters: 7, isOt: true },
  { name: 'Nahum', chapters: 3, isOt: true },
  { name: 'Habakkuk', chapters: 3, isOt: true },
  { name: 'Zephaniah', chapters: 3, isOt: true },
  { name: 'Haggai', chapters: 2, isOt: true },
  { name: 'Zechariah', chapters: 14, isOt: true },
  { name: 'Malachi', chapters: 4, isOt: true },
  // New Testament
  { name: 'Matthew', chapters: 28, isOt: false },
  { name: 'Mark', chapters: 16, isOt: false },
  { name: 'Luke', chapters: 24, isOt: false },
  { name: 'John', chapters: 21, isOt: false },
  { name: 'Acts', chapters: 28, isOt: false },
  { name: 'Romans', chapters: 16, isOt: false },
  { name: '1 Corinthians', chapters: 16, isOt: false },
  { name: '2 Corinthians', chapters: 13, isOt: false },
  { name: 'Galatians', chapters: 6, isOt: false },
  { name: 'Ephesians', chapters: 6, isOt: false },
  { name: 'Philippians', chapters: 4, isOt: false },
  { name: 'Colossians', chapters: 4, isOt: false },
  { name: '1 Thessalonians', chapters: 5, isOt: false },
  { name: '2 Thessalonians', chapters: 3, isOt: false },
  { name: '1 Timothy', chapters: 6, isOt: false },
  { name: '2 Timothy', chapters: 4, isOt: false },
  { name: 'Titus', chapters: 3, isOt: false },
  { name: 'Philemon', chapters: 1, isOt: false },
  { name: 'Hebrews', chapters: 13, isOt: false },
  { name: 'James', chapters: 5, isOt: false },
  { name: '1 Peter', chapters: 5, isOt: false },
  { name: '2 Peter', chapters: 3, isOt: false },
  { name: '1 John', chapters: 5, isOt: false },
  { name: '2 John', chapters: 1, isOt: false },
  { name: '3 John', chapters: 1, isOt: false },
  { name: 'Jude', chapters: 1, isOt: false },
  { name: 'Revelation', chapters: 22, isOt: false }
];

export const generateDailyTimeline = (plan) => {
  if (!plan) return [];
  const scope = (plan.scope || '').toLowerCase();
  
  // Filter books based on plan scope
  let activeBooks = [];
  if (scope.includes('entire')) {
    activeBooks = BIBLE_BOOKS_DATA;
  } else if (scope.includes('old')) {
    activeBooks = BIBLE_BOOKS_DATA.filter(b => b.isOt);
  } else if (scope.includes('new')) {
    activeBooks = BIBLE_BOOKS_DATA.filter(b => !b.isOt);
  } else if (scope.includes('custom') && plan.selectedBooks) {
    activeBooks = BIBLE_BOOKS_DATA.filter(b => plan.selectedBooks.includes(b.name));
  } else {
    activeBooks = BIBLE_BOOKS_DATA;
  }

  // Create flat list of chapters
  const allChapters = [];
  activeBooks.forEach(book => {
    for (let i = 1; i <= book.chapters; i++) {
      allChapters.push({ book: book.name, chapter: i });
    }
  });

  const totalDays = plan.totalDays || 365;
  const days = [];
  const baseDate = new Date(plan.startDate || new Date());

  for (let d = 0; d < totalDays; d++) {
    const startIdx = Math.floor(d * (allChapters.length / totalDays));
    const endIdx = Math.floor((d + 1) * (allChapters.length / totalDays));
    const dayChapters = allChapters.slice(startIdx, endIdx);

    // Group chapters by book for elegant display
    // e.g. [{ book: 'Genesis', chapters: [1, 2, 3] }]
    const grouped = [];
    dayChapters.forEach(ch => {
      let group = grouped.find(g => g.book === ch.book);
      if (!group) {
        group = { book: ch.book, chapters: [] };
        grouped.push(group);
      }
      group.chapters.push(ch.chapter);
    });

    // Format assignment text
    // e.g. "Genesis 1 - 3" or "Genesis 50, Exodus 1"
    const textAssignments = grouped.map(g => {
      if (g.chapters.length === 1) {
        return `${g.book} ${g.chapters[0]}`;
      }
      const min = Math.min(...g.chapters);
      const max = Math.max(...g.chapters);
      return `${g.book} ${min} - ${max}`;
    });

    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + d);

    days.push({
      dayNumber: d + 1,
      date: dayDate,
      assignmentsText: textAssignments.join(', '),
      totalChapters: dayChapters.length,
      chaptersList: dayChapters,
      groupedAssignments: grouped
    });
  }

  return days;
};

export const calculateStreak = (completedDates, todayStr, yesterdayStr) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
  const mostRecent = uniqueDates[0];

  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const d1 = new Date(uniqueDates[i] + 'T12:00:00');
    const d2 = new Date(uniqueDates[i + 1] + 'T12:00:00');
    const diffTime = d1 - d2;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else if (diffDays === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
};

export const MILESTONES = [
  { id: 'first_plan', name: 'Architect', description: 'Created your first reading plan', type: 'plan', value: 1 },
  { id: 'first_chapter', name: 'First Steps', description: 'Read your first chapter', type: 'chapters', value: 1 },
  { id: 'first_group', name: 'Social Reader', description: 'Joined your first reading group', type: 'group', value: 1 },
  { id: 'streak_3', name: 'Steadfast Start', description: 'Maintain a 3-day reading streak', type: 'streak', value: 3 },
  { id: 'streak_7', name: 'Faithful Habit', description: 'Maintain a 7-day reading streak', type: 'streak', value: 7 },
  { id: 'book_1', name: 'Book Finisher', description: 'Completed your first full book of the Bible', type: 'books', value: 1 },
  { id: 'book_5', name: 'Pentateuch Pilgrim', description: 'Completed reading 5 books of the Bible', type: 'books', value: 5 },
  { id: 'chapters_50', name: 'Devoted Reader', description: 'Read 50 chapters of the Word', type: 'chapters', value: 50 },
  { id: 'streak_30', name: 'Enduring Light', description: 'Maintain a 30-day reading streak', type: 'streak', value: 30 },
  { id: 'chapters_100', name: 'Keeper of Wisdom', description: 'Read 100 chapters of the Word', type: 'chapters', value: 100 },
  { id: 'book_33', name: 'Halfway Mark', description: 'Completed reading 33 books of the Bible', type: 'books', value: 33 },
  { id: 'streak_100', name: 'On Fire', description: 'Maintain a 100-day reading streak', type: 'streak', value: 100 },
  { id: 'book_all', name: 'The Living Word', description: 'Completed reading all 66 books of the Bible', type: 'books', value: 66 },
  { id: 'plan_complete', name: 'Steadfast Heart', description: 'Complete your reading plan', type: 'complete', value: 100 }
];

export const getUpcomingMilestone = (chaptersRead, currentStreak, booksCompleted, activeGroupId, completionPercentage) => {
  const hasPlan = chaptersRead > 0 || currentStreak > 0 || booksCompleted > 0 || completionPercentage > 0;
  
  for (const m of MILESTONES) {
    if (m.id === 'first_plan' && !hasPlan) {
      return { name: m.description, remaining: 1, unit: 'plan' };
    }
    if (m.id === 'first_group' && !activeGroupId) {
      return { name: m.description, remaining: 1, unit: 'group' };
    }
    if (m.type === 'chapters' && chaptersRead < m.value) {
      return { name: m.description, remaining: m.value - chaptersRead, unit: 'chapters' };
    }
    if (m.type === 'streak' && currentStreak < m.value) {
      return { name: m.description, remaining: m.value - currentStreak, unit: 'days' };
    }
    if (m.type === 'books' && booksCompleted < m.value) {
      return { name: m.description, remaining: m.value - booksCompleted, unit: 'books' };
    }
    if (m.type === 'complete' && completionPercentage < m.value) {
      return { name: m.description, remaining: m.value - completionPercentage, unit: '%' };
    }
  }
  return { name: 'All Milestones Achieved!', remaining: 0, unit: '' };
};

export const getLatestAchievedMilestone = (chaptersRead, currentStreak, booksCompleted, activeGroupId, completionPercentage, planStartDate) => {
  let latest = null;

  for (const m of MILESTONES) {
    let achieved = false;
    if (m.id === 'first_plan') {
      achieved = true;
    } else if (m.id === 'first_group' && activeGroupId) {
      achieved = true;
    } else if (m.type === 'chapters' && chaptersRead >= m.value) {
      achieved = true;
    } else if (m.type === 'streak' && currentStreak >= m.value) {
      achieved = true;
    } else if (m.type === 'books' && booksCompleted >= m.value) {
      achieved = true;
    } else if (m.type === 'complete' && completionPercentage >= m.value) {
      achieved = true;
    }

    if (achieved) {
      latest = m;
    }
  }

  if (latest) {
    return {
      title: latest.name,
      description: latest.description,
      date: planStartDate ? new Date(planStartDate) : new Date()
    };
  }
  return null;
};
