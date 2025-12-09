(async function () {
  console.log("🔍 Checking drugs.json for duplicates...");

  try {
    const response = await fetch("./drugs.json", { cache: "no-store" });
    const drugs = await response.json();

    const seenIds = new Map();
    const seenNames = new Map();
    const seenTerms = new Map();

    const duplicates = {
      id: [],
      name: [],
      searchTerms: []
    };

    drugs.forEach((drug, index) => {
      // Check ID duplicates
      if (seenIds.has(drug.id)) {
        duplicates.id.push({
          id: drug.id,
          firstIndex: seenIds.get(drug.id),
          secondIndex: index
        });
      } else {
        seenIds.set(drug.id, index);
      }

      // Check name duplicates
      const nameKey = drug.name.toLowerCase().trim();
      if (seenNames.has(nameKey)) {
        duplicates.name.push({
          name: drug.name,
          firstIndex: seenNames.get(nameKey),
          secondIndex: index
        });
      } else {
        seenNames.set(nameKey, index);
      }

      // Check search term duplicates
      (drug.searchTerms || []).forEach(term => {
        const termKey = term.toLowerCase().trim();
        if (seenTerms.has(termKey)) {
          duplicates.searchTerms.push({
            term: term,
            firstIndex: seenTerms.get(termKey),
            secondIndex: index
          });
        } else {
          seenTerms.set(termKey, index);
        }
      });
    });

    console.log("📦 Duplicate report:");
    console.log("------------------------");

    if (
      duplicates.id.length === 0 &&
      duplicates.name.length === 0 &&
      duplicates.searchTerms.length === 0
    ) {
      console.log("✅ No duplicates found!");
    } else {
      if (duplicates.id.length > 0) {
        console.log("❌ Duplicate IDs:");
        console.table(duplicates.id);
      }
      if (duplicates.name.length > 0) {
        console.log("❌ Duplicate Names:");
        console.table(duplicates.name);
      }
      if (duplicates.searchTerms.length > 0) {
        console.log("❌ Duplicate Search Terms:");
        console.table(duplicates.searchTerms);
      }
    }

  } catch (err) {
    console.error("Error loading drugs.json:", err);
  }
})();
