// Targets: layouts/_default/_markup/render-heading.html
// Elements: button.heading-anchor, .heading-anchor-icon, .heading-anchor-done

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button.heading-anchor");
  if (!buttons.length) return;

  const copy = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const input = document.createElement("input");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "absolute";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  };

  buttons.forEach((btn) => {
    const icon = btn.querySelector(".heading-anchor-icon");
    const done = btn.querySelector(".heading-anchor-done");

    btn.addEventListener("click", async () => {
      const anchor = btn.dataset.anchor;
      if (!anchor) return;

      const url = `${window.location.origin}${window.location.pathname}#${anchor}`;

      try {
        await copy(url);
      } catch {
        return;
      }

      history.replaceState(null, "", `#${anchor}`);

      icon.classList.add("hidden");
      done.classList.remove("hidden");

      clearTimeout(btn.resetTimer);
      btn.resetTimer = setTimeout(() => {
        done.classList.add("hidden");
        icon.classList.remove("hidden");
      }, 1500);
    });
  });
});
