import { getAccessToken } from "./authService";

async function fetchSentinelData() {
  const token = await getAccessToken();

  /*const filter = encodeURIComponent("Collection/Name eq 'SENTINEL-5P'");*/

  // Wahrscheinlich ist es "S5P_" statt "SENTINEL-5P"
  const filter = encodeURIComponent("startswith(Name,'S5P_')");

  const url = `https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=${filter}&$top=5`;
  /*const url = `https://catalogue.dataspace.copernicus.eu/odata/v1/Products`;*/

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
