import React from 'react';
import Icon from '../../../components/AppIcon';

const StyleSelection = ({ selectedStyle, onStyleChange }) => {
  const styleOptions = [
    {
      id: 'sequential',
      title: 'Sequential Reading',
      description: 'Read books in order from beginning to end, completing one book before moving to the next',
      icon: 'ArrowRight',
      example: 'Genesis → Exodus → Leviticus → Numbers...',
      benefits: ['Natural narrative flow', 'Complete book context', 'Traditional approach']
    },
    {
      id: 'balanced',
      title: 'Balanced Reading',
      description: 'Alternate between Old Testament and New Testament books for varied daily reading',
      icon: 'Scale',
      example: 'Genesis + Matthew → Exodus + Mark → Leviticus + Luke...',
      benefits: ['Diverse content daily', 'Historical and gospel balance', 'Engaging variety']
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
          Choose Your Reading Style
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Select how you'd like to progress through your reading plan
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {styleOptions?.map((option) => (
          <button
            key={option?.id}
            onClick={() => onStyleChange(option?.id)}
            className={`p-6 md:p-8 rounded-lg border-2 transition-gentle text-left ${
              selectedStyle === option?.id
                ? 'border-accent bg-accent/5' :'border-border bg-card hover:border-accent/50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedStyle === option?.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon name={option?.icon} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
                  {option?.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-3">
                  {option?.description}
                </p>
                <div className="bg-muted/50 rounded-md p-3 mb-3">
                  <p className="caption text-foreground">
                    <strong>Example:</strong> {option?.example}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option?.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-background rounded-full px-3 py-1">
                      <Icon name="Check" size={14} className="text-accent" />
                      <span className="caption text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base text-foreground mb-2">
              <strong>Tip:</strong> Your reading style choice affects daily assignments but not the overall content.
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              Sequential reading provides continuous narrative flow, while balanced reading offers daily variety between Old and New Testament content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelection;