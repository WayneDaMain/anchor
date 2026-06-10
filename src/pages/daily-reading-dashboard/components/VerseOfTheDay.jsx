import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

// Highly encouraging Bible verses to rotate through daily as fallbacks or offline defaults
const CURATED_VERSES = [
  {
    text: "For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6"
  },
  {
    text: "Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    reference: "Isaiah 41:10"
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28"
  },
  {
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    reference: "Psalm 23:1-3"
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31"
  },
  {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:6-7"
  },
  {
    text: "God is our refuge and strength, an ever-present help in trouble.",
    reference: "Psalm 46:1"
  }
];

const VerseOfTheDay = () => {
  // Select a default verse based on the day of the month
  const dayOfMonth = new Date().getDate();
  const defaultVerse = CURATED_VERSES[dayOfMonth % CURATED_VERSES.length];

  const [verse, setVerse] = useState(defaultVerse);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchVotd = async () => {
      try {
        // CORS-compliant Our Manna daily verse endpoint
        const res = await fetch('https://beta.ourmanna.com/api/v1/get/?format=json');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();

        if (active && data?.verse?.details) {
          const details = data.verse.details;
          setVerse({
            text: details.text.trim(),
            reference: details.reference
          });
        }
      } catch (err) {
        console.warn('VOTD API fetch failed, using curated backup:', err);
        // Fallback already loaded by default state
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchVotd();
    return () => { active = false; };
  }, []);

  return (
    <div className="bg-muted/30 border border-border/60 rounded-xl px-4 py-3 flex items-start gap-3 relative overflow-hidden">
      {/* Subtle accent line on left */}
      <div className="w-0.5 self-stretch bg-accent/40 rounded-full flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Verse of the Day</span>
          {loading && (
            <span className="w-1 h-1 rounded-full bg-accent/50 animate-ping" />
          )}
        </div>
        <p className="text-normal font-medium text-foreground leading-relaxed mb-1 line-clamp-2">
          "{verse.text}"
        </p>
        <cite className="text-[10px] font-bold text-muted-foreground not-italic uppercase tracking-wider">
          — {verse.reference}
        </cite>
      </div>
    </div>
  );
};

export default VerseOfTheDay;
