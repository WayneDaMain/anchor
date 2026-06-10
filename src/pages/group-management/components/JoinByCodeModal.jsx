import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const JoinByCodeModal = ({ onClose, onJoin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!code?.trim()) {
      setError('Please enter a group code');
      return;
    }
    onJoin(code);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-card rounded-lg shadow-lg max-w-md w-full"
          onClick={(e) => e?.stopPropagation()}
        >
          <div className="border-b border-border p-4 md:p-6 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Join by Invitation Code
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-gentle"
              aria-label="Close modal"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Enter the invitation code shared by the group admin to join a private group.
              </p>
            </div>

            <Input
              label="Invitation Code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => {
                setCode(e?.target?.value?.toUpperCase());
                setError('');
              }}
              error={error}
              required
            />

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                fullWidth
                iconName="UserPlus"
                iconPosition="left"
              >
                Join Group
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JoinByCodeModal;