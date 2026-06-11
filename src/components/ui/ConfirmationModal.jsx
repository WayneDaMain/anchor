import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';

const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // 'info' | 'danger' | 'warning' | 'success'
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  // Theme configurations based on type
  const theme = {
    danger: {
      icon: 'AlertTriangle',
      iconColor: 'text-red-500 dark:text-red-400',
      bgCircle: 'bg-red-100 dark:bg-red-950/50 border-red-200 dark:border-red-900/50',
      confirmVariant: 'danger',
    },
    warning: {
      icon: 'AlertCircle',
      iconColor: 'text-amber-500 dark:text-amber-400',
      bgCircle: 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50',
      confirmVariant: 'default', // Button variant
    },
    success: {
      icon: 'CheckCircle2',
      iconColor: 'text-green-500 dark:text-green-400',
      bgCircle: 'bg-green-100 dark:bg-green-950/50 border-green-200 dark:border-green-900/50',
      confirmVariant: 'default',
    },
    info: {
      icon: 'HelpCircle',
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      bgCircle: 'bg-indigo-100 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/50',
      confirmVariant: 'default',
    },
  }[type] || {
    icon: 'HelpCircle',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    bgCircle: 'bg-indigo-100 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/50',
    confirmVariant: 'default',
  };

  const isAlertOnly = !onCancel && cancelText === null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="bg-card rounded-3xl border border-border/80 shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 text-center space-y-6">
              {/* Animated Icon Circle */}
              <div className="flex justify-center">
                <div className={`w-16 h-16 rounded-2xl ${theme.bgCircle} border flex items-center justify-center shadow-inner animate-in zoom-in-50 duration-300`}>
                  <Icon name={theme.icon} size={28} className={theme.iconColor} />
                </div>
              </div>

              {/* Title & Message */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground tracking-tight">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                {!isAlertOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={handleCancel}
                    className="h-12 rounded-xl text-sm font-semibold hover:bg-muted"
                  >
                    {cancelText}
                  </Button>
                )}
                <Button
                  type="button"
                  variant={theme.confirmVariant}
                  fullWidth
                  onClick={handleConfirm}
                  className={`h-12 rounded-xl text-sm font-semibold ${
                    type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''
                  } ${
                    type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                  }`}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
