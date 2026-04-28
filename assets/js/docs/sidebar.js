// Targets: layouts/partials/docs/sidebar.html
// Targets: layouts/docs/single.html
// Targets: layouts/docs/list.html
// Elements: .sidebar-accordion, .sidebar-accordion-btn, .sidebar-accordion-content
// Elements: .version-selector, .version-selector-btn, .version-selector-menu
// Elements: #docs-sidebar-open, #docs-sidebar-close, #docs-sidebar-overlay, #docs-sidebar-mobile

document.addEventListener("DOMContentLoaded", () => {
  // Accordion
  document.querySelectorAll(".sidebar-accordion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const accordion = btn.closest(".sidebar-accordion");
      const content = accordion.querySelector(".sidebar-accordion-content");
      const chevron = accordion.querySelector(".sidebar-accordion-chevron");
      const isOpen = !content.classList.contains("hidden");

      content.classList.toggle("hidden");
      chevron.classList.toggle("rotate-180", !isOpen);
    });
  });

  // Version selector
  document.querySelectorAll(".version-selector-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = btn
        .closest(".version-selector")
        .querySelector(".version-selector-menu");
      menu?.classList.toggle("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".version-selector")) {
      document
        .querySelectorAll(".version-selector-menu")
        .forEach((m) => m.classList.add("hidden"));
    }
  });

  // Mobile sidebar
  const sidebarOpen = document.getElementById("docs-sidebar-open");
  const sidebarClose = document.getElementById("docs-sidebar-close");
  const sidebarOverlay = document.getElementById("docs-sidebar-overlay");
  const sidebarMobile = document.getElementById("docs-sidebar-mobile");

  const openSidebar = () => {
    sidebarMobile?.classList.remove("-translate-x-full");
    sidebarOverlay?.classList.remove("hidden");
  };

  const closeSidebar = () => {
    sidebarMobile?.classList.add("-translate-x-full");
    sidebarOverlay?.classList.add("hidden");
  };

  sidebarOpen?.addEventListener("click", openSidebar);
  sidebarClose?.addEventListener("click", closeSidebar);
  sidebarOverlay?.addEventListener("click", closeSidebar);
});
