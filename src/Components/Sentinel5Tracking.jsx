import { useEffect, useState } from "react";

export default function Sentinel5Tracking({ setSentinel5Position }) {
  const [satelliteData, setSatelliteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSentinel5Data = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/n2yo/positions/42969/41.702/-76.014/0/2?apiKey=${
            import.meta.env.VITE_N2YO_API_KEY
          }`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw API data received:", data);
        if (data.positions && data.positions.length > 0) {
          const newPosition = {
            latitude: data.positions[0].satlatitude,
            longitude: data.positions[0].satlongitude,
            altitude: data.positions[0].sataltitude,
          };
          /*console.log("Setting new position:", newPosition);*/
          setSatelliteData(newPosition);
          setSentinel5Position(newPosition);
        } else {
          console.warn("No position data found in API response:", data);
        }
      } catch (error) {
        console.error("Error fetching sentinel5 data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getSentinel5Data();

    // N2YO API limit: 1000 transactions/hour (= max once every 3.6s)
    // Using 15s interval for safe margin (240 requests/hour)
    const interval = setInterval(getSentinel5Data, 15000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
