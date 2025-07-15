async function fetchNasaEmitV001Service() {
  console.log("===NASA EmitV001 Service Connection===");

  // NASA CMR API for EMITV001 Methane data

  const cmrUrl = "https://cmr.earthdata.nasa.gov/search/granules.json";
  const params = new URLSearchParams({
    short_name: "EMITL2BCH4ENH",
    version: "001",
    //"bounding_box[]": "-180,-23.5,180,23.5",
    "bounding_box[]": "-81,-56,-34,13",
    page_size: 500, // max. 1500
    sort_key: "-start_date",
  });

  // HTTP Status Errors(enhanced error messages)
  try {
    const response = await fetch(`${cmrUrl}?${params}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "NASA EMITV001 data not found - service may be unavailable"
        );
      }
      if (response.status >= 500) {
        throw new Error("NASA server error - please try again later");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded - please wait before retrying");
      }
      throw new Error(
        `NASA API Error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    // Data Structure Validation
    if (!data) {
      throw new Error("No response from NASA API");
    }
    if (!data.feed) {
      throw new Error("Invalid NASA API response - missing feed");
    }
    if (!data.feed.entry) {
      throw new Error("Invalid NASA API response - missing entry data");
    }
    if (data.feed.entry.length === 0) {
      throw new Error("No EMITV001 data available for tropical region");
    }

    console.log(`EMITV001-prop:, ${cmrUrl}?${params}`);
    console.log("Raw EMITV001 data", data);
    return data; // Guaranteed: data.feed.entry exists!
  } catch (error) {
    if (error.name === "SyntaxError") {
      throw new Error("NASA server returned invalid data format");
    }
    throw error;
  }
}

export default fetchNasaEmitV001Service;
