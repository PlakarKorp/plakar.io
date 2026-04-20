// Targets: layouts/partials/common/search/search-modal.html
// Elements: #search-modal, #search-backdrop, #search-input, #search-close
// Elements: #search-section-filter, #search-version-filter, #search-version-wrap
// Elements: #search-results, #search-status, #search-empty-state
// Triggers: .search-trigger, window event 'open-search', Cmd/Ctrl+K

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("search-modal");
  if (!modal) return;

  const backdrop = document.getElementById("search-backdrop");
  const input = document.getElementById("search-input");
  const closeBtn = document.getElementById("search-close");
  const sectionFilter = document.getElementById("search-section-filter");
  const versionWrap = document.getElementById("search-version-wrap");
  const versionFilter = document.getElementById("search-version-filter");
  const resultsEl = document.getElementById("search-results");
  const emptyState = document.getElementById("search-empty-state");
  const status = document.getElementById("search-status");
  const statusLoading = document.getElementById("search-status-loading");
  const statusCount = document.getElementById("search-status-count");
  const statusEmpty = document.getElementById("search-status-empty");
  const fileIconHTML =
    document.getElementById("search-icon-file")?.innerHTML || "";

  const PAGE_SIZE = 20;
  let pagefind = null;
  let rawResults = [];
  let mappedResults = [];
  let resultCount = 0;
  let loadedCount = 0;
  let debounceTimer = null;

  // Pagefind
  const ensurePagefind = async () => {
    if (pagefind) return;
    try {
      pagefind = await import("/pagefind/pagefind.js");
      await pagefind.init();
    } catch (e) {
      console.error("Failed to load Pagefind:", e);
    }
  };

  // Open / close
  const openModal = async () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Auto-select section filter based on current URL (mirrors original Alpine behaviour)
    const path = window.location.pathname;
    if (path.startsWith("/docs/")) sectionFilter.value = "Docs";
    else if (path.startsWith("/control-plane-docs/")) sectionFilter.value = "Control Plane Docs";
    else if (path.startsWith("/posts/")) sectionFilter.value = "Blog";
    else sectionFilter.value = "";
    syncVersionWrap();

    await ensurePagefind();
    input?.focus();
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  // Filters
  const syncVersionWrap = () => {
    const isDocsSelected = sectionFilter.value === "Docs";
    versionWrap.classList.toggle("hidden", !isDocsSelected);
    versionWrap.classList.toggle("flex", isDocsSelected);
    if (!isDocsSelected) versionFilter.value = "";
  };

  const onSectionChange = () => {
    syncVersionWrap();
    doSearch();
  };

  // Status
  const setStatus = (state, text = "") => {
    status.classList.toggle("hidden", state === "hidden");
    statusLoading.classList.toggle("hidden", state !== "loading");
    statusCount.classList.toggle("hidden", state !== "count");
    statusEmpty.classList.toggle("hidden", state !== "empty");
    if (state === "count") statusCount.textContent = text;
  };

  // Render one page result with its sub-results
  const renderResult = (result) => {
    const { title, section, version, subResults, url, excerpt } = result;

    // Main page link: use first sub-result's URL/excerpt if available (mirrors original)
    const mainHref = subResults.length > 0 ? subResults[0].url : url;
    const mainExcerpt = subResults.length > 0 ? subResults[0].excerpt : excerpt;

    const sectionBadge = section
      ? `<span class="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 border border-primary-200">${section}</span>`
      : "";
    const versionBadge = version
      ? `<span class="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">${version}</span>`
      : "";

    const el = document.createElement("div");
    el.className = "border-b border-neutral-100 group";

    // Page-level row
    const pageLink = document.createElement("a");
    pageLink.href = mainHref;
    pageLink.className =
      "flex gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors";
    pageLink.innerHTML = `
      <div class="shrink-0 mt-0.5 w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors">${fileIconHTML}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-neutral-900 truncate">${title}</span>
          ${sectionBadge}${versionBadge}
        </div>
        <div class="text-sm text-neutral-500 mt-1 leading-relaxed line-clamp-2">${mainExcerpt}</div>
      </div>
    `;
    pageLink.addEventListener("click", closeModal);
    el.appendChild(pageLink);

    // Sub-results: skip first (already shown above), show up to 4 more = 5 total visible
    const renderSubs = (subs) => {
      subs.forEach((sub) => {
        const a = document.createElement("a");
        a.href = sub.url;
        a.className =
          "flex items-start gap-2 pl-14 pr-5 py-1.5 hover:bg-neutral-50 transition-colors border-t border-neutral-50";
        a.innerHTML = `
          <span class="text-neutral-300 text-xs mt-px">#</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-neutral-700">${sub.title}</div>
            <div class="text-xs text-neutral-500 mt-0.5 leading-relaxed line-clamp-1">${sub.excerpt}</div>
          </div>
        `;
        a.addEventListener("click", closeModal);
        el.appendChild(a);
      });
    };

    if (subResults.length > 1) {
      const restSubs = subResults.slice(1); // skip first
      const initialVisible = restSubs.slice(0, 4); // show up to 4 more
      renderSubs(initialVisible);

      if (restSubs.length > 4) {
        const remaining = restSubs.length - 4;
        const showAllBtn = document.createElement("button");
        showAllBtn.className =
          "pl-14 pr-5 py-1.5 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors border-t border-neutral-50 w-full text-left";
        showAllBtn.textContent = `Show all (${remaining} more)`;
        showAllBtn.addEventListener("click", () => {
          showAllBtn.remove();
          renderSubs(restSubs.slice(4));
        });
        el.appendChild(showAllBtn);
      }
    }

    return el;
  };

  // Load a batch of raw results into mapped results
  const loadBatch = async () => {
    const end = Math.min(loadedCount + PAGE_SIZE, resultCount);
    const batch = rawResults.slice(loadedCount, end);
    const loaded = await Promise.all(batch.map((r) => r.data()));

    document.getElementById("search-load-more")?.remove();

    loaded.forEach((data) => {
      const mapped = {
        url: data.url,
        title: data.meta?.title || "Untitled",
        excerpt: data.excerpt || "",
        section: data.filters?.section?.[0] || "",
        version: data.filters?.version?.[0] || "",
        subResults: (data.sub_results || []).map((sub) => ({
          title: sub.title || "",
          url: sub.url || data.url,
          excerpt: sub.excerpt || "",
        })),
      };
      mappedResults.push(mapped);
      resultsEl.appendChild(renderResult(mapped));
    });

    loadedCount = end;
    setStatus("count", `${loadedCount} of ${resultCount} results`);

    if (loadedCount < resultCount) {
      const wrap = document.createElement("div");
      wrap.id = "search-load-more";
      wrap.className = "px-5 py-3 text-center";
      const btn = document.createElement("button");
      btn.className =
        "text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors disabled:opacity-50";
      btn.textContent = `Load more (${resultCount - loadedCount} remaining)`;
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Loading...";
        await loadBatch();
      });
      wrap.appendChild(btn);
      resultsEl.appendChild(wrap);
    }
  };

  // Search
  const doSearch = async () => {
    const query = input.value.trim();

    if (!query || query.length < 2) {
      resultsEl.innerHTML = "";
      emptyState.textContent = "Start typing to search.";
      resultsEl.appendChild(emptyState);
      setStatus("hidden");
      return;
    }

    if (!pagefind) return;

    setStatus("loading");
    resultsEl.innerHTML = "";
    mappedResults = [];

    const filters = {};
    if (sectionFilter.value) filters.section = sectionFilter.value;
    if (versionFilter.value && sectionFilter.value === "Docs")
      filters.version = versionFilter.value;

    const options = Object.keys(filters).length > 0 ? { filters } : {};
    const search = await pagefind.debouncedSearch(query, options);
    if (!search) return;

    rawResults = search.results;
    resultCount = rawResults.length;
    loadedCount = 0;

    if (resultCount === 0) {
      setStatus("empty");
      return;
    }

    await loadBatch();
  };

  // Event listeners
  input?.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSearch, 200);
  });

  sectionFilter?.addEventListener("change", onSectionChange);
  versionFilter?.addEventListener("change", doSearch);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.querySelectorAll(".search-trigger").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  window.addEventListener("open-search", openModal);

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      modal.classList.contains("hidden") ? openModal() : closeModal();
    }
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
});
