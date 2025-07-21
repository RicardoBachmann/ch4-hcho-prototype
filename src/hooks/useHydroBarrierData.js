import { useState, useEffect } from "react";

export default function useHydroBarrierData() {
  const [barrierData, setBarrierData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHydroBarrierData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "/data/hydropower_barriers_gdw_2024.geojson"
        );
        const data = await response.json();
        console.log("GDW barrier data loaded:", data);
        setBarrierData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error to import GDW barrier data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadHydroBarrierData();
  }, []);
  return { barrierData, loading, error };
}
