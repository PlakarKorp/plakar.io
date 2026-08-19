// Targets: layouts/partials/docs/toc.html
// Elements: .toc-content a, .tab__button

document.addEventListener("DOMContentLoaded", () => {
  const toc = document.querySelector(".toc-content");
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  // Track exactly what the TOC links to, rather than a hardcoded set of levels
  const targets = new Map();
  links.forEach((link) => {
    try {
      const target = document.getElementById(
        decodeURIComponent(link.getAttribute("href").slice(1)),
      );
      if (target) targets.set(link, target);
    } catch {
      /* ignore ids that are not valid selectors */
    }
  });

  const headings = Array.from(targets.values());
  if (!headings.length) return;

  // A heading in a closed tab is display:none and reports no client rects. That
  // also covers nesting, since an ancestor being hidden hides the heading too.
  const isVisible = (element) => element.getClientRects().length > 0;

  // The sidebar lists only what is actually on screen, so switching tabs swaps
  // which of their headings are offered rather than showing every variant at
  // once. Without this a page like the vSphere install lists both the OVA and
  // ISO walkthroughs, including headings that repeat between them.
  const syncVisibility = () => {
    links.forEach((link) => {
      const target = targets.get(link);
      link.dataset.tocHidden = target && !isVisible(target) ? "1" : "";
    });

    // Hide a row only when nothing inside it is reachable, so a visible heading
    // nested under a hidden one keeps its parent row
    toc.querySelectorAll("li").forEach((item) => {
      const reachable = Array.from(item.querySelectorAll("a")).some(
        (link) => link.dataset.tocHidden !== "1",
      );
      item.style.display = reachable ? "" : "none";
    });
  };

  const setActive = (id) => {
    links.forEach((link) => link.classList.remove("active"));
    if (!id) return;
    toc.querySelector(`a[href="#${CSS.escape(id)}"]`)?.classList.add("active");
  };

  const onScroll = () => {
    let current = null;
    for (const heading of headings) {
      if (!isVisible(heading)) continue;
      if (heading.getBoundingClientRect().top <= 120) current = heading.id;
    }
    setActive(current);
  };

  const refresh = () =>
    requestAnimationFrame(() => {
      syncVisibility();
      onScroll();
    });

  window.addEventListener("scroll", onScroll, { passive: true });

  // Switching tabs changes which headings exist on screen
  document.addEventListener("click", (event) => {
    if (event.target.closest(".tab__button")) refresh();
  });

  // anchor-tabs.js may open a tab for an incoming hash, and it can run either
  // side of this file depending on bundle order, so settle after it
  window.addEventListener("hashchange", refresh);

  syncVisibility();
  onScroll();
  refresh();
});
