// Targets: layouts/partials/home/integrations.html, layouts/partials/home/community.html
// Elements: .home-marquee
//
// Browsers keep the marquee animation's clock running while the tab is hidden,
// so the rows jump when you come back. Pausing them while hidden makes them
// resume where they were.

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".home-marquee")) return;

  const sync = () =>
    document.documentElement.classList.toggle("is-tab-hidden", document.hidden);

  document.addEventListener("visibilitychange", sync);
  sync();
});
