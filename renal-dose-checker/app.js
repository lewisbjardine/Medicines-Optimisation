// app.js — logic for Renal Dose Calculator (non-module, uses global DRUG_DATA)

const DRUG_DATA = window.DRUG_DATA || [];

/************************************************************
 * DOM references
 ************************************************************/

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
const egfrSummaryEl = document.getElementById("egfr-summary");
const renalBandsEl = document.getElementById("renal-bands");
const drugNotesEl = document.getElementById("drug-notes");

let currentEgfr = null;

// Initial view state
searchView.style.display = "block";
drugView.style.display = "none";

/************************************************************
 * Helpers
 ************************************************************/

function normalise(str) {
  return (str || "").toLowerCase().trim();
}

function parseEgfr(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function updateEgfr() {
  currentEgfr = parseEgfr(egfrInput.value);
}

egfrInput.addEventListener("input", updateEgfr);

/************************************************************
 * Search / suggestions
 ************************************************************/

function searchDrugs(query) {
  const q = normalise(query);
  if (q.length < 2) return [];

  return DRUG_DATA.filter((drug) => {
    const nameMatch = normalise(drug.name).includes(q);
    const termMatch = (drug.searchTerms || []).some((t) =>
      normalise(t).includes(q)
    );
    return nameMatch || termMatch;
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function clearSuggestions() {
  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "none";
}

function renderSuggestions(results) {
  if (!results.length) {
    clearSuggestions();
    return;
  }

  suggestionsBox.innerHTML = "";
  results.slice(0, 12).forEach((drug) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = drug.name;
    btn.addEventListener("click", () => {
      clearSuggestions();
      openDrug(drug.id);
    });
    suggestionsBox.appendChild(btn);
  });

  suggestionsBox.style.display = "block";
}

let suggestionTimeout = null;

drugSearchInput.addEventListener("input", () => {
  const value = drugSearchInput.value;
  clearTimeout(suggestionTimeout);
  suggestionTimeout = setTimeout(() => {
    const results = searchDrugs(value);
    renderSuggestions(results);
  }, 120);
});

drugSearchInput.addEventListener("focus", () => {
  const results = searchDrugs(drugSearchInput.value);
  renderSuggestions(results);
});

document.addEventListener("click", (e) => {
  if (
    e.target !== drugSearchInput &&
    !suggestionsBox.contains(e.target)
  ) {
    clearSuggestions();
  }
});

drugSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const results = searchDrugs(drugSearchInput.value);
    if (!results.length) return;
    clearSuggestions();
    openDrug(results[0].id);
  }
});

/************************************************************
 * Drug detail view
 ************************************************************/

function getBandForEgfr(renalBands, egfr) {
  if (egfr == null) return null;
  for (const band of renalBands) {
    const minOk = band.min == null || egfr >= band.min;
    const maxOk = band.max == null || egfr < band.max;
    if (minOk && maxOk) return band;
  }
  return null;
}

function openDrug(drugId) {
  const drug = DRUG_DATA.find((d) => d.id === drugId);
  if (!drug) return;

  updateEgfr();

  // Basic info
  drugNameEl.textContent = drug.name;
  drugClassEl.textContent = drug.className || "";
  drugUsualDoseEl.textContent = drug.usualDose || "";

  // Tags
  drugTagsEl.innerHTML = "";
  (drug.tags || []).forEach((tag) => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = tag;
    drugTagsEl.appendChild(span);
  });

  // Renal bands
  renalBandsEl.innerHTML = "";
  const highlightBand = getBandForEgfr(drug.renalBands || [], currentEgfr);

  (drug.renalBands || []).forEach((band) => {
    const li = document.createElement("li");
    li.className = "renal-band";

    if (highlightBand && highlightBand === band) {
      li.classList.add("highlight");
    }

    const header = document.createElement("div");
    header.className = "renal-band-header";

    const labelEl = document.createElement("div");
    labelEl.className = "renal-band-label";
    labelEl.textContent = band.label;
    header.appendChild(labelEl);

    if (band.category) {
      const catEl = document.createElement("div");
      catEl.className = "renal-band-category";
      catEl.textContent = band.category;
      header.appendChild(catEl);
    }

    const body = document.createElement("div");
    body.className = "renal-band-body";
    body.textContent = band.details;

    li.appendChild(header);
    li.appendChild(body);
    renalBandsEl.appendChild(li);
  });

  // eGFR summary
  if (currentEgfr != null) {
    egfrSummaryEl.textContent =
      "Current eGFR entered: " +
      currentEgfr +
      " mL/min/1.73m². Highlighted band shows the renal dosing category that matches this value. For DOACs, calculate dose using creatinine clearance (Cockcroft–Gault) rather than eGFR.";
  } else {
    egfrSummaryEl.textContent =
      "No eGFR value entered – all renal bands are shown. Enter eGFR on the search page to highlight the most relevant band.";
  }

  // Notes
  drugNotesEl.innerHTML = "";
  (drug.notes || []).forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    drugNotesEl.appendChild(li);
  });

  // “New page” effect
  searchView.style.display = "none";
  drugView.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

backButton.addEventListener("click", () => {
  drugView.style.display = "none";
  searchView.style.display = "block";
  drugSearchInput.focus();
});

// Initialise
updateEgfr();
