import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface AdminLongPressLogoProps {
  children: React.ReactNode;
  className?: string;
  onActivate?: () => void;
}

export const AdminLongPressLogo: React.FC<AdminLongPressLogoProps> = ({ 
  children, 
  className = "", 
  onActivate 
}) => {
  const [, setLocation] = useLocation();
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showRipples, setShowRipples] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const startLongPress = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsPressed(true);
    setProgress(0);
    setShowRipples(true);

    // Smooth progress animation
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
    }, 16); // 60fps

    // Complete activation after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setIsPressed(false);
      setProgress(0);
      setShowRipples(false);
      onActivate?.();
      setLocation('/admin/login');
      
      // Clear the progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, 3000);
  }, [onActivate, setLocation]);

  const cancelLongPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsPressed(false);
    setProgress(0);
    setShowRipples(false);
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    startLongPress(event);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    startLongPress(event);
  };

  const handleMouseUp = () => {
    cancelLongPress();
  };

  const handleTouchEnd = () => {
    cancelLongPress();
  };

  const handleMouseLeave = () => {
    cancelLongPress();
  };

  return (
    <div 
      className={`relative overflow-hidden z-[60] ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {children}
      
      {/* Long press progress indicator */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-[70]"
          >
            {/* Progress ring */}
            <div className="relative w-16 h-16">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background ring */}
                <path
                  className="text-white/20"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth="2"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress ring */}
                <motion.path
                  className="text-white"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth="3"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    strokeDasharray: `${progress}, 100`,
                    filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))'
                  }}
                />
              </svg>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: 0
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple animations */}
      <AnimatePresence>
        {showRipples && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[70]">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ 
                  scale: [0, 2, 3], 
                  opacity: [0.6, 0.3, 0] 
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.5,
                  repeat: 1,
                  ease: "easeOut"
                }}
                className="absolute w-12 h-12 border border-white/30 rounded-full"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};