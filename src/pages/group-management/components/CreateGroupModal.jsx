import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateGroupModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    planType: '',
    duration: '',
    isPrivate: false
  });

  const [errors, setErrors] = useState({});

  const planOptions = [
    { value: 'entire-bible', label: 'Entire Bible' },
    { value: 'old-testament', label: 'Old Testament' },
    { value: 'new-testament', label: 'New Testament' },
    { value: 'gospels', label: 'Gospels' },
    { value: 'psalms-proverbs', label: 'Psalms & Proverbs' }
  ];

  const durationOptions = [
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: '2-years', label: '2 Years' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Group name is required';
    if (!formData?.description?.trim()) newErrors.description = 'Description is required';
    if (!formData?.planType) newErrors.planType = 'Please select a reading plan';
    if (!formData?.duration) newErrors.duration = 'Please select a duration';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onCreate(formData);
    }
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
          className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e?.stopPropagation()}
        >
          <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Create New Group
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-gentle"
              aria-label="Close modal"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
            <Input
              label="Group Name"
              type="text"
              placeholder="Enter group name"
              value={formData?.name}
              onChange={(e) => handleChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-gentle resize-none"
                rows="4"
                placeholder="Describe the purpose and goals of this group"
                value={formData?.description}
                onChange={(e) => handleChange('description', e?.target?.value)}
              />
              {errors?.description && (
                <p className="text-sm text-destructive mt-1">{errors?.description}</p>
              )}
            </div>

            <Select
              label="Reading Plan"
              placeholder="Select a reading plan"
              options={planOptions}
              value={formData?.planType}
              onChange={(value) => handleChange('planType', value)}
              error={errors?.planType}
              required
            />

            <Select
              label="Duration"
              placeholder="Select duration"
              options={durationOptions}
              value={formData?.duration}
              onChange={(value) => handleChange('duration', value)}
              error={errors?.duration}
              required
            />

            <Checkbox
              label="Private Group"
              description="Only members with invitation code can join"
              checked={formData?.isPrivate}
              onChange={(e) => handleChange('isPrivate', e?.target?.checked)}
            />

            <div className="flex items-center space-x-3 pt-4">
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
                iconName="Plus"
                iconPosition="left"
              >
                Create Group
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateGroupModal;