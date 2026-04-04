// Targets: layouts/index.html, layouts/partials/common/footer/footer.html, layouts/contact/single.html
// Elements: #newsletter-form-home, #newsletter-form-footer, #newsletter-form-contact
// Depends: assets/js/bundle/toast.js

const HUBSPOT_NEWSLETTER_PORTAL_ID = "48034556";
const HUBSPOT_NEWSLETTER_FORM_ID = "a65a0673-a43b-41cc-ba1c-a7084f704685";

const submitNewsletter = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('[name="email"]')?.value || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      window.addToast({
        title: "Invalid email",
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_NEWSLETTER_PORTAL_ID}/${HUBSPOT_NEWSLETTER_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields: [{ name: "email", value: email }] }),
        },
      );

      if (!res.ok) throw new Error("Submission failed");

      window.addToast({
        title: "Subscribed!",
        message: "Thank you for subscribing to our newsletter.",
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
};

document.addEventListener("DOMContentLoaded", () => {
  submitNewsletter("newsletter-form-home");
  submitNewsletter("newsletter-form-footer");
  submitNewsletter("newsletter-form-contact");
});
