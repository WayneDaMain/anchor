import { motion } from 'framer-motion';

/**
 * AnimatedButton - Wrapper for button interactions
 */
const AnimatedButton = ({ children, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;