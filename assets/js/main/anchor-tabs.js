// Targets: themes/blowfish/layouts/shortcodes/tabs.html, layouts/partials/docs/toc.html
// Elements: .tab__container, .tab__nav, .tab__content, .tab__button, .tab__panel, .tab--active

// A heading inside an inactive tab cannot be scrolled to, so any anchor
// pointing at one silently does nothing. That affects TOC entries, the heading
// copy-link button, and links pasted from elsewhere. Before honouring a hash,
// open whichever tabs contain the target.

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".tab__container")) return;

  const panelsOf = (container) =>
    Array.from(
      container.querySelectorAll(":scope > .tab__content > .tab__panel"),
    );

  const buttonsOf = (container) =>
    Array.from(container.querySelectorAll(":scope > .tab__nav .tab__button"));

  const activate = (container, index) => {
    panelsOf(container).forEach((panel, i) => {
      panel.classList.toggle("tab--active", i === index);
    });
    buttonsOf(container).forEach((button, i) => {
      button.classList.toggle("tab--active", i === index);
      button.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  };

  // Walk outwards so a target nested in tabs-within-tabs opens every level
  const reveal = (element) => {
    let panel = element.closest(".tab__panel");

    while (panel) {
      const container = panel.closest(".tab__container");
      if (!container) return;

      const index = panelsOf(container).indexOf(panel);
      if (index >= 0) activate(container, index);

      panel = container.parentElement?.closest(".tab__panel") || null;
    }
  };

  const targetOf = (hash) => {
    if (!hash || hash.length < 2) return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  };

  // Clicks: open the tab first, then let the browser do the scrolling
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const target = targetOf(link.getAttribute("href"));
    if (target) reveal(target);
  });

  // Direct hits: the browser already failed to scroll to a hidden target, so
  // scroll manually once it is visible. scroll-margin-top handles the offset.
  const revealHash = () => {
    const target = targetOf(window.location.hash);
    if (!target) return;
    reveal(target);
    target.scrollIntoView();
  };

  window.addEventListener("hashchange", revealHash);
  if (window.location.hash) revealHash();
});
