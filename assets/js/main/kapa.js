// Targets: layouts/partials/extend-head.html
// Elements: #kapa-config

document.addEventListener("DOMContentLoaded", () => {
  const config = document.getElementById("kapa-config");
  if (!config) return;

  const websiteId = config.dataset.websiteId;
  if (!websiteId) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://widget.kapa.ai/kapa-widget.bundle.js";
  script.dataset.websiteId = websiteId;
  if (config.dataset.projectName) {
    script.dataset.projectName = config.dataset.projectName;
  }
  if (config.dataset.projectColor) {
    script.dataset.projectColor = config.dataset.projectColor;
  }
  if (config.dataset.projectLogo) {
    script.dataset.projectLogo = config.dataset.projectLogo;
  }
  document.head.appendChild(script);
});
