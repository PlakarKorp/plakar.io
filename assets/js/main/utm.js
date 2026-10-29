// Targets: every page (main bundle), used by newsletter.js, contact.js, book-demo-modal.js
// Exposes: window.submitHubSpotForm

// HubSpot only attributes a form submission to a campaign when its tracking
// cookie was set, which needs analytics consent (see hubspot.js). To keep
// attribution for visitors who decline, remember the UTM parameters they
// landed with for this tab and send them as utm_* form fields.
// sessionStorage only: no identifier, cleared when the tab closes.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
const UTM_STORAGE_KEY = "plakar_utm";

const readStoredUtm = () => {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

// First landing in the session wins, so internal navigation doesn't erase it.
(() => {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  });
  if (!Object.keys(utm).length || Object.keys(readStoredUtm()).length) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // Storage blocked: the submission just goes out without UTMs.
  }
})();

// Posts to the HubSpot Forms API with the stored UTMs added as fields. A form
// that doesn't define the utm_* fields rejects the whole submission with a
// 400, so retry once without them rather than lose the lead.
window.submitHubSpotForm = async (url, payload) => {
  const post = (body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const utmFields = Object.entries(readStoredUtm()).map(([name, value]) => ({
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
