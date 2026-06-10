import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MilestoneCard = ({ milestone }) => {
  if (!milestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-accent/5 border border-accent/10 rounded-lg p-1.5 px-3 flex items-center gap-2 max-w-max"
    >
      <Icon name="Award" size={13} className="text-accent flex-shrink-0" />
      <p className="text-[11px] font-medium text-foreground leading-none">
        <span className="font-bold text-accent">{milestone?.title}</span>: {milestone?.description}
      </p>
    </motion.div>
  );
};

export default MilestoneCard;

