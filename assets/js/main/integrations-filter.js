// Targets: layouts/integrations/list.html
// Elements: #integrations-grid, .integrations-filter-dropdown, #integrations-sort,
// .filter-dropdown-option, .edition-dropdown-option, .sort-btn, [data-categories], [data-editions]

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("integrations-grid");
  const filterDropdown = document.querySelector(
    ".integrations-filter-dropdown",
  );
  const filterDropdownBtn = filterDropdown?.querySelector(
    ".integrations-filter-dropdown-btn",
  );
  const filterDropdownMenu = filterDropdown?.querySelector(
    ".integrations-filter-dropdown-menu",
  );
  const filterDropdownLabel = filterDropdown?.querySelector(
    ".integrations-filter-dropdown-label",
  );
  const sortContainer = document.getElementById("integrations-sort");
  if (!grid || !filterDropdown) return;

  const categoryOptions = filterDropdown.querySelectorAll(
    ".filter-dropdown-option",
  );
  const editionOptions = filterDropdown.querySelectorAll(
    ".edition-dropdown-option",
  );
  const sortButtons = sortContainer
    ? sortContainer.querySelectorAll(".sort-btn")
    : [];

  const categoryLabels = {
    all: "All Categories",
    source: "Source",
    destination: "Destination",
    storage: "Storage",
    "secrets-manager": "Secrets Manager",
    inventories: "Inventories",
  };

  const editionLabels = {
    all: "All Editions",
    community: "Community",
    "control-plane": "Control Plane",
  };

  let activeCategory = "all";
  let activeEdition = "all";

  const updateLabel = () => {
    if (!filterDropdownLabel) return;
    if (activeCategory === "all" && activeEdition === "all") {
      filterDropdownLabel.textContent = "All Integrations";
      return;
    }
    const parts = [];
    if (activeCategory !== "all") parts.push(categoryLabels[activeCategory]);
    if (activeEdition !== "all") parts.push(editionLabels[activeEdition]);
    filterDropdownLabel.textContent = parts.join(" · ");
  };

  const updateVisibility = () => {
    const cards = grid.querySelectorAll("[data-categories]");
    cards.forEach((card) => {
      const categories = card.dataset.categories
        .split(",")
        .map((c) => c.trim().toLowerCase());
      const editions = (card.dataset.editions || "")
        .split(",")
        .map((c) => c.trim().toLowerCase());

      const matchesCategory =
        activeCategory === "all" ||
        categories.some((c) => c.includes(activeCategory));
      const matchesEdition =
        activeEdition === "all" || editions.includes(activeEdition);

      card.style.display = matchesCategory && matchesEdition ? "" : "none";
    });
  };

  const applyFilter = (category) => {
    activeCategory = category;
    categoryOptions.forEach((opt) => {
      const isActive = opt.dataset.filter === category;
      opt.classList.toggle("text-primary-500", isActive);
      opt.classList.toggle("bg-neutral-100", isActive);
    });
    updateLabel();
    updateVisibility();
  };

  const applyEditionFilter = (edition) => {
    activeEdition = edition;
    editionOptions.forEach((opt) => {
      const isActive = opt.dataset.edition === edition;
      opt.classList.toggle("text-primary-500", isActive);
      opt.classList.toggle("bg-neutral-100", isActive);
    });
    updateLabel();
    updateVisibility();
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

  categoryOptions.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter(opt.dataset.filter);
      filterDropdownMenu?.classList.add("hidden");

      const url = new URL(window.location);
      if (opt.dataset.filter === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", opt.dataset.filter);
      }
      history.pushState({}, "", url);
    });
  });

  editionOptions.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.preventDefault();
      applyEditionFilter(opt.dataset.edition);
      filterDropdownMenu?.classList.add("hidden");

      const url = new URL(window.location);
      if (opt.dataset.edition === "all") {
        url.searchParams.delete("edition");
      } else {
        url.searchParams.set("edition", opt.dataset.edition);
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

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".integrations-filter-dropdown")) {
      filterDropdownMenu?.classList.add("hidden");
    }
  });

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "all";
  const edition = params.get("edition") || "all";
  const sort = params.get("sort") || "name";
  applySort(sort);
  applyFilter(category);
  applyEditionFilter(edition);
});
