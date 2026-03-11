// Targets: layouts/partials/common/header/header-corporate.html
// Elements: .dropdown-group, .dropdown-btn, .dropdown-menu, .dropdown-chevron

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const dropdownGroups = document.querySelectorAll(".dropdown-group");

  const closeAll = () => {
    dropdownGroups.forEach((g) => {
      g.querySelector(".dropdown-menu")?.classList.add("hidden");
      const chevron = g.querySelector(".dropdown-chevron");
      if (chevron) chevron.style.transform = "";
    });
  };

  const setDropdownWidths = () => {
    if (!header || !nav) return;
    const headerRect = header.getBoundingClientRect();
    dropdownGroups.forEach((g) => {
      const menu = g.querySelector(".dropdown-menu");
      const btn = g.querySelector(".dropdown-btn");
      if (!menu || !btn) return;
      const btnRect = btn.getBoundingClientRect();
      menu.style.left = `${-(btnRect.left - headerRect.left)}px`;
      menu.style.width = `${headerRect.width}px`;
    });
  };

  dropdownGroups.forEach((g) => {
    const btn = g.querySelector(".dropdown-btn");
    const menu = g.querySelector(".dropdown-menu");
    const chevron = g.querySelector(".dropdown-chevron");
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !menu.classList.contains("hidden");
      closeAll();
      if (!isOpen) {
        menu.classList.remove("hidden");
        if (chevron) chevron.style.transform = "rotate(180deg)";
      }
    });

    g.addEventListener("mouseleave", (e) => {
      if (!g.contains(e.relatedTarget) && !header?.contains(e.relatedTarget))
        closeAll();
    });
  });

  header?.addEventListener("mouseleave", (e) => {
    if (![...dropdownGroups].some((g) => g.contains(e.relatedTarget)))
      closeAll();
  });

  document.addEventListener("click", (e) => {
    if (
      ![...dropdownGroups].some((g) => g.contains(e.target)) ||
      e.target.closest("a")
    )
      closeAll();
  });

  setDropdownWidths();
  window.addEventListener("resize", setDropdownWidths);
});
