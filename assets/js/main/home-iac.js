// Targets: layouts/index.html
// Elements: #home-iac, [data-step]
//
// Resilience as code. On wide, tall enough screens the section is pinned and
// scrolling through it moves from one step to the next: data-stage picks the
// step shown, --iac-progress fills the rail. Clicking a step scrolls to it.
// Without pinning (small screens, reduced motion) CSS shows every step.

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("home-iac");
  if (!section) return;

  const sticky = section.querySelector(".home-iac-sticky");
  const steps = section.querySelectorAll("[data-step]").length;
  if (!sticky || steps < 2) return;

  const wide = window.matchMedia("(min-width: 1024px)");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pinned = false;

  const layout = () => {
    // Measure in the pinned layout: one step on screen, below the fixed header.
    section.classList.add("is-pinned");
    const fits =
      sticky.firstElementChild.offsetHeight + 112 <= window.innerHeight;
    pinned = wide.matches && !calm.matches && fits;
    section.classList.toggle("is-pinned", pinned);
    onScroll();
  };

  const onScroll = () => {
    if (!pinned) {
      section.dataset.stage = "0";
      return;
    }
    const travel = section.offsetHeight - window.innerHeight;
    const ratio = Math.min(
      Math.max(-section.getBoundingClientRect().top / travel, 0),
      0.9999,
    );
    const stage = String(Math.floor(ratio * steps));
    if (section.dataset.stage !== stage) section.dataset.stage = stage;
    section.style.setProperty("--iac-progress", ratio.toFixed(4));
  };

  section.querySelectorAll("[data-step]").forEach((step, i) => {
    step.addEventListener("click", () => {
      if (!pinned) return;
      const travel = section.offsetHeight - window.innerHeight;
      const top = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({
        top: top + (travel * (i + 0.5)) / steps,
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", layout);
  wide.addEventListener("change", layout);
  calm.addEventListener("change", layout);
  layout();
});
