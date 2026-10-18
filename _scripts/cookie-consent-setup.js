---
permalink: /assets/js/cookie-consent-setup.js
---
/**
 * Opt-in analytics using https://cookieconsent.orestbida.com/.
 * Templates mark analytics scripts with type="text/plain" data-category="analytics".
 */

// Keep Google Analytics disabled until consent is restored or granted.
window.dataLayer = window.dataLayer || [];
var googleAnalyticsDisableKey = 'ga-disable-{{ site.google_analytics }}';
window[googleAnalyticsDisableKey] = true;

if (typeof window.gtag !== 'function') {
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
}

var gtag = window.gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied'
});

// Wait for the library to be available
var cookieConsentRetryCount = 0;
var COOKIE_CONSENT_MAX_RETRIES = 50; // 5 seconds max wait time

function initializeCookieConsent() {
  // Check if CookieConsent is available
  if (!window.CookieConsent) {
    if (cookieConsentRetryCount++ < COOKIE_CONSENT_MAX_RETRIES) {
      // Library not yet loaded, try again after a short delay
      setTimeout(initializeCookieConsent, 100);
    } else {
      console.error('CookieConsent library failed to load');
    }
    return;
  }

  window.CookieConsent.run({
    mode: 'opt-in',
    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        enabled: false,
        autoClear: {
          cookies: [{ name: /^_ga($|_)/ }],
          // CookieConsent saves the choice and invokes onChange before reloading.
          // Reloading unloads analytics scripts that already ran on this page.
          reloadPage: true
        }
      }
    },

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies',
            description: 'With your permission, Google Analytics uses cookies to measure visits to this website. You can accept or reject analytics and change your choice in the footer. <a class="cc-link" href="{{ "/privacy/" | relative_url }}">Privacy notice</a>.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Cookie preferences'
          },
          preferencesModal: {
            title: 'Manage cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Accept current selection',
            closeIconLabel: 'Close modal',
            sections: [
              {
                title: 'Cookie usage',
                description: 'Analytics is optional. Your choice is saved in this browser, and you can change it using Cookie preferences in the footer.'
              },
              {
                title: 'Consent preference',
                description: 'The cc_cookie cookie remembers your privacy choices. It is not used for analytics.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analytics cookies',
                description: 'Google Analytics uses _ga cookies to measure visits, page views, traffic sources, and interactions. Advertising consent remains disabled.',
                linkedCategory: 'analytics'
              },
              {
                title: 'More information',
                description: 'See the <a class="cc-link" href="{{ "/privacy/" | relative_url }}">privacy notice</a> for details and contact information.'
              }
            ]
          }
        }
      }
    },

    // Runs on the first choice and on later page loads with saved consent.
    onConsent: function(consentData) {
      updateConsentMode(consentData);
    },

    // Callback when user changes preferences
    onChange: function(consentData) {
      updateConsentMode(consentData);
    }
  });

  function updateConsentMode(consentData) {
    // CookieConsent v3 supplies { cookie: { categories: string[] } }.
    var analyticsAllowed = consentData.cookie.categories.includes('analytics');
    // Denied consent alone can still allow cookieless pings from a loaded tag.
    window[googleAnalyticsDisableKey] = !analyticsAllowed;

    gtag('consent', 'update', {
      'analytics_storage': analyticsAllowed ? 'granted' : 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied'
    });
  }
}

// Initialize when the library is available
initializeCookieConsent();

