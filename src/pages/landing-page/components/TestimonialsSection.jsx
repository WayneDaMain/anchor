import React from 'react';
import FadeIn from '../../../components/animations/FadeIn';
import StaggerContainer from '../../../components/animations/StaggerContainer';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Completed the entire Bible in 11 months",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fb6cf439-1763299224286.png",
      imageAlt: "Professional woman with brown hair wearing white blouse smiling warmly at camera in bright office setting",
      testimonial: "I'd started four different Bible plans over the years and abandoned all of them. Anchor was the first time I actually finished. Seeing the exact percentage left every day made it feel doable.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Small group leader, 3 groups on Anchor",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_18177d561-1763301900808.png",
      imageAlt: "Asian man with short black hair wearing navy blue shirt smiling confidently against neutral gray background",
      testimonial: "Running group reading plans used to mean chasing people with spreadsheets. Now everyone logs their own progress and I can see where each person is at a glance. Game changer.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Using Anchor with a physical Bible",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11719be22-1763294717708.png",
      imageAlt: "Hispanic woman with long dark hair wearing casual gray sweater with warm smile in natural outdoor lighting",
      testimonial: "I use a physical Bible and wasn't sure this would work for me. Turns out the app is just the tracker, I still read the real thing. It's perfect. I just log what I read and move on.",
      rating: 5
    }];

  return (
    <section id="testimonials" className="py-16 md:py-24 lg:py-32 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16 lg:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-slate-900 dark:text-zinc-100 mb-4 md:mb-6 leading-tight">
              Real people.
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent"> Real progress.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Not everyone who starts a Bible plan finishes it. Here are some who did.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {testimonials?.map((testimonial, index) =>
            <TestimonialCard
              key={index}
              name={testimonial?.name}
              role={testimonial?.role}
              image={testimonial?.image}
              imageAlt={testimonial?.imageAlt}
              testimonial={testimonial?.testimonial}
              rating={testimonial?.rating} />

          )}
        </StaggerContainer>
      </div>
    </section>);

};

export default TestimonialsSection;
