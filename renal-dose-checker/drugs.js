// drugs.js — data model for Renal Dose Calculator
// Exposes DRUG_DATA on window so app.js can use it without ES modules.

window.DRUG_DATA = [
  {
    id: "metformin",
    name: "Metformin",
    searchTerms: ["metformin", "glucophage"],
    className: "Biguanide, oral hypoglycaemic",
    tags: ["Diabetes", "eGFR-based", "Use eGFR"],
    usualDose:
      "Typical maintenance 1–2 g/day in divided doses (max 2–3 g/day depending on preparation and local guidance), given with or after food.",
    renalBands: [
      {
        min: 60,
        max: null,
        label: "eGFR ≥ 60 mL/min/1.73m²",
        category: "No dose change",
        details:
          "Usual dosing can be used. Monitor renal function at least annually and before iodinated contrast or surgery."
      },
      {
        min: 45,
        max: 60,
        label: "eGFR 45–59 mL/min/1.73m²",
        category: "Caution / monitor",
        details:
          "Standard doses often acceptable, but review risk of AKI (older age, diuretics, heart failure). Consider more frequent monitoring (e.g. every 3–6 months). Avoid initiating in high-risk patients."
      },
      {
        min: 30,
        max: 45,
        label: "eGFR 30–44 mL/min/1.73m²",
        category: "Dose reduction",
        details:
          "Reduce total daily dose (for example by around 50%) and do not escalate. Review need for metformin; monitor renal function at least every 3 months. Temporarily stop during intercurrent illness, dehydration or contrast exposure."
      },
      {
        min: null,
        max: 30,
        label: "eGFR < 30 mL/min/1.73m²",
        category: "Avoid / stop",
        details:
          "Avoid metformin – contraindicated due to risk of accumulation and lactic acidosis. Switch to alternative glucose-lowering therapy."
      }
    ],
    notes: [
      "Ensure baseline renal function before starting and monitor at least yearly; more often if eGFR <60 or at risk of deterioration.",
      "Stop temporarily during acute illness causing dehydration, hypoxia or sepsis, and around iodinated contrast or major surgery.",
      "Use body weight and frailty to individualise dose; low-weight or older patients may need lower total daily doses."
    ]
  },

  {
    id: "gabapentin",
    name: "Gabapentin",
    searchTerms: ["gabapentin", "neurontin"],
    className: "Antiepileptic, neuropathic pain agent",
    tags: ["Neuropathic pain", "Renally cleared"],
    usualDose:
      "In adults with normal renal function, maintenance often 900–3600 mg/day in 3 divided doses (titrated according to response and tolerability).",
    renalBands: [
      {
        min: 60,
        max: null,
        label: "eGFR ≥ 60 mL/min/1.73m² (CrCl ≥ 60 mL/min)",
        category: "No dose change",
        details:
          "Standard titration and target doses can usually be used, up to local maximum (often 3600 mg/day) in three divided doses."
      },
      {
        min: 30,
        max: 60,
        label: "eGFR 30–59 mL/min/1.73m²",
        category: "Moderate reduction",
        details:
          "Reduce total daily dose and/or dosing frequency (for example 600–1800 mg/day in 2–3 divided doses depending on exact CrCl and indication). Titrate slowly and monitor for CNS adverse effects."
      },
      {
        min: 15,
        max: 30,
        label: "eGFR 15–29 mL/min/1.73m²",
        category: "Significant reduction",
        details:
          "Use lower daily doses (for example 300–600 mg/day in 1–2 divided doses) with slow titration. Monitor closely for sedation and dizziness – accumulation is more likely."
      },
      {
        min: null,
        max: 15,
        label: "eGFR < 15 mL/min/1.73m² or dialysis",
        category: "Specialist dosing",
        details:
          "Very low daily doses or intermittent post-dialysis dosing; follow local renal / pain guidance. Consider alternatives if adverse effects problematic."
      }
    ],
    notes: [
      "Gabapentin is almost entirely renally excreted – accumulation causes sedation, ataxia and confusion.",
      "Dose using creatinine clearance where possible (Cockcroft–Gault) and follow local renal dosing tables.",
      "Be cautious in older patients, those with falls risk, or concomitant CNS depressants (opioids, benzodiazepines, alcohol)."
    ]
  },

  {
    id: "pregabalin",
    name: "Pregabalin",
    searchTerms: ["pregabalin", "lyrica"],
    className: "Antiepileptic, neuropathic pain / GAD agent",
    tags: ["Neuropathic pain", "Renally cleared"],
    usualDose:
      "In normal renal function, usual adult dose range 150–600 mg/day in 2–3 divided doses depending on indication.",
    renalBands: [
      {
        min: 60,
        max: null,
        label: "eGFR ≥ 60 mL/min/1.73m² (CrCl ≥ 60 mL/min)",
        category: "No dose change",
        details:
          "Standard dosing range (150–600 mg/day in divided doses) may be used; titrate to response and tolerability."
      },
      {
        min: 30,
        max: 60,
        label: "eGFR 30–59 mL/min/1.73m²",
        category: "Dose reduction",
        details:
          "Start at lower doses and reduce total daily maximum (for example up to ~300 mg/day in divided doses – check current BNF/SPC for exact schedule)."
      },
      {
        min: 15,
        max: 30,
        label: "eGFR 15–29 mL/min/1.73m²",
        category: "Marked reduction",
        details:
          "Use substantially reduced doses (for example maximum around 150 mg/day in 1–2 divided doses) with cautious titration."
      },
      {
        min: null,
        max: 15,
        label: "eGFR < 15 mL/min/1.73m² or dialysis",
        category: "Specialist dosing",
        details:
          "Very low doses only, often once daily or after dialysis as per local renal guidance."
      }
    ],
    notes: [
      "Pregabalin is renally eliminated; accumulation increases risk of dizziness, somnolence and peripheral oedema.",
      "Use falls risk, frailty and concomitant CNS depressants to individualise dose.",
      "Taper gradually when stopping to reduce withdrawal symptoms."
    ]
  },

  {
    id: "allopurinol",
    name: "Allopurinol",
    searchTerms: ["allopurinol"],
    className: "Xanthine oxidase inhibitor (urate-lowering therapy)",
    tags: ["Gout", "Urate-lowering", "Renal caution"],
    usualDose:
      "Start at low dose (e.g. 100 mg once daily) and titrate according to serum urate, up to typical maintenance 300–600 mg/day; higher doses sometimes required under specialist supervision.",
    renalBands: [
      {
        min: 60,
        max: null,
        label: "eGFR ≥ 60 mL/min/1.73m²",
        category: "Standard initiation",
        details:
          "Can start at 100 mg once daily and titrate gradually according to urate level and guidance, monitoring for rash and hypersensitivity."
      },
      {
        min: 30,
        max: 60,
        label: "eGFR 30–59 mL/min/1.73m²",
        category: "Lower starting dose",
        details:
          "Use lower starting dose (for example 50–100 mg once daily) and titrate cautiously. Maximal doses may need to be lower; follow local protocols."
      },
      {
        min: 15,
        max: 30,
        label: "eGFR 15–29 mL/min/1.73m²",
        category: "Cautious use",
        details:
          "Start at very low dose (for example 50 mg once daily or 100 mg on alternate days). Increase slowly with close monitoring for toxicity. Seek specialist advice if higher doses considered."
      },
      {
        min: null,
        max: 15,
        label: "eGFR < 15 mL/min/1.73m²",
        category: "Specialist decision",
        details:
          "Use only on specialist advice; consider alternative options such as febuxostat where appropriate and safe. Risk of allopurinol hypersensitivity increases in severe renal impairment."
      }
    ],
    notes: [
      "Allopurinol hypersensitivity syndrome is associated with higher starting doses and renal impairment – start low and go slow.",
      "Continue prophylactic colchicine/NSAID cover when initiating to reduce flare risk, adapted for renal function.",
      "Aim for target serum urate per local guideline; do not abruptly stop during flares."
    ]
  },

  {
    id: "apixaban",
    name: "Apixaban",
    searchTerms: ["apixaban", "eliquis", "doac"],
    className: "Direct oral anticoagulant (factor Xa inhibitor)",
    tags: ["DOAC", "Stroke prevention in AF", "VTE treatment"],
    usualDose:
      "Typical dosing (NVAF): 5 mg twice daily, reduced to 2.5 mg twice daily if two or more of: age ≥80 years, body weight ≤60 kg, serum creatinine ≥133 micromol/L – plus renal function and indication specific adjustments.",
    renalBands: [
      {
        min: 50,
        max: null,
        label: "eGFR ≥ 50 mL/min/1.73m² (CrCl ≥ 50 mL/min)",
        category: "Standard DOAC dosing",
        details:
          "For NVAF, standard 5 mg twice daily (or 2.5 mg twice daily if dose-reduction criteria met). For VTE treatment/secondary prevention use standard licensed regimens. Always check current SPC/SPS guidance."
      },
      {
        min: 30,
        max: 50,
        label: "eGFR 30–49 mL/min/1.73m² (approx. CrCl 30–49)",
        category: "Caution / consider reduction",
        details:
          "Apixaban often preferred DOAC in moderate CKD. For NVAF, consider 2.5 mg twice daily if meeting dose-reduction criteria or borderline renal function. For VTE, use with caution and verify against SPC and local DOAC protocol."
      },
      {
        min: 15,
        max: 30,
        label: "eGFR 15–29 mL/min/1.73m²",
        category: "Reduced dose / specialist advice",
        details:
          "For NVAF, a reduced dose (commonly 2.5 mg twice daily) may be used with caution depending on exact CrCl and local policy. For VTE treatment this range often requires specialist decision; consider warfarin or alternative strategy."
      },
      {
        min: null,
        max: 15,
        label: "eGFR < 15 mL/min/1.73m² or dialysis",
        category: "Generally avoid",
        details:
          "Most UK guidance advises avoiding DOACs in CrCl <15 mL/min; seek haematology/renal advice. Warfarin or no anticoagulation may be preferred depending on stroke and bleeding risk."
      }
    ],
    notes: [
      "DOAC dosing should be based on creatinine clearance (Cockcroft–Gault), not eGFR; this tool only offers approximate bands.",
      "Always consult up-to-date SPS DOAC guidance, national AF guidelines and local DOAC protocols.",
      "Monitor renal function at baseline and at least annually; more frequently in older or frail patients or when eGFR <60."
    ]
  }

  // ➕ Add further drugs here following the same pattern.
];
