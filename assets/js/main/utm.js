// Targets: every page (main bundle), used by newsletter.js, contact.js, book-demo-modal.js
// Depends: assets/js/main/consent.js
// Exposes: window.submitHubSpotForm

// HubSpot attributes a form submission to a campaign through its tracking
// cookie, which only exists once the visitor grants analytics consent (see
// hubspot.js), and it often misses the landing page's UTMs anyway. So we send
// the utm_* parameters the visitor landed with as explicit form fields.
//
// Two sources, in order:
// 1. The current page URL. No storage involved, so it needs no consent.
// 2. sessionStorage, written only after analytics consent is granted and only
//    while the landing URL still carries UTMs. Holds the utm_* values alone,
//    no identifier, and is cleared when the tab closes. A visitor who declines
//    gets nothing stored, and keeps attribution only if they submit a form on
//    the landing page itself.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
const UTM_STORAGE_KEY = "plakar_utm";

const utmFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  });
  return utm;
};

const utmFromStorage = () => {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

// First landing in the tab wins, so internal navigation doesn't erase it.
const landingUtm = utmFromUrl();
if (Object.keys(landingUtm).length && window.onAnalyticsConsent) {
  window.onAnalyticsConsent(() => {
    if (Object.keys(utmFromStorage()).length) return;
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(landingUtm));
    } catch {
      // Storage blocked: submissions fall back to the URL alone.
    }
  });
}

// Posts to the HubSpot Forms API with the UTMs added as fields. A form that
// doesn't define the utm_* fields rejects the whole submission with a 400
// (FIELD_NOT_IN_FORM_DEFINITION), so retry once without them rather than lose
// the lead.
window.submitHubSpotForm = async (url, payload) => {
  const post = (body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const utm = { ...utmFromStorage(), ...utmFromUrl() };
  const utmFields = Object.entries(utm).map(([name, value]) => ({
    name,
    value,
  }));
  if (!utmFields.length) return post(payload);

  const res = await post({
    ...payload,
    fields: [...payload.fields, ...utmFields],
  });
  if (res.status !== 400) return res;
  return post(payload);
};
