// Targets: layouts/quote/single.html
// Elements: #price-simulator
// Data: data/pricing.yaml (rendered into data-pricing)

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("price-simulator");
  if (!root) return;

  const pricing = JSON.parse(root.dataset.pricing);
  const tiers = [...pricing.tiers].sort((a, b) => a.min - b.min);

  const fmt = (value, decimals) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: pricing.currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  const money = (value) => fmt(value, Number.isInteger(value) ? 0 : 2);

  const tibInput = document.getElementById("ps-tib");
  const tibRange = document.getElementById("ps-tib-range");
  const tierRows = root.querySelectorAll(".ps-tier");
  const optionInputs = root.querySelectorAll("[data-option]");
  const out = {
    license: document.getElementById("ps-license"),
    licenseDetail: document.getElementById("ps-license-detail"),
    lines: document.getElementById("ps-lines"),
    monthly: document.getElementById("ps-monthly"),
    onetime: document.getElementById("ps-onetime"),
    onetimeRow: document.getElementById("ps-onetime-row"),
    cta: document.getElementById("ps-cta"),
  };

  // Volume pricing: all TiB are billed at the rate of the tier the total falls in.
  const tierIndexFor = (tib) => {
    let index = 0;
    tiers.forEach((t, i) => {
      if (tib >= t.min) index = i;
    });
    return index;
  };

  const readTib = () => {
    const tib = Math.floor(Number(tibInput.value));
    return Number.isFinite(tib) && tib > 0 ? tib : 0;
  };

  const render = () => {
    const tib = readTib();
    const tierIndex = tierIndexFor(tib);
    const tier = tiers[tierIndex];
    const license = Math.round(tib * tier.price * 100) / 100;

    tierRows.forEach((row) => {
      const active = Number(row.dataset.tier) === tierIndex && tib > 0;
      row.classList.toggle("bg-primary-50", active);
      row.classList.toggle("font-semibold", active);
      row.classList.toggle("text-primary-700", active);
    });

    out.licenseDetail.textContent = `${tib} TiB × ${fmt(tier.price, 2)}`;
    out.license.textContent = money(license);

    let monthly = license;
    let onetime = 0;
    const selected = [];
    out.lines.replaceChildren();

    optionInputs.forEach((input) => {
      if (!input.checked) return;
      const option = pricing.options.find((o) => o.id === input.dataset.option);
      if (!option) return;
      selected.push(option);
      if (option.billing === "monthly") monthly += option.price;
      else onetime += option.price;

      const line = document.createElement("div");
      line.className = "flex justify-between gap-4";
      const dt = document.createElement("dt");
      dt.className = "text-neutral-600";
      dt.textContent =
        option.billing === "monthly"
          ? option.label
          : `${option.label} (one-time)`;
      const dd = document.createElement("dd");
      dd.className = "font-medium text-neutral-900 tabular-nums";
      dd.textContent = money(option.price);
      line.append(dt, dd);
      out.lines.append(line);
    });

    out.monthly.textContent = money(monthly);
    out.onetime.textContent = money(onetime);
    out.onetimeRow.classList.toggle("hidden", onetime === 0);
    out.onetimeRow.classList.toggle("flex", onetime > 0);

    const summary = [
      "Price simulator estimate:",
      `- Data protected: ${tib} TiB (${fmt(tier.price, 2)} per TiB / month)`,
      ...selected.map((o) => `- ${o.label}`),
      `- Total per month: ${money(monthly)}`,
      ...(onetime > 0 ? [`- One-time fees: ${money(onetime)}`] : []),
    ].join("\n");
    const params = new URLSearchParams({ subject: "sales", message: summary });
    out.cta.href = `/contact/?${params.toString()}#email-contact`;
  };

  tibInput.addEventListener("input", () => {
    const tib = readTib();
    tibRange.value = Math.min(Math.max(tib, 1), Number(tibRange.max));
    render();
  });
  tibRange.addEventListener("input", () => {
    tibInput.value = tibRange.value;
    render();
  });
  optionInputs.forEach((input) => input.addEventListener("change", render));

  render();
});
