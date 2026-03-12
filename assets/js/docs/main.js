// Targets: layouts/partials/docs/toc.html
// Elements: .toc-content a, h2[id], h3[id]

document.addEventListener("DOMContentLoaded", () => {
  const toc = document.querySelector(".toc-content");
  if (!toc) return;

  const headings = Array.from(
    document.querySelectorAll("h2 .anchor, h3 .anchor"),
  );
  if (!headings.length) return;

  const links = toc.querySelectorAll("a");

  const setActive = (id) => {
    links.forEach((a) => a.classList.remove("active"));
    const active = toc.querySelector(`a[href="#${CSS.escape(id)}"]`);
    active?.classList.add("active");
  };

  const onScroll = () => {
    let current = null;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= 120) current = h.id;
    }
    if (current) setActive(current);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
