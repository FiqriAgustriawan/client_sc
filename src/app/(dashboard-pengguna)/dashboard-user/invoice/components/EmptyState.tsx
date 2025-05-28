import React from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-12 flex flex-col items-center justify-center text-center"
    >
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <FaFileInvoiceDollar className="text-blue-500 text-2xl" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada invoice</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
    </motion.div>
  );
};

export default EmptyState;