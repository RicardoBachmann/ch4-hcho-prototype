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
        const formaldehydeData = await fetchDlrService("formaldehyde");
        const ozoneData = await fetchDlrService("ozone");
        const sulfurDioxideData = await fetchDlrService("sulfurDioxide");
        const aerosolIndexData = await fetchDlrService("aerosolIndex");
        setCollectionData({
          formaldehyde: formaldehydeData,
          ozone: ozoneData,
          sulfurDioxide: sulfurDioxideData,
          aerosolIndex: aerosolIndexData,
        });
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    loadSentinelData();
  }, []);
  return { collectionData, loading, error };
}
