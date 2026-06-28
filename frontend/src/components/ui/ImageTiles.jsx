import { motion } from 'framer-motion';
import React from 'react';

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delay: 0.2, staggerChildren: 0.2 },
  },
};

const leftVariants = {
  initial: { rotate: 0, x: 0, y: 0 },
  animate: {
    rotate: -8, x: -140, y: 10,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  hover: {
    rotate: 1, x: -150, y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

const middleVariants = {
  initial: { rotate: 0, x: 0, y: 0 },
  animate: {
    rotate: 6, x: 0, y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  hover: {
    rotate: 0, x: 0, y: -10,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

const rightVariants = {
  initial: { rotate: 0, x: 0, y: 0 },
  animate: {
    rotate: -6, x: 190, y: 20,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  hover: {
    rotate: 3, x: 190, y: 10,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

const ImageTiles = ({ leftImage, middleImage, rightImage, onClickLeft, onClickMiddle, onClickRight }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center w-64 h-64"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="absolute w-48 h-48 origin-bottom-right overflow-hidden rounded-xl shadow-lg bg-white cursor-pointer"
        variants={leftVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 30 }}
        onClick={onClickLeft}
      >
        <img src={leftImage} alt="" className="w-full h-full object-cover rounded-xl" />
      </motion.div>

      <motion.div
        className="absolute w-48 h-48 origin-bottom-left overflow-hidden rounded-xl shadow-lg bg-white cursor-pointer"
        variants={middleVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 20 }}
        onClick={onClickMiddle}
      >
        <img src={middleImage} alt="" className="w-full h-full object-cover rounded-2xl" />
      </motion.div>

      <motion.div
        className="absolute w-48 h-48 origin-bottom-right overflow-hidden rounded-xl shadow-lg bg-white cursor-pointer"
        variants={rightVariants}
        whileHover="hover"
        animate="animate"
        style={{ zIndex: 10 }}
        onClick={onClickRight}
      >
        <img src={rightImage} alt="" className="w-full h-full object-cover rounded-2xl" />
      </motion.div>
    </motion.div>
  );
};

export default ImageTiles;
