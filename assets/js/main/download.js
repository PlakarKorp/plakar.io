// Targets: layouts/download/list.html
// Elements: #version-dropdown-btn, #version-dropdown-menu, #current-version-display
// Elements: #release-notes-link, .version-option, .version-panel, .version-badge, .sha-copy-btn

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("version-dropdown-btn");
  const menu = document.getElementById("version-dropdown-menu");
  const currentVersionDisplay = document.getElementById(
    "current-version-display",
  );
  const releaseNotesLink = document.getElementById("release-notes-link");
  const panels = document.querySelectorAll(".version-panel");
  const badges = document.querySelectorAll(".version-badge");
  const options = document.querySelectorAll(".version-option");

  const showVersion = (version) => {
    if (currentVersionDisplay) currentVersionDisplay.textContent = version;

    panels.forEach((p) => {
      p.style.display = p.dataset.version === version ? "" : "none";
    });

    badges.forEach((b) => {
      b.style.display = b.dataset.version === version ? "" : "none";
    });

    options.forEach((o) => {
      const active = o.dataset.version === version;
      o.classList.toggle("bg-primary-50", active);
      o.classList.toggle("text-primary-700", active);
      o.classList.toggle("font-medium", active);
      if (active && releaseNotesLink && o.dataset.releaseNotesUrl) {
        releaseNotesLink.href = o.dataset.releaseNotesUrl;
      }
    });

    const url = new URL(window.location);
    url.searchParams.set("version", version);
    history.pushState({}, "", url);

    menu?.classList.add("hidden");
  };

  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu?.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("#version-dropdown-btn") &&
      !e.target.closest("#version-dropdown-menu")
    ) {
      menu?.classList.add("hidden");
    }
  });

  options.forEach((o) => {
    o.addEventListener("click", () => showVersion(o.dataset.version));
  });

  const params = new URLSearchParams(window.location.search);
  const firstPanel = panels[0];
  const version = params.get("version") || firstPanel?.dataset.version;
  if (version) showVersion(version);

  document.querySelectorAll(".sha-copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sha = btn.dataset.sha;
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(sha);
        btn.textContent = "Copied!";
      } catch {
        btn.textContent = "Failed";
      }
      setTimeout(() => {
        btn.textContent = original;
      }, 1500);
    });
  });
});
