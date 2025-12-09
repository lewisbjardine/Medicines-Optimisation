// Renal Dose Calculator – drug detail page using drugs.json

let DRUG_DATA = [];
let dataLoaded = false;

const drugNameEl = document.getElementById('drug-name');
const drugClassEl = document.getElementById('drug-class');
const drugTagsEl = document.getElementById('drug-tags');
const drugUsualDoseEl = document.getElementById('drug-usual-dose');
const egfrSummaryEl = document.getElementById('egfr-summary');
const renalBandsEl = document.getElementById('renal-bands');
const drugNotesEl = document.getElementById('drug-notes');
const backButton = document.getElementById('back-button');

function normalise(str) {
  return (str || '').toLowerCase().trim();
}

function parseEgfr(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function getSavedEgfr() {
  let egfr = null;
  const params = new URLSearchParams(window.location.search);
  if (params.has('egfr')) {
    egfr = parseEgfr(params.get('egfr'));
  }
  if (egfr === null) {
    try {
      const stored = localStorage.getItem('renalDoseEgfr');
      egfr = parseEgfr(stored);
    } catch (e) {
      egfr = null;
    }
  }
  return egfr;
}

function getBandForEgfr(renalBands, egfr) {
  if (egfr === null || !Array.isArray(renalBands)) return null;
  for (const band of renalBands) {
    const minOk = band.min === null || egfr >= band.min;
    const maxOk = band.max === null || egfr < band.max;
    if (minOk && maxOk) return band;
  }
  return null;
}

function renderDrug(drug) {
  const egfr = getSavedEgfr();

  drugNameEl.textContent = drug.name || '';
  drugClassEl.textContent = drug.className || '';

  // tags
  drugTagsEl.innerHTML = '';
  (drug.tags || []).forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'pill';
    span.textContent = tag;
    drugTagsEl.appendChild(span);
  });

  // usual dose
  drugUsualDoseEl.textContent = drug.usualDose || '';

  // renal bands
  renalBandsEl.innerHTML = '';
  const bands = drug.renalBands || [];
  const highlightBand = getBandForEgfr(bands, egfr);

  bands.forEach((band) => {
    const li = document.createElement('li');
    li.className = 'renal-band';

    if (highlightBand && highlightBand === band) {
      li.classList.add('highlight');
    }

    const header = document.createElement('div');
    header.className = 'renal-band-header';

    const labelEl = document.createElement('div');
    labelEl.className = 'renal-band-label';
    labelEl.textContent = band.label || '';
    header.appendChild(labelEl);

    if (band.category) {
      const catEl = document.createElement('div');
      catEl.className = 'renal-band-category';
      catEl.textContent = band.category;
      header.appendChild(catEl);
    }

    const body = document.createElement('div');
    body.className = 'renal-band-body';
    body.textContent = band.details || '';

    li.appendChild(header);
    li.appendChild(body);
    renalBandsEl.appendChild(li);
  });

  // eGFR summary text
  if (egfr !== null) {
    egfrSummaryEl.textContent =
      'eGFR used: ' +
      egfr +
      ' mL/min/1.73 m². The highlighted band shows the renal dosing category that matches this value. For DOACs, final dosing should follow creatinine clearance using Cockcroft–Gault.';
  } else {
    egfrSummaryEl.textContent =
      'No eGFR value was available from the search page. All renal bands are shown without a highlighted recommendation.';
  }

  // notes
  drugNotesEl.innerHTML = '';
  (drug.notes || []).forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    drugNotesEl.appendChild(li);
  });
}

async function loadDrugData() {
  if (dataLoaded) return;

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
}

async function init() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    await loadDrugData();

    const drug = DRUG_DATA.find((d) => d.id === id);
    if (!drug) {
      drugNameEl.textContent = 'Medicine not found';
      drugClassEl.textContent = '';
      renalBandsEl.innerHTML = '';
      egfrSummaryEl.textContent = 'The requested medicine ID was not found in the renal dose data.';
      return;
    }

    renderDrug(drug);
  } catch (err) {
    console.error('Error initialising drug page', err);
    drugNameEl.textContent = 'Error loading renal drug data';
    egfrSummaryEl.textContent = 'Please check that drugs.json is present and correctly formatted.';
  }
}

if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

init();
