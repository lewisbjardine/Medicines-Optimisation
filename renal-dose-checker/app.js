// app.js — Renal Dose Checker logic (modular)
// Loads DRUG_DATA from drugs.js

import { DRUG_DATA } from "./drugs.js";

/* --------------------- DOM ELEMENTS ---------------------- */

const searchView = document.getElementById("search-view");
const drugView = document.getElementById("drug-view");

const egfrInput = document.getElementById("egfr-input");
const drugSearchInput = document.getElementById("drug-search");
const suggestionsBox = document.getElementById("search-suggestions");

const backButton = document.getElementById("back-button");

const drugNameEl = document.getElementById("drug-name");
const drugClassEl = document.getElementById("drug-class");
const drugTagsEl = document.getElementById("drug-tags");
const drugUsualDoseEl = document.getElementById("drug-usual-dose");
const renalBandsEl = document.getElementById("renal-bands");
const egfrSummaryEl = document.getElementById("egfr-summary");
const drugNotesEl = document.getElementById("drug-notes");

let currentEgfr = null;

/* ------------------------- eGFR --------------------------- */

function updateEgfr() {
  const value = parseFloat(egfrInput.value);
  currentEgfr = Number.isFinite(value) && value >= 0 ? value : null;
}
egfrInput.addEventListener("input", updateEgfr);

/* ------------------------ SEARCH -------------------------- */

function normalise(str) {
  return (str || "").toLowerCase().trim();
}

function searchDrugs(query) {
  const q = normalise(query);
  if (q.length < 2) return [];

  return DRUG_DATA.filter(drug =>
    normalise(drug.name).includes(q) ||
    (drug.searchTerms || []).some(term => normalise(term).includes(q))
  ).sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------------------- AUTOCOMPLETE ---------------------- */

let suggestionDelay;

function renderSuggestions(results) {
  if (!results.length) {
    suggestionsBox.style.display = "none";
    suggestionsBox.innerHTML = "";
    return;
  }

  suggestionsBox.innerHTML = "";

  results.slice(0, 12).forEach(drug => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = drug.name;
    btn.addEventListener("click", () => {
      suggestionsBox.style.display = "none";
      openDrug(drug.id);
    });
    suggestionsBox.appendChild(btn);
  });

  suggestionsBox.style.display = "block";
}

drugSearchInput.addEventListener("input", () => {
  clearTimeout(suggestionDelay);
  suggestionDelay = setTimeout(() => {
    const results = searchDrugs(drugSearchInput.value);
    renderSuggestions(results);
  }, 120);
});

// Prevent dropdown from closing immediately on Safari/WebKit
document.addEventListener("mousedown", (e) => {
  if (e.target === drugSearchInput || suggestionsBox.contains(e.target)) return;
  suggestionsBox.style.display = "none";
});

/* ---------------------- DRUG VIEW ------------------------- */

function getBandForEgfr(bands, egfr) {
  if (egfr == null) return null;
  return bands.find(b =>
    (b.min == null || egfr >= b.min) &&
    (b.max == null || egfr < b.max)
  );
}

function openDrug(id) {
  const drug = DRUG_DATA.find(d => d.id === id);
  if (!drug) return;

  updateEgfr();

  // Title + class
  drugNameEl.textContent = drug.name;
  drugClassEl.textContent = drug.className || "";

  // Tags
  drugTagsEl.innerHTML = "";
  (drug.tags || []).forEach(tag => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = tag;
    drugTagsEl.appendChild(span);
  });

  // Usual dose
  drugUsualDoseEl.textContent = drug.usualDose || "";

  // Renal dosing bands
  renalBandsEl.innerHTML = "";
  const highlightBand = getBandForEgfr(drug.renalBands, currentEgfr);

  drug.renalBands.forEach(band => {
    const li = document.createElement("li");
    li.className = "renal-band";

    if (band === highlightBand) {
      li.classList.add("highlight");
    }

    li.innerHTML = `
      <div class="renal-band-header">
        <div class="renal-band-label">${band.label}</div>
        <div class="renal-band-category">${band.category}</div>
      </div>
      <div class="renal-band-body">${band.details}</div>
    `;

    renalBandsEl.appendChild(li);
  });

  // eGFR summary
  egfrSummaryEl.textContent =
    currentEgfr == null
      ? "No eGFR entered — all renal bands shown."
      : `Current eGFR: ${currentEgfr} mL/min/1.73m². Highlighted band applies.`;

  // Notes
  drugNotesEl.innerHTML = "";
  (drug.notes || []).forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    drugNotesEl.appendChild(li);
  });

  // Switch views
  searchView.classList.add("hidden");
  drugView.classList.remove("hidden");
  window.scrollTo({ top: 0 });
}

backButton.addEventListener("click", () => {
  drugView.classList.add("hidden");
  searchView.classList.remove("hidden");
  suggestionsBox.style.display = "none";
  drugSearchInput.focus();
});
