// Copernicus Data:
// - too complicated, despite various attempts at different endpoints always get empty array back

/*import { getAccessToken } from "./authService";


async function fetchCopernicusData() {
  const token = await getAccessToken();

  // Level 2 Daten von Copernicus
  const url = `https://catalogue.dataspace.copernicus.eu/resto/api/collections/Sentinel5P/search.json?productType=L2__HCHO__&startDate=2024-01-01`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export { fetchCopernicusData }; 
*/
