import { useEffect, useState } from "react";

export function useHydroReservoirData() {
  const [hydroReserviorData, setHydroReservoirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHydroReserviorData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "/data/br_ve_py_co_hydropower_reservoirs_48_glwd1_2025.geojson"
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
    loadHydroReserviorData();
  }, []);
  return { hydroReserviorData, loading, error };
}
