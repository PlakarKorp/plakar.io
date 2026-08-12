// Targets: layouts/partials/extend-head.html
// Elements: #hubspot-config

document.addEventListener("DOMContentLoaded", () => {
  const config = document.getElementById("hubspot-config");
  if (!config) return;

  const portalId = config.dataset.portalId;
  if (!portalId) return;

  let loaded = false;
  const loadHubSpot = () => {
    if (loaded) return;
    loaded = true;
    const script = document.createElement("script");
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    script.src = `https://js.hs-scripts.com/${portalId}.js`;
    document.head.appendChild(script);
  };

  // HubSpot sets tracking cookies (hubspotutk, __hstc, …), so it must not load
  // before consent. Consent is driven by Axeptio's Google Consent Mode
  // integration and surfaced on the dataLayer; load HubSpot only once
  // `analytics_storage` is granted (matches how GA4/GTM tags are gated).
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

  // Returning visitor whose stored consent is already applied.
  if (analyticsGranted()) {
    loadHubSpot();
    return;
  }

  // Otherwise wait for Axeptio to apply the visitor's choice.
  window._axcb = window._axcb || [];
  window._axcb.push((axeptio) => {
    axeptio.on("cookies:complete", () => {
      if (analyticsGranted()) return loadHubSpot();
      // The consent update may land on the dataLayer just after this event.
      setTimeout(() => {
        if (analyticsGranted()) loadHubSpot();
      }, 0);
    });
  });
});
