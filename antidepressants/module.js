// ============================
// Antidepressant Switch & Stop Tool
// Fully restored behaviour
// ============================

// ---- GLOBAL STATE ----
let showAllAntidepressants = false;
let taperProfile = "standard";
let userHasClickedGenerateStop = false;

let pendingTaperContext = null;
let pendingTaperOptions = [];
let selectedTaperOptionId = null;

let lastFocusedElementBeforeModal = null;

const SHOW_ALL_VALUE = "__SHOW_ALL__";
const HIDE_EXTRA_VALUE = "__HIDE_EXTRA__";

// ---- ANTIDEPRESSANT DATA ----
const antidepressants = [
  // -------- SSRIs ----------
  {
    id: "sertraline",
    name: "Sertraline",
    class: "SSRI",
    dailyDoses: [25, 50, 75, 100, 150, 200],
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
    name: "Citalalopram",
    class: "SSRI",
    dailyDoses: [10, 20, 40],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [40, 20, 10],
    recommendedStart: 20,
    geriatricStart: 10
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
    recommendedStart: 10,
    geriatricStart: 5
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
    recommendedStart: 20,
    geriatricStart: 10
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
    recommendedStart: 20,
    geriatricStart: 10
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
    recommendedStart: 50,
    geriatricStart: 50
  },

  // -------- SNRIs ----------
  {
    id: "venlafaxine_ir",
    name: "Venlafaxine IR (immediate-release)",
    class: "SNRI",
    dailyDoses: [37.5, 75, 112.5, 150, 187.5, 225, 262.5, 300, 337.5, 375],
    halfLife: "short",
    withdrawalRisk: "very_high",
    ukLicensed: true,
    requiresSwitchForTaper: false,
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
    unitStrengths: [300, 225, 150, 75, 37.5],
    recommendedStart: 75,
    geriatricStart: 37.5
  },
  {
    id: "duloxetine",
    name: "Duloxetine",
    class: "SNRI",
    dailyDoses: [30, 60, 90, 120],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: true,
    unitStrengths: [60, 30],
    recommendedStart: 30,
    geriatricStart: 30
  },

  // -------- NaSSA / atypical ----------
  {
    id: "mirtazapine",
    name: "Mirtazapine",
    class: "NaSSA",
    dailyDoses: [15, 30, 45],
    halfLife: "medium",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [45, 30, 15],
    recommendedStart: 15,
    geriatricStart: 15
  },
  {
    id: "vortioxetine",
    name: "Vortioxetine",
    class: "Atypical",
    dailyDoses: [5, 10, 15, 20],
    halfLife: "very_long",
    withdrawalRisk: "low",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [20, 15, 10, 5],
    recommendedStart: 10,
    geriatricStart: 5
  },
  {
    id: "agomelatine",
    name: "Agomelatine",
    class: "Atypical",
    dailyDoses: [25, 50],
    halfLife: "short",
    withdrawalRisk: "low",
    ukLicensed: false,
    requiresSwitchForTaper: false,
    unitStrengths: [25],
    recommendedStart: 25,
    geriatricStart: 25
  },
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
    recommendedStart: 4,
    geriatricStart: 2
  },

  // -------- TCAs ----------
  {
    id: "amitriptyline",
    name: "Amitriptyline",
    class: "TCA",
    dailyDoses: [10, 25, 50, 75, 100, 150],
    halfLife: "long",
    withdrawalRisk: "medium",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [50, 25, 10],
    recommendedStart: 25,
    geriatricStart: 10
  },
  {
    id: "clomipramine",
    name: "Clomipramine",
    class: "TCA",
    dailyDoses: [25, 50, 75, 100, 150, 200],
    halfLife: "medium",
    withdrawalRisk: "high",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [50, 25],
    recommendedStart: 25,
    geriatricStart: 10
  },
  {
    id: "dosulepin",
    name: "Dosulepin (dothiepin – not recommended)",
    class: "TCA",
    dailyDoses: [25, 50, 75, 150],
    halfLife: "long",
    withdrawalRisk: "high",
    ukLicensed: true,
    requiresSwitchForTaper: false,
    unitStrengths: [75, 25],
    recommendedStart: 25,
    geriatricStart: 25
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
    recommendedStart: 25,
    geriatricStart: 10
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
    recommendedStart: 25,
    geriatricStart: 10
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
    recommendedStart: 70,
    geriatricStart: 70
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
    recommendedStart: 25,
    geriatricStart: 10
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
    unitStrengths: [50, 25, 10],
    recommendedStart: 25,
    geriatricStart: 10
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
    unitStrengths: [60, 30, 10],
    recommendedStart: 30,
    geriatricStart: 10
  },

  // ------------ MAOIs (specialist only) ------------
  {
    id: "phenelzine",
    name: "Phenelzine (MAOI – specialist only)",
    class: "MAOI",
    dailyDoses: [15, 30, 45, 60],
    halfLife: "medium",
    withdrawalRisk: "high",
    ukLicensed: true,
    specialistOnly: true,
    noAutoSwitch: true,
    unitStrengths: [15],
    recommendedStart: 15,
    geriatricStart: 15
  },
  {
    id: "tranylcypromine",
    name: "Tranylcypromine (MAOI – specialist only)",
    class: "MAOI",
    dailyDoses: [10, 20, 30, 40, 50, 60],
    halfLife: "short",
    withdrawalRisk: "high",
    ukLicensed: true,
    specialistOnly: true,
    noAutoSwitch: true,
    unitStrengths: [10],
    recommendedStart: 10,
    geriatricStart: 10
  },
  {
    id: "isocarboxazid",
    name: "Isocarboxazid (MAOI – specialist only)",
    class: "MAOI",
    dailyDoses: [10, 20, 30, 40, 60],
    halfLife: "medium",
    withdrawalRisk: "high",
    ukLicensed: true,
    specialistOnly: true,
    noAutoSwitch: true,
    unitStrengths: [10],
    recommendedStart: 10,
    geriatricStart: 10
  },
  {
    id: "moclobemide",
    name: "Moclobemide (reversible MAOI – specialist only)",
    class: "MAOI",
    dailyDoses: [150, 300, 450, 600],
    halfLife: "short",
    withdrawalRisk: "medium",
    ukLicensed: true,
    specialistOnly: true,
    noAutoSwitch: true,
    unitStrengths: [150],
    recommendedStart: 150,
    geriatricStart: 150
  }
];

// ============================
// Utility Functions
// ============================

function getDrugById(id) {
  return antidepressants.find(d => d.id === id) || null;
}

function describeHalfLife(drug) {
  const map = {
    short: "short half-life (higher withdrawal risk)",
    medium: "medium half-life",
    long: "long half-life (smoother withdrawal)",
    very_long: "very long half-life (withdrawal may be delayed)"
  };
  return map[drug.halfLife] || "";
}

function describeWithdrawalRisk(drug) {
  const map = {
    low: "lower withdrawal risk",
    medium: "moderate withdrawal risk",
    high: "higher withdrawal risk",
    very_high: "very high withdrawal risk"
  };
  return map[drug.withdrawalRisk] || "";
}

// ============================
// DOM Elements
// ============================

const fromDrugSelect = document.getElementById("fromDrug");
const fromDoseSelect = document.getElementById("fromDose");
const toDrugSelect = document.getElementById("toDrug");
const toDrugDoseSelect = document.getElementById("toDrugDose");

const switchClinicianOutput = document.getElementById("switchClinician");
const switchSMSOutput = document.getElementById("switchSMS");
const switchTabletsOutput = document.getElementById("switchTablets");

const generateSwitchButton = document.getElementById("generateSwitch");
const clearSwitchButton = document.getElementById("clearSwitch");

const stopDrugSelect = document.getElementById("stopDrug");
const stopDoseSelect = document.getElementById("stopDose");
const durationSelect = document.getElementById("duration");

const stopClinicianOutput = document.getElementById("stopClinician");
const stopSMSOutput = document.getElementById("stopSMS");
const stopTabletsOutput = document.getElementById("stopTablets");

const generateStopButton = document.getElementById("generateStop");
const clearStopButton = document.getElementById("clearStop");

const tabButtons = document.querySelectorAll(".tab-button");
const tabs = document.querySelectorAll(".tab");
const copyButtons = document.querySelectorAll(".copy-btn");
const taperProfileButtons = document.querySelectorAll(".taper-profile-button");

const taperModal = document.getElementById("taperModal");
const taperModalTitle = document.getElementById("taperModalTitle");
const taperModalDescription = document.getElementById("taperModalDescription");
const taperModalOptions = document.getElementById("taperModalOptions");
const taperModalCancel = document.getElementById("taperModalCancel");
const taperModalConfirm = document.getElementById("taperModalConfirm");

// ============================
// Dropdowns
// ============================

function populateDrugSelect(selectEl, showAll = false, selectedValue = null) {
  selectEl.innerHTML = "";

  const limitedList = antidepressants.filter(d => d.ukLicensed).slice(0, 10);
  const fullList = antidepressants;
  const list = showAll ? fullList : limitedList;

  list.forEach(drug => {
    const opt = document.createElement("option");
    opt.value = drug.id;
    opt.textContent = drug.name;
    selectEl.appendChild(opt);
  });

  const metaOption = document.createElement("option");
  metaOption.value = showAll ? HIDE_EXTRA_VALUE : SHOW_ALL_VALUE;
  metaOption.textContent = showAll
    ? "Hide extra antidepressants"
    : "Show all antidepressants…";
  metaOption.dataset.meta = "true";
  selectEl.appendChild(metaOption);

  if (selectedValue && [...selectEl.options].some(o => o.value === selectedValue)) {
    selectEl.value = selectedValue;
  } else {
    selectEl.selectedIndex = 0;
  }
}

function populateDoseSelect(drugSelect, doseSelect) {
  const drug = getDrugById(drugSelect.value);
  doseSelect.innerHTML = "";
  if (!drug) return;
  drug.dailyDoses.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = `${d} mg`;
    doseSelect.appendChild(opt);
  });
}

function initialiseDropdowns() {
  populateDrugSelect(fromDrugSelect, showAllAntidepressants);
  populateDrugSelect(toDrugSelect, showAllAntidepressants);
  populateDrugSelect(stopDrugSelect, showAllAntidepressants);

  populateDoseSelect(fromDrugSelect, fromDoseSelect);
  populateDoseSelect(toDrugSelect, toDrugDoseSelect);
  populateDoseSelect(stopDrugSelect, stopDoseSelect);
}

function handleDrugSelectChange(selectEl, doseSelect) {
  const value = selectEl.value;

  if (value === SHOW_ALL_VALUE) {
    showAllAntidepressants = true;
    initialiseDropdowns();
    return;
  }

  if (value === HIDE_EXTRA_VALUE) {
    showAllAntidepressants = false;
    initialiseDropdowns();
    return;
  }

  if (doseSelect) {
    populateDoseSelect(selectEl, doseSelect);
  }
}

// collapse back from "show all" if click outside
document.addEventListener("click", (ev) => {
  const isDropdown =
    ev.target.closest("#fromDrug") ||
    ev.target.closest("#toDrug") ||
    ev.target.closest("#stopDrug");

  if (!isDropdown && showAllAntidepressants) {
    showAllAntidepressants = false;
    initialiseDropdowns();
  }
});

// ============================
// Copy buttons
// ============================

copyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const el = document.getElementById(targetId);
    if (!el) return;
    const text = el.textContent || "";

    navigator.clipboard.writeText(text).then(
      () => {
        btn.classList.add("copied");
        setTimeout(() => btn.classList.remove("copied"), 800);
      },
      () => {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    );
  });
});

// ============================
// Tabs
// ============================

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tabName = btn.dataset.tab;
    tabs.forEach(t => t.classList.toggle("hidden", t.id !== tabName));
  });
});

// ============================
// Taper profile
// ============================

function setTaperProfile(profile) {
  taperProfile = profile;
  taperProfileButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.profile === profile);
  });
  if (userHasClickedGenerateStop) {
    generateStopPlan();
  }
}

taperProfileButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const profile = btn.dataset.profile || "standard";
    setTaperProfile(profile);
  });
});

// ============================
// Modal helpers
// ============================

function openTaperModal(context, options) {
  pendingTaperContext = context;
  pendingTaperOptions = options || [];
  selectedTaperOptionId = null;

  taperModalTitle.textContent = context.title || "Choose taper option";
  taperModalDescription.textContent =
    context.description || "Select the taper plan that best matches the clinical situation.";

  taperModalOptions.innerHTML = "";

  pendingTaperOptions.forEach(opt => {
    const div = document.createElement("div");
    div.className = "modal-option";
    div.dataset.id = opt.id;

    const title = document.createElement("div");
    title.textContent = opt.title;
    div.appendChild(title);

    const body = document.createElement("div");
    body.textContent = opt.description;
    div.appendChild(body);

    div.addEventListener("click", () => {
      document.querySelectorAll(".modal-option").forEach(o => o.classList.remove("selected"));
      div.classList.add("selected");
      selectedTaperOptionId = opt.id;
    });

    taperModalOptions.appendChild(div);
  });

  lastFocusedElementBeforeModal = document.activeElement;
  taperModal.classList.remove("hidden");
}

function closeTaperModal() {
  taperModal.classList.add("hidden");
  if (lastFocusedElementBeforeModal) lastFocusedElementBeforeModal.focus();
  pendingTaperContext = null;
  pendingTaperOptions = [];
  selectedTaperOptionId = null;
}

taperModalCancel.addEventListener("click", closeTaperModal);

taperModalConfirm.addEventListener("click", () => {
  if (!selectedTaperOptionId || !pendingTaperContext) {
    closeTaperModal();
    return;
  }
  const chosen = pendingTaperOptions.find(o => o.id === selectedTaperOptionId);
  if (!chosen) return closeTaperModal();

  stopClinicianOutput.textContent = chosen.clinicianText || "";
  stopSMSOutput.textContent = chosen.smsText || "";
  stopTabletsOutput.textContent = chosen.tabletText || "";

  closeTaperModal();
});

taperModal.addEventListener("click", e => {
  if (e.target === taperModal) closeTaperModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !taperModal.classList.contains("hidden")) {
    closeTaperModal();
  }
});

// ============================
// Switching logic
// ============================

function clearSwitchOutputs() {
  switchClinicianOutput.textContent = "";
  switchSMSOutput.textContent = "";
  switchTabletsOutput.textContent = "";
}

function generateSwitchPlan() {
  clearSwitchOutputs();

  const fromDrugId = fromDrugSelect.value;
  const toDrugId = toDrugSelect.value;
  const fromDose = parseFloat(fromDoseSelect.value);
  const toDose = parseFloat(toDrugDoseSelect.value);

  const fromDrug = getDrugById(fromDrugId);
  const toDrug = getDrugById(toDrugId);

  if (!fromDrug || !toDrug || !fromDose || !toDose) {
    switchClinicianOutput.textContent = "Please select both antidepressants and doses.";
    return;
  }

  if (fromDrugId === toDrugId) {
    switchClinicianOutput.textContent =
      "You selected the same antidepressant as both current and target.\nNo switch plan required.";
    switchSMSOutput.textContent =
      "Your antidepressant is not being changed at this time.";
    return;
  }

  if (fromDrug.class === "MAOI" || toDrug.class === "MAOI") {
    switchClinicianOutput.textContent =
      "Switches involving MAOIs require specialist advice.\nNo automated plan generated.";
    switchSMSOutput.textContent =
      "Your medication change involves a specialist-only drug, so your clinician will advise you directly.";
    return;
  }

  let clinician = "";
  let sms = "";
  let tablet = "";

  clinician += `Current antidepressant: ${fromDrug.name} – ${fromDose} mg daily.\n`;
  clinician += `Target antidepressant: ${toDrug.name} – ${toDose} mg starting dose.\n\n`;
  clinician += "Half-life & withdrawal considerations:\n";
  clinician += `• ${fromDrug.name}: ${describeHalfLife(fromDrug)}; ${describeWithdrawalRisk(fromDrug)}.\n`;
  clinician += `• ${toDrug.name}: ${describeHalfLife(toDrug)}; ${describeWithdrawalRisk(toDrug)}.\n\n`;

  clinician += "Suggested switch approach:\n\n";

  const fromHighRisk =
    fromDrug.withdrawalRisk === "high" || fromDrug.withdrawalRisk === "very_high";

  const toHighRisk =
    toDrug.withdrawalRisk === "high" || toDrug.withdrawalRisk === "very_high";

  if (fromDrug.class === "SSRI" && toDrug.class === "SSRI" && !fromHighRisk && !toHighRisk) {
    clinician +=
      "1. Direct switch recommended: stop the current SSRI one day and start the new SSRI the next day.\n";
    clinician += "2. Start at the suggested starting dose.\n";
    clinician += "3. Monitor for serotonin toxicity and withdrawal.\n";

    sms =
      `We are changing your antidepressant from ${fromDrug.name} to ${toDrug.name}. ` +
      `You will stop ${fromDrug.name} one day and start ${toDrug.name} the next at ${toDose} mg. ` +
      `Please contact us if symptoms worsen or side effects occur.`;
  } else if (fromDrug.id === "fluoxetine") {
    clinician +=
      "Fluoxetine has a very long half-life. Recommended strategy:\n";
    clinician += "1. Stop fluoxetine.\n";
    clinician += "2. Wait 4–7 days washout.\n";
    clinician += "3. Start new antidepressant at starting dose.\n";

    sms =
      `We are switching you from fluoxetine to ${toDrug.name}. ` +
      "After stopping fluoxetine, there will be a short gap before starting the new medicine.";
  } else if (fromDrug.class === "TCA" && toDrug.class === "SSRI") {
    clinician +=
      "1. Reduce TCA dose by 50% for 1–2 weeks.\n" +
      "2. Start SSRI at low dose while continuing reduced TCA.\n" +
      "3. Stop TCA when SSRI tolerated.\n";

    sms =
      `We are gradually changing you from ${fromDrug.name} to ${toDrug.name}. ` +
      "We will reduce your current dose before introducing the new medicine.";
  } else if (fromDrug.class === "SSRI" && toDrug.class === "SNRI") {
    clinician +=
      "1. A direct switch or short cross-taper is acceptable depending on symptoms.\n" +
      "2. Start SNRI at a low dose.\n";

    sms =
      `We are changing from ${fromDrug.name} to ${toDrug.name}. ` +
      "Your clinician will introduce the new medicine gradually.";
  } else {
    clinician +=
      "This switch is more complex. Recommended approach:\n" +
      "1. Gradual taper of current antidepressant.\n" +
      "2. After reduction, introduce new antidepressant cautiously.\n" +
      "3. Consider specialist input in complex patients.\n";

    sms =
      `We are changing your antidepressant from ${fromDrug.name} to ${toDrug.name}. ` +
      "This will be done gradually based on your symptoms.";
  }

  tablet =
    "Tablet helper:\n" +
    `• ${fromDrug.name}: UK strengths ${fromDrug.unitStrengths.join(" mg, ")} mg.\n` +
    `• ${toDrug.name}: UK strengths ${toDrug.unitStrengths.join(" mg, ")} mg.\n` +
    "Check local formulary for availability.";

  switchClinicianOutput.textContent = clinician.trim();
  switchSMSOutput.textContent = sms.trim();
  switchTabletsOutput.textContent = tablet.trim();
}

// ============================
// Stopping / tapering
// ============================

function clearStopOutputs() {
  stopClinicianOutput.textContent = "";
  stopSMSOutput.textContent = "";
  stopTabletsOutput.textContent = "";
  userHasClickedGenerateStop = false;
  pendingTaperContext = null;
  pendingTaperOptions = [];
  selectedTaperOptionId = null;
}

function generateStopPlan() {
  clearStopOutputs();
  userHasClickedGenerateStop = true;

  const drugId = stopDrugSelect.value;
  const dose = parseFloat(stopDoseSelect.value);
  const duration = durationSelect.value;
  const drug = getDrugById(drugId);

  if (!drug || !dose || !duration) {
    stopClinicianOutput.textContent =
      "Please select antidepressant, dose, and duration.";
    return;
  }

  let clinician = "";
  let sms = "";
  let tablet = "";

  clinician += `Stopping plan for ${drug.name}.\n`;
  clinician += `Current dose: ${dose} mg daily.\n\n`;
  clinician += `Half-life: ${describeHalfLife(drug)}.\n`;
  clinician += `Withdrawal risk: ${describeWithdrawalRisk(drug)}.\n\n`;
  clinician += `Selected taper profile: ${taperProfile.toUpperCase()}\n\n`;

  const highWithdrawal =
    drug.withdrawalRisk === "high" || drug.withdrawalRisk === "very_high";

  let taperText = "";
  let smsCore = "";

  if (duration === "short") {
    if (taperProfile === "standard") {
      taperText += "- Reduce dose by ~50% for 1–2 weeks, then stop.\n";
      smsCore = "We will reduce your dose by half for 1–2 weeks, then stop.";
    } else if (taperProfile === "extended") {
      taperText += "- Reduce dose over 2–4 weeks with 25–50% steps.\n";
      smsCore = "We will reduce your dose more gradually over a few weeks.";
    } else {
      taperText += "- Reduce dose by ~25% every 2–4 weeks.\n";
      smsCore = "We will taper very gradually with small reductions.";
    }
  } else if (duration === "medium") {
    if (taperProfile === "standard") {
      taperText +=
        "- Reduce dose in 2–3 steps over 4–8 weeks (e.g., 50% every 2–4 weeks).\n";
      smsCore = "Your dose will be reduced over 1–2 months at a moderate pace.";
    } else if (taperProfile === "extended") {
      taperText += "- Reduce dose by 25–33% every 3–4 weeks.\n";
      smsCore = "We will taper your dose gradually over several weeks.";
    } else {
      taperText += "- Reduce dose by 10–25% every 4–6 weeks.\n";
      smsCore = "We will taper very slowly with small reductions.";
    }
  } else if (duration === "long" || duration === "very_long" || highWithdrawal) {
    if (taperProfile === "standard") {
      taperText +=
        "- Reduce 25–50% every 2–4 weeks; smaller reductions as dose becomes low.\n";
      smsCore = "We will reduce your medicine gradually over several months.";
    } else if (taperProfile === "extended") {
      taperText += "- Reduce dose by 10–25% every 4–6 weeks.\n";
      smsCore = "We will make modest reductions every few weeks.";
    } else {
      taperText += "- Reduce dose by 5–10% every 4–8+ weeks.\n";
      smsCore = "We will taper your dose very slowly with small changes.";
    }
  }

  clinician += taperText + "\n";

  sms =
    smsCore +
    " If you feel worse during dose reduction, contact us and we can pause or adjust the taper.";

  tablet =
    "Tablet helper:\n" +
    `• ${drug.name}: UK strengths ${drug.unitStrengths.join(" mg, ")} mg.\n` +
    "Consider liquid or smaller strengths for small reductions.";

  const needsModal =
    (duration !== "short") &&
    (highWithdrawal || duration === "long" || duration === "very_long") &&
    taperProfile !== "standard";

  if (needsModal) {
    const context = {
      title: "Confirm taper approach",
      description:
        "This patient may benefit from reviewing taper options. Choose the safest plan."
    };

    const options = [
      {
        id: "chosen-profile",
        title: `Use selected profile: ${taperProfile}`,
        description: taperText,
        clinicianText: clinician.trim(),
        smsText: sms.trim(),
        tabletText: tablet.trim()
      },
      {
        id: "standard",
        title: "Switch to standard taper",
        description:
          "Standard taper: 25–50% reductions every 2–4 weeks, slowing at lower doses.",
        clinicianText:
          clinician.replace(
            `Selected taper profile: ${taperProfile.toUpperCase()}`,
            "Selected taper profile: STANDARD (override)"
          ),
        smsText:
          "We will follow a standard dose reduction unless symptoms develop.",
        tabletText: tablet.trim()
      }
    ];

    openTaperModal(context, options);
    return;
  }

  stopClinicianOutput.textContent = clinician.trim();
  stopSMSOutput.textContent = sms.trim();
  stopTabletsOutput.textContent = tablet.trim();
}

// ============================
// Event listeners & init
// ============================

fromDrugSelect.addEventListener("change", () => {
  handleDrugSelectChange(fromDrugSelect, fromDoseSelect);
  clearSwitchOutputs();
});
toDrugSelect.addEventListener("change", () => {
  handleDrugSelectChange(toDrugSelect, toDrugDoseSelect);
  clearSwitchOutputs();
});
stopDrugSelect.addEventListener("change", () => {
  handleDrugSelectChange(stopDrugSelect, stopDoseSelect);
  clearStopOutputs();
});

fromDoseSelect.addEventListener("change", clearSwitchOutputs);
toDrugDoseSelect.addEventListener("change", clearSwitchOutputs);
stopDoseSelect.addEventListener("change", clearStopOutputs);
durationSelect.addEventListener("change", clearStopOutputs);

generateSwitchButton.addEventListener("click", generateSwitchPlan);
clearSwitchButton.addEventListener("click", clearSwitchOutputs);
generateStopButton.addEventListener("click", generateStopPlan);
clearStopButton.addEventListener("click", clearStopOutputs);

document.addEventListener("DOMContentLoaded", () => {
  initialiseDropdowns();
  setTaperProfile("standard");

  clearSwitchOutputs();
  clearStopOutputs();
});

// ============================
// END OF MODULE
// ============================
