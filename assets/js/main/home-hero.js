// Hero v2: rotating headline + animated control-plane demo
// Only runs when #hv2-demo is present (homepage only).

(function () {
  // ── Rotating headline ────────────────────────────────────────────────────
  var rotInner = document.getElementById("hv2-rot");
  if (rotInner) {
    var items = [
      "AI pipelines",
      "SaaS data",
      "databases",
      "Kubernetes clusters",
      "Virtual Machines",
      "S3 Buckets",
    ];
    var all = items.concat([items[0]]);
    rotInner.innerHTML = all
      .map(function (t) {
        return "<span>" + t + "</span>";
      })
      .join("");
    var idx = 0;
    function spanH() {
      var s = rotInner.querySelector("span");
      return s ? s.offsetHeight : 0;
    }
    setInterval(function () {
      idx++;
      var sh = spanH();
      rotInner.style.transition = "transform .5s cubic-bezier(.4,0,.2,1)";
      rotInner.style.transform = "translateY(-" + idx * sh + "px)";
      if (idx === all.length - 1) {
        setTimeout(function () {
          rotInner.style.transition = "none";
          rotInner.style.transform = "translateY(0)";
          idx = 0;
        }, 520);
      }
    }, 2200);
  }

  // ── Icon substitution ────────────────────────────────────────────────────
  var ICONS = {
    PG: '<svg class="w-[18px] h-[18px] inline-block align-middle" viewBox="0 0 24 24" fill="#336791"><path d="M23.56 14.72c-.14-.26-.48-.34-1.01-.23-1.65.34-2.29.13-2.52-.02 1.34-2.05 2.44-4.52 3.04-6.83.27-1.05.8-3.52.12-4.73a1.56 1.56 0 0 0-.15-.24C21.69.91 19.8.02 17.5 0c-1.49-.01-2.77.35-3.11.48a9.4 9.4 0 0 0-.52-.08A8.04 8.04 0 0 0 12.56.28C11.38.26 10.36.55 9.51 1.12 8.66.8 4.72-.52 2.29 1.21.94 2.15.31 3.87.43 6.3c.04.82.51 3.34 1.24 5.74.46 1.51.94 2.7 1.43 3.58.55.99 1.13 1.6 1.71 1.79.45.15 1.13.14 1.86-.73.8-.96 1.59-1.83 1.94-2.21.43.24.91.36 1.39.38v.01c-.08.1-.16.2-.25.3-.34.43-.41.52-1.5.74-.31.07-1.13.23-1.15.81 0 .12.03.23.09.33.23.42.92.61 1.02.63 1.33.33 2.5.09 3.37-.68-.02 2.23.08 4.42.35 5.09.22.55.76 1.9 2.47 1.9.25 0 .53-.03.83-.09 1.78-.38 2.56-1.17 2.86-2.91.15-.87.4-2.87.54-4.1.02-.07.04-.12.06-.14 0 0 .07-.05.43.03h.04l.25.02c.85.04 1.91-.14 2.53-.43.64-.3 1.81-1.03 1.6-1.67z"/></svg>',
    MYSQL:
      '<img src="/img/providers/mysql.png" class="h-[18px] w-auto inline-block align-middle object-contain" alt="">',
    REDIS:
      '<svg class="w-[18px] h-[18px] inline-block align-middle" viewBox="0 0 24 24" fill="#DC382D"><path d="M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73z"/></svg>',
    MONGO:
      '<svg class="w-[18px] h-[18px] inline-block align-middle" viewBox="0 0 24 24" fill="#47A248"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218z"/></svg>',
    S3: '<img src="/img/providers/amazon-s3.svg" class="w-[18px] h-[18px] inline-block align-middle object-contain" alt="">',
    SFTP: '<svg class="w-[18px] h-[18px] inline-block align-middle" viewBox="0 0 24 24" fill="none"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    GITLAB:
      '<svg class="w-[18px] h-[18px] inline-block align-middle" viewBox="0 0 24 24" fill="#FC6D26"><path d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z"/></svg>',
    FS: '<svg class="w-[18px] h-[18px] inline-block align-middle" viewBox="0 0 24 24" fill="none"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="#8b5cf6" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  };

  var demoEl = document.getElementById("hv2-demo");
  if (!demoEl) return;

  demoEl.innerHTML = demoEl.innerHTML
    .replace(/__PG__/g, ICONS.PG)
    .replace(/__MYSQL__/g, ICONS.MYSQL)
    .replace(/__REDIS__/g, ICONS.REDIS)
    .replace(/__MONGO__/g, ICONS.MONGO)
    .replace(/__S3__/g, ICONS.S3)
    .replace(/__SFTP__/g, ICONS.SFTP)
    .replace(/__GITLAB__/g, ICONS.GITLAB)
    .replace(/__FS__/g, ICONS.FS);

  // ── Demo element refs ────────────────────────────────────────────────────
  var dExpand = document.getElementById("hv2-d-expand");
  var dBModal = document.getElementById("hv2-d-bmodal");
  var dRModal = document.getElementById("hv2-d-rmodal");
  var dRow1 = document.getElementById("hv2-d-row1");
  var dChevron = document.getElementById("hv2-d-chevron");
  var dCursor = document.getElementById("hv2-cursor");
  var dBBtn = dExpand ? dExpand.querySelector("button") : null;
  var dRBtn = document.getElementById("hv2-d-restorebtn");
  var dBRun = document.getElementById("hv2-d-brun");
  var dRRun = document.getElementById("hv2-d-rrun");
  var dDestAlt = document.getElementById("hv2-d-dest-alt");
  var dCombo = document.getElementById("hv2-d-dest-combo");

  // ── Public helpers (called from inline onclick) ──────────────────────────
  window.hv2ToggleExpand = function () {
    if (!dExpand) return;
    var open = dExpand.classList.toggle("open");
    if (dRow1) dRow1.classList.toggle("active", open);
    if (dChevron) dChevron.style.transform = open ? "rotate(90deg)" : "";
  };

  window.hv2OpenBackup = function () {
    if (dBModal) dBModal.classList.add("open");
  };

  window.hv2CloseBackup = function () {
    if (dBModal) dBModal.classList.remove("open");
    if (dBRun) dBRun.textContent = "Run backup";
  };

  window.hv2OpenRestore = function () {
    if (dRModal) dRModal.classList.add("open");
  };

  window.hv2ShowCombo = function (show) {
    if (dCombo) dCombo.classList.toggle("hidden", !show);
    var alt = document.querySelector("#hv2-d-dest-alt input");
    if (alt) alt.checked = show;
    var orig = document.querySelector("#hv2-d-dest-orig input");
    if (orig) orig.checked = !show;
  };

  window.hv2CloseRestore = function () {
    if (dRModal) dRModal.classList.remove("open");
    if (dRRun) dRRun.textContent = "Restore";
    window.hv2ShowCombo(false);
  };

  // ── Cursor mover ─────────────────────────────────────────────────────────
  function moveCursor(el) {
    if (!el || !dCursor || !demoEl) return;
    var fr = demoEl.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    dCursor.style.left = r.left - fr.left + r.width / 2 + "px";
    dCursor.style.top = r.top - fr.top + r.height / 2 + "px";
  }

  // ── Animation loop ───────────────────────────────────────────────────────
  var STEPS = [
    {
      d: 1000,
      fn: function () {
        moveCursor(dChevron);
      },
    },
    {
      d: 700,
      fn: function () {
        if (!dExpand.classList.contains("open")) window.hv2ToggleExpand();
      },
    },
    {
      d: 1100,
      fn: function () {
        moveCursor(dBBtn);
      },
    },
    {
      d: 700,
      fn: function () {
        window.hv2OpenBackup();
      },
    },
    {
      d: 1100,
      fn: function () {
        moveCursor(dBRun);
      },
    },
    {
      d: 700,
      fn: function () {
        if (dBRun) dBRun.textContent = "Backup started ✓";
      },
    },
    {
      d: 1300,
      fn: function () {
        window.hv2CloseBackup();
      },
    },
    {
      d: 900,
      fn: function () {
        moveCursor(dRBtn);
      },
    },
    {
      d: 700,
      fn: function () {
        window.hv2OpenRestore();
      },
    },
    {
      d: 1100,
      fn: function () {
        moveCursor(dDestAlt);
      },
    },
    {
      d: 600,
      fn: function () {
        window.hv2ShowCombo(true);
      },
    },
    {
      d: 1000,
      fn: function () {
        moveCursor(dCombo);
      },
    },
    {
      d: 900,
      fn: function () {
        moveCursor(dRRun);
      },
    },
    {
      d: 700,
      fn: function () {
        if (dRRun) dRRun.textContent = "Restore started ✓";
      },
    },
    {
      d: 1500,
      fn: function () {
        window.hv2CloseRestore();
      },
    },
    {
      d: 600,
      fn: function () {
        if (dExpand.classList.contains("open")) window.hv2ToggleExpand();
        moveCursor(dChevron);
      },
    },
    { d: 1200, fn: function () {} },
  ];

  var stepIdx = 0;
  var paused = false;

  demoEl.addEventListener("mouseenter", function () {
    paused = true;
    if (dCursor) dCursor.style.opacity = "0";
  });
  demoEl.addEventListener("mouseleave", function () {
    paused = false;
    if (dCursor) dCursor.style.opacity = "1";
  });

  function tick() {
    if (paused) {
      setTimeout(tick, 500);
      return;
    }
    var step = STEPS[stepIdx % STEPS.length];
    step.fn();
    stepIdx++;
    setTimeout(tick, step.d);
  }
  tick();
})();
