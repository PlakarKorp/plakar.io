// Targets: layouts/partials/components/toast.html
// Elements: #toast-container
// Usage: window.addToast({ title, message, type, duration })

(function () {
  const getContainer = () => document.querySelector("#toast-container > div");

  const icons = {
    success: `<svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    error: `<svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info: `<svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>`,
  };

  function addToast({
    title = "Notification",
    message = "",
    type = "success",
    iconHTML = "",
    duration = 5000,
  } = {}) {
    const container = getContainer();
    if (!container) return;

    const icon = iconHTML || icons[type] || icons.success;

    const toast = document.createElement("div");
    toast.className =
      "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-neutral-50 shadow-lg border border-neutral-200 transform transition ease-out duration-300 opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2";
    toast.innerHTML = `
      <div class="p-4 flex items-start gap-3">
        <div class="shrink-0 mt-0.5">${icon}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-neutral-900">${title}</p>
          ${message ? `<p class="mt-1 text-sm text-neutral-500">${message}</p>` : ""}
        </div>
        <button class="toast-close shrink-0 text-neutral-400 hover:text-neutral-700 transition">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;

    container.appendChild(toast);
    toast.getBoundingClientRect(); // force reflow
    toast.classList.remove("opacity-0", "translate-y-2", "sm:translate-x-2");

    const dismiss = () => {
      toast.classList.add("opacity-0");
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector(".toast-close").addEventListener("click", dismiss);
    setTimeout(dismiss, duration);
  }

  window.addToast = addToast;
})();
