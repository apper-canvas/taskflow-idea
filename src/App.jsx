import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { AnimatePresence, motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  // Get icons using the utility function
  const Sun = useMemo(() => getIcon('Sun'), []);
  const Moon = useMemo(() => getIcon('Moon'), []);
  return (
    <div className="min-h-screen relative">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 10 }}
              >
                {/* Using JSX tag syntax for icon components */}
              </motion.div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? 'dark' : 'light'}
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="text-surface-600 dark:text-surface-300"
              >
                {/* Using JSX tag syntax for icon components */}
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>
      
      <main className="pt-16 pb-8 min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        toastClassName="rounded-lg"
      />
    </div>
  );
}

export default App;