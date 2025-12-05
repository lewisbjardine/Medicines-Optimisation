  // ========= Global state & constants =========
  let userHasClickedGenerateStop = false;
  let taperProfile = "standard";
  let pendingTaperContext = null;
  let pendingTaperOptions = [];
  let selectedTaperOptionId = null;
  let lastFocusedElementBeforeModal = null;

  let showAllAntidepressants = false; // collapsed by default
  const SHOW_ALL_VALUE = "__SHOW_ALL__";
  const HIDE_EXTRA_VALUE = "__HIDE_EXTRA__";

  // ========= Antidepressant dataset =========
  const antidepressants = [
    // SSRIs
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

    // SNRIs
    {
      id: "venlafaxine_ir",
      name: "Venlafaxine IR (immediate-release)",
      class: "SNRI",
      dailyDoses: [37.5, 75, 112.5, 150, 187.5, 225, 262.5, 300, 337.5, 375],
      halfLife: "short",
      withdrawalRisk: "very_high",
      ukLicensed: true,
      requiresSwitchForTaper: false,
      unitStrengths: [75, 37.5],  // corrected: IR tablets are 37.5 & 75 mg
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
      unitStrengths: [300, 225, 150, 75, 37.5], // corrected: full MR range
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

    // NaSSA / related
    {
      id: "mirtazapine",
      name: "Mirtazapine",
      class: "NaSSA",
      dailyDoses: [15, 30, 45], // doses achievable via halves/alternation
      halfLife: "medium",
      withdrawalRisk: "medium",
      ukLicensed: true,
      requiresSwitchForTaper: false,
      unitStrengths: [45, 30, 15], // actual tablet strengths
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

    // TCAs & related
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
      name: "Dosulepin (dothiepin – not recommended for new starts)",
      class: "TCA",
      dailyDoses: [25, 50, 75, 100, 150],
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

    // MAOIs — specialist only
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
      requiresSwitchForTaper: false,
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
      requiresSwitchForTaper: false,
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
      requiresSwitchForTaper: false,
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
      requiresSwitchForTaper: false,
      unitStrengths: [150],
      recommendedStart: 150,
      geriatricStart: 150
    }
  ];

  // ========= Utility functions =========
  function getDrugById(id) {
    return antidepressants.find(d => d.id === id) || null;
  }

  function formatDose(d) {
    return `${d} mg`;
  }

  function describeHalfLife(drug) {
    if (!drug || !drug.halfLife) return "";
    const map = {
      short: "short half-life (higher risk of withdrawal if stopped abruptly)",
      medium: "medium half-life",
      long: "long half-life (slightly smoother withdrawal)",
      very_long: "very long half-life (withdrawal can be delayed)"
    };
    return map[drug.halfLife] || "";
  }

  function describeWithdrawalRisk(drug) {
    if (!drug || !drug.withdrawalRisk) return "";
    const map = {
      low: "lower risk of withdrawal symptoms",
      medium: "moderate risk of withdrawal symptoms",
      high: "higher risk of withdrawal symptoms",
      very_high: "very high risk of withdrawal symptoms"
    };
    return map[drug.withdrawalRisk] || "";
  }

  // ========= DOM references =========
  const fromDrugSelect = document.getElementById("fromDrug");
  const toDrugSelect = document.getElementById("toDrug");
  const stopDrugSelect = document.getElementById("stopDrug");

  const fromDoseSelect = document.getElementById("fromDose");
  const toDrugDoseSelect = document.getElementById("toDrugDose");
  const stopDoseSelect = document.getElementById("stopDose");

  const durationSelect = document.getElementById("duration");

  const switchClinicianOutput = document.getElementById("switchClinician");
  const switchSMSOutput = document.getElementById("switchSMS");
  const switchTabletsOutput = document.getElementById("switchTablets");

  const stopClinicianOutput = document.getElementById("stopClinician");
  const stopSMSOutput = document.getElementById("stopSMS");
  const stopTabletsOutput = document.getElementById("stopTablets");

  const generateSwitchButton = document.getElementById("generateSwitch");
  const clearSwitchButton = document.getElementById("clearSwitch");
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

  // ========= Dropdown helpers (SHOW ALL / HIDE EXTRA) =========
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
    if (!showAll) {
      metaOption.value = SHOW_ALL_VALUE;
      metaOption.textContent = "Show all antidepressants…";
    } else {
      metaOption.value = HIDE_EXTRA_VALUE;
      metaOption.textContent = "Hide extra antidepressants";
    }
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
      opt.textContent = formatDose(d);
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
      populateDrugSelect(fromDrugSelect, true, fromDrugSelect.value);
      populateDrugSelect(toDrugSelect, true, toDrugSelect.value);
      populateDrugSelect(stopDrugSelect, true, stopDrugSelect.value);
      return;
    }

    if (value === HIDE_EXTRA_VALUE) {
      showAllAntidepressants = false;
      populateDrugSelect(fromDrugSelect, false, fromDrugSelect.value);
      populateDrugSelect(toDrugSelect, false, toDrugSelect.value);
      populateDrugSelect(stopDrugSelect, false, stopDrugSelect.value);
      return;
    }

    if (doseSelect) {
      populateDoseSelect(selectEl, doseSelect);
    }
  }

  document.addEventListener("click", (ev) => {
    const isDropdown =
      ev.target.closest("#fromDrug") ||
      ev.target.closest("#toDrug") ||
      ev.target.closest("#stopDrug");

    if (!isDropdown && showAllAntidepressants) {
      showAllAntidepressants = false;
      populateDrugSelect(fromDrugSelect, false, fromDrugSelect.value);
      populateDrugSelect(toDrugSelect, false, toDrugSelect.value);
      populateDrugSelect(stopDrugSelect, false, stopDrugSelect.value);
    }
  });

  // ========= Output helpers =========
  function clearSwitchOutputs() {
    switchClinicianOutput.textContent = "";
    switchSMSOutput.textContent = "";
    switchTabletsOutput.textContent = "";
  }

  function clearStopOutputs() {
    stopClinicianOutput.textContent = "";
    stopSMSOutput.textContent = "";
    stopTabletsOutput.textContent = "";
    userHasClickedGenerateStop = false;
    pendingTaperContext = null;
    pendingTaperOptions = [];
    selectedTaperOptionId = null;
  }

  // ========= Copy buttons =========
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const el = document.getElementById(targetId);
      if (!el) return;
      const text = el.textContent || "";

      navigator.clipboard.writeText(text).then(
        () => {
          btn.classList.add("copied");
          setTimeout(() => btn.classList.remove("copied"), 1000);
        },
        () => {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          btn.classList.add("copied");
          setTimeout(() => btn.classList.remove("copied"), 1000);
        }
      );
    });
  });

  // ========= Tabs =========
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tabName = btn.dataset.tab;
      tabs.forEach(t => {
        t.classList.toggle("hidden", t.id !== tabName);
      });
    });
  });

  // ========= Taper profile buttons =========
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

  // ========= Modal helpers =========
  function openTaperModal(context, options) {
    pendingTaperContext = context;
    pendingTaperOptions = options || [];

    if (context && context.title) {
      taperModalTitle.textContent = context.title;
    } else {
      taperModalTitle.textContent = "Choose taper option";
    }

    taperModalDescription.textContent = context && context.description
      ? context.description
      : "Select the taper plan that best matches the clinical situation.";

    taperModalOptions.innerHTML = "";
    selectedTaperOptionId = null;

    pendingTaperOptions.forEach(opt => {
      const div = document.createElement("div");
      div.className = "modal-option";
      div.dataset.id = opt.id;

      const title = document.createElement("div");
      title.className = "modal-option-title";
      title.textContent = opt.title;
      div.appendChild(title);

      const body = document.createElement("div");
      body.className = "modal-option-body";
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
    taperModal.setAttribute("aria-hidden", "false");
    taperModal.focus();
  }

  function closeTaperModal() {
    taperModal.classList.add("hidden");
    taperModal.setAttribute("aria-hidden", "true");
    if (lastFocusedElementBeforeModal) {
      lastFocusedElementBeforeModal.focus();
    }
    pendingTaperContext = null;
    pendingTaperOptions = [];
    selectedTaperOptionId = null;
  }

  taperModalCancel.addEventListener("click", () => {
    closeTaperModal();
  });

  taperModalConfirm.addEventListener("click", () => {
    if (!selectedTaperOptionId || !pendingTaperContext) {
      closeTaperModal();
      return;
    }

    const chosen = pendingTaperOptions.find(o => o.id === selectedTaperOptionId);
    if (!chosen) {
      closeTaperModal();
      return;
    }

    stopClinicianOutput.textContent = chosen.clinicianText || "";
    stopSMSOutput.textContent = chosen.smsText || "";
    stopTabletsOutput.textContent = chosen.tabletText || "";

    closeTaperModal();
  });

  taperModal.addEventListener("click", (e) => {
    if (e.target === taperModal) {
      closeTaperModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !taperModal.classList.contains("hidden")) {
      closeTaperModal();
    }
  });

  // ========= Switching logic =========
  function generateSwitchPlan() {
    clearSwitchOutputs();

    const fromDrugId = fromDrugSelect.value;
    const toDrugId = toDrugSelect.value;
    const fromDose = parseFloat(fromDoseSelect.value);
    const toDose = parseFloat(toDrugDoseSelect.value);

    const fromDrug = getDrugById(fromDrugId);
    const toDrug = getDrugById(toDrugId);

    if (!fromDrug || !toDrug || !fromDose || !toDose) {
      switchClinicianOutput.textContent = "Please select both drugs and doses.";
      return;
    }

    if (fromDrug.id === toDrug.id) {
      switchClinicianOutput.textContent =
        "You have selected the same antidepressant as both the current and new drug. A 'switch' plan is not required.";
      switchSMSOutput.textContent =
        "Your current antidepressant is not being changed – we will continue your existing dose for now.";
      return;
    }

    if (fromDrug.class === "MAOI" || toDrug.class === "MAOI") {
      switchClinicianOutput.textContent =
        "At least one of the selected drugs is an MAOI. Switches to or from MAOIs should be managed using specialist advice and local guidance. This tool does not generate a specific plan.";
      switchSMSOutput.textContent =
        "Your medicines are being changed from or to a type of antidepressant (MAOI) that needs specialist guidance. Your clinician will discuss a safe plan with you.";
      return;
    }

    let clinicianText = "";
    let smsText = "";
    let tabletText = "";

    clinicianText += `Current antidepressant: ${fromDrug.name} ${formatDose(fromDose)} daily.\n`;
    clinicianText += `New antidepressant: ${toDrug.name} ${formatDose(toDose)} daily (target starting dose).\n\n`;

    clinicianText += `Half-life / withdrawal context:\n`;
    clinicianText += `- ${fromDrug.name}: ${describeHalfLife(fromDrug)}; ${describeWithdrawalRisk(fromDrug)}.\n`;
    clinicianText += `- ${toDrug.name}: ${describeHalfLife(toDrug)}; ${describeWithdrawalRisk(toDrug)}.\n\n`;

    clinicianText += "Suggested switch approach (must be adapted to the individual patient):\n\n";

    const fromIsShortActing =
      fromDrug.halfLife === "short" ||
      fromDrug.withdrawalRisk === "high" ||
      fromDrug.withdrawalRisk === "very_high";

    const toIsShortActing =
      toDrug.halfLife === "short" ||
      toDrug.withdrawalRisk === "high" ||
      toDrug.withdrawalRisk === "very_high";

    if (fromDrug.class === "SSRI" && toDrug.class === "SSRI" && !fromIsShortActing && !toIsShortActing) {
      clinicianText +=
        "1. Direct switch between SSRIs with moderate withdrawal risk: stop the current SSRI one day and start the new SSRI the next day at the suggested starting dose.\n";
      clinicianText +=
        "2. Monitor for discontinuation symptoms and serotonin toxicity, and adjust dose according to response and tolerability.\n";

      smsText =
        `We are planning to change your antidepressant from ${fromDrug.name} to ${toDrug.name}. ` +
        `You will stop ${fromDrug.name} one day, and start ${toDrug.name} the next day at ${formatDose(
          toDose
        )}. ` +
        "Please contact us urgently if you feel much worse, have suicidal thoughts, or get severe side effects.";

    } else if (fromDrug.id === "fluoxetine") {
      clinicianText +=
        "Because fluoxetine has a long half-life, a brief washout period is usually recommended before starting the new antidepressant:\n";
      clinicianText +=
        "1. Stop fluoxetine. Wait 4–7 days (or longer in high-dose or high-risk patients) before starting the new antidepressant at the suggested starting dose.\n";
      clinicianText +=
        "2. In higher-risk patients (e.g. bipolar disorder, recent self-harm, complex physical comorbidity), seek specialist advice and consider a longer washout.\n";

      smsText =
        `We are changing your antidepressant from fluoxetine to ${toDrug.name}. ` +
        "You will stop fluoxetine, then after a short gap start the new antidepressant. " +
        "Your clinician will confirm the exact dates and doses. Please contact us urgently if you feel much worse or have severe side effects.";

    } else if (fromDrug.class === "TCA" && toDrug.class === "SSRI") {
      clinicianText +=
        "For a TCA to SSRI switch, a cautious cross-taper or stepwise reduction is usually safer:\n";
      clinicianText +=
        "1. Reduce the TCA dose by around 50% for 1–2 weeks while introducing the SSRI at a low dose.\n";
      clinicianText +=
        "2. If tolerated, stop the TCA and continue up-titration of the SSRI towards the target dose.\n";
      clinicianText +=
        "3. Monitor U&Es, ECG and overall risk where indicated (e.g. in older adults, cardiac disease, overdose risk).\n";

      smsText =
        `We are gradually changing your antidepressant from ${fromDrug.name} to ${toDrug.name}. ` +
        `We will reduce ${fromDrug.name} over 1–2 weeks while starting ${toDrug.name} at a low dose, then stop ${fromDrug.name} if you are tolerating the change. ` +
        "Please tell us if you feel worse, very low, or notice worrying side effects.";

    } else if (fromDrug.class === "SSRI" && toDrug.class === "SNRI") {
      clinicianText +=
        "For SSRI to SNRI switches, a cautious cross-taper or direct switch may be used depending on risk:\n";
      clinicianText +=
        "1. In lower-risk, non-complex cases, a direct switch (stop SSRI one day, start SNRI the next at a low or moderate starting dose) may be reasonable.\n";
      clinicianText +=
        "2. In higher-risk patients, consider reducing the SSRI dose first, then introducing the SNRI at a low dose and cross-tapering over 1–2 weeks.\n";

      smsText =
        `We are changing your antidepressant from ${fromDrug.name} to ${toDrug.name}. ` +
        "Your clinician will either switch you directly or gradually, depending on your situation. " +
        "Please contact us urgently if you feel much worse or have severe side effects.";

    } else {
      clinicianText +=
        "Switching between these two antidepressants is more complex or higher risk. Suggested approach:\n";
      clinicianText +=
        "1. Consider tapering the current drug first, especially if it has a high withdrawal risk or the patient has been on it long term.\n";
      clinicianText +=
        "2. Introduce the new drug at a low dose after an appropriate washout or cross-taper period, guided by local / national guidance.\n";
      clinicianText +=
        "3. Seek specialist advice if the patient has bipolar disorder, a recent history of self-harm, significant physical comorbidity, or is taking other serotonergic medicines.\n";

      smsText =
        `We are planning to change your antidepressant from ${fromDrug.name} to ${toDrug.name}. ` +
        "Because this combination is more complex, your clinician will tailor the switch carefully and may change doses gradually or add a gap between medicines. " +
        "Please contact us urgently if you feel much worse or have severe side effects.";

    }

    tabletText =
      "Tablet / capsule helper (approximate):\n" +
      `- ${fromDrug.name}: using UK BNF strengths ${fromDrug.unitStrengths?.join(" mg, ") || ""} mg where available.\n` +
      `- ${toDrug.name}: using UK BNF strengths ${toDrug.unitStrengths?.join(" mg, ") || ""} mg where available.\n` +
      "Please check the exact formulation and strengths in your local formulary and adjust the prescription accordingly.\n";

    switchClinicianOutput.textContent = clinicianText.trim();
    switchSMSOutput.textContent = smsText.trim();
    switchTabletsOutput.textContent = tabletText.trim();
  }

  // ========= Stopping / tapering logic =========
  function generateStopPlan() {
    clearStopOutputs();
    userHasClickedGenerateStop = true;

    const drugId = stopDrugSelect.value;
    const dose = parseFloat(stopDoseSelect.value);
    const duration = durationSelect.value;

    const drug = getDrugById(drugId);
    if (!drug || !dose || !duration) {
      stopClinicianOutput.textContent = "Please choose a drug, current dose and duration of use.";
      return;
    }

    let clinicianText = "";
    let smsText = "";
    let tabletText = "";

    clinicianText += `Antidepressant cessation plan for ${drug.name}.\n`;
    clinicianText += `Current dose: ${formatDose(dose)} daily.\n\n`;

    clinicianText += `Half-life / withdrawal context: ${describeHalfLife(drug)}; ${describeWithdrawalRisk(
      drug
    )}.\n\n`;

    const highWithdrawal = drug.withdrawalRisk === "high" || drug.withdrawalRisk === "very_high";

    const profileDescription = {
      standard: "Standard taper (moderate pace, usually suitable for many patients).",
      extended: "Extended taper (slower taper, for higher withdrawal risk or more cautious approach).",
      slow: "Slow taper (very gradual reductions, for patients with marked withdrawal or high sensitivity)."
    }[taperProfile] || "Standard taper.";

    clinicianText += `Selected taper profile: ${profileDescription}\n\n`;

    let stepText = "";
    let smsCore = "";

    if (duration === "short") {
      if (taperProfile === "standard") {
        stepText +=
          "Duration of use < 6 weeks and standard taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by ~50% for 1–2 weeks, then stop if tolerated.\n" +
          "- If withdrawal symptoms occur, return to the previous dose and reduce more gradually.\n";
        smsCore =
          `You have been taking ${drug.name} for a relatively short time. ` +
          "We will usually halve the dose for 1–2 weeks and then stop if things are going well.";
      } else if (taperProfile === "extended") {
        stepText +=
          "Duration of use < 6 weeks and extended taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose in 2–3 steps (e.g. 25–50% reductions) over 2–4 weeks total.\n" +
          "- Pause or slow further reductions if withdrawal symptoms develop.\n";
        smsCore =
          `You have been taking ${drug.name} for a relatively short time. ` +
          "We will reduce the dose in a couple of steps over a few weeks.";
      } else {
        stepText +=
          "Duration of use < 6 weeks and slow taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by small steps (e.g. 25% of the current dose) every 2–4 weeks.\n" +
          "- Consider using smaller tablet strengths or liquid if available.\n";
        smsCore =
          `You have been taking ${drug.name} for a relatively short time but we are choosing a slow taper. ` +
          "We will make small reductions every few weeks and adjust based on how you feel.";
      }
    } else if (duration === "medium") {
      if (taperProfile === "standard") {
        stepText +=
          "Duration of use 6 weeks – 6 months and standard taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose in 2–3 steps over 4–8 weeks (for example 50% reductions every 2–4 weeks).\n" +
          "- If withdrawal symptoms occur (e.g. dizziness, 'electric shocks', anxiety, low mood), revert to the last well-tolerated dose and slow the taper.\n";
        smsCore =
          `You have been taking ${drug.name} for several months. ` +
          "We will usually reduce the dose gradually over 1–2 months.";
      } else if (taperProfile === "extended") {
        stepText +=
          "Duration of use 6 weeks – 6 months and extended taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by ~25–33% every 3–4 weeks.\n" +
          "- As the dose gets lower, use smaller absolute reductions and longer intervals if withdrawal symptoms appear.\n";
        smsCore =
          `You have been taking ${drug.name} for several months. ` +
          "We will reduce the dose gradually over a few months with smaller changes.";
      } else {
        stepText +=
          "Duration of use 6 weeks – 6 months and slow taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by 10–25% of the current dose every 4–6 weeks.\n" +
          "- Use smaller strengths or liquid formulations where available to allow fine adjustments.\n";
        smsCore =
          `You have been taking ${drug.name} for several months and we are using a slow taper. ` +
          "We will make small changes every few weeks, aiming to minimise withdrawal symptoms.";
      }
    } else if (duration === "long" || duration === "very_long" || highWithdrawal) {
      if (taperProfile === "standard") {
        stepText +=
          "Duration of use > 6 months and/or high withdrawal risk; standard taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by around 25–50% of the current dose every 2–4 weeks initially.\n" +
          "- As the dose gets lower, use smaller absolute reductions (e.g. 10–25% of the previous dose) and longer intervals (4–8 weeks or more) if needed.\n";
        smsCore =
          `You have been taking ${drug.name} for a long time and/or it can cause withdrawal symptoms if stopped quickly. ` +
          "We will reduce the dose in stages over several months.";
      } else if (taperProfile === "extended") {
        stepText +=
          "Duration of use > 6 months and/or high withdrawal risk; extended taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by around 10–25% of the current dose every 4–6 weeks.\n" +
          "- As you reach lower doses, use very small reductions (e.g. 10% of the previous dose) and pause each step until stable.\n";
        smsCore =
          `You have been taking ${drug.name} for a long time and we are choosing a slower taper. ` +
          "We will make modest reductions every month or so and adjust based on your symptoms.";
      } else {
        stepText +=
          "Duration of use > 6 months and/or high withdrawal risk; slow taper chosen.\n" +
          "Suggested approach:\n" +
          "- Reduce dose by around 5–10% of the previous dose every 4–8 weeks (or longer if needed).\n" +
          "- Consider using liquid formulations or very small tablet strengths, particularly at the lower end of the dose range.\n" +
          "- Be prepared to pause or slightly increase the dose temporarily if severe withdrawal occurs.\n";
        smsCore =
          `You have been taking ${drug.name} for a long time and we are using a very slow taper. ` +
          "We will make small changes every few weeks or months, with the option to pause or slow further if you get withdrawal symptoms.";
      }
    } else {
      stepText +=
        "Duration not specified. A gradual, patient-led taper is generally safer than abrupt cessation, especially for high-risk drugs.\n" +
        "Suggested approach:\n" +
        "- Start with modest reductions (e.g. 25% every 2–4 weeks) and slow down if withdrawal symptoms occur.\n";
      smsCore =
        `We will reduce your ${drug.name} gradually rather than stopping suddenly. ` +
        "Your clinician will discuss the pace of reduction with you based on how you feel.";
    }

    clinicianText += stepText + "\n";

    smsText =
      smsCore +
      " If you feel much worse, very low, or have severe symptoms while reducing, please contact us promptly.";

    tabletText =
      "Tablet / capsule helper (approximate):\n" +
      `- ${drug.name}: using UK BNF strengths ${drug.unitStrengths?.join(" mg, ") || ""} mg where available.\n` +
      "Consider liquid formulations, splitting tablets if appropriate, or using smaller strengths to allow small dose reductions, especially at the lower end of the range.\n";

    const mayNeedModal =
      duration !== "short" &&
      (highWithdrawal || duration === "long" || duration === "very_long") &&
      taperProfile !== "standard";

    if (mayNeedModal) {
      const context = {
        title: "Confirm taper option",
        description: "Based on duration and drug withdrawal risk, more than one taper approach may be reasonable. Choose the one that best fits the patient."
      };

      const options = [
        {
          id: "currentProfile",
          title: `Use selected profile: ${taperProfile}`,
          description: profileDescription,
          clinicianText: clinicianText.trim(),
          smsText: smsText.trim(),
          tabletText: tabletText.trim()
        },
        {
          id: "standardProfile",
          title: "Switch to standard taper instead",
          description:
            "Standard taper with 25–50% reductions every 2–4 weeks, lengthening intervals and reducing steps at lower doses.",
          clinicianText:
            clinicianText.replace(profileDescription, profileDescription) +
            "\n(Consider standard taper profile if this feels safer or simpler.)",
          smsText:
            smsCore +
            " We will aim for a standard pace of reduction, but can slow this if needed.",
          tabletText: tabletText.trim()
        }
      ];

      openTaperModal(context, options);
      return;
    }

    stopClinicianOutput.textContent = clinicianText.trim();
    stopSMSOutput.textContent = smsText.trim();
    stopTabletsOutput.textContent = tabletText.trim();
  }

  // ========= Event listeners =========
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

  // ========= Initialisation =========
  document.addEventListener("DOMContentLoaded", () => {
    initialiseDropdowns();
    setTaperProfile("standard");

    document.getElementById("switchClinician").textContent = "";
    document.getElementById("switchSMS").textContent = "";
    document.getElementById("switchTablets").textContent = "";
    document.getElementById("stopClinician").textContent = "";
    document.getElementById("stopSMS").textContent = "";
    document.getElementById("stopTablets").textContent = "";
  });
