import { useEffect } from "react";

export default function Sentinel5Tracking() {
  useEffect(() => {
    console.log("API Key:", import.meta.env.VITE_N2YO_API_KEY);
    try {
      fetch(
        `https://api.n2yo.com/rest/v1/satellite/positions/42969/41.702/-76.014/0/2/&apiKey=${
          import.meta.env.VITE_N2YO_API_KEY
        }`
      )
        .then((res) => res.json())
        .then((data) => console.log("Sentinel-5 data:", data))
        .catch((error) =>
          console.error("Error in fetch promise chain:", error)
        );
    } catch (error) {
      console.error("Error Fetching Sentinel-5 data:", error);
    }
  }, []);
  return null;
}
