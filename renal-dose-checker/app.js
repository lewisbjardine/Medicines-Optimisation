// Renal Dose Calculator – search page logic using drugs.json

let DRUG_DATA = [];
let dataLoaded = false;

const egfrInput = document.getElementById('egfr-input');
const drugSearchInput = document.getElementById('drug-search');
const suggestionsBox = document.getElementById('search-suggestions');

function normalise(str) {
  return (str || '').toLowerCase().trim();
}

function parseEgfr(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

// --- Suggestions rendering ---

function clearSuggestions() {
  suggestionsBox.innerHTML = '';
  suggestionsBox.classList.add('hidden');
}

function searchDrugs(query) {
  if (!dataLoaded) return [];
  const q = normalise(query);
  if (q.length < 2) return [];
  return DRUG_DATA
    .filter((drug) => {
      const nameMatch = normalise(drug.name).includes(q);
      const termMatch = (drug.searchTerms || []).some(t =>
        normalise(t).includes(q)
      );
      return nameMatch || termMatch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderSuggestions(results) {
  if (!results.length) {
    clearSuggestions();
    return;
  }

  suggestionsBox.innerHTML = '';
  results.slice(0, 12).forEach((drug) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = drug.name;
    btn.addEventListener('click', () => {
      clearSuggestions();
      openDrug(drug.id);
    });
    suggestionsBox.appendChild(btn);
  });

  suggestionsBox.classList.remove('hidden');
}

// --- Navigation to drug detail page ---

function openDrug(drugId) {
  const egfr = parseEgfr(egfrInput.value);

  try {
    if (egfr !== null) {
      localStorage.setItem('renalDoseEgfr', String(egfr));
    } else {
      localStorage.removeItem('renalDoseEgfr');
    }
  } catch (e) {
    // localStorage might not be available; fail silently
  }

  window.location.href = 'drug.html?id=' + encodeURIComponent(drugId);
}

// --- Event listeners ---

let suggestionTimeout = null;

drugSearchInput.addEventListener('input', () => {
  const value = drugSearchInput.value;
  clearTimeout(suggestionTimeout);
  suggestionTimeout = setTimeout(() => {
    const results = searchDrugs(value);
    renderSuggestions(results);
  }, 120);
});

drugSearchInput.addEventListener('focus', () => {
  const results = searchDrugs(drugSearchInput.value);
  renderSuggestions(results);
});

drugSearchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const results = searchDrugs(drugSearchInput.value);
    if (results.length >= 1) {
      clearSuggestions();
      openDrug(results[0].id);
    }
  }
});

document.addEventListener('click', (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== drugSearchInput) {
    clearSuggestions();
  }
});

// --- Load JSON data ---

async function loadDrugData() {
  try {
    drugSearchInput.disabled = true;
    drugSearchInput.placeholder = 'Loading renal drug list…';

    const res = await fetch('./drugs.json', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('drugs.json is not an array');
    }

    DRUG_DATA = data;
    dataLoaded = true;
    drugSearchInput.disabled = false;
    drugSearchInput.placeholder = 'Start typing a medicine name…';
  } catch (err) {
    console.error('Failed to load drugs.json', err);
    drugSearchInput.disabled = true;
    drugSearchInput.placeholder = 'Unable to load renal drug data';
  }
}

loadDrugData();
