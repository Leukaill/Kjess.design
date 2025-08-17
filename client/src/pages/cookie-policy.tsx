import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Cookie, MapPin, Activity, Eye } from "lucide-react";
import { Link } from "wouter";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-8 hover:bg-bronze/10" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-italiana mb-6">Cookie Policy</h1>
            <p className="text-lg text-charcoal/70 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose max-w-none"
        >
          {/* Introduction */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Cookie className="w-6 h-6 text-bronze mr-3" />
              <h2 className="text-2xl font-italiana">What are cookies?</h2>
            </div>
            <p className="text-charcoal/80 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing how you use our site, and providing personalized content.
            </p>
          </div>

          {/* Types of Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-italiana mb-6">Types of cookies we use</h2>
            
            <div className="space-y-8">
              {/* Necessary Cookies */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-bronze/10">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-bronze mr-3" />
                  <h3 className="text-xl font-italiana">Necessary Cookies</h3>
                </div>
                <p className="text-charcoal/80 mb-4">
                  These cookies are essential for the website to function properly. They enable 
                  basic functionality like page navigation and access to secure areas.
                </p>
                <div className="bg-bronze/5 p-4 rounded border-l-4 border-bronze">
                  <p className="text-sm font-medium">Cannot be disabled</p>
                  <p className="text-sm text-charcoal/70">
                    These cookies are required for the basic functionality of our website.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-bronze/10">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-bronze mr-3" />
                  <h3 className="text-xl font-italiana">Analytics Cookies</h3>
                </div>
                <p className="text-charcoal/80 mb-4">
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside text-sm text-charcoal/70 space-y-1">
                  <li>Page views and time spent on each page</li>
                  <li>Click-through rates and navigation patterns</li>
                  <li>Device and browser information</li>
                  <li>Performance metrics and error tracking</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-bronze/10">
                <div className="flex items-center mb-4">
                  <Eye className="w-5 h-5 text-bronze mr-3" />
                  <h3 className="text-xl font-italiana">Marketing Cookies</h3>
                </div>
                <p className="text-charcoal/80 mb-4">
                  These cookies are used to deliver advertisements that are relevant to you 
                  and your interests. They also limit the number of times you see an ad.
                </p>
                <ul className="list-disc list-inside text-sm text-charcoal/70 space-y-1">
                  <li>Personalized content and advertisements</li>
                  <li>Social media integration</li>
                  <li>Cross-platform tracking for better targeting</li>
                  <li>Conversion tracking and attribution</li>
                </ul>
              </div>

              {/* Location Cookies */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-bronze/10">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-bronze mr-3" />
                  <h3 className="text-xl font-italiana">Location Cookies</h3>
                </div>
                <p className="text-charcoal/80 mb-4">
                  With your permission, we may store your location information to provide 
                  localized services and content.
                </p>
                <ul className="list-disc list-inside text-sm text-charcoal/70 space-y-1">
                  <li>Country, region, and city information</li>
                  <li>GPS coordinates (only with explicit permission)</li>
                  <li>Timezone for scheduling and appointments</li>
                  <li>Local service availability</li>
                </ul>
              </div>

              {/* Activity Tracking */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-bronze/10">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-bronze mr-3" />
                  <h3 className="text-xl font-italiana">Activity Tracking</h3>
                </div>
                <p className="text-charcoal/80 mb-4">
                  We track certain user activities to improve our website's user experience 
                  and provide better services.
                </p>
                <ul className="list-disc list-inside text-sm text-charcoal/70 space-y-1">
                  <li>Button clicks and form interactions</li>
                  <li>Scroll behavior and engagement metrics</li>
                  <li>Feature usage and preferences</li>
                  <li>Session duration and frequency</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-italiana mb-6">Managing your cookie preferences</h2>
            <div className="bg-bronze/5 p-6 rounded-lg border border-bronze/20">
              <p className="text-charcoal/80 mb-4">
                You have full control over your cookie preferences. You can:
              </p>
              <ul className="list-disc list-inside text-charcoal/70 space-y-2 mb-4">
                <li>Accept or reject non-essential cookies at any time</li>
                <li>Modify your preferences through our cookie banner</li>
                <li>Clear existing cookies through your browser settings</li>
                <li>Disable cookies entirely (may affect website functionality)</li>
              </ul>
              <p className="text-sm text-charcoal/60">
                Note: Disabling necessary cookies may prevent certain features from working properly.
              </p>
            </div>
          </div>

          {/* Data Retention */}
          <div className="mb-12">
            <h2 className="text-2xl font-italiana mb-4">Data retention</h2>
            <div className="space-y-4 text-charcoal/80">
              <p>
                Different types of cookies are stored for different periods:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Stored for up to 1 year unless deleted</li>
                <li><strong>Analytics cookies:</strong> Stored for up to 2 years</li>
                <li><strong>Location data:</strong> Stored for up to 30 days</li>
                <li><strong>Activity data:</strong> Stored for up to 30 days</li>
              </ul>
            </div>
          </div>

          {/* Third-party Services */}
          <div className="mb-12">
            <h2 className="text-2xl font-italiana mb-4">Third-party services</h2>
            <p className="text-charcoal/80 mb-4">
              We may use third-party services that set their own cookies:
            </p>
            <ul className="list-disc list-inside text-charcoal/70 space-y-1">
              <li>Google Analytics (analytics and performance)</li>
              <li>Social media platforms (sharing and integration)</li>
              <li>Content delivery networks (performance optimization)</li>
              <li>Payment processors (secure transactions)</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-bronze/10">
            <h2 className="text-2xl font-italiana mb-4">Questions about our cookie policy?</h2>
            <p className="text-charcoal/80 mb-4">
              If you have any questions about how we use cookies or want to exercise 
              your rights regarding your data, please contact us:
            </p>
            <div className="space-y-2 text-charcoal/70">
              <p><strong>Email:</strong> privacy@kjessdesigns.com</p>
              <p><strong>Phone:</strong> +250 123 456 789</p>
              <p><strong>Address:</strong> Kigali, Rwanda</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;