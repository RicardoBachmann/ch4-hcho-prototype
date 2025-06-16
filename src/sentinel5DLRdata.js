// DLR Data:
// - No token required
// - Direct tiles available
// - Level 3 data
// - Can be used immediately in Mapbox
// - NRTI = Near Real-Time Imagery
// ! Later: STAC Implementation for DLR (More control and metadata, can select specific days, modern standard) !

async function fetchDLRStacData(productKey) {
  // Product names to actual API collection IDs for better code readability
  const productName = {
    Formaldehyde: "S5P_TROPOMI_L3_P1D_HCHO_v2",
    SulfurDioxide: "S5P_TROPOMI_L3_P1D_SO2_v2",
    Ozone: "S5P_TROPOMI_L3_P1D_O3_v2",
    AerosolIndex: "S5P_TROPOMI_L3_P1D_AI_v2",
    NitrogenDioxide: "S5P_TROPOMI_L3_P1D_NO2_v2",
    Methane: "S5P_TROPOMI_L3_P1D_CH4_v2",
    CarbonMonoxide: "S5P_TROPOMI_L3_P1D_CO_v2",
  };

  // Intercepts all errors that could occur during the network request process
  try {
    const collectionID = productName[productKey];
    const url = `/api/dlr/eoc/ogc/stac/v1/collections/${collectionID}/items?&limit=10`;

    console.log("Fetching URL:", url);
    const response = await fetch(url);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const text = await response.text();
    console.log("Response text:", text);

    // Focuses specifically on errors when parsing the JSON, instead of throwing the error up
    try {
      const data = JSON.parse(text);
      console.log(
        "All dates:",
        data.features.map((f) => f.properties.datetime)
      );
      console.log("Parsed data:", data);

      return data;
    } catch (parseError) {
      console.error("JSON parse error", parseError);
      console.log("Raw text was:", text);

      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default fetchDLRStacData;
