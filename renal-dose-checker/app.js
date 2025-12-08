// app.js — Logic for Renal Dose Checker
import { DRUG_DATA } from "./drugs.js";

// Cached DOM elements
const searchView = document.querySelector("main.card");
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

/* -------------------- eGFR handling -------------------- */
function updateEgfr() {
  const n = parseFloat(egfrInput.value);
  currentEgfr = Number.isFinite(n) && n >= 0 ? n : null;
}
egfrInput.addEventListener("input", updateEgfr);

/* -------------------- SEARCH -------------------- */
function normalise(str) {
  return (str || "").toLowerCase().trim();
}

function searchDrugs(query) {
  const q = normalise(query);
  if (q.length < 2) return [];
  return DRUG_DATA.filter(d =>
    normalise(d.name).includes(q) ||
    (d.searchTerms || []).some(t => normalise(t).includes(q))
  ).sort((a,b) => a.name.localeCompare(b.name));
}

let suggestionTimeout = null;

drugSearchInput.addEventListener("input", () => {
  clearTimeout(suggestionTimeout);
  suggestionTimeout = setTimeout(() => {
    const results = searchDrugs(drugSearchInput.value);
    renderSuggestions(results);
  }, 100);
});

/* ---------------- SUGGESTION DROPDOWN ---------------- */
function clearSuggestions() {
  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "none";
  suggestionsBox.classList.add("hidden");
}

function renderSuggestions(list) {
  if (!list.length) {
    clearSuggestions();
    return;
  }
  suggestionsBox.innerHTML = "";
  list.slice(0,12).forEach(drug => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = drug.name;
    btn.addEventListener("click", () => {
      clearSuggestions();
      openDrug(drug.id);
    });
    suggestionsBox.appendChild(btn);
  });
  suggestionsBox.classList.remove("hidden");
  suggestionsBox.style.display = "block";
}

// prevent immediate closing glitch
document.addEventListener("mousedown", (e) => {
  if (e.target === drugSearchInput || suggestionsBox.contains(e.target)) return;
  clearSuggestions();
});

/* -------------------- DRUG VIEW -------------------- */

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

  // Populate header
  drugNameEl.textContent = drug.name;
  drugClassEl.textContent = drug.className || "";
  drugTagsEl.innerHTML = "";
  (drug.tags || []).forEach(t => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = t;
    drugTagsEl.appendChild(span);
  });

  // Usual dose
  drugUsualDoseEl.textContent = drug.usualDose || "";

  // Renal bands
  renalBandsEl.innerHTML = "";
  const bandToHighlight = getBandForEgfr(drug.renalBands, currentEgfr);

  drug.renalBands.forEach(band => {
    const li = document.createElement("li");
    li.className = "renal-band";
    if (band === bandToHighlight) li.classList.add("highlight");

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
  egfrSummaryEl.textContent = currentEgfr == null
    ? "No eGFR entered — all bands shown."
    : `Current eGFR: ${currentEgfr} mL/min/1.73m²`;

  // Notes
  drugNotesEl.innerHTML = "";
  (drug.notes || []).forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    drugNotesEl.appendChild(li);
  });

  // Switch views
  searchView.classList.add("hidden");
  drugView.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

backButton.addEventListener("click", () => {
  drugView.classList.add("hidden");
  searchView.classList.remove("hidden");
  drugSearchInput.focus();
});
