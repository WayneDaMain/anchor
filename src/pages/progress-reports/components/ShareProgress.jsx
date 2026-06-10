import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareProgress = ({ shareData }) => {
  const [shareFormat, setShareFormat] = useState('image');
  const [privacySetting, setPrivacySetting] = useState('public');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const { planName, completionPercentage, booksCompleted, daysActive } = shareData;

  const formats = [
    { id: 'image', label: 'Image', icon: 'Image' },
    { id: 'link', label: 'Link', icon: 'Link' },
    { id: 'text', label: 'Text', icon: 'FileText' }
  ];

  const privacyOptions = [
    { id: 'public', label: 'Public', icon: 'Globe' },
    { id: 'friends', label: 'Friends Only', icon: 'Users' },
    { id: 'private', label: 'Private', icon: 'Lock' }
  ];

  const handleShare = (platform) => {
    console.log(`Sharing to ${platform} with format ${shareFormat} and privacy ${privacySetting}`);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://anchor.app/progress/share/abc123');
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Share Your Progress
        </h2>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Share2" size={20} color="var(--color-accent)" />
        </div>
      </div>
      <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
        <div className="text-center space-y-2 md:space-y-3">
          <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
            {planName}
          </h3>
          <div className="flex items-center justify-center space-x-4 md:space-x-6">
            <div className="text-center">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
                {completionPercentage}%
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Complete</p>
            </div>
            <div className="w-px h-12 md:h-16 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                {booksCompleted}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Books</p>
            </div>
            <div className="w-px h-12 md:h-16 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                {daysActive}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Days</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">
            Share Format
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {formats?.map((format) => (
              <button
                key={format?.id}
                onClick={() => setShareFormat(format?.id)}
                className={`p-3 md:p-4 rounded-lg border transition-gentle ${
                  shareFormat === format?.id
                    ? 'border-accent bg-accent/10 text-accent' :'border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={format?.icon} size={20} className="mx-auto mb-1 md:mb-2" />
                <p className="text-xs md:text-sm font-medium">{format?.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">
            Privacy Setting
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {privacyOptions?.map((option) => (
              <button
                key={option?.id}
                onClick={() => setPrivacySetting(option?.id)}
                className={`p-3 md:p-4 rounded-lg border transition-gentle ${
                  privacySetting === option?.id
                    ? 'border-accent bg-accent/10 text-accent' :'border-border bg-background text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={option?.icon} size={20} className="mx-auto mb-1 md:mb-2" />
                <p className="text-xs md:text-sm font-medium text-center">{option?.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <Button
            variant="outline"
            iconName="Facebook"
            iconPosition="left"
            onClick={() => handleShare('facebook')}
            className="w-full"
          >
            Facebook
          </Button>
          <Button
            variant="outline"
            iconName="Twitter"
            iconPosition="left"
            onClick={() => handleShare('twitter')}
            className="w-full"
          >
            Twitter
          </Button>
          <Button
            variant="outline"
            iconName="Instagram"
            iconPosition="left"
            onClick={() => handleShare('instagram')}
            className="w-full"
          >
            Instagram
          </Button>
          <Button
            variant="outline"
            iconName="Mail"
            iconPosition="left"
            onClick={() => handleShare('email')}
            className="w-full"
          >
            Email
          </Button>
        </div>

        <Button
          variant="default"
          iconName="Copy"
          iconPosition="left"
          onClick={handleCopyLink}
          fullWidth
        >
          Copy Shareable Link
        </Button>

        {showCopiedMessage && (
          <div className="p-3 md:p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <p className="text-sm md:text-base text-success font-medium">
                Link copied to clipboard!
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 md:mt-8 p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-2 md:space-x-3">
          <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-muted-foreground">
            Share your progress to encourage others in their reading journey. Your consistency can inspire fellow readers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareProgress;