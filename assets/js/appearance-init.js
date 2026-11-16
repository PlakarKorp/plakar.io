// Inlined at the top of <head> so the page is painted in the right appearance.
// The saved choice is "system", "light" or "dark". Without one, it is "system".
(function () {
  var saved = null;
  try {
    saved = localStorage.getItem("appearance");
  } catch (e) {}
  var system = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var dark = saved === "dark" || (saved !== "light" && system);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dataset.appearance =
    saved === "light" || saved === "dark" ? saved : "system";
})();
