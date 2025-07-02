import { useState, useEffect } from "react";

import fetchNasaService from "../services/nasaService";

export default function useEmitData() {
  const [emitData, setEmitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    async function loadEmitData() {
      try {
        const data = await fetchNasaService(controller.signal);
        console.log("NASA-EMIT data loaded:", data);
        setEmitData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NASA-EMIT data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadEmitData();

    // Clean up
    return () => {
      controller.abort();
    };
  }, []);

  return { emitData, loading, error };
}
