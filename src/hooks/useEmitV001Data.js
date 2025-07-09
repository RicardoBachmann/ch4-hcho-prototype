import { useState, useEffect } from "react";

import fetchNasaEmitV001Service from "../services/nasaEmitV001Service";

export default function useEmitV001Data() {
  const [emitV001Data, setEmitV001Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true), setError(null);
    async function loadEmitV001Data() {
      try {
        const response = await fetchNasaEmitV001Service();
        console.log("NASA EMITV001 data loaded", response);
        setEmitV001Data(response);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching NASA EMITV001 data", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadEmitV001Data();
  }, []);

  return { emitV001Data, loading, error };
}
