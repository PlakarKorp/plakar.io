// Targets: layouts/solutions/control-plane.html, layouts/solutions/plakar.html
// Elements: [data-landing-tabs], [role="tab"], [role="tabpanel"], [data-clip]
//
// Powers the deploy/install tab switcher and the copy-to-clipboard buttons on the
// product landing pages. Self-guards: no-op on pages that render none of these
// elements, so it is safe to bundle globally from extend-head.html.

document.addEventListener("DOMContentLoaded", () => {
  // ---- Tab switchers (WAI-ARIA) ----
  document.querySelectorAll("[data-landing-tabs]").forEach((group) => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((t) =>
      document.getElementById(t.getAttribute("aria-controls")),
    );

    const activate = (index, focus) => {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panels[i]) panels[i].hidden = !selected;
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(i));
      tab.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          activate((i + 1) % tabs.length, true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          activate((i - 1 + tabs.length) % tabs.length, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          activate(0, true);
        } else if (e.key === "End") {
          e.preventDefault();
          activate(tabs.length - 1, true);
        }
      });
    });
  });

  // ---- Copy-to-clipboard buttons ----
  document.querySelectorAll("[data-clip]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-clip");
      const label = btn.querySelector(".landing-copy__label");
      const previous = label ? label.textContent : null;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch {
          /* clipboard unavailable */
        }
        document.body.removeChild(ta);
      }
      btn.classList.add("is-copied");
      if (label) label.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("is-copied");
        if (label && previous !== null) label.textContent = previous;
      }, 1600);
    });
  });
});
