// GA4 Analytics utilities
// Добавить в head сайта:
// <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// Initialize GA4
export const initGA = () => {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }
};

// Event tracking helper
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    window.gtag('event', eventName, params);
  }
};

// Pre-defined events
export const analyticsEvents = {
  // Form events
  formSubmit: (formName: string) => {
    trackEvent('form_submit', {
      event_category: 'form',
      event_label: formName,
    });
  },
  formStart: (formName: string) => {
    trackEvent('form_start', {
      event_category: 'form',
      event_label: formName,
    });
  },
  
  // Button clicks
  buttonClick: (buttonName: string, location?: string) => {
    trackEvent('button_click', {
      event_category: 'button',
      event_label: buttonName,
      location,
    });
  },
  
  // Phone clicks
  phoneClick: (phoneNumber: string) => {
    trackEvent('phone_click', {
      event_category: 'contact',
      phone: phoneNumber,
    });
  },
  
  // CTA clicks
  ctaClick: (ctaText: string, page?: string) => {
    trackEvent('cta_click', {
      event_category: 'cta',
      event_label: ctaText,
      page,
    });
  },
  
  // Service requests
  serviceRequest: (serviceName: string) => {
    trackEvent('service_request', {
      event_category: 'service',
      event_label: serviceName,
    });
  },
  
  // Calculator usage
  calculatorStart: () => {
    trackEvent('calculator_start', {
      event_category: 'calculator',
    });
  },
  calculatorComplete: (totalPrice: number) => {
    trackEvent('calculator_complete', {
      event_category: 'calculator',
      value: totalPrice,
    });
  },
  
  // Page views
  pageView: (pagePath: string, pageTitle: string) => {
    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  },
};

// React hook for analytics
export const useAnalytics = () => {
  return analyticsEvents;
};
