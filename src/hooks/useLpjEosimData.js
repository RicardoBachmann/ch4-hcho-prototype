import { useState, useEffect } from "react";

import fetchLpjEosimService from "../services/lpjEosimService";

export default function useLpjEosimData() {
  console.log("🔵 useLpjEosimData hook called!");
  const [lpjEosimData, setLpjEosimData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    async function loadLpjEosimData() {
      try {
        const data = await fetchLpjEosimService(controller.signal);
        console.log("NASA-LPJ EOSIM data loaded:", data);
        setLpjEosimData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NASA-LPJ EOSIM data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadLpjEosimData();

    // Clean up
    return () => {
      controller.abort();
    };
  }, []);

  return { lpjEosimData, loading, error };
}

// NASA LPJ-EOSIM data hook with abort control and error state management
// Handles: Component unmount cleanup, loading states, error propagation
