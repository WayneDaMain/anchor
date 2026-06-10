import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportOptions = () => {
  const [selectedExport, setSelectedExport] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Comprehensive progress report with charts and statistics',
      icon: 'FileText',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      id: 'csv',
      name: 'CSV Data',
      description: 'Raw reading data for external analysis',
      icon: 'Table',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'calendar',
      name: 'Calendar Export',
      description: 'Import reading schedule to your calendar app',
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'json',
      name: 'JSON Export',
      description: 'Complete data export in JSON format',
      icon: 'Code',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const handleExport = (exportId) => {
    setSelectedExport(exportId);
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Exported as ${exportId}`);
    }, 2000);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          Export Options
        </h2>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Download" size={20} color="var(--color-primary)" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {exportOptions?.map((option) => (
          <div
            key={option?.id}
            className="bg-background rounded-lg p-4 md:p-5 border border-border transition-gentle hover:shadow-md"
          >
            <div className="flex items-start space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${option?.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={option?.icon} size={20} className={option?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                  {option?.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {option?.description}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => handleExport(option?.id)}
              loading={isExporting && selectedExport === option?.id}
              disabled={isExporting}
              fullWidth
            >
              {isExporting && selectedExport === option?.id ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
        <div className="p-3 md:p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Icon name="Shield" size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm md:text-base font-medium text-foreground mb-1">
                Privacy Protected
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                All exports are encrypted and stored securely. Your reading data remains private.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm md:text-base font-medium text-foreground mb-1">
                Export Formats
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Choose the format that best suits your needs. PDF for sharing, CSV for analysis, Calendar for scheduling, and JSON for backup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;