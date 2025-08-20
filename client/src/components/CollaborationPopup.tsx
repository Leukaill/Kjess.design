import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

const CollaborationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay on every page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCollaborate = () => {
    // Handle collaboration logic here
    console.log("User wants to collaborate!");
    setIsVisible(false);
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
            className="fixed inset-0 bg-black/10 z-40"
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
            className="fixed top-4 left-4 right-4 z-50 w-auto max-w-xs 
                     sm:top-6 sm:left-6 sm:right-auto sm:max-w-sm
                     md:top-8 md:left-8 md:max-w-md"
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
              <div className="p-6 md:p-8">
                {/* Refined title */}
                <h3 className="font-italiana text-2xl font-semibold text-charcoal mb-3 leading-tight">
                  Let's Create Something
                  <span className="block text-bronze font-normal">Beautiful Together</span>
                </h3>

                {/* Elegant description */}
                <p className="text-charcoal/70 leading-relaxed mb-6 text-sm">
                  Transform your space with personalized design that reflects your unique vision and lifestyle.
                </p>

                {/* Refined benefits */}
                <div className="space-y-2 mb-6">
                  <div className="text-sm text-charcoal/80">
                    • Complimentary design consultation
                  </div>
                  <div className="text-sm text-charcoal/80">
                    • Professional 3D visualization
                  </div>
                  <div className="text-sm text-charcoal/80">
                    • Collaborative design process
                  </div>
                </div>

                {/* Elegant action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCollaborate}
                    className="w-full bg-charcoal text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-charcoal/90 flex items-center justify-center gap-2 group"
                    data-testid="button-start-collaboration"
                  >
                    <span>Begin Collaboration</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full py-2 text-charcoal/50 hover:text-charcoal/70 transition-colors duration-200 text-sm"
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