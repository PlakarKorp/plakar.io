// Targets: layouts/partials/common/header/header-corporate.html
// Targets: layouts/partials/common/header/header-corporate-menu-desktop.html
// Targets: layouts/partials/common/header/header-corporate-menu-mobile.html
// Elements: .dropdown-group, .dropdown-btn, .dropdown-menu, .dropdown-chevron
// Elements: #menu-button, #menu-close-button, #menu-mobile
// Elements: .accordion-item, .accordion-toggle, .accordion-content, .accordion-chevron

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const dropdownGroups = document.querySelectorAll(".dropdown-group");
  const menuButton = document.getElementById("menu-button");
  const menuClose = document.getElementById("menu-close-button");
  const menuMobile = document.getElementById("menu-mobile");

  // Desktop dropdown
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

  // Mobile menu
  menuButton?.addEventListener("click", () => {
    menuMobile?.classList.toggle("hidden");
  });

  menuClose?.addEventListener("click", () => {
    menuMobile?.classList.add("hidden");
  });

  // Mobile accordion
  document.querySelectorAll(".accordion-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      const chevron = toggle.querySelector(".accordion-chevron");
      const isOpen = !content?.classList.contains("hidden");

      content?.classList.toggle("hidden");
      content?.classList.toggle("flex");
      if (chevron) chevron.style.transform = isOpen ? "" : "rotate(180deg)";
    });
  });
});
