// Targets: layouts/partials/extend-head.html
// Elements: #hubspot-config
// Depends: assets/js/main/consent.js

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

  // HubSpot sets tracking cookies (hubspotutk, __hstc, ...), so it must not load
  // before consent: load it only once `analytics_storage` is granted (matches
  // how GA4/GTM tags are gated). The consent wait lives in consent.js.
  window.onAnalyticsConsent(loadHubSpot);
});
