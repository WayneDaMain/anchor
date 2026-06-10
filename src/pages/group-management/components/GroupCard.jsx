import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const GroupCard = ({ group, onViewDetails, onLeaveGroup }) => {
  const progressPercentage = group?.totalChapters
    ? Math.round((group?.completedChapters / group?.totalChapters) * 100)
    : 0;

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
        {group?.image ? (
          <Image
            src={group?.image}
            alt={group?.imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="Users" size={36} className="text-accent/40" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

        {/* Admin badge */}
        {group?.isAdmin && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
            Admin
          </div>
        )}

        {/* Member count pill */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
          <Icon name="Users" size={12} className="text-accent" />
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
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
            <Icon name="BookOpen" size={12} className="text-accent" />
            <span className="font-medium text-foreground">{group?.planName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
            <Icon name="Calendar" size={12} className="text-primary" />
            <span className="font-medium text-foreground">{group?.duration}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-bold text-accent">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onViewDetails(group)}
          >
            View Details
          </Button>
          {!group?.isAdmin && (
            <button
              onClick={() => onLeaveGroup(group?.id)}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-gentle flex-shrink-0"
              title="Leave group"
            >
              <Icon name="LogOut" size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;
