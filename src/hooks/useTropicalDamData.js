import { useState, useEffect } from "react";
export function useTropicalDamData() {
  const [damData, setDamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadDamData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/data/hydropower-tropical-dams.geojson");
        const data = await response.json();
        console.log("Global-Dam-Watch data loaded:", data);

        setDamData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error to import Global-Dam-Watch data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadDamData();
  }, []);
  return { damData, loading, error };
}
