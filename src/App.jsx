import { useState, useEffect } from "react";
import { getAccessToken } from "./authService";
import "./App.css";

import fetchDLRStacData from "./sentinel5DLRdata";
import SyncMapTracking from "./Components/SyncMapTracking";
import Sentinel5Tracking from "./Components/Sentinel5Tracking";
import FormaldehydeLayer from "./Components/DataSpaceViz/FormaldehydeLayer";
import SulfurDioxide from "./Components/DataSpaceViz/SulfurDioxideLayer";

function App() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [sentinelData, setSentinelData] = useState({
    formaldehyde: null,
    sulfurDioxide: null,
  });
  const [isPositionLoaded, setIsPositionLoaded] = useState(false);
  const [mapRefs, setMapRefs] = useState(null);

  const handleMapsReady = (refs) => {
    setMapRefs(refs);
  };

  const [sentinel5Position, setSentinel5Position] = useState({
    longitude: 0,
    latitude: 0,
    altitude: 0,
  });

  useEffect(() => {
    async function fetchToken() {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);
      } catch (error) {
        setError(error.message);
        console.error(`Error getting Token:`, error);
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const formaldehydeData = await fetchDLRStacData("Formaldehyde");
        const sulfurDioxideData = await fetchDLRStacData("SulfurDioxide");
        setSentinelData({
          formaldehyde: formaldehydeData,
          sulfurDioxide: sulfurDioxideData,
        });
        console.log("Data:", formaldehydeData, sulfurDioxideData);
      } catch (error) {
        console.error("Error to get sentinel-data:", error);
        setError(error.message);
      }
    }
    fetchData();
  }, []);

  const handleSetPosition = (position) => {
    setSentinel5Position(position);
    setIsPositionLoaded(true);
  };

  return (
    <div>
      {token && <p>Token erfolgreich abgerufen!</p>}
      {!token && <p>Fehler:{error}!</p>}
      <section>
        {/* Only render maps once we have position data */}
        {isPositionLoaded ? (
          <SyncMapTracking
            onLayerReady={handleMapsReady}
            sentinel5Position={sentinel5Position}
          />
        ) : (
          <div className="loading">Loading satellite position...</div>
        )}
        <Sentinel5Tracking
          setSentinel5Position={handleSetPosition}
          sentinelData={sentinelData}
        />
        {/*Render Layer only if mapRefs are available*/}
        {mapRefs && sentinelData && (
          <>
            <FormaldehydeLayer
              data={sentinelData.formaldehyde}
              mapRefs={mapRefs}
            />
            <SulfurDioxide
              data={sentinelData.sulfurDioxide}
              mapRefs={mapRefs}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default App;
