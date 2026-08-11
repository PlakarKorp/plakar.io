// Targets: layouts/partials/extend-head.html
// Elements: #gtm-config

document.addEventListener("DOMContentLoaded", () => {
  const config = document.getElementById("gtm-config");
  if (!config) return;

  const id = config.dataset.id;
  if (!id) return;

  // Google Consent Mode v2 defaults (must run before the GTM loader below).
  // Consent *updates* are driven natively by Axeptio's Google Consent Mode v2
  // integration (project vendor `google_consent_mode_v2`, googleConsentMode
  // enabled in the Axeptio config) — it pushes gtag('consent','update',...) on
  // the user's choice, so no custom _axcb bridge is needed here.
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  gtag("set", "url_passthrough", true);
  gtag("set", "ads_data_redaction", true);

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", id);
});
