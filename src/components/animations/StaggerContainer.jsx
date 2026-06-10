import { motion } from 'framer-motion';

/**
 * StaggerContainer - Animates children with stagger effect
 */
const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default StaggerContainer;