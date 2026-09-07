// Targets: layouts/changelog/project.html
// Elements: .changelog-switcher, .changelog-switcher-btn, .changelog-switcher-menu
// Elements: .changelog-release, .changelog-rail-link

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".changelog-switcher-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = btn
        .closest(".changelog-switcher")
        .querySelector(".changelog-switcher-menu");
      const open = menu?.classList.toggle("hidden") === false;
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  const closeSwitchers = () => {
    document.querySelectorAll(".changelog-switcher-menu").forEach((m) => {
      m.classList.add("hidden");
    });
    document.querySelectorAll(".changelog-switcher-btn").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
    });
  };

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".changelog-switcher")) closeSwitchers();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSwitchers();
  });

  // ---- Release rail ----
  const links = Array.from(document.querySelectorAll(".changelog-rail-link"));
  const releases = Array.from(document.querySelectorAll(".changelog-release"));
  if (!links.length || !releases.length) return;

  const setCurrent = (id) => {
    links.forEach((link) => {
      link.setAttribute(
        "aria-current",
        String(link.getAttribute("href") === `#${id}`),
      );
    });
  };

  // Track the last release whose heading has scrolled past the header, so the
  // rail marks the release you are reading rather than the next one down.
  const update = () => {
    let current = releases[0].id;
    for (const release of releases) {
      if (release.getBoundingClientRect().top - 130 <= 0) current = release.id;
      else break;
    }
    setCurrent(current);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
});
