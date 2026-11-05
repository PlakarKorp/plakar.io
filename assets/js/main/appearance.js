// Appearance toggle: cycles system -> light -> dark and stores the choice.
// With "system", the page follows the OS setting, including when it changes.
(function () {
  var order = ["system", "light", "dark"];
  var labels = { system: "System theme", light: "Light theme", dark: "Dark theme" };
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var root = document.documentElement;

  function current() {
    return root.dataset.appearance || "system";
  }

  function apply(choice) {
    root.dataset.appearance = choice;
    root.classList.toggle("dark", choice === "dark" || (choice === "system" && media.matches));
    document.querySelectorAll("[data-appearance-toggle]").forEach(function (button) {
      button.setAttribute("aria-label", labels[choice]);
      button.setAttribute("title", labels[choice]);
    });
  }

  function choose(choice) {
    try {
      localStorage.setItem("appearance", choice);
    } catch (e) {}
    apply(choice);
  }

  media.addEventListener("change", function () {
    if (current() === "system") apply("system");
  });

  document.addEventListener("DOMContentLoaded", function () {
    apply(current());
    document.querySelectorAll("[data-appearance-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        choose(order[(order.indexOf(current()) + 1) % order.length]);
      });
    });
  });
})();
