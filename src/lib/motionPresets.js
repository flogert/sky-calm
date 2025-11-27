export const gentleSpring = { type: 'spring', stiffness: 40, damping: 14 };
export const mediumSpring = { type: 'spring', stiffness: 90, damping: 18 };
export const easeTransition = (duration = 0.45) => ({ duration, ease: 'easeInOut' });

export const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: easeTransition() },
};

export const buttonMicro = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};
