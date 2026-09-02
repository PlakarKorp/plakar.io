// Targets: layouts/integrations/list.html
// Elements: #integrations-grid, #integrations-search, #integrations-author,
// #integrations-type, #integrations-platform, #integrations-sort,
// #integrations-reset, #integrations-empty-reset, #integrations-result-note,
// #integrations-empty-filters, #integrations-empty-community, [data-stat]

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("integrations-grid");
  if (!grid) return;

  const searchInput = document.getElementById("integrations-search");
  const authorContainer = document.getElementById("integrations-author");
  const typeSelect = document.getElementById("integrations-type");
  const platformContainer = document.getElementById("integrations-platform");
  const sortContainer = document.getElementById("integrations-sort");
  const resultNote = document.getElementById("integrations-result-note");
  const resetBtn = document.getElementById("integrations-reset");
  const emptyResetBtn = document.getElementById("integrations-empty-reset");
  const emptyFilters = document.getElementById("integrations-empty-filters");
  const emptyCommunity = document.getElementById(
    "integrations-empty-community",
  );

  const authorButtons = authorContainer
    ? Array.from(authorContainer.querySelectorAll("[data-author]"))
    : [];
  const platformButtons = platformContainer
    ? Array.from(platformContainer.querySelectorAll("[data-platform]"))
    : [];
  const sortButtons = sortContainer
    ? Array.from(sortContainer.querySelectorAll("[data-sort]"))
    : [];
  const cards = Array.from(grid.querySelectorAll("[data-categories]"));
  const totalCount = cards.length;

  const state = {
    q: "",
    author: "all",
    type: "all",
    platform: "all",
    sort: "date",
  };

  // Active state is expressed as ARIA, and the styling hangs off
  // `aria-selected:` / `aria-pressed:` variants in the template.
  const setActive = (buttons, attr, value, ariaName) => {
    buttons.forEach((btn) => {
      btn.setAttribute(ariaName, String(btn.dataset[attr] === value));
    });
  };

  const hasActiveFilters = () =>
    !!state.q || state.type !== "all" || state.platform !== "all";

  const applyVisibility = () => {
    const q = state.q.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.dataset.categories
        .split(",")
        .map((c) => c.trim().toLowerCase());
      const editions = (card.dataset.editions || "")
        .split(",")
        .map((c) => c.trim().toLowerCase());
      const author = card.dataset.author || "";

      const matchesAuthor = state.author === "all" || author === state.author;
      const matchesType =
        state.type === "all" || categories.includes(state.type);
      const matchesPlatform =
        state.platform === "all" || editions.includes(state.platform);
      const matchesSearch = !q || (card.dataset.search || "").includes(q);

      const visible =
        matchesAuthor && matchesType && matchesPlatform && matchesSearch;
      card.style.display = visible ? "" : "none";
      if (visible) visibleCount += 1;
    });

    if (resultNote) {
      resultNote.textContent = `${visibleCount} / ${totalCount} integrations`;
    }
    if (resetBtn) resetBtn.hidden = !hasActiveFilters();

    const showCommunityEmpty =
      visibleCount === 0 && state.author === "community" && !hasActiveFilters();
    if (emptyCommunity) emptyCommunity.hidden = !showCommunityEmpty;
    if (emptyFilters)
      emptyFilters.hidden = !(visibleCount === 0 && !showCommunityEmpty);
  };

  const setAuthorActive = (v) =>
    setActive(authorButtons, "author", v, "aria-selected");
  const setPlatformActive = (v) =>
    setActive(platformButtons, "platform", v, "aria-pressed");

  const applySort = (sortBy) => {
    state.sort = sortBy;
    setActive(sortButtons, "sort", sortBy, "aria-pressed");
    const sorted = [...cards].sort((a, b) => {
      if (sortBy === "name")
        return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      return parseInt(b.dataset.date, 10) - parseInt(a.dataset.date, 10);
    });
    sorted.forEach((card) => grid.appendChild(card));
  };

  const resetFilters = () => {
    state.q = "";
    state.type = "all";
    state.platform = "all";
    if (searchInput) searchInput.value = "";
    if (typeSelect) typeSelect.value = "all";
    setPlatformActive("all");
    applyVisibility();
  };

  searchInput?.addEventListener("input", () => {
    state.q = searchInput.value;
    applyVisibility();
  });

  authorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.author = btn.dataset.author;
      setAuthorActive(state.author);
      applyVisibility();
    });
  });

  authorContainer?.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const idx = authorButtons.findIndex(
      (b) => b.dataset.author === state.author,
    );
    const step = e.key === "ArrowRight" ? 1 : authorButtons.length - 1;
    const next = authorButtons[(idx + step) % authorButtons.length];
    if (!next) return;
    e.preventDefault();
    next.click();
    next.focus();
  });

  typeSelect?.addEventListener("change", () => {
    state.type = typeSelect.value;
    applyVisibility();
  });

  platformButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.platform = btn.dataset.platform;
      setPlatformActive(state.platform);
      applyVisibility();
    });
  });

  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applySort(btn.dataset.sort);
    });
  });

  // `/` focuses the search box, matching the kbd hint in the panel.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
    const active = document.activeElement;
    const tag = active?.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (active?.isContentEditable) return;
    if (!searchInput) return;
    e.preventDefault();
    searchInput.focus();
  });

  resetBtn?.addEventListener("click", resetFilters);
  emptyResetBtn?.addEventListener("click", resetFilters);

  document.querySelectorAll("[data-stat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stat = btn.dataset.stat;
      if (stat === "all") {
        resetFilters();
      } else {
        if (stat === "storage") {
          state.type = "storage";
          if (typeSelect) typeSelect.value = "storage";
        }
        applyVisibility();
      }
      searchInput
        ?.closest("section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  setAuthorActive("all");
  setPlatformActive("all");
  applySort("date");
  applyVisibility();
});
