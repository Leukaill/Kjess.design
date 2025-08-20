import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CollaborationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay on every page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleClose}
            data-testid="collaboration-popup-backdrop"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            data-testid="collaboration-popup"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                data-testid="button-close-collaboration"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-bronze/20 to-transparent rounded-bl-full" />

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-bronze to-bronze/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-italiana text-2xl font-bold text-charcoal mb-3">
                  Let's Collaborate!
                </h3>

                {/* Description */}
                <p className="text-charcoal/70 leading-relaxed mb-6">
                  Ready to transform your space? Join forces with KJESS Designs to create something extraordinary together.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-bronze flex-shrink-0" />
                    <span className="text-sm text-charcoal/80">Personalized design consultation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-bronze flex-shrink-0" />
                    <span className="text-sm text-charcoal/80">3D visualization of your project</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-bronze flex-shrink-0" />
                    <span className="text-sm text-charcoal/80">Collaborative design process</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleCollaborate}
                    className="w-full bg-bronze hover:bg-bronze/90 text-white py-3 rounded-xl font-medium transition-all duration-300"
                    data-testid="button-start-collaboration"
                  >
                    Start Collaboration
                  </Button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full py-3 text-charcoal/60 hover:text-charcoal transition-colors duration-200 text-sm"
                    data-testid="button-maybe-later"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              {/* Subtle animation element */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 w-12 h-12 bg-bronze/20 rounded-full"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollaborationPopup;