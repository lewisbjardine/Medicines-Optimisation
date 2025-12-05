//
// Antidepressants Module (Modularised)
//

// -------------------------------
// DOM references
// -------------------------------
const fromDrugSelect = document.getElementById("fromDrug");
const toDrugSelect = document.getElementById("toDrug");
const stopDrugSelect = document.getElementById("stopDrug");

const fromDoseSelect = document.getElementById("fromDose");
const toDrugDoseSelect = document.getElementById("toDrugDose");
const stopDoseSelect = document.getElementById("stopDose");

const switchClinicianOutput = document.getElementById("switchClinician");
const switchSMSOutput = document.getElementById("switchSMS");
const switchTabletsOutput = document.getElementById("switchTablets");

const stopClinicianOutput = document.getElementById("stopClinician");
const stopSMSOutput = document.getElementById("stopSMS");
const stopTabletsOutput = document.getElementById("stopTablets");

// -------------------------------
// Tabs
// -------------------------------
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tabName = btn.getAttribute("data-tab");
    document.querySelectorAll(".tab").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(tabName).classList.remove("hidden");
  });
});

// -------------------------------
// Local state
// -------------------------------
let showAllAntidepressants = false;
let savedState = JSON.parse(localStorage.getItem("antidepressantState") || "{}");

function saveState(newState) {
  savedState = { ...savedState, ...newState };
  localStorage.setItem("antidepressantState", JSON.stringify(savedState));
}

// -------------------------------
// Clipboard copy
// -------------------------------
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const text = document.getElementById(targetId).textContent || "";

    navigator.clipboard.writeText(text)
      .then(() => {
        btn.classList.add("copied");
        setTimeout(() => btn.classList.remove("copied"), 800);
      })
      .catch(() => {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        btn.classList.add("copied");
        setTimeout(() => btn.classList.remove("copied"), 800);
      });
  });
});
//
// PART 2 — ANTIDEPRESSANT DATA
//

const antidepressants = [
  {
    id: "sertraline",
    name: "Sertraline",
    class: "SSRI",
    dailyDoses: [25, 50, 75, 100, 125, 150, 175, 200],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [100, 50, 25],
    recommendedStart: 50,
    geriatricStart: 25
  },

  {
    id: "citalopram",
    name: "Citalopram",
    class: "SSRI",
    dailyDoses: [10, 20, 40],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [40, 20, 10],
    recommendedStart: 20
  },

  {
    id: "escitalopram",
    name: "Escitalopram",
    class: "SSRI",
    dailyDoses: [5, 10, 20],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [20, 10, 5],
    recommendedStart: 10
  },

  {
    id: "fluoxetine",
    name: "Fluoxetine",
    class: "SSRI",
    dailyDoses: [10, 20, 30, 40, 60],
    halfLife: "very_long",
    withdrawalRisk: "low",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [60, 20, 10],
    recommendedStart: 20
  },

  {
    id: "paroxetine",
    name: "Paroxetine",
    class: "SSRI",
    dailyDoses: [10, 20, 30, 40, 50, 60],
    halfLife: "short",
    withdrawalRisk: "high",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [40, 30, 20, 10],
    recommendedStart: 20
  },

  {
    id: "fluvoxamine",
    name: "Fluvoxamine",
    class: "SSRI",
    dailyDoses: [50, 100, 150, 200, 250, 300],
    halfLife: "short",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [100, 50],
    recommendedStart: 50
  },

  //
  // VENLAFAXINE — CORRECTED
  //

  {
    id: "venlafaxine_ir",
    name: "Venlafaxine IR (immediate-release)",
    class: "SNRI",
    dailyDoses: [37.5, 75, 112.5, 150, 187.5, 225, 262.5, 300, 337.5, 375],
    halfLife: "short",
    withdrawalRisk: "very_high",
    ukLicensed: true,
    requiresSwitchForTaper: false,

    // Correct IR strengths (UK): 37.5 mg, 75 mg
    unitStrengths: [75, 37.5],

    recommendedStart: 75,
    geriatricStart: 37.5
  },

  {
    id: "venlafaxine_mr",
    name: "Venlafaxine MR / XL (modified-release)",
    class: "SNRI",
    dailyDoses: [75, 150, 225, 300, 375],
    halfLife: "short",
    withdrawalRisk: "very_high",
    ukLicensed: true,
    requiresSwitchForTaper: true,

    // Correct MR strengths (UK): 37.5, 75, 150, 225, 300 mg
    unitStrengths: [300, 225, 150, 75, 37.5],

    recommendedStart: 75
  },

  {
    id: "duloxetine",
    name: "Duloxetine",
    class: "SNRI",
    dailyDoses: [30, 60, 90, 120],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [60, 30],
    recommendedStart: 30
  },

  //
  // MIRTAZAPINE — CORRECTED DOSES
  //

  {
    id: "mirtazapine",
    name: "Mirtazapine",
    class: "NaSSA",
    // Correct doses: 15 / 30 / 45 mg (no 7.5, 22.5, 37.5)
    dailyDoses: [15, 30, 45],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [45, 30, 15],
    recommendedStart: 15
  },

  //
  // TRICYCLICS & RELATED
  //

  {
    id: "amitriptyline",
    name: "Amitriptyline",
    class: "TCA",
    dailyDoses: [10, 25, 35, 50, 75, 100, 125, 150],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [50, 25, 10],
    recommendedStart: 25
  },

  {
    id: "trazodone",
    name: "Trazodone",
    class: "SARI",
    dailyDoses: [50, 100, 150, 200, 250, 300, 400],
    halfLife: "short",
    withdrawalRisk: "high",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [150, 100, 50],
    recommendedStart: 50
  },

  {
    id: "clomipramine",
    name: "Clomipramine",
    class: "TCA",
    dailyDoses: [10, 25, 50, 75, 100, 125, 150, 200],
    halfLife: "medium",
    withdrawalRisk: "high",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [50, 25, 10],
    recommendedStart: 25
  },

  {
    id: "dosulepin",
    name: "Dosulepin",
    class: "TCA",
    dailyDoses: [25, 75, 150],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: false,
    requiresSwitchForTaper: false,
    unitStrengths: [75, 25],
    recommendedStart: 25
  },

  {
    id: "doxepin",
    name: "Doxepin",
    class: "TCA",
    dailyDoses: [25, 50, 75, 100, 150, 200],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [75, 50, 25],
    recommendedStart: 25
  },

  {
    id: "imipramine",
    name: "Imipramine",
    class: "TCA",
    dailyDoses: [10, 25, 50, 75, 100, 150, 200],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [50, 25, 10],
    recommendedStart: 25
  },

  {
    id: "lofepramine",
    name: "Lofepramine",
    class: "TCA",
    dailyDoses: [70, 140, 210, 280],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [70],
    recommendedStart: 70
  },

  {
    id: "maprotiline",
    name: "Maprotiline",
    class: "TCA-related",
    dailyDoses: [25, 50, 75, 100, 150],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: false,
    requiresSwitchForTaper: false,
    unitStrengths: [75, 25],
    recommendedStart: 25
  },

  {
    id: "mianserin",
    name: "Mianserin",
    class: "TCA-related",
    dailyDoses: [10, 30, 60],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: false,
    requiresSwitchForTaper: false,
    // Corrected: 10 / 30 / 60 mg are available
    unitStrengths: [60, 30, 10],
    recommendedStart: 30
  },

  {
    id: "nortriptyline",
    name: "Nortriptyline",
    class: "TCA",
    dailyDoses: [10, 25, 50, 75, 100],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [50, 25, 10],
    recommendedStart: 25
  },

  {
    id: "trimipramine",
    name: "Trimipramine",
    class: "TCA",
    dailyDoses: [10, 25, 50, 75, 100, 150],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: false,
    requiresSwitchForTaper: false,

    // Corrected: include the missing 10 mg
    unitStrengths: [50, 25, 10],
    recommendedStart: 25
  },

  //
  // S&NRI-like atypicals
  //

  {
    id: "reboxetine",
    name: "Reboxetine",
    class: "NRI",
    dailyDoses: [4, 8, 10, 12],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [4],
    recommendedStart: 4
  },

  {
    id: "agomelatine",
    name: "Agomelatine",
    class: "Melatonergic",
    dailyDoses: [25, 50],
    halfLife: "short",
    withdrawalRisk: "low",
    ukLicensed: false,
    requiresSwitchForTaper: false,
    unitStrengths: [25],
    recommendedStart: 25
  },

  {
    id: "vortioxetine",
    name: "Vortioxetine",
    class: "Serotonin modulator",
    dailyDoses: [5, 10, 15, 20],
    halfLife: "very_long",
    withdrawalRisk: "low",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [20, 15, 10, 5],
    recommendedStart: 10
  }
];
//
// PART 3 — DROPDOWNS, EXPAND/COLLAPSE LOGIC
//

const SHOW_ALL_VALUE = "__SHOW_ALL__";
const HIDE_EXTRA_VALUE = "__HIDE__";

// ---------------------------------
// DRUG LOOKUP
// ---------------------------------
function getDrugById(id) {
  return antidepressants.find(d => d.id === id) || null;
}

