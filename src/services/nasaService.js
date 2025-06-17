async function fetchNasaService() {
  console.log("===NASA-Service connection===");

  //NASA CMR API for EMIT Methane data
  const cmrUrl = "https://cmr.earthdata.nasa.gov/search/granules.json";
  const params = new URLSearchParams({
    short_name: "EMITL2BCH4ENH",
    version: "002",
    "bounding_box[]": "-180,-23.5,180,23.5",
    page_size: 50, // max. 1500
    sort_key: "-start_date",
  });

  const response = await fetch(`${cmrUrl}?${params}`);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status:, ${response.status}`);
  }
  console.log("EMIT-prop", `${cmrUrl}?${params}`);
  const data = await response.json();
  console.log("Raw Nasa Data:", data);

  return data;
}

export default fetchNasaService;

// Service-Responsibility:
// Only fetch and pass on Nasa data
// Error-Handling in Component
