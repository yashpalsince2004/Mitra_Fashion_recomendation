export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const cardHover = {
  hover: {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.97
  }
};

export const modalAnimation = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.95
  }
};
