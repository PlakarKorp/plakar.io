// Targets: layouts/contact/single.html
// Elements: #contact-form
// Depends: assets/js/main/toast.js

const CONTACT_PORTAL_ID = "48034556";
const CONTACT_FORM_ID = "3ac805bd-3625-455e-b8d4-f92316d1682e";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
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
        `https://api.hsforms.com/submissions/v3/integration/submit/${CONTACT_PORTAL_ID}/${CONTACT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Submission failed");

      window.addToast({
        title: "Message sent!",
        message: "We'll get back to you within 24 business hours.",
        type: "success",
      });
      form.reset();
    } catch {
      window.addToast({
        title: "Something went wrong",
        message: "Please try again.",
        type: "error",
      });
    }
  });
});
