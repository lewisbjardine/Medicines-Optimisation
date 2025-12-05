  // ========= Global state =========
  let userHasClickedGenerate = false;
  let currentTab = "switching";
  let showAllAntidepressants = false; // collapsed by default

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
      // corrected IR strengths
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
      // corrected MR capsule strengths
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
      requiresSwitchForTaper: true,
      unitStrengths: [60, 30],
      recommendedStart: 30
    },

    // NaSSA / atypical
    {
      id: "mirtazapine",
      name: "Mirtazapine",
      class: "NaSSA",
      // corrected: only 15 / 30 / 45 mg
      dailyDoses: [15, 30, 45],
      halfLife: "medium",
      withdrawalRisk: "medium",
      ukLicensed: true,
      requiresSwitchForTaper: false,
      unitStrengths: [45, 30, 15],
      recommendedStart: 15
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
      recommendedStart: 10
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
      recommendedStart: 25
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
      recommendedStart: 4
    },

    // TCAs
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
      id: "clomipramine",
      name: "Clomipramine",
      class: "TCA",
      dailyDoses: [25, 50, 75, 100, 150, 200],
      halfLife: "medium",
      withdrawalRisk: "high",
      ukLicensed: true,
      requiresSwitchForTaper: false,
      unitStrengths: [50, 25],
      recommendedStart: 25
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
      unitStrengths: [50, 25, 10],
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
      unitStrengths: [60, 30, 10],
      recommendedStart: 30
    },

    // MAOIs (specialist-only, no auto-switch)
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
      recommendedStart: 15
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
      recommendedStart: 10
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
      recommendedStart: 10
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
      recommendedStart: 150
    }
  ];

  // ========= Utility lookups =========
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

  // ========= Populate dropdowns =========
  const fromDrugSelect = document.getElementById("fromDrug");
  const toDrugSelect = document.getElementById("toDrug");
  const stopDrugSelect = document.getElementById("stopDrug");
  const fromDoseSelect = document.getElementById("fromDose");
  const toDrugDoseSelect = document.getElementById("toDrugDose");
  const stopDoseSelect = document.getElementById("stopDose");

  function populateDrugSelect(select, showAll, currentValue) {
    const commonList = antidepressants.filter(d => d.ukLicensed);
    const fullList = antidepressants;

    const listToUse = showAll ? fullList : commonList;

    select.innerHTML = "";
    listToUse.forEach(drug => {
      const opt = document.createElement("option");
      opt.value = drug.id;
      opt.textContent = drug.name;
      select.appendChild(opt);
    });

    if (currentValue && listToUse.some(d => d.id === currentValue)) {
      select.value = currentValue;
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

  // ========= Toggle "show all" =========
  const toggleAntidepressantListButton = document.getElementById("toggleAntidepressantList");

  if (toggleAntidepressantListButton) {
    toggleAntidepressantListButton.addEventListener("click", () => {
      showAllAntidepressants = !showAllAntidepressants;
      toggleAntidepressantListButton.textContent = showAllAntidepressants
        ? "Show commonly used antidepressants ▲"
        : "Show all antidepressants ▼";
      initialiseDropdowns();
    });
  }

  // ========= Tab switching =========
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabs = document.querySelectorAll(".tab");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tabName = btn.dataset.tab;
      currentTab = tabName;
      tabs.forEach(t => {
        t.classList.toggle("hidden", t.id !== tabName);
      });
    });
  });

  // ========= Outputs =========
  const switchClinicianOutput = document.getElementById("switchClinician");
  const switchSMSOutput = document.getElementById("switchSMS");
  const switchTabletsOutput = document.getElementById("switchTablets");
  const stopClinicianOutput = document.getElementById("stopClinician");
  const stopSMSOutput = document.getElementById("stopSMS");
  const stopTabletsOutput = document.getElementById("stopTablets");

  function clearSwitchOutputs() {
    switchClinicianOutput.textContent = "";
    switchSMSOutput.textContent = "";
    switchTabletsOutput.textContent = "";
  }

  function clearStopOutputs() {
    stopClinicianOutput.textContent = "";
    stopSMSOutput.textContent = "";
    stopTabletsOutput.textContent = "";
  }

  // ========= Copy buttons =========
  const copyButtons = document.querySelectorAll(".copy-btn");
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

  // ========= Switching logic =========

  function generateSwitchPlan() {
    clearSwitchOutputs();
    userHasClickedGenerate = true;

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

    const fromIsShortActing = fromDrug.halfLife === "short" || fromDrug.withdrawalRisk === "high" || fromDrug.withdrawalRisk === "very_high";
    const toIsShortActing = toDrug.halfLife === "short" || toDrug.withdrawalRisk === "high" || toDrug.withdrawalRisk === "very_high";

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

    // Tablet/capsule helper text (very simple placeholder)
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

  const durationSelect = document.getElementById("duration");

  function generateStopPlan() {
    clearStopOutputs();
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

    if (duration === "short") {
      clinicianText +=
        "Duration of use < 6 weeks. For most patients, a relatively quick reduction may be reasonable:\n";
      clinicianText +=
        "1. Reduce dose by ~50% for 1–2 weeks, then stop if tolerated.\n";
      clinicianText +=
        "2. In patients who are very anxious about stopping, or who develop symptoms, slow the reduction and use smaller steps.\n";

      smsText =
        `You have been taking ${drug.name} for a relatively short time. ` +
        "We will usually reduce the dose for 1–2 weeks and then stop if things are going well. " +
        "If you feel worse, very low or have concerning symptoms, please contact us.";

    } else if (duration === "medium") {
      clinicianText +=
        "Duration of use 6 weeks – 6 months. Suggested approach (adapt to the patient):\n";
      clinicianText +=
        "1. Reduce the dose in 2–3 steps over 4–8 weeks (for example 50% reductions every 2–4 weeks).\n";
      clinicianText +=
        "2. If withdrawal symptoms occur (e.g. dizziness, 'electric shocks', anxiety, low mood), revert to the last well-tolerated dose and slow the taper.\n";
      clinicianText +=
        "3. Consider using liquid or smaller tablet strengths where available to allow smaller dose reductions.\n";

      smsText =
        `You have been taking ${drug.name} for several months. ` +
        "We will usually reduce the dose gradually over 1–2 months. " +
        "If you get new or worrying symptoms while reducing, please tell us so we can slow the plan down.";

    } else if (duration === "long" || duration === "very_long" || highWithdrawal) {
      clinicianText +=
        "Duration of use > 6 months and/or the drug has high withdrawal risk. A slower, proportional taper is usually safer:\n";
      clinicianText +=
        "1. Reduce the dose by around 25–50% of the current dose every 2–4 weeks initially.\n";
      clinicianText +=
        "2. As the dose gets lower, use smaller absolute reductions (e.g. 10–25% of the previous dose) and longer intervals (4–8 weeks or more) if needed.\n";
      clinicianText +=
        "3. Use liquid formulations or smaller tablet strengths where possible to achieve a smooth taper, especially at the lower end of the dose range.\n";
      clinicianText +=
        "4. In patients with severe withdrawal in the past, comorbid bipolar disorder, or complex psychiatric history, seek specialist advice.\n";

      smsText =
        `You have been taking ${drug.name} for a long time and/or it can cause withdrawal symptoms if stopped quickly. ` +
        "We will reduce the dose slowly in stages over several months, with smaller reductions towards the end. " +
        "If you feel much worse, very low, or have severe symptoms while reducing, please contact us promptly.";

    } else {
      clinicianText +=
        "Duration not specified. A gradual, patient-led taper is generally safer than abrupt cessation, especially for high-risk drugs.\n";
      smsText =
        `We will reduce your ${drug.name} gradually rather than stopping suddenly. ` +
        "Your clinician will discuss the pace of reduction with you based on how you feel.";
    }

    tabletText =
      "Tablet / capsule helper (approximate):\n" +
      `- ${drug.name}: using UK BNF strengths ${drug.unitStrengths?.join(" mg, ") || ""} mg where available.\n` +
      "Consider liquid formulations, splitting tablets if appropriate, or using smaller strengths to allow small dose reductions, especially at the lower end of the range.\n";

    stopClinicianOutput.textContent = clinicianText.trim();
    stopSMSOutput.textContent = smsText.trim();
    stopTabletsOutput.textContent = tabletText.trim();
  }

  // ========= Event listeners =========
  fromDrugSelect.addEventListener("change", () => {
    populateDoseSelect(fromDrugSelect, fromDoseSelect);
    clearSwitchOutputs();
  });

  toDrugSelect.addEventListener("change", () => {
    populateDoseSelect(toDrugSelect, toDrugDoseSelect);
    clearSwitchOutputs();
  });

  stopDrugSelect.addEventListener("change", () => {
    populateDoseSelect(stopDrugSelect, stopDoseSelect);
    clearStopOutputs();
  });

  fromDoseSelect.addEventListener("change", clearSwitchOutputs);
  toDrugDoseSelect.addEventListener("change", clearSwitchOutputs);
  stopDoseSelect.addEventListener("change", clearStopOutputs);
  durationSelect.addEventListener("change", clearStopOutputs);

  const generateSwitchButton = document.getElementById("generateSwitch");
  const clearSwitchButton = document.getElementById("clearSwitch");
  const generateStopButton = document.getElementById("generateStop");
  const clearStopButton = document.getElementById("clearStop");

  generateSwitchButton.addEventListener("click", generateSwitchPlan);
  clearSwitchButton.addEventListener("click", () => {
    clearSwitchOutputs();
  });

  generateStopButton.addEventListener("click", generateStopPlan);
  clearStopButton.addEventListener("click", () => {
    clearStopOutputs();
  });

  // ========= Initialisation =========
  initialiseDropdowns();
