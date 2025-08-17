// Cookie management utilities
export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  location: boolean;
  activities: boolean;
  timestamp: number;
}

export interface UserLocation {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timestamp: number;
}

export interface UserActivity {
  page: string;
  action: string;
  timestamp: number;
  duration?: number;
}

// Cookie utilities
export const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Consent management
export const saveConsent = (consent: CookieConsent) => {
  setCookie('cookie-consent', JSON.stringify(consent), 365);
};

export const getConsent = (): CookieConsent | null => {
  const consentStr = getCookie('cookie-consent');
  if (consentStr) {
    try {
      return JSON.parse(consentStr);
    } catch (e) {
      console.error('Error parsing cookie consent:', e);
      return null;
    }
  }
  return null;
};

// Location tracking
export const saveUserLocation = async (consent: CookieConsent) => {
  if (!consent.location) return;

  try {
    // Try to get precise location with user permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now()
          };
          setCookie('user-location', JSON.stringify(location), 30);
        },
        async () => {
          // Fallback to IP-based location
          await getIPLocation();
        }
      );
    } else {
      await getIPLocation();
    }
  } catch (error) {
    console.error('Error getting user location:', error);
  }
};

const getIPLocation = async () => {
  try {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const location: UserLocation = {
        country: data.country_name,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: Date.now()
      };
      setCookie('user-location', JSON.stringify(location), 30);
    }
  } catch (error) {
    console.error('Error getting IP location:', error);
  }
};

export const getUserLocation = (): UserLocation | null => {
  const locationStr = getCookie('user-location');
  if (locationStr) {
    try {
      return JSON.parse(locationStr);
    } catch (e) {
      console.error('Error parsing user location:', e);
      return null;
    }
  }
  return null;
};

// Activity tracking
export const trackActivity = (page: string, action: string, consent: CookieConsent) => {
  if (!consent.activities) return;

  const activity: UserActivity = {
    page,
    action,
    timestamp: Date.now()
  };

  // Get existing activities
  const existingActivities = getUserActivities();
  const updatedActivities = [...existingActivities, activity];

  // Keep only the last 100 activities to prevent cookie size issues
  const recentActivities = updatedActivities.slice(-100);

  setCookie('user-activities', JSON.stringify(recentActivities), 30);
};

export const getUserActivities = (): UserActivity[] => {
  const activitiesStr = getCookie('user-activities');
  if (activitiesStr) {
    try {
      return JSON.parse(activitiesStr);
    } catch (e) {
      console.error('Error parsing user activities:', e);
      return [];
    }
  }
  return [];
};

// Page tracking hook
export const useActivityTracking = () => {
  const consent = getConsent();
  
  const trackPageView = (page: string) => {
    if (consent?.activities) {
      trackActivity(page, 'page_view', consent);
    }
  };

  const trackInteraction = (action: string, page: string = window.location.pathname) => {
    if (consent?.activities) {
      trackActivity(page, action, consent);
    }
  };

  return { trackPageView, trackInteraction };
};

// Clear all tracking data
export const clearAllTrackingData = () => {
  deleteCookie('user-location');
  deleteCookie('user-activities');
  deleteCookie('cookie-consent');
};