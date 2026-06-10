import React from 'react';
import FadeIn from '../../../components/animations/FadeIn';
import StaggerContainer from '../../../components/animations/StaggerContainer';
import PricingCard from './PricingCard';

const PricingSection = () => {
  const plans = [
    {
      title: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Access to all system reading plans",
        "Create up to 3 custom plans",
        "Daily progress tracking",
        "Basic progress reports",
        "Email notifications",
        "Light & dark themes"
      ],
      isPopular: false,
      ctaText: "Start Free",
      ctaVariant: "outline"
    },
    {
      title: "Premium",
      price: "$4.99",
      period: "month",
      features: [
        "Everything in Free",
        "Unlimited custom reading plans",
        "Multiple active plans simultaneously",
        "Join unlimited reading groups",
        "Advanced progress reports with images",
        "Push notifications",
        "Priority support",
        "Export reading history"
      ],
      isPopular: true,
      ctaText: "Start Premium",
      ctaVariant: "default"
    },
    {
      title: "Lifetime",
      price: "$49.99",
      period: null,
      features: [
        "Everything in Premium",
        "One-time payment",
        "Lifetime access to all features",
        "Future feature updates included",
        "Early access to new features",
        "Premium support forever",
        "Support app development"
      ],
      isPopular: false,
      ctaText: "Get Lifetime Access",
      ctaVariant: "outline"
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10 md:mb-14 lg:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Choose Your
              <span className="text-accent"> Reading Plan</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with our free plan and upgrade anytime. All plans include our grace-centered approach to Bible reading.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {plans?.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan?.title}
              price={plan?.price}
              period={plan?.period}
              features={plan?.features}
              isPopular={plan?.isPopular}
              ctaText={plan?.ctaText}
              ctaVariant={plan?.ctaVariant}
            />
          ))}
        </StaggerContainer>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm md:text-base text-muted-foreground">
            All plans include 14-day money-back guarantee • Cancel anytime • Secure payment
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;