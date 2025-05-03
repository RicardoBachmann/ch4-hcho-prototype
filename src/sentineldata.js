import { getAccessToken } from "./authService";

async function fetchSentinelData() {
  const token = await getAccessToken();

  const filter = encodeURIComponent("Collection/Name eq 'SENTINEL-5P'");

  const url = `https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=${filter}&$top=5`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  return data;
}

export default fetchSentinelData;
