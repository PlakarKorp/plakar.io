// Targets: layouts/goodies/single.html
// Elements: #goodies-grid, .goodies-card, #goodies-filters .goodies-chip, #goodies-empty
//
// Nestor sticker gallery: client-side filter by series. No voting.

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("goodies-grid");
  if (!grid) return;

  const filtersEl = document.getElementById("goodies-filters");
  const emptyEl = document.getElementById("goodies-empty");
  const cards = [...grid.querySelectorAll(".goodies-card")];
  let activeFilter = "all";

  const applyFilter = () => {
    let visible = 0;
    cards.forEach((card) => {
      const show =
        activeFilter === "all" || card.dataset.series === activeFilter;
      card.hidden = !show;
      if (show) visible++;
    });
    if (emptyEl) emptyEl.hidden = visible > 0;
  };

  if (filtersEl) {
    filtersEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".goodies-chip");
      if (!chip) return;
      activeFilter = chip.dataset.filter;
      filtersEl.querySelectorAll(".goodies-chip").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      applyFilter();
    });
  }

  applyFilter();
});
