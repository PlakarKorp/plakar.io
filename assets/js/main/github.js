// Targets: layouts/partials/components/badges/github-badge.html
// Elements: .github-stars-count

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".github-stars-count");
  if (!els.length) return;

  const repo = els[0].dataset.repo;
  if (!repo) return;

  const cacheKey = `github_stars_count`;
  const ttl = 60 * 60 * 1000;

  let cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(cacheKey));
  } catch (_) {
    localStorage.removeItem(cacheKey);
  }

  if (cached && Date.now() < cached.expiresAt) {
    els.forEach((el) => (el.textContent = cached.value));
    return;
  }

  fetch(`https://api.github.com/repos/${repo}`)
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((data) => {
      if (typeof data.stargazers_count !== "number") return;
      els.forEach((el) => (el.textContent = data.stargazers_count));
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            value: data.stargazers_count,
            expiresAt: Date.now() + ttl,
          }),
        );
      } catch (_) {}
    })
    .catch(() => {
      els.forEach((el) => (el.textContent = cached?.value ?? "0"));
    });
});
