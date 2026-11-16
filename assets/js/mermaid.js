// Overrides the theme's assets/js/mermaid.js (bundled after the Mermaid
// library by the theme's vendor.html partial).
//
// Diagrams use the site's adaptive --ui-* palette, so they follow light and
// dark mode, and are redrawn when the appearance changes.
(function () {
  var root = document.documentElement;

  function cssRaw(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function css(name) {
    return "rgb(" + cssRaw(name) + ")";
  }

  function config() {
    var dark = root.classList.contains("dark");
    var box = dark ? "rgb(38, 38, 46)" : css("--ui-white");
    return {
      startOnLoad: false,
      layout: "elk",
      look: "classic",
      theme: "base",
      darkMode: dark,
      elk: { nodePlacementStrategy: "NETWORK_SIMPLEX" },
      flowchart: { padding: 16, nodeSpacing: 48, rankSpacing: 56 },
      themeVariables: {
        background: css("--ui-neutral-50"),
        primaryColor: box,
        primaryTextColor: css("--ui-neutral-900"),
        primaryBorderColor: css("--ui-neutral-300"),
        secondaryColor: box,
        tertiaryColor: box,
        lineColor: css("--ui-neutral-400"),
        textColor: css("--ui-neutral-700"),
        clusterBkg: "rgba(" + cssRaw("--ui-primary-500") + ", 0.05)",
        clusterBorder: "rgba(" + cssRaw("--ui-primary-500") + ", 0.3)",
        titleColor: css("--ui-primary-600"),
        edgeLabelBackground: css("--ui-neutral-50"),
        dropShadow: "none",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: "14px",
      },
      // Label styles go here, not in custom.css: Mermaid measures labels with
      // these rules applied, so boxes are sized to fit the styled text.
      themeCSS: [
        ".node .label { font-weight: 500; }",
        ".cluster-label p { margin: 0; }",
        ".cluster-label .nodeLabel {",
        "  font-size: 12.5px; font-weight: 600; letter-spacing: 0.06em;",
        "  text-transform: uppercase; color: rgb(var(--ui-primary-600));",
        "  padding: 0 6px; border-radius: 4px;",
        "  background-color: color-mix(in srgb, rgb(var(--ui-primary-500)) 5%, rgb(var(--ui-neutral-50)));",
        "}",
        ".edgeLabel { background: transparent !important; }",
        ".edgeLabel p { margin: 0; padding: 0; background: none !important; }",
        "span.edgeLabel {",
        "  display: inline-block; margin: 0; padding: 2px 8px;",
        "  font-size: 12px; line-height: 1.5; color: rgb(var(--ui-neutral-700));",
        "  background-color: " + box + " !important;",
        "  border: 1px solid rgb(var(--ui-neutral-300)); border-radius: 6px;",
        "}",
      ].join("\n"),
    };
  }

  // After drawing: arrowheads at a fixed size (Mermaid scales them with the
  // line width), and group titles moved above the edges so lines pass behind
  // them instead of through them.
  function polish(nodes) {
    nodes.forEach(function (node) {
      node.querySelectorAll("marker").forEach(function (marker) {
        marker.setAttribute("markerUnits", "userSpaceOnUse");
        marker.setAttribute("markerWidth", "8");
        marker.setAttribute("markerHeight", "8");
      });
      node.querySelectorAll("g.root").forEach(function (rootGroup) {
        var labels = rootGroup.querySelectorAll(
          ":scope > .clusters .cluster-label",
        );
        if (!labels.length) return;
        var layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        layer.setAttribute("class", "cluster-titles");
        labels.forEach(function (label) {
          // Move the title down from the group border.
          var t = label.getAttribute("transform") || "";
          var m = t.match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/);
          if (m) {
            label.setAttribute(
              "transform",
              "translate(" + m[1] + ", " + (parseFloat(m[2]) + 8) + ")",
            );
          }
          layer.appendChild(label);
        });
        rootGroup.appendChild(layer);
      });
    });
  }

  // Mermaid replaces each block's content with the SVG, so keep the source to
  // redraw it later.
  function render() {
    var nodes = document.querySelectorAll("pre.mermaid");
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      if (node.dataset.source === undefined) {
        node.dataset.source = node.innerHTML;
      } else {
        node.innerHTML = node.dataset.source;
        node.removeAttribute("data-processed");
      }
    });
    mermaid.initialize(config());
    mermaid.run({ nodes: nodes }).then(function () {
      polish(nodes);
    });
  }

  mermaid.initialize({ startOnLoad: false });

  document.addEventListener("DOMContentLoaded", function () {
    render();
    var dark = root.classList.contains("dark");
    new MutationObserver(function () {
      var now = root.classList.contains("dark");
      if (now !== dark) {
        dark = now;
        render();
      }
    }).observe(root, { attributes: true, attributeFilter: ["class"] });
  });
})();
