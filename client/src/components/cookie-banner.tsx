import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cookie, Settings, X, Shield, MapPin, Activity } from "lucide-react";
import { 
  getConsent, 
  saveConsent, 
  saveUserLocation, 
  type CookieConsent,
  useActivityTracking 
} from "@/lib/cookies";

interface CookieBannerProps {
  onAccept?: (consent: CookieConsent) => void;
}

export function CookieBanner({ onAccept }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    location: false,
    activities: false,
    timestamp: Date.now()
  });

  const { trackInteraction } = useActivityTracking();

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = getConsent();
    if (!existingConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Update consent state with existing consent
      setConsent(existingConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      location: true,
      activities: true,
      timestamp: Date.now()
    };
    
    saveConsent(newConsent);
    saveUserLocation(newConsent);
    setShowBanner(false);
    onAccept?.(newConsent);
    trackInteraction('accept_all_cookies');
  };

  const handleAcceptSelected = () => {
    const newConsent = { ...consent, timestamp: Date.now() };
    saveConsent(newConsent);
    if (newConsent.location) {
      saveUserLocation(newConsent);
    }
    setShowBanner(false);
    setShowSettings(false);
    onAccept?.(newConsent);
    trackInteraction('accept_selected_cookies');
  };

  const handleRejectAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      location: false,
      activities: false,
      timestamp: Date.now()
    };
    
    saveConsent(newConsent);
    setShowBanner(false);
    onAccept?.(newConsent);
    trackInteraction('reject_all_cookies');
  };

  const updateConsent = (key: keyof CookieConsent, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-bronze/20 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto p-6">
          {!showSettings ? (
            // Simple banner
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-bronze/10 rounded-full flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-bronze" />
                </div>
                <div>
                  <h3 className="font-italiana text-lg mb-1">Cookie Preferences</h3>
                  <p className="text-sm text-charcoal/70">
                    We use cookies to enhance your experience and analyze site usage. 
                    Your location and browsing activities may be stored with your consent.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(true)}
                  className="text-charcoal/70 hover:text-charcoal"
                  data-testid="button-customize-cookies"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleRejectAll}
                  className="text-charcoal/70 hover:text-charcoal"
                  data-testid="button-reject-cookies"
                >
                  Reject All
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="bg-bronze hover:bg-bronze/90 text-white"
                  data-testid="button-accept-all-cookies"
                >
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            // Detailed settings
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-italiana text-xl">Cookie Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-bronze/10 rounded-full transition-colors"
                  data-testid="button-close-settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Necessary Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-bronze" />
                      <span className="font-medium">Necessary</span>
                    </div>
                    <Switch
                      checked={consent.necessary}
                      disabled={true}
                      data-testid="switch-necessary"
                    />
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Essential cookies required for the website to function properly.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-bronze" />
                      <span className="font-medium">Analytics</span>
                    </div>
                    <Switch
                      checked={consent.analytics}
                      onCheckedChange={(checked) => updateConsent('analytics', checked)}
                      data-testid="switch-analytics"
                    />
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Help us understand how visitors use our website.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cookie className="w-5 h-5 text-bronze" />
                      <span className="font-medium">Marketing</span>
                    </div>
                    <Switch
                      checked={consent.marketing}
                      onCheckedChange={(checked) => updateConsent('marketing', checked)}
                      data-testid="switch-marketing"
                    />
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Personalized ads and content based on your interests.
                  </p>
                </div>

                {/* Location Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-bronze" />
                      <span className="font-medium">Location</span>
                    </div>
                    <Switch
                      checked={consent.location}
                      onCheckedChange={(checked) => updateConsent('location', checked)}
                      data-testid="switch-location"
                    />
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Store your location to provide localized services.
                  </p>
                </div>

                {/* Activity Tracking */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-bronze" />
                      <span className="font-medium">Activities</span>
                    </div>
                    <Switch
                      checked={consent.activities}
                      onCheckedChange={(checked) => updateConsent('activities', checked)}
                      data-testid="switch-activities"
                    />
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Track your browsing activities to improve user experience.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                  data-testid="button-cancel-settings"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAcceptSelected}
                  className="bg-bronze hover:bg-bronze/90 text-white"
                  data-testid="button-save-settings"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CookieBanner;