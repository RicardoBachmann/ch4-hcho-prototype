import { getAccessToken } from "./authService";

async function fetchSentinelData() {
  const token = await getAccessToken();

  const filter = encodeURIComponent(
    "startswith(Name,'S5P_') and ContentDate/Start gt 2023-01-01T00:00:00.000Z"
  );
  const response = await fetch(
    `https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=${filter}&$top=5`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export default fetchSentinelData;
