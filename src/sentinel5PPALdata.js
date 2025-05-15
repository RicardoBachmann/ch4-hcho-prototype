// S5P-PAL:
// - Level 3 Grid (L3GRD): Gridded Level 3 Daten
// - Different time periods: year, month, day
// - NetCDF format (scientific data format)

/*
async function getSTACInfo() {
  try {
    const response = await fetch("https://data-portal.s5p-pal.com/api/");
    const data = await response.json();
    // STAC Landing Page zeigt alle verfügbaren Links
    console.log("Verfügbare Links:", data.links);
    // Finde den Collection-Link
    const collectionsLink = data.links.find((link) => link.rel === "data");
    console.log("Collection Links-URL:", collectionsLink?.href);
    return data;
  } catch (error) {
    console.error("Fehler:", error);
  }
}
getSTACInfo();
*/
