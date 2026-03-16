// Targets: layouts/partials/docs/sidebar.html
// Elements: .sidebar-accordion, .sidebar-accordion-btn, .sidebar-accordion-content
// Elements: .version-selector, .version-selector-btn, .version-selector-menu

document.addEventListener("DOMContentLoaded", () => {
  // --- Accordion ---
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

  // --- Version selector ---
  const selectorBtn = document.querySelector(".version-selector-btn");
  const selectorMenu = document.querySelector(".version-selector-menu");

  selectorBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    selectorMenu?.classList.toggle("hidden");
  });

  document.querySelectorAll(".version-selector-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const samePage = option.dataset.samePage;
      window.location.href = samePage || option.getAttribute("href");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".version-selector")) {
      selectorMenu?.classList.add("hidden");
    }
  });
});
