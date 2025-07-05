async function fetchDlrService(productKey) {
  console.log("===DLR-Service connection===");
  if (productKey !== "Formaldehyde")
    throw new Error("Invalid product key: only 'Formaldehyde' is supported");

  // API_COLLECTIONS object for storing and categorize different Sentinel 5p products
  const API_COLLECTIONS = {
    Formaldehyde: "S5P_TROPOMI_L3_P1D_HCHO_v2",
  };

  const collectionId = API_COLLECTIONS[productKey];
  const url = `/api/dlr/eoc/ogc/stac/v1/collections/${collectionId}/items?&limit=10`;

  try {
    const response = await fetch(url);

    // HTTP Status Errors(enhanced error messages)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("DLR data not found - service may be unavailable");
      }
      if (response.status >= 500) {
        throw new Error("DLR server error - please try again later");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded - please wait before retrying");
      }
      throw new Error(`DLR-API error:, ${response.status}`);
    }
    const data = await response.json();
    console.log("Raw Dlr Data:", data);

    // Data Structure Validation
    if (!data.features || data.features.length === 0) {
      throw new Error("No HCHO data available for timeline");
    }
    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("DLR API not available - please check your connection");
    } else if (error.name === "SyntaxError") {
      throw new Error("DLR server returned invalid data format");
    }
    throw new Error("Error processing DLR data - please try again");
  }
}

export default fetchDlrService;

// DLR STAC Data:
// - No token required
// - Direct WMS tiles available
// - Level 3 atmosphere data
// - NRTI(Near Real-Time Imagery)

// Service-Responsibility:
// Fetch DLR STAC data and provide user-friendly error messages
// Data validation ensures timeline-ready HCHO data

// Error Types:
// "TypeError" = Network/Internet connection problem
// "SyntaxError" = Server returned invalid data format
// else = General data processing problem
