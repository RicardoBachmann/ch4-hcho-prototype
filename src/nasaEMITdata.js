async function fetchEMITdata() {
  console.log("Test EMIT connection:");

  //NASA CMR API for EMIT methane data
  const cmrUrl = "https://cmr.earthdata.nasa.gov/search/granules.json";
  const params = new URLSearchParams({
    short_name: "EMITL2BCH4ENH",
    version: "002",
    "bounding_box[]": "-180,-23.5,180,23.5",
    page_size: 100, // 1500
    sort_key: "-start_date",
  });

  console.log("EMIT-prop", `${cmrUrl}?${params}`);

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
