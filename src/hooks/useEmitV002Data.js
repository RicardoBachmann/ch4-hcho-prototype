import { useState, useEffect } from "react";

import fetchNasaEmitV002Service from "../services/nasaEmitV002Service";

export default function useEmitV002Data() {
  const [emitV002Data, setEmitV002Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    async function loadEmitV002Data() {
      try {
        const data = await fetchNasaEmitV002Service(controller.signal);
        console.log("NASA-EMIT data loaded:", data);
        setEmitV002Data(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NASA-EMIT data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadEmitV002Data();

    // Clean up
    return () => {
      controller.abort();
    };
  }, []);

  return { emitV002Data, loading, error };
}

// NASA EMIT data hook with abort control and error state management
// Handles: Component unmount cleanup, loading states, error propagation
