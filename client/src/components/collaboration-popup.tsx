import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollaborationPopupProps {
  onClose: () => void;
}

export function CollaborationPopup({ onClose }: CollaborationPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, y: -50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -100, y: -50 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
      className="fixed top-6 left-6 z-50 bg-white/95 backdrop-blur-lg border border-bronze/20 rounded-2xl shadow-2xl p-6 max-w-sm"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-bronze/10 rounded-full transition-colors"
        data-testid="button-close-popup"
      >
        <X className="w-4 h-4 text-charcoal/60" />
      </button>

      {/* Content */}
      <div className="pr-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-bronze to-bronze/80 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-italiana text-lg text-charcoal">Let's Collaborate</h3>
            <p className="text-sm text-charcoal/60">Transform your space together</p>
          </div>
        </div>

        <p className="text-sm text-charcoal/80 mb-4 leading-relaxed">
          Ready to bring your vision to life? Our design experts are here to collaborate 
          with you on creating the perfect space that reflects your style and needs.
        </p>

        <div className="space-y-2">
          <Button 
            className="w-full bg-bronze hover:bg-bronze/90 text-white shadow-lg hover:shadow-xl transition-all"
            onClick={() => {
              // Scroll to contact section
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              onClose();
            }}
            data-testid="button-start-project"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Your Project
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-charcoal/70 hover:text-charcoal hover:bg-bronze/5"
            onClick={onClose}
            data-testid="button-maybe-later"
          >
            Maybe Later
          </Button>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-tr from-bronze/20 to-transparent rounded-full blur-lg" />
    </motion.div>
  );
}

export function useCollaborationPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown in this session
    const popupShown = sessionStorage.getItem('collaboration-popup-shown');
    
    if (!popupShown && !hasShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('collaboration-popup-shown', 'true');
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return { showPopup, closePopup };
}