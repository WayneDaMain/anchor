import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ type, onAction }) => {
  const content = {
    'my-groups': {
      icon: 'Users',
      title: 'No Groups Yet',
      description: 'Join or create a group to start reading together with others.',
      actionLabel: 'Create Group',
      actionIcon: 'Plus'
    },
    'discover': {
      icon: 'Search',
      title: 'No Groups Found',
      description: 'Try adjusting your search or filters to find groups.',
      actionLabel: 'Clear Filters',
      actionIcon: 'X'
    }
  };

  const config = content?.[type] || content?.['my-groups'];

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
        <Icon name={config?.icon} size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2 text-center">
        {config?.title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground text-center mb-6 md:mb-8 max-w-md">
        {config?.description}
      </p>
      {onAction && (
        <Button
          variant="default"
          iconName={config?.actionIcon}
          iconPosition="left"
          onClick={onAction}
        >
          {config?.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;