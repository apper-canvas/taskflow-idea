import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

export function NotFound() {
  const AlertTriangle = getIcon('AlertTriangle');
  const ArrowLeft = getIcon('ArrowLeft');
  
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto text-center"
      >
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          className="inline-block p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6 text-yellow-500"
        >
          <AlertTriangle size={48} />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary px-6 py-3"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}