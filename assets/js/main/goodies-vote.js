// Targets: layouts/goodies/single.html
// Elements: #goodies-grid, .goodies-card, .goodies-vote-btn, .goodies-count,
//   #goodies-filters .goodies-chip, #goodies-view-toggle .goodies-view-btn,
//   #goodies-mine-count, #goodies-empty
//
// Nestor sticker vote. Votes persist per device in localStorage today. To make
// tallies global, replace the body of vote() with an API call (see the comment
// inside it): every other line in this file already renders whatever vote()
// returns, so that one function is the only thing that changes.

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("goodies-grid");
  if (!grid) return;

  const filtersEl = document.getElementById("goodies-filters");
  const viewToggleEl = document.getElementById("goodies-view-toggle");
  const mineCountEl = document.getElementById("goodies-mine-count");
  const emptyEl = document.getElementById("goodies-empty");

  const BALLOT_KEY = "plakar:goodies:ballot:v1";

  let activeFilter = "all";
  let activeView = "grid";

  // --- Persistence -----------------------------------------------------------

  function readBallot() {
    try {
      return new Set(JSON.parse(localStorage.getItem(BALLOT_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function writeBallot(ballot) {
    try {
      localStorage.setItem(BALLOT_KEY, JSON.stringify([...ballot]));
    } catch (e) {
      /* storage unavailable (private mode): votes stay in-memory this session */
    }
  }

  // The single swap point. Returns a Promise of { voted, count } for `slug`.
  // Today it toggles a per-device ballot in localStorage, so `count` is 0 or 1.
  // To go global, swap the localStorage block for an API call, for example:
  //
  //   const res = await fetch("/api/goodies/vote", {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({ slug, vote: shouldVote }),
  //   });
  //   const data = await res.json();
  //   return { voted: data.voted, count: data.count };
  //
  async function vote(slug, shouldVote) {
    const ballot = readBallot();
    if (shouldVote) {
      ballot.add(slug);
    } else {
      ballot.delete(slug);
    }
    writeBallot(ballot);
    const voted = ballot.has(slug);
    return { voted, count: voted ? 1 : 0 };
  }

  // --- Rendering -------------------------------------------------------------

  const cards = [...grid.querySelectorAll(".goodies-card")];

  function getCount(card) {
    return parseInt(card.querySelector(".goodies-count").textContent, 10) || 0;
  }

  function paintCard(card, voted, count) {
    const btn = card.querySelector(".goodies-vote-btn");
    const label = btn.querySelector(".goodies-vote-label");
    const countEl = card.querySelector(".goodies-count");
    btn.setAttribute("aria-pressed", String(voted));
    btn.classList.toggle("is-voted", voted);
    label.textContent = voted ? "Voted" : "Vote";
    countEl.textContent = count;
  }

  function updateMine() {
    if (mineCountEl) mineCountEl.textContent = String(readBallot().size);
  }

  function applyState() {
    const isVisible = (card) =>
      activeFilter === "all" || card.dataset.series === activeFilter;

    const visible = cards.filter(isVisible);
    const hidden = cards.filter((c) => !isVisible(c));
    cards.forEach((c) => {
      c.hidden = !isVisible(c);
    });

    const ordered =
      activeView === "standings"
        ? [...visible].sort(
            (a, b) =>
              getCount(b) - getCount(a) ||
              Number(a.dataset.order) - Number(b.dataset.order),
          )
        : [...visible].sort(
            (a, b) => Number(a.dataset.order) - Number(b.dataset.order),
          );

    // Re-attach in the resolved order; park hidden cards at the end.
    ordered.forEach((c) => grid.appendChild(c));
    hidden.forEach((c) => grid.appendChild(c));

    ordered.forEach((card, idx) => {
      const rankEl = card.querySelector(".goodies-rank");
      if (activeView === "standings") {
        const rank = idx + 1;
        const top3 = rank <= 3 && getCount(card) > 0;
        rankEl.textContent = "#" + rank;
        rankEl.hidden = false;
        rankEl.classList.toggle("is-top3", top3);
        card.classList.toggle("is-top3", top3);
      } else {
        rankEl.hidden = true;
        rankEl.textContent = "";
        rankEl.classList.remove("is-top3");
        card.classList.remove("is-top3");
      }
    });

    grid.dataset.view = activeView;
    if (emptyEl) emptyEl.hidden = visible.length > 0;
  }

  // --- Events ----------------------------------------------------------------

  grid.addEventListener("click", async (e) => {
    const btn = e.target.closest(".goodies-vote-btn");
    if (!btn) return;
    const card = btn.closest(".goodies-card");
    const slug = btn.dataset.slug;
    const willVote = btn.getAttribute("aria-pressed") !== "true";

    // Optimistic update, then reconcile with whatever vote() reports back.
    paintCard(card, willVote, willVote ? 1 : 0);
    updateMine();
    try {
      const { voted, count } = await vote(slug, willVote);
      paintCard(card, voted, count);
    } catch (err) {
      paintCard(card, !willVote, !willVote ? 1 : 0);
    }
    updateMine();
    if (activeView === "standings") applyState();
  });

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
      applyState();
    });
  }

  if (viewToggleEl) {
    viewToggleEl.addEventListener("click", (e) => {
      const b = e.target.closest(".goodies-view-btn");
      if (!b) return;
      activeView = b.dataset.view;
      viewToggleEl.querySelectorAll(".goodies-view-btn").forEach((c) => {
        const on = c === b;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      applyState();
    });
  }

  // --- Init ------------------------------------------------------------------

  (function init() {
    const ballot = readBallot();
    cards.forEach((card) => {
      const slug = card.querySelector(".goodies-vote-btn").dataset.slug;
      const voted = ballot.has(slug);
      paintCard(card, voted, voted ? 1 : 0);
    });
    updateMine();
    applyState();
  })();
});
