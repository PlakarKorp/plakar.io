// Targets: layouts/partials/components/badges/github-badge.html
// Elements: .github-stars-count

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".github-stars-count");
  if (!els.length) return;

  const repo = els[0].dataset.repo;
  if (!repo) return;

  const cacheKey = `github_stars_count`;
  const ttl = 60 * 60 * 1000;

  const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
  if (cached && Date.now() < cached.expiresAt) {
    els.forEach((el) => (el.textContent = cached.value));
    return;
  }

  fetch(`https://api.github.com/repos/${repo}`)
    .then((r) => r.json())
    .then((data) => {
      if (!data.stargazers_count) return;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          value: data.stargazers_count,
          expiresAt: Date.now() + ttl,
        }),
      );
      els.forEach((el) => (el.textContent = data.stargazers_count));
    })
    .catch(() => {
      els.forEach((el) => (el.textContent = "0"));
    });
});
