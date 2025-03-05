import React from 'react';
import { motion } from 'framer-motion';

const BaseballLoading: React.FC = () => {
  return (
    <motion.div
      className="flex justify-center items-center h-screen"
      // Animate the container: moving horizontally and scaling the logo
      animate={{
        x: ['-50vw', '50vw', '-50vw'],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    >
      <motion.img
        // This is your bolder baseball SVG encoded as a Data URL.
        // (Make sure the Base64 string is generated from your finalized SVG.)
        src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2MWRhZmIiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik02NSA3MCBRMTAwIDEwMCA2NSA2MzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxZGFmYiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtZGFzaGFycmF5PSI0IDQiLz4KICA8cGF0aCBkPSJNMTM1IDcwIFE5MCAxMDAgMTM1IDEzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIvPgogIDxwYXRoIGQ9Ik03MCA3NSBRMTAwIDEwNSA3MCAxMzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxZGFmYiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbWFzaGFycmF5PSIyIDIiLz4KICA8cGF0aCBkPSJNMTMwIDc1IFE5MCAxMDUgMTMwIDEzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjIgMiIvPgo8L3N2Zz4="
        alt="Baseball Logo"
        className="h-12 w-auto"
      />
    </motion.div>
  );
};

export default BaseballLoading;
