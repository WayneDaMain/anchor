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
