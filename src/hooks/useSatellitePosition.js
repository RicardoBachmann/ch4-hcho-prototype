import { useState, useEffect } from "react";

import fetchN2yoService from "../services/n2yoService";

export function useSatellitePosition() {
  const [sentinelPosition, setSentinelPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSentinelPosition() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchN2yoService();
        console.log("N2YO Service returns:", data);
        if (data.positions && data.positions.length > 0) {
          const transformedPosition = {
            latitude: data.positions[0].satlatitude,
            longitude: data.positions[0].satlongitude,
            altitude: data.positions[0].sataltitude,
          };
          setSentinelPosition(transformedPosition);
        } else {
          console.warn("No Sentinel 5 position data");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    loadSentinelPosition();
    const interval = setInterval(loadSentinelPosition, 15000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  console.log("Hook return:", { sentinelPosition, loading, error });
  return { sentinelPosition, loading, error };
}

// Note:
// N2YO API limit: 1000 transactions/hour (= max once every 3.6s)
// Using 15s interval for safe margin (240 requests/hour)
