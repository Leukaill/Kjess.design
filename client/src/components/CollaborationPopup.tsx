import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

const CollaborationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds on page load
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Auto-dismiss after 5 seconds of being visible
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCollaborate = () => {
    setIsNavigating(true);
    
    // Close popup after showing loading state
    setTimeout(() => {
      setIsVisible(false);
      
      // Scroll to contact section
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Focus on the first input field after scroll completes
          setTimeout(() => {
            const firstInput = contactSection.querySelector('input[name="name"]') as HTMLInputElement;
            if (firstInput) {
              firstInput.focus();
              // Add a subtle highlight animation
              firstInput.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.2)';
              setTimeout(() => {
                firstInput.style.boxShadow = '';
              }, 2000);
            }
          }, 800);
        }
      }, 200);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/10 z-[9998]"
            onClick={handleClose}
            data-testid="collaboration-popup-backdrop"
          />

          {/* Elegant popup from top-left */}
          <motion.div
            initial={{ 
              opacity: 0, 
              x: -320, 
              y: -80
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              x: -320, 
              y: -80
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="fixed top-4 left-4 right-4 z-[9999] w-auto max-w-xs 
                     sm:top-6 sm:left-6 sm:right-auto sm:max-w-xs
                     md:top-8 md:left-8 md:max-w-sm"
            data-testid="collaboration-popup"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-charcoal/5 relative overflow-hidden">
              {/* Minimal close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-6 h-6 text-charcoal/40 hover:text-charcoal/70 transition-colors duration-200"
                data-testid="button-close-collaboration"
              >
                <X className="w-full h-full" />
              </button>

              {/* Elegant accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bronze to-transparent" />

              {/* Content */}
              <div className="p-4 md:p-5">
                {/* Refined title */}
                <h3 className="font-italiana text-lg font-semibold text-charcoal mb-2 leading-tight">
                  Let's Create Something
                  <span className="block text-bronze font-normal">Beautiful Together</span>
                </h3>

                {/* Elegant description */}
                <p className="text-charcoal/70 leading-relaxed mb-4 text-xs">
                  Transform your space with personalized design that reflects your unique vision and lifestyle.
                </p>

                {/* Refined benefits */}
                <div className="space-y-1 mb-4">
                  <div className="text-xs text-charcoal/80">
                    • Complimentary design consultation
                  </div>
                  <div className="text-xs text-charcoal/80">
                    • Professional 3D visualization
                  </div>
                  <div className="text-xs text-charcoal/80">
                    • Collaborative design process
                  </div>
                </div>

                {/* Elegant action buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCollaborate}
                    disabled={isNavigating}
                    className="w-full bg-charcoal text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-charcoal/90 flex items-center justify-center gap-2 group disabled:opacity-70 text-sm"
                    data-testid="button-start-collaboration"
                  >
                    {isNavigating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span className="text-xs">Taking you there...</span>
                      </>
                    ) : (
                      <>
                        <span>Begin Collaboration</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full py-1 text-charcoal/50 hover:text-charcoal/70 transition-colors duration-200 text-xs"
                    data-testid="button-maybe-later"
                  >
                    Perhaps later
                  </button>
                </div>
              </div>

              {/* Subtle bottom accent */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollaborationPopup;