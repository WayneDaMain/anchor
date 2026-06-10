import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingCard = ({ title, price, period, features, isPopular, ctaText, ctaVariant }) => {
  const navigate = useNavigate();

  return (
    <div className={`relative bg-card rounded-xl p-6 md:p-8 lg:p-10 shadow-sm border-2 transition-gentle ${
      isPopular ? 'border-accent' : 'border-border'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs md:text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-3 md:mb-4">
          {title}
        </h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{price}</span>
          {period && <span className="text-base md:text-lg text-muted-foreground">/{period}</span>}
        </div>
      </div>
      <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
        {features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Icon name="Check" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5 w-5 h-5" />
            <span className="text-sm md:text-base text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={ctaVariant}
        size="lg"
        fullWidth
        onClick={() => navigate('/register')}
        className={ctaVariant === 'default' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
      >
        {ctaText}
      </Button>
    </div>
  );
};

export default PricingCard;