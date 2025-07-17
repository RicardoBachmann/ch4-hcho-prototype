import { useEffect, useState } from "react";

export function useHydroReservoirData() {
  const [hydroReservoirData, setHydroReservoirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHydroReservoirData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "/data/hydropower_reservoirs_gdw_2024.geojson"
        );
        const data = await response.json();
        console.log("Hydro-Reservoir geojson data loaded:", data);
        setHydroReservoirData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading Hydro-Reservoir geojson data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadHydroReservoirData();
  }, []);
  return { hydroReservoirData, loading, error };
}
