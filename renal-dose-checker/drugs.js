// drugs.js — Renal Dose Checker drug database (modular)

export const DRUG_DATA = [

/* -------------------- METFORMIN -------------------- */
{
  id: "metformin",
  name: "Metformin",
  className: "Biguanide — oral hypoglycaemic",
  tags: ["Diabetes", "eGFR"],
  searchTerms: ["metformin", "glucophage"],

  usualDose:
    "Typical: 1–2 g/day in divided doses (max varies by brand). Assess renal function before titrating.",

  renalBands: [
    {
      min: 60, max: null,
      label: "eGFR ≥ 60",
      category: "No dose change",
      details: "Use usual dosing. Monitor renal function at least annually."
    },
    {
      min: 45, max: 60,
      label: "eGFR 45–59",
      category: "Caution",
      details: "Continue but check renal function every 3–6 months."
    },
    {
      min: 30, max: 45,
      label: "eGFR 30–44",
      category: "Reduce dose",
      details: "Reduce dose (often to ~50%). Avoid titrating upward."
    },
    {
      min: null, max: 30,
      label: "eGFR < 30",
      category: "Avoid",
      details: "Contraindicated due to lactic acidosis risk."
    }
  ],

  notes: [
    "Suspend during acute illness (SADMANS).",
    "Review dose under age >75 or frailty.",
    "Consider risk of dehydration and AKI."
  ]
},

/* -------------------- GABAPENTIN -------------------- */
{
  id: "gabapentin",
  name: "Gabapentin",
  className: "Antiepileptic / neuropathic pain",
  tags: ["Neuropathic pain", "Renal"],
  searchTerms: ["gabapentin", "neurontin"],

  usualDose:
    "Normal renal function: 900–3600 mg/day in 3 divided doses.",

  renalBands: [
    {
      min: 60, max: null,
      label: "eGFR ≥ 60",
      category: "No adjustment",
      details: "Use standard titration schedule."
    },
    {
      min: 30, max: 60,
      label: "eGFR 30–59",
      category: "Reduce dose",
      details: "Use reduced total daily dose; slow titration."
    },
    {
      min: 15, max: 30,
      label: "eGFR 15–29",
      category: "Marked reduction",
      details: "Use lower daily dose; monitor for sedation."
    },
    {
      min: null, max: 15,
      label: "eGFR < 15",
      category: "Specialist dosing",
      details: "Very low or post-dialysis dosing only."
    }
  ],

  notes: [
    "Renally cleared — accumulation causes CNS depression.",
    "Use CrCl when possible for accurate dosing.",
    "Consider falls risk and polypharmacy."
  ]
},

/* -------------------- PREGABALIN -------------------- */
{
  id: "pregabalin",
  name: "Pregabalin",
  className: "Antiepileptic / neuropathic pain / GAD",
  tags: ["Renal", "Neuropathic pain"],
  searchTerms: ["pregabalin", "lyrica"],

  usualDose:
    "Standard: 150–600 mg/day in 2–3 divided doses (normal renal function).",

  renalBands: [
    {
      min: 60, max: null,
      label: "eGFR ≥ 60",
      category: "No change",
      details: "Use standard dosing range."
    },
    {
      min: 30, max: 60,
      label: "eGFR 30–59",
      category: "Reduce dose",
      details: "Lower maximum dose; titrate slowly."
    },
    {
      min: 15, max: 30,
      label: "eGFR 15–29",
      category: "Significant reduction",
      details: "Use substantially reduced doses."
    },
    {
      min: null, max: 15,
      label: "eGFR < 15",
      category: "Specialist dosing",
      details: "Post-dialysis or very low doses only."
    }
  ],

  notes: [
    "Renally eliminated — toxicity risk in CKD.",
    "Taper slowly to avoid withdrawal.",
    "Watch for oedema, sedation, dizziness."
  ]
},

/* -------------------- ALLOPURINOL -------------------- */
{
  id: "allopurinol",
  name: "Allopurinol",
  className: "Xanthine oxidase inhibitor",
  tags: ["Gout", "Renal caution"],
  searchTerms: ["allopurinol"],

  usualDose:
    "Start low (50–100 mg) and titrate to urate target. Maximum dose depends on renal function.",

  renalBands: [
    {
      min: 60, max: null,
      label: "eGFR ≥ 60",
      category: "Standard initiation",
      details: "Start 100 mg daily and titrate."
    },
    {
      min: 30, max: 60,
      label: "eGFR 30–59",
      category: "Lower starting dose",
      details: "Start 50–100 mg; increase cautiously."
    },
    {
      min: 15, max: 30,
      label: "eGFR 15–29",
      category: "Very low start",
      details: "Use 50 mg or alternate-day dosing."
    },
    {
      min: null, max: 15,
      label: "eGFR < 15",
      category: "Specialist only",
      details: "Seek advice — hypersensitivity risk increases."
    }
  ],

  notes: [
    "Risk of allopurinol hypersensitivity ↑ in renal impairment.",
    "Continue flare prophylaxis where appropriate.",
    "Aim for target urate — do not stop during flare."
  ]
},

/* -------------------- APIXABAN -------------------- */
{
  id: "apixaban",
  name: "Apixaban",
  className: "DOAC — Factor Xa inhibitor",
  tags: ["DOAC", "Anticoagulant"],
  searchTerms: ["apixaban", "eliquis", "doac"],

  usualDose:
    "Standard NVAF dose: 5 mg BD. Reduce to 2.5 mg BD if ≥2 of age ≥80, weight ≤60 kg, creatinine ≥133 μmol/L.",

  renalBands: [
    {
      min: 50, max: null,
      label: "CrCl ≥ 50",
      category: "Standard dose",
      details: "Use standard dosing unless reduction criteria met."
    },
    {
      min: 30, max: 50,
      label: "CrCl 30–49",
      category: "Consider reduction",
      details: "2.5 mg BD if meets dose-reduction criteria."
    },
    {
      min: 15, max: 30,
      label: "CrCl 15–29",
      category: "Reduced dose",
      details: "Often 2.5 mg BD — verify with SPC/SPS."
    },
    {
      min: null, max: 15,
      label: "CrCl < 15",
      category: "Avoid",
      details: "Generally contraindicated; seek specialist advice."
    }
  ],

  notes: [
    "Dose by CrCl, NOT eGFR.",
    "Monitor renal function at least annually.",
    "Check hepatic function, interacting medicines, frailty."
  ]
}

]; // END DRUG_DATA
