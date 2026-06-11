import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DiscoverGroupCard = ({ group, onJoinGroup, isJoined }) => {
  const [shareCopied, setShareCopied] = React.useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareText = `Join my Bible reading group "${group?.name}" on Anchor! Invite Code: ${group?.inviteCode}`;
    const shareData = {
      title: 'Join Anchor Bible Reading Group',
      text: shareText,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      {/* Image banner */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 overflow-hidden">
        {group?.photoURL ? (
          <Image
            src={group?.photoURL}
            alt={group?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/40">
            {/* Crisp, Beautifully Faded Large Anchor Logo */}
            <img 
              src="/anchor.png" 
              alt="" 
              className="w-20 h-20 object-contain opacity-25 dark:opacity-15 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

        {/* Private badge */}
        {group?.isPrivate && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-card/90 backdrop-blur-sm text-xs font-bold text-foreground rounded-full">
            Private
          </div>
        )}

        {/* Member count pill */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground">
          {group?.memberCount} members
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-lg text-foreground mb-1.5 truncate">
          {group?.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {group?.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
          <span className="font-semibold text-foreground">{group?.planName}</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="font-semibold text-foreground">{group?.duration}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isJoined ? (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              disabled
              className="opacity-60 bg-muted cursor-not-allowed text-muted-foreground border-border"
            >
              Joined
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              fullWidth
              onClick={() => onJoinGroup(group)}
            >
              {group?.isPrivate ? 'Request to Join' : 'Join Group'}
            </Button>
          )}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all flex-shrink-0"
            title="Share group code"
          >
            <Icon name={shareCopied ? "Check" : "Share2"} size={15} className={shareCopied ? "text-emerald-500" : ""} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverGroupCard;
