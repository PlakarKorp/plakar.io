// Targets: layouts/partials/components/badges/discord-badge.html
// Elements: .discord-members-count

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".discord-members-count");
  if (!els.length) return;

  const invite = els[0].dataset.invite;
  if (!invite) return;

  const cacheKey = `discord_members_count`;
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

  fetch(`https://discord.com/api/invites/${invite}?with_counts=true`)
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((data) => {
      if (data.approximate_member_count == null) return;
      els.forEach((el) => (el.textContent = data.approximate_member_count));
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            value: data.approximate_member_count,
            expiresAt: Date.now() + ttl,
          }),
        );
      } catch (_) {}
    })
    .catch(() => {
      els.forEach((el) => (el.textContent = "0"));
    });
});
