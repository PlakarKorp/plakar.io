// Targets: layouts/partials/components/badges/github-badge.html
// Elements: .github-stars-count

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".github-stars-count");
  if (!els.length) return;

  const repo = els[0].dataset.repo;
  if (!repo) return;

  fetch(`https://api.github.com/repos/${repo}`)
    .then((r) => r.json())
    .then((data) => {
      if (!data.stargazers_count) return;
      els.forEach((el) => (el.textContent = data.stargazers_count));
    })
    .catch(() => {});
});
