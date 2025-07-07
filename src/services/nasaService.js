async function fetchNasaService(signal) {
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

  let timeoutId;
  try {
    // 10s Timeout for network calls
    timeoutId = setTimeout(() => signal.abort(), 10000);
    const response = await fetch(`${cmrUrl}?${params}`, {
      signal: signal,
    });

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
      throw new Error(
        "NASA API request timeout - please check your connection "
      );
    }
    if (error.name === "TypeError") {
      throw new Error("NASA API not available - please check your connection");
    }
    if (error.name === "SyntaxError") {
      throw new Error("NASA server returned invalid data format");
    }
    throw error; // Errors for data structure validation
  } finally {
    clearTimeout(timeoutId);
  }
}

export default fetchNasaService;

// Service-Responsibility:
// Fetch NASA EMIT L2B Methane Enhancement Data 60 m V002

// Timeout Protection via external signal - aborts after 10s OR component unmount
// API errors (4xx, 5xx responses + User-friendliy error messages)
// Data Structure Validation - Fail Fast with Clear Messages

// Error Types:
// "AbortError" = Request timeout (10s) or component unmount
// "TypeError" = Network/Internet connection problem
// "SyntaxError" = Server returned invalid data format
// else = Data structure validation errors (passed through)

