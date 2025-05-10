import { getAccessToken } from "./authService";

async function fetchSentinelData(productTypeName) {
  const token = await getAccessToken();
  const productTypes = {
    Formaldehyde: "L2__HCHO__",
    SulfurDioxide: "L2__SO2___",
  };

  // Sentinel-5P catalog openSearch for Level 2 Formaldehyde data
  /*const url = `https://catalogue.dataspace.copernicus.eu/resto/api/collections/Sentinel5P/search.json?productType=L2__HCHO__&startDate=2024-01-01`;*/
  /*const url = `https://catalogue.dataspace.copernicus.eu/resto/api/collections/Sentinel5P/search.json?productType=${productTypes[productTypeName]}&startDate=2022-01-01`;*/
  // Query collection of products
  /*const url = `https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=Collection/Name eq 'SENTINEL-5P'`;*/

  // Copernicus Sentinel data processed by S[&]T
  const url = `https://data-portal.s5p-pal.com/api/s5p-l3/hcho/year/2024/s5p-l3grd-hcho-001-year-20240101-20250105.json`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Bearer Token", token);
  const rawText = await response.clone().text();
  console.log("Raw response:", rawText);
  console.log("Status:", response.status);
  console.log("status Text:", response.statusText);
  console.log("Full URL:", url);
  console.log(
    "Response Headers:",
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Actual data returned:", data);
  return data;
}

export default fetchSentinelData;
