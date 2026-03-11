// Targets: layouts/partials/components/badges/discord-badge.html
// Elements: .discord-members-count

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".discord-members-count");
  if (!els.length) return;

  const invite = els[0].dataset.invite;
  if (!invite) return;

  fetch(`https://discord.com/api/invites/${invite}?with_counts=true`)
    .then((r) => r.json())
    .then((data) => {
      if (!data.approximate_member_count) return;
      els.forEach((el) => (el.textContent = data.approximate_member_count));
    })
    .catch(() => {
      els.forEach((el) => (el.textContent = "..."));
    });
});
