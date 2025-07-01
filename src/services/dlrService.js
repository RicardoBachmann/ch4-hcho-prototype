// DLR STAC Data:
// - No token required
// - Direct WMS tiles available
// - Level 3 atmosphere data
// - NRTI(Near Real-Time Imagery)

async function fetchDlrService(productKey) {
  console.log("===DLR-Service connection===");

  // productName for actual API collection IDs for better code readability
  const API_COLLECTIONS = {
    Formaldehyde: "S5P_TROPOMI_L3_P1D_HCHO_v2",
  };

  const collectionId = API_COLLECTIONS[productKey];
  const url = `/api/dlr/eoc/ogc/stac/v1/collections/${collectionId}/items?&limit=10`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error! Status:, ${response.status}`);
  }
  const data = await response.json();
  console.log("Raw Dlr Data:", data);

  return data;
}

export default fetchDlrService;

// Service-Responsibility:
// Only fetch and pass on Dlr data
// Error-Handling in Component
