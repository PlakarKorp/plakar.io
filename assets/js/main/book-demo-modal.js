// Targets: layouts/partials/components/modals/demo-modal.html
// Elements: #demo-modal, #demo-modal-close, #demo-form
// Triggers: .book-a-demo-modal-open
// Depends: assets/js/main/toast.js

const HUBSPOT_PORTAL_ID = "48034556";
const HUBSPOT_FORM_ID = "8230a5c9-edf7-492e-ae14-b9246a6206d5";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("demo-modal");
  const modalBox = document.getElementById("demo-modal-box");
  const closeBtn = document.getElementById("demo-modal-close");
  const form = document.getElementById("demo-form");
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
  };

  document.querySelectorAll(".book-a-demo-modal-open").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (!modalBox.contains(e.target)) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email || "")) {
      window.addToast({
        title: "Invalid email",
        message: "Please enter a valid email address.",
        type: "error",
      });
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

      window.addToast({
        title: "Request submitted!",
        message: "A team member will contact you shortly.",
        type: "success",
      });
      form.reset();
      setTimeout(closeModal, 1000);
    } catch {
      window.addToast({
        title: "Something went wrong",
        message: "Please try again.",
        type: "error",
      });
    }
  });
});
