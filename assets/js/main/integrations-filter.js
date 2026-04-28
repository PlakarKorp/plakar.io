// Targets: layouts/integrations/list.html
// Elements: #integrations-grid, #integrations-filter, .filter-btn, [data-categories]

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("integrations-grid");
  const filter = document.getElementById("integrations-filter");
  if (!grid || !filter) return;

  const buttons = filter.querySelectorAll(".filter-btn");
  const cards = grid.querySelectorAll("[data-categories]");

  const applyFilter = (category) => {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle("bg-primary-500", isActive);
      btn.classList.toggle("text-neutral-50", isActive);
      btn.classList.toggle("text-neutral-700", !isActive);
      btn.classList.toggle("hover:bg-neutral-100", !isActive);
    });

    cards.forEach((card) => {
      if (category === "all") {
        card.style.display = "";
        return;
      }
      const categories = card.dataset.categories
        .split(",")
        .map((c) => c.trim().toLowerCase());
      card.style.display = categories.some((c) => c.includes(category))
        ? ""
        : "none";
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const category = btn.dataset.filter;
      applyFilter(category);

      const url = new URL(window.location);
      if (category === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", category);
      }
      history.pushState({}, "", url);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "all";
  applyFilter(category);
});
