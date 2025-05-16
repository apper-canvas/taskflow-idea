import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const Clock = getIcon('Clock');
  const CheckCircle = getIcon('CheckCircle');
  const Star = getIcon('Star');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            className="text-primary"
          >
            {getIcon('Loader2')({ size: 40, className: "animate-spin text-primary" })}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-surface-600 dark:text-surface-400"
          >
            Loading your tasks...
          </motion.p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Welcome to TaskFlow
        </motion.h1>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-8"
        >
          <div className="flex items-center text-surface-600 dark:text-surface-400">
            <Clock size={20} className="mr-2" />
            <span>Stay organized</span>
          </div>
          
          <div className="flex items-center text-surface-600 dark:text-surface-400">
            <CheckCircle size={20} className="mr-2" />
            <span>Boost productivity</span>
          </div>
          
          <div className="flex items-center text-surface-600 dark:text-surface-400">
            <Star size={20} className="mr-2" />
            <span>Achieve your goals</span>
          </div>
        </motion.div>
      </motion.div>
      
      <MainFeature />
    </div>
  );
}