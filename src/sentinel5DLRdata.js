async function fetchDLRStacData() {
  try {
    const url =
      "/api/dlr/eoc/ogc/stac/v1/collections/S5P_TROPOMI_L3_P1D_HCHO_v2/items?limit=1";
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
