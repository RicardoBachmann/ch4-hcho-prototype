// DLR Data:
// - No token required
// - Direct tiles available
// - Level 3 data
// - Can be used immediately in Mapbox
// - NRTI = Near Real-Time Imagery
// ! Later: STAC Implementation for DLR (More control and metadata, can select specific days, modern standard) !

async function fetchDLRStacData(productKey) {
  const productName = {
    Formaldehyde: "S5P_TROPOMI_L3_P1D_HCHO_v2",
    SulfurDioxide: "S5P_TROPOMI_L3_P1D_SO2_v2",
  };

  try {
    const collectionID = productName[productKey];
    const url = `/api/dlr/eoc/ogc/stac/v1/collections/${collectionID}/items?limit=1`;
    console.log("Fetching URL:", url);
    const response = await fetch(url);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const text = await response.text();
    console.log("Response text:", text);

    try {
      const data = JSON.parse(text);
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
