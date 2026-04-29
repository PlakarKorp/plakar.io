// Targets: layouts/partials/components/badges/discord-badge.html
// Elements: .discord-members-count

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".discord-members-count");
  if (!els.length) return;

  const invite = els[0].dataset.invite;
  if (!invite) return;

  const cacheKey = `discord_members_count`;
  const ttl = 60 * 60 * 1000;

  const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
  if (cached && Date.now() < cached.expiresAt) {
    els.forEach((el) => (el.textContent = cached.value));
    return;
  }

  fetch(`https://discord.com/api/invites/${invite}?with_counts=true`)
    .then((r) => r.json())
    .then((data) => {
      if (!data.approximate_member_count) return;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          value: data.approximate_member_count,
          expiresAt: Date.now() + ttl,
        }),
      );
      els.forEach((el) => (el.textContent = data.approximate_member_count));
    })
    .catch(() => {
      els.forEach((el) => (el.textContent = "0"));
    });
});
