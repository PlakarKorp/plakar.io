// Homepage v2: interactive section behaviours (tab switchers, etc.)

(function () {
  // ── "What recoverable takes" tab switcher ────────────────────────────────
  var rail = document.getElementById("rec-rail");
  if (!rail) return;

  var tabs = rail.querySelectorAll("[data-rec-tab]");
  var panes = document.querySelectorAll("[data-rec-pane]");

  var ACTIVE = ["bg-primary-500", "text-white", "border-primary-500"];
  var IDLE = ["bg-white", "text-neutral-700", "border-neutral-300"];

  function activate(key) {
    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-rec-tab") === key;
      ACTIVE.forEach(function (c) { tab.classList.toggle(c, on); });
      IDLE.forEach(function (c) { tab.classList.toggle(c, !on); });
      var num = tab.querySelector("[data-rec-num]");
      if (num) {
        num.classList.toggle("bg-white/25", on);
        num.classList.toggle("text-white", on);
        num.classList.toggle("bg-neutral-200", !on);
        num.classList.toggle("text-neutral-600", !on);
      }
    });
    panes.forEach(function (pane) {
      pane.classList.toggle("hidden", pane.getAttribute("data-rec-pane") !== key);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(tab.getAttribute("data-rec-tab"));
    });
  });
})();
