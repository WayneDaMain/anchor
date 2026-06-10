import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScopeSelection = ({ selectedScope, onScopeChange, selectedBooks, onBookToggle }) => {
  const scopeOptions = [
    {
      id: 'entire',
      title: 'Entire Bible',
      description: 'Read through all 66 books from Genesis to Revelation',
      icon: 'BookOpen',
      books: 66
    },
    {
      id: 'old-testament',
      title: 'Old Testament',
      description: 'Focus on the 39 books from Genesis to Malachi',
      icon: 'Scroll',
      books: 39
    },
    {
      id: 'new-testament',
      title: 'New Testament',
      description: 'Study the 27 books from Matthew to Revelation',
      icon: 'Cross',
      books: 27
    },
    {
      id: 'custom',
      title: 'Custom Selection',
      description: 'Choose specific books for your reading plan',
      icon: 'ListChecks',
      books: 'Variable'
    }
  ];

  const bibleBooks = {
    oldTestament: [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
      'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
      'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
      'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
      'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
      'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
      'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
    ],
    newTestament: [
      'Matthew', 'Mark', 'Luke', 'John', 'Acts',
      'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
      'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
      '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
      '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
      'Jude', 'Revelation'
    ]
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
          Choose Your Reading Scope
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Select which portion of the Bible you'd like to read through
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {scopeOptions?.map((option) => (
          <button
            key={option?.id}
            onClick={() => onScopeChange(option?.id)}
            className={`p-6 md:p-8 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.01] active:scale-[0.99] ${
              selectedScope === option?.id
                ? 'border-accent bg-accent/5' :'border-border bg-card hover:border-accent/40 shadow-sm'
            }`}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-heading font-extrabold text-foreground mb-1.5">
                {option?.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 leading-relaxed">
                {option?.description}
              </p>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 text-xs font-bold text-accent">
                {option?.books} {typeof option?.books === 'number' ? 'books' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>
      {selectedScope === 'custom' && (
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
              Select Books
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Choose the specific books you want to include in your reading plan
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base md:text-lg font-heading font-medium text-foreground">
                  Old Testament
                </h4>
                <span className="caption text-muted-foreground">
                  {selectedBooks?.filter(book => bibleBooks?.oldTestament?.includes(book))?.length} of {bibleBooks?.oldTestament?.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bibleBooks?.oldTestament?.map((book) => (
                  <Checkbox
                    key={book}
                    label={book}
                    checked={selectedBooks?.includes(book)}
                    onChange={(e) => onBookToggle(book, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base md:text-lg font-heading font-medium text-foreground">
                  New Testament
                </h4>
                <span className="caption text-muted-foreground">
                  {selectedBooks?.filter(book => bibleBooks?.newTestament?.includes(book))?.length} of {bibleBooks?.newTestament?.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bibleBooks?.newTestament?.map((book) => (
                  <Checkbox
                    key={book}
                    label={book}
                    checked={selectedBooks?.includes(book)}
                    onChange={(e) => onBookToggle(book, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScopeSelection;