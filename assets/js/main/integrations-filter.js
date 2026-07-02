// Targets: layouts/integrations/list.html
// Elements: #integrations-grid, #integrations-filter, #integrations-sort, .filter-btn, .sort-btn, [data-categories]

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("integrations-grid");
  const filter = document.getElementById("integrations-filter");
  const filterDropdown = document.querySelector(".integrations-filter-dropdown");
  const filterDropdownBtn = filterDropdown?.querySelector(".integrations-filter-dropdown-btn");
  const filterDropdownMenu = filterDropdown?.querySelector(".integrations-filter-dropdown-menu");
  const filterDropdownLabel = filterDropdown?.querySelector(".integrations-filter-dropdown-label");
  const sortContainer = document.getElementById("integrations-sort");
  if (!grid || (!filter && !filterDropdown)) return;

  const filterButtons = filter ? filter.querySelectorAll(".filter-btn") : [];
  const sortButtons = sortContainer ? sortContainer.querySelectorAll(".sort-btn") : [];

  const filterLabels = {
    all: "All Integrations",
    source: "Source",
    destination: "Destination",
    storage: "Storage",
    viewer: "Viewer",
  };

  const applyFilter = (category) => {
    filterButtons.forEach((btn) => {
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

    const cards = grid.querySelectorAll("[data-categories]");
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

  const applySort = (sortBy) => {
    sortButtons.forEach((btn) => {
      const isActive = btn.dataset.sort === sortBy;
      btn.classList.toggle("bg-primary-500", isActive);
      btn.classList.toggle("text-neutral-50", isActive);
      btn.classList.toggle("text-neutral-700", !isActive);
      btn.classList.toggle("hover:bg-neutral-100", !isActive);
    });

    const cards = Array.from(grid.querySelectorAll("[data-categories]"));
    cards.sort((a, b) => {
      if (sortBy === "date") {
        return parseInt(b.dataset.date, 10) - parseInt(a.dataset.date, 10);
      }
      return (a.dataset.name || "").localeCompare(b.dataset.name || "");
    });
    cards.forEach((card) => grid.appendChild(card));
  };

  filterButtons.forEach((btn) => {
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

  sortButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const sortBy = btn.dataset.sort;
      applySort(sortBy);

      const url = new URL(window.location);
      if (sortBy === "name") {
        url.searchParams.delete("sort");
      } else {
        url.searchParams.set("sort", sortBy);
      }
      history.pushState({}, "", url);
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

      const url = new URL(window.location);
      if (category === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", category);
      }
      history.pushState({}, "", url);
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".integrations-filter-dropdown")) {
      filterDropdownMenu?.classList.add("hidden");
    }
  });

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "name";
  applySort(sort);
  applyFilter(category);
});
