async function fetchEMITdata() {
  console.log("Test EMIT connection:");

  //NASA CMR API for EMIT methane data
  const cmrUrl = "https://cmr.earthdata.nasa.gov/search/granules.json";
  const params = new URLSearchParams({
    short_name: "EMITL2BCH4ENH",
    version: "002",
    page_size: 10,
    sort_key: "-start_date",
  });

  try {
    const response = await fetch(`${cmrUrl}?${params}`);
    const data = await response.json();

    console.log("EMIT Response:", data);
    console.log("First granule links:", data.feed.entry[0].links);
    return data;
  } catch (error) {
    console.error("EMIT Data Error:", error);
    throw error;
  }
}

export default fetchEMITdata;
