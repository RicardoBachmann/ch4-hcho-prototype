import { useState, useEffect } from "react";

import fetchDlrService from "../services/dlrService";

export function useSentinelData() {
  const [collectionData, setCollectionData] = useState({
    formaldehyde: null,
    ozone: null,
    sulfurDioxide: null,
    aerosolIndex: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSentinelData() {
      try {
        setLoading(true);
        setError(null);
        // Implement Promise.all to call all 4 collections at the same time!
        const [
          formaldehydeData,
          ozoneData,
          sulfurDioxideData,
          aerosolIndexData,
        ] = await Promise.all([
          fetchDlrService("Formaldehyde"),
          fetchDlrService("Ozone"),
          fetchDlrService("SulfurDioxide"),
          fetchDlrService("AerosolIndex"),
        ]);
        setCollectionData({
          formaldehyde: formaldehydeData,
          ozone: ozoneData,
          sulfurDioxide: sulfurDioxideData,
          aerosolIndex: aerosolIndexData,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Sentinel 5P collections data:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    loadSentinelData();
  }, []);
  return { collectionData, loading, error };
}

// Notes:
// Promise.all() is "fail-fast"
// If 1 of 4 APIs fails → whole Promise.all() failed
// Get 0 data back, even if 3 APIs were successful

// Improvements:
// const results = await Promise.allSettled([...]);
