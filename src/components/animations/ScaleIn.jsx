import { motion } from 'framer-motion';

/**
 * ScaleIn component - Scales in content with fade effect
 */
const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.4,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.9
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;