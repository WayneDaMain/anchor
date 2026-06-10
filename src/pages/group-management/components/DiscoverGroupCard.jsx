import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DiscoverGroupCard = ({ group, onJoinGroup }) => {
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/25 via-accent/15 to-primary/10">
            <span className="text-xl font-heading font-extrabold text-accent/80 tracking-wider">
              {group?.name?.substring(0, 2)?.toUpperCase()}
            </span>
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
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
            <span className="font-semibold text-foreground">{group?.planName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
            <span className="font-semibold text-foreground">{group?.duration}</span>
          </div>
        </div>

        {/* Join button */}
        <Button
          variant="default"
          size="sm"
          fullWidth
          onClick={() => onJoinGroup(group)}
        >
          {group?.isPrivate ? 'Request to Join' : 'Join Group'}
        </Button>
      </div>
    </motion.div>
  );
};

export default DiscoverGroupCard;
