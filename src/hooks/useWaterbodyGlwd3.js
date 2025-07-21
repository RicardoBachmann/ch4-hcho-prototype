import { useState, useEffect } from "react";

export default function useWaterbodyGlwd3() {
  const [waterbodyData, setWaterbodyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWaterbodyData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "/data/waterbodies_southamerica_glwd_3_2004.geojson"
        );
        const data = await response.json();
        console.log("GLWD3 waterbody data loaded:", data);
        setWaterbodyData(data);
        setLoading(false);
      } catch (error) {
        console.log("Error to import GLWD3 waterbody data", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadWaterbodyData();
  }, []);
  return { waterbodyGlwd3: waterbodyData, loading, error };
}