// ---------------------------------
// POPULATE DRUG SELECT
// ---------------------------------
function populateDrugSelect(selectEl, showAll = false, selectedValue = null, includeShowAllOption = true) {
  selectEl.innerHTML = "";

  const list = showAll
    ? antidepressants
    : antidepressants.filter(d => d.ukLicensed || d.class !== "MAOI").slice(0, 10);

  // Create drug options
  list.forEach(drug => {
    const opt = document.createElement("option");
    opt.value = drug.id;
    opt.textContent = drug.name;
    selectEl.appendChild(opt);
  });

  // Meta-options
  if (!showAll && includeShowAllOption) {
    const showAllOpt = document.createElement("option");
    showAllOpt.value = SHOW_ALL_VALUE;
    showAllOpt.textContent = "Show all antidepressants…";
    showAllOpt.setAttribute("data-meta-option", "true");
    selectEl.appendChild(showAllOpt);
  }

  if (showAll && includeShowAllOption) {
    const hideOpt = document.createElement("option");
    hideOpt.value = HIDE_EXTRA_VALUE;
    hideOpt.textContent = "Hide extra antidepressants";
    hideOpt.setAttribute("data-meta-option", "true");
    selectEl.appendChild(hideOpt);
  }

  // Restore previous selection
  if (selectedValue && [...selectEl.options].some(o => o.value === selectedValue)) {
    selectEl.value = selectedValue;
  } else {
    selectEl.selectedIndex = 0;
  }
}

// ---------------------------------
// POPULATE DOSE SELECT
// ---------------------------------
function populateDoseSelect(drugId, doseSelect) {
  const drug = getDrugById(drugId);
  if (!drug) return;

  doseSelect.innerHTML = "";

  drug.dailyDoses.forEach(dose => {
    const opt = document.createElement("option");
    opt.value = dose;
    opt.textContent = dose + " mg";
    doseSelect.appendChild(opt);
  });
}

// Populate starting dose of the target drug
function populateToDrugDose(drugId, doseSelect) {
  const drug = getDrugById(drugId);
  if (!drug) return;

  doseSelect.innerHTML = "";

  drug.dailyDoses.forEach(dose => {
    const opt = document.createElement("option");
    opt.value = dose;
    opt.textContent = dose + " mg";
    doseSelect.appendChild(opt);
  });
}

// ---------------------------------
// EXPAND/COLLAPSE FUNCTIONS
// ---------------------------------
function expandAllAntidepressantsAndRepopulate() {
  showAllAntidepressants = true;
  saveState({ showAllAntidepressants: true });

  populateDrugSelect(fromDrugSelect, true, null, true);
  populateDrugSelect(toDrugSelect, true, null, true);
  populateDrugSelect(stopDrugSelect, true, null, true);

  populateDoseSelect(fromDrugSelect.value, fromDoseSelect);
  populateToDrugDose(toDrugSelect.value, toDrugDoseSelect);
  populateDoseSelect(stopDrugSelect.value, stopDoseSelect);
}

function collapseAntidepressantsAndRepopulate() {
  showAllAntidepressants = false;
  saveState({ showAllAntidepressants: false });

  populateDrugSelect(fromDrugSelect, false, null, true);
  populateDrugSelect(toDrugSelect, false, null, true);
  populateDrugSelect(stopDrugSelect, false, null, true);

  populateDoseSelect(fromDrugSelect.value, fromDoseSelect);
  populateToDrugDose(toDrugSelect.value, toDrugDoseSelect);
  populateDoseSelect(stopDrugSelect.value, stopDoseSelect);
}

// ---------------------------------
// EVENT LISTENERS FOR EACH SELECT
// ---------------------------------
function attachDrugSelectListeners(selectEl, doseSelect, isSwitchToSelect = false) {
  selectEl.addEventListener("change", () => {
    const val = selectEl.value;

    if (val === SHOW_ALL_VALUE) {
      expandAllAntidepressantsAndRepopulate();
      return;
    }

    if (val === HIDE_EXTRA_VALUE) {
      collapseAntidepressantsAndRepopulate();
      return;
    }

    if (isSwitchToSelect) {
      populateToDrugDose(val, toDrugDoseSelect);
    } else {
      populateDoseSelect(val, doseSelect);
    }

    saveState({ [selectEl.id]: val });
  });
}

// fromDrug / fromDose
attachDrugSelectListeners(fromDrugSelect, fromDoseSelect);

// toDrug / toDrugDose
attachDrugSelectListeners(toDrugSelect, toDrugDoseSelect, true);

// stopDrug / stopDose
attachDrugSelectListeners(stopDrugSelect, stopDoseSelect);

// ---------------------------------
// CLICK-AWAY HANDLER — collapse expanded dropdowns
// ---------------------------------
document.addEventListener("click", (ev) => {
  const isSelect =
    ev.target.closest("#fromDrug") ||
    ev.target.closest("#toDrug") ||
    ev.target.closest("#stopDrug");

  if (!isSelect && showAllAntidepressants) {
    collapseAntidepressantsAndRepopulate();
  }
});

