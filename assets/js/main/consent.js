// Targets: every page (main bundle), used by hubspot.js and utm.js
// Exposes: window.onAnalyticsConsent

// Consent is driven by Axeptio's Google Consent Mode integration and surfaced
// on the dataLayer (see gtm.js). `onAnalyticsConsent(cb)` runs `cb` once
// `analytics_storage` is granted: right away for a returning visitor whose
// stored choice is already applied, otherwise when Axeptio applies the
// visitor's choice. It never runs `cb` for a visitor who declines.
window.onAnalyticsConsent = (cb) => {
  const analyticsGranted = () => {
    const dl = window.dataLayer || [];
    for (let i = dl.length - 1; i >= 0; i--) {
      const e = dl[i];
      if (!e) continue;
      // Axeptio `axeptio_update` event payload
      if (e.consent_mode) return e.consent_mode.analytics_storage === "granted";
      // gtag('consent', 'default'|'update', { analytics_storage })
      if (e[0] === "consent" && e[2] && e[2].analytics_storage) {
        return e[2].analytics_storage === "granted";
      }
    }
    return false;
  };

  if (analyticsGranted()) return cb();

  window._axcb = window._axcb || [];
  window._axcb.push((axeptio) => {
    axeptio.on("cookies:complete", () => {
      if (analyticsGranted()) return cb();
      // The consent update may land on the dataLayer just after this event.
      setTimeout(() => {
        if (analyticsGranted()) cb();
      }, 0);
    });
  });
};
