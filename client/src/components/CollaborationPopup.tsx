import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Star, Heart, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          {/* Backdrop - lighter for less intrusive feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={handleClose}
            data-testid="collaboration-popup-backdrop"
          />

          {/* Popup - Positioned from top-left on desktop, optimized for mobile */}
          <motion.div
            initial={{ 
              opacity: 0, 
              x: -400, 
              y: -100,
              scale: 0.8
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: 0,
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              x: -400, 
              y: -100,
              scale: 0.8
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              damping: 20
            }}
            className="fixed top-4 left-4 right-4 z-50 w-auto max-w-sm 
                     sm:top-6 sm:left-6 sm:right-auto sm:max-w-sm
                     md:top-8 md:left-8 md:max-w-md 
                     lg:max-w-lg"
            data-testid="collaboration-popup"
          >
            <div className="bg-gradient-to-br from-white via-white to-bronze/5 rounded-3xl shadow-2xl border border-bronze/10 relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                data-testid="button-close-collaboration"
              >
                <X className="w-4 h-4 text-charcoal/70" />
              </button>

              {/* Magical decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-bronze/20 via-bronze/10 to-transparent rounded-bl-full" />
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-4 right-4 w-6 h-6 text-bronze/30"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Attention-grabbing badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-bronze to-bronze/80 text-white px-4 py-2 rounded-full text-xs font-semibold mb-4 shadow-lg">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Limited Time: Free Consultation</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>

                {/* Emotional headline */}
                <h3 className="font-italiana text-2xl md:text-3xl font-bold text-charcoal mb-3 leading-tight">
                  Your Dream Space
                  <span className="block text-bronze">Awaits You</span>
                </h3>

                {/* Compelling description */}
                <p className="text-charcoal/80 leading-relaxed mb-6 text-sm md:text-base">
                  Imagine walking into a space that perfectly reflects your personality and makes you feel truly at home. That dream can become reality.
                </p>

                {/* Irresistible benefits with emotional appeal */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-charcoal/90 font-medium">Free 30-minute design consultation worth $150</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-charcoal/90 font-medium">See your space transformed in stunning 3D</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pink-200 transition-colors">
                      <Heart className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-sm text-charcoal/90 font-medium">Work directly with award-winning designers</span>
                  </div>
                </div>

                {/* Social proof */}
                <div className="bg-bronze/5 border border-bronze/20 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-charcoal">4.9/5 stars</span>
                  </div>
                  <p className="text-xs text-charcoal/70 italic">
                    "KJESS Designs transformed our house into a home we never want to leave." - Sarah M.
                  </p>
                </div>

                {/* Urgency and scarcity */}
                <div className="flex items-center gap-2 mb-6 text-bronze text-xs font-medium">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-bronze rounded-full"
                  />
                  <span>Only 3 consultation spots left this month</span>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCollaborate}
                    className="w-full bg-gradient-to-r from-bronze to-bronze/90 hover:from-bronze/90 hover:to-bronze text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    data-testid="button-start-collaboration"
                  >
                    <span>Yes, I Want My Dream Space!</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full py-2 text-charcoal/50 hover:text-charcoal/70 transition-colors duration-200 text-xs"
                    data-testid="button-maybe-later"
                  >
                    Not ready yet
                  </button>
                </div>

                {/* Trust indicator */}
                <div className="text-center mt-4 pt-4 border-t border-charcoal/10">
                  <p className="text-xs text-charcoal/60">
                    💳 No payment required • 🔒 100% free consultation
                  </p>
                </div>
              </div>

              {/* Floating sparkle animations */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: 0.5
                }}
                className="absolute bottom-6 left-6 text-bronze/40"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute top-16 left-8 text-bronze/30"
              >
                <Star className="w-3 h-3" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollaborationPopup;