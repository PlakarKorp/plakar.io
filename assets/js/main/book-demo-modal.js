// Targets: layouts/partials/components/modals/demo-modal.html
// Elements: #demo-modal, #demo-modal-close, #demo-form
// Triggers: .book-a-demo-modal-open (any element with this class)

const HUBSPOT_PORTAL_ID = "48034556";
const HUBSPOT_FORM_ID = "8230a5c9-edf7-492e-ae14-b9246a6206d5";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("demo-modal");
  const modalBox = document.getElementById("demo-modal-box");
  const closeBtn = document.getElementById("demo-modal-close");
  const form = document.getElementById("demo-form");
  const errorEl = document.getElementById("demo-form-error");
  const successEl = document.getElementById("demo-form-success");

  if (!modal) return;

  const openModal = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
    form?.reset();
    errorEl?.classList.add("hidden");
    successEl?.classList.add("hidden");
  };

  // Open on any element with .book-a-demo-modal-open
  document.querySelectorAll(".book-a-demo-modal-open").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close on button
  closeBtn?.addEventListener("click", closeModal);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (!modalBox.contains(e.target)) closeModal();
  });

  // Close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Form submit
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");
    successEl.classList.add("hidden");

    const data = Object.fromEntries(new FormData(form));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email || "")) {
      errorEl.textContent = "Please enter a valid email address.";
      errorEl.classList.remove("hidden");
      return;
    }

    const payload = {
      fields: Object.keys(data).map((key) => ({ name: key, value: data[key] })),
    };

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Submission failed");

      successEl.classList.remove("hidden");
      form.reset();
      setTimeout(closeModal, 5000);
    } catch (err) {
      errorEl.textContent = "An error occurred. Please try again.";
      errorEl.classList.remove("hidden");
    }
  });
});
