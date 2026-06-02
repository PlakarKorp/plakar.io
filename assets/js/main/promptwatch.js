// Targets: layouts/partials/extend-head.html
// Elements: #promptwatch-config

document.addEventListener("DOMContentLoaded", () => {
  const config = document.getElementById("promptwatch-config");
  if (!config) return;

  const projectId = config.dataset.projectId;
  if (!projectId) return;

  const script = document.createElement("script");
  script.setAttribute("data-project-id", projectId);
  script.src = "https://ingest.promptwatch.com/js/client.min.js";
  document.head.appendChild(script);
});
