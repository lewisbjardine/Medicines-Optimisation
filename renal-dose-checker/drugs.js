// drugs.js — Renal dosing database for Renal Dose Checker
// Expand with more drugs as needed

export const DRUG_DATA = [

/* ------------------------ METFORMIN ------------------------ */
{
  id: "metformin",
  name: "Metformin",
  className: "Biguanide (oral hypoglycaemic)",
  tags: ["Diabetes", "eGFR-based"],
  searchTerms: ["metformin", "glucophage"],

  usualDose:
    "Typically 1–2 g/day in divided doses. Evaluate GI tolerance and renal function before titration.",

  renalBands: [
    {
      min: 60,
      max: null,
      label: "eGFR ≥ 60",
      category: "No dose change",
      details: "Use standard dosing. Monitor renal function at least annually."
    },
    {
      min: 45,
      max: 60,
      label: "eGFR 45–59",
      category: "Caution",
      details: "Continue but monitor renal function every 3–6 months."
    },
    {
      min: 30,
      max: 45,
      label: "eGFR 30–44",
      category: "Dose reduction",
      details: "Reduce dose (e.g. ~50%); do not escalate. Review need for metformin."
    },
    {
      min: null,
      max: 30,
      label: "eGFR < 30",
      category: "Avoid",
      details: "Contraindicated. Switch to alternative glucose-lowering therapy."
    }
  ],

  notes: [
    "Always stop temporarily during acute illness (SADMANS principle).",
    "Consider age, frailty, dehydration risk and comorbidities.",
    "Verify renal function before contrast imaging or surgery."
  ]
},

/* ------------------------ GABAPENTIN ------------------------ */
{
  id: "gabapentin",
  name: "Gabapentin",
  className: "Antiepileptic / neuropathic pain",
  tags: ["Neuropathic pain", "Renal", "CrCl-based"],
  searchTerms: ["gabapentin", "neurontin"],

  usualDose:
    "In normal renal function: 900–3600 mg/day in 3 divided doses.",

  renalBands: [
    { min: 60, max: null, label: "eGFR ≥ 60", category: "No adjustment",
      details: "Standard titration up to usual maximum doses." },

    { min: 30, max: 60, label: "eGFR 30–59", category: "Reduce dose",
      details: "Use reduced total daily dose and slower titration." },

    { min: 15, max: 30, label: "eGFR 15–29", category: "Significant reduction",
      details: "Lower daily dose with cautious titration; monitor sedation." },

    { min: null, max: 15, label: "eGFR < 15", category: "Specialist dosing",
      details: "Very low or post-dialysis dosing only. Seek specialist guidance." }
  ],

  notes: [
    "Gabapentin is almost entirely renally cleared.",
    "High risk of accumulation → drowsiness, confusion, falls.",
    "Dose using CrCl (Cockcroft–Gault) when possible."
  ]
},

/* ------------------------ PREGABALIN ------------------------ */
{
  id: "pregabalin",
  name: "Pregabalin",
  className: "Antiepileptic / neuropathic pain / GAD",
  tags: ["Neuropathic pain", "Renal"],
  searchTerms: ["pregabalin", "lyrica"],

  usualDose:
    "Typical adult maintenance: 150–600 mg/day in 2–3 divided doses.",

  renalBands: [
    { min: 60, max: null, label: "eGFR ≥ 60", category: "No change",
      details: "Standard dose range acceptable." },

    { min: 30, max: 60, label: "eGFR 30–59", category: "Reduce dose",
      details: "Lower maximum daily dose; titrate slowly." },

    { min: 15, max: 30, label: "eGFR 15–29", category: "Marked reduction",
      details: "Use substantially reduced doses; monitor sedation & oedema." },

    { min: null, max: 15, label: "eGFR < 15", category: "Specialist dosing",
      details: "Very low or post-dialysis doses only." }
  ],

  notes: [
    "Renally cleared → toxicity risk in CKD.",
    "Taper slowly when discontinuing.",
    "Consider falls risk and polypharmacy."
  ]
},

/* ------------------------ ALLOPURINOL ------------------------ */
{
  id: "allopurinol",
  name: "Allopurinol",
  className: "Xanthine oxidase inhibitor",
  tags: ["Gout", "Renal caution"],
  searchTerms: ["allopurinol"],

  usualDose:
    "Start low (e.g. 100 mg) and titrate using serum urate. Max dose depends on renal function and tolerance.",

  renalBands: [
    { min: 60, max: null, label: "eGFR ≥ 60", category: "Standard initiation",
      details: "Start 100 mg daily; titrate as per urate levels." },

    { min: 30, max: 60, label: "eGFR 30–59", category: "Lower starting dose",
      details: "Start 50–100 mg; titrate cautiously." },

    { min: 15, max: 30, label: "eGFR 15–29", category: "Very low starting dose",
      details: "Start 50 mg or alternate days; close monitoring." },

    { min: null, max: 15, label: "eGFR < 15", category: "Specialist decision",
      details: "Use with caution; consider febuxostat alternatives." }
  ],

  notes: [
    "Risk of allopurinol hypersensitivity ↑ with CKD.",
    "Continue prophylactic colchicine/NSAID if appropriate.",
    "Aim for target urate per guideline; do not stop during flares."
  ]
},

/* ------------------------ APIXABAN (example DOAC) ------------------------ */
{
  id: "apixaban",
  name: "Apixaban",
  className: "DOAC (Factor Xa inhibitor)",
  tags: ["DOAC", "Anticoagulant"],
  searchTerms: ["apixaban", "eliquis", "doac"],

  usualDose:
    "Standard NVAF dose: 5 mg twice daily; reduce to 2.5 mg BD if ≥2 of: age ≥80, weight ≤60kg, creatinine ≥133 µmol/L.",

  renalBands: [
    { min: 50, max: null, label: "CrCl ≥ 50", category: "Standard dosing",
      details: "Use standard dose unless formal dose-reduction criteria met." },

    { min: 30, max: 50, label: "CrCl 30–49", category: "Caution / consider reduction",
      details: "Use reduced dose if meets dose-reduction criteria; for VTE follow SPC." },

    { min: 15, max: 30, label: "CrCl 15–29", category: "Reduced dose",
      details: "2.5 mg twice daily commonly used; confirm locally." },

    { min: null, max: 15, label: "CrCl < 15", category: "Avoid",
      details: "Generally avoided; seek haematology/renal advice." }
  ],

  notes: [
    "Dose DOACs by **CrCl**, not eGFR.",
    "Check weight, age, interacting drugs, hepatic function.",
    "Monitor renal function at least annually; more in frailty."
  ]
}

]; // END DRUG_DATA
