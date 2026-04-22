// Targets: layouts/posts/list.html
// Elements: #posts-filter, .filter-btn, #posts-grid, [data-category]

document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("posts-filter");
  const grid = document.getElementById("posts-grid");
  if (!filter || !grid) return;

  const buttons = filter.querySelectorAll(".filter-btn");
  const cards = grid.querySelectorAll("[data-category]");

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
      card.style.display = card.dataset.category === category ? "" : "none";
    });

    const url = new URL(window.location);
    if (category === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", category);
    }
    history.pushState({}, "", url);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter(btn.dataset.filter);
    });
  });

  const params = new URLSearchParams(window.location.search);
  applyFilter(params.get("category") || "all");
});
