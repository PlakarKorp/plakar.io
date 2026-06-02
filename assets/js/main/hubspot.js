// Targets: layouts/partials/extend-head.html
// Elements: #hubspot-config

document.addEventListener("DOMContentLoaded", () => {
  const config = document.getElementById("hubspot-config");
  if (!config) return;

  const portalId = config.dataset.portalId;
  if (!portalId) return;

  const script = document.createElement("script");
  script.id = "hs-script-loader";
  script.async = true;
  script.defer = true;
  script.src = `//js.hs-scripts.com/${portalId}.js`;
  document.head.appendChild(script);
});
