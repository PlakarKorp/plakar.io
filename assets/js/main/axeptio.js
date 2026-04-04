// Targets: layouts/partials/extend-head.html
// Elements: #axeptio-config

document.addEventListener("DOMContentLoaded", () => {
  const config = document.getElementById("axeptio-config");
  if (!config) return;

  const clientId = config.dataset.clientId;
  const cookiesVersion = config.dataset.cookiesVersion;
  if (!clientId || !cookiesVersion) return;

  window.axeptioSettings = { clientId, cookiesVersion };

  const script = document.createElement("script");
  script.async = true;
  script.src = "//static.axept.io/sdk.js";
  document.head.appendChild(script);
});
