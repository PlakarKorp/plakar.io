// Targets: layouts/partials/docs/page-header.html
// Elements: #copy-markdown-btn, #copy-md-icon, #copy-md-check, .open-in-selector-btn, .open-in-selector-menu

document.addEventListener("DOMContentLoaded", () => {
  const copyMdBtn = document.getElementById("copy-markdown-btn");
  const copyIcon = document.getElementById("copy-md-icon");
  const checkIcon = document.getElementById("copy-md-check");
  const openInBtn = document.querySelector(".open-in-selector-btn");
  const openInMenu = document.querySelector(".open-in-selector-menu");

  if (copyMdBtn) {
    copyMdBtn.addEventListener("click", async () => {
      const url = copyMdBtn.dataset.mdUrl;
      try {
        const res = await fetch(url);
        const text = await res.text();
        await navigator.clipboard.writeText(text);
        copyIcon.classList.add("hidden");
        checkIcon.classList.remove("hidden");
        setTimeout(() => {
          checkIcon.classList.add("hidden");
          copyIcon.classList.remove("hidden");
        }, 2000);
      } catch (e) {
        copyMdBtn.textContent = "Failed";
      }
    });
  }

  if (openInBtn && openInMenu) {
    openInBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openInMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", () => {
      openInMenu.classList.add("hidden");
    });
  }
});
