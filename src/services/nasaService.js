async function fetchNasaService() {
  console.log("=== NASA-Service connection ===");

  //NASA CMR API for EMIT Methane data
  const cmrUrl = "https://cmr.earthdata.nasa.gov/search/granules.json";
  const params = new URLSearchParams({
    short_name: "EMITL2BCH4ENH",
    version: "002",
    "bounding_box[]": "-180,-23.5,180,23.5",
    page_size: 50, // max. 1500
    sort_key: "-start_date",
  });

  try {
    // 10s Timeout for network calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${cmrUrl}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // HTTP Status Errors(enhanced error messages)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "NASA EMIT data not found - service may be unavailable"
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
      throw new Error("No EMIT data available for tropical region");
    }
    console.log("EMIT-prop:", `${cmrUrl}?${params}`);
    console.log("Raw Nasa Data:", data);
    return data; // Guaranteed: data.feed.entry exists!
  } catch (error) {
    if (error.name === "AbortError") {
      // Errors for timeout abort()
      throw new Error(
        "NASA API request timeout - please check your connection "
      );
    }
    throw error; // Errors for data structure validation
  }
}

export default fetchNasaService;

// Comprehensive error handling:

// Timeout Protection with AbortController() - controller object allows to abort Web requests after 10s.
// API errors (4xx, 5xx responses + User-friendliy error messages)
// Data Structure Validation - Fail Fast with Clear Messages
