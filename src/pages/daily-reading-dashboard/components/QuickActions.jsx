import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      label: 'View Progress',
      icon: 'TrendingUp',
      colorClass: 'text-accent bg-accent/10 group-hover:bg-accent/20',
      onClick: () => navigate('/progress-reports')
    },
    {
      id: 2,
      label: 'Join Group',
      icon: 'Users',
      colorClass: 'text-accent bg-accent/10 group-hover:bg-accent/20',
      onClick: () => navigate('/group-management')
    },
    {
      id: 3,
      label: 'Read Bible',
      icon: 'BookOpen',
      colorClass: 'text-accent bg-accent/10 group-hover:bg-accent/20',
      onClick: () => window.open('https://web.biblescriptura.com', '_blank', 'noopener,noreferrer')
    },
    {
      id: 4,
      label: 'Settings',
      icon: 'Settings',
      colorClass: 'text-accent bg-accent/10 group-hover:bg-accent/20',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
      <h2 className="text-lg font-heading font-bold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-4 gap-2.5">
        {actions?.map((action) => (
          <motion.button
            key={action?.id}
            onClick={action?.onClick}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/30 hover:border-primary/30 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-2 transition-colors duration-200 ${action.colorClass}`}>
              <Icon name={action?.icon} size={18} />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-foreground tracking-tight leading-tight">
              {action?.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;