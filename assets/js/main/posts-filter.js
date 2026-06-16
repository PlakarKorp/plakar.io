// Targets: layouts/posts/list.html
// Elements: #posts-filter, .filter-btn, #posts-grid, [data-categories], .posts-filter-dropdown

document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("posts-filter");
  const filterDropdown = document.querySelector(".posts-filter-dropdown");
  const filterDropdownBtn = filterDropdown?.querySelector(".posts-filter-dropdown-btn");
  const filterDropdownMenu = filterDropdown?.querySelector(".posts-filter-dropdown-menu");
  const filterDropdownLabel = filterDropdown?.querySelector(".posts-filter-dropdown-label");
  const grid = document.getElementById("posts-grid");
  if (!grid || (!filter && !filterDropdown)) return;

  const buttons = filter ? filter.querySelectorAll(".filter-btn") : [];
  const cards = grid.querySelectorAll("[data-categories]");

  const filterLabels = {
    all: "All Posts",
    announcement: "Announcement",
    "release-note": "Release Notes",
    community: "Community",
    insights: "Insights",
    technology: "Technology",
  };

  const applyFilter = (category) => {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle("bg-primary-500", isActive);
      btn.classList.toggle("text-neutral-50", isActive);
      btn.classList.toggle("text-neutral-700", !isActive);
      btn.classList.toggle("hover:bg-neutral-100", !isActive);
    });

    if (filterDropdownLabel) {
      filterDropdownLabel.textContent = filterLabels[category] || category;
    }
    filterDropdown?.querySelectorAll(".filter-dropdown-option").forEach((opt) => {
      const isActive = opt.dataset.filter === category;
      opt.classList.toggle("text-primary-500", isActive);
      opt.classList.toggle("bg-neutral-100", isActive);
    });

    cards.forEach((card) => {
      if (category === "all") {
        card.style.display = "";
        return;
      }
      const cardCategories = (card.dataset.categories || "").split(" ").filter(Boolean);
      card.style.display = cardCategories.includes(category) ? "" : "none";
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

  filterDropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    filterDropdownMenu?.classList.toggle("hidden");
  });

  filterDropdown?.querySelectorAll(".filter-dropdown-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.preventDefault();
      const category = opt.dataset.filter;
      applyFilter(category);
      filterDropdownMenu?.classList.add("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".posts-filter-dropdown")) {
      filterDropdownMenu?.classList.add("hidden");
    }
  });

  const params = new URLSearchParams(window.location.search);
  applyFilter(params.get("category") || "all");
});
