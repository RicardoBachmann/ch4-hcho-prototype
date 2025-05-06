import { useState, useEffect } from "react";
import { getAccessToken } from "./authService";
import "./App.css";
import fetchSentinelData from "./sentineldata";
import SyncMapTracking from "./Components/SyncMapTracking";
import Sentinel5Tracking from "./Components/Sentinel5Tracking";
import FormaldehydeLayer from "./Components/DataSpaceViz/FormaldehydeLayer";

function App() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [sentinelData, setSentinelData] = useState(null);
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
        const data = await fetchSentinelData("Formaldehyde");
        setSentinelData(data);
        console.log("Data:", data);
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
        {/*Render FormaldehydeLayer only if mapRefs are available*/}
        {mapRefs && sentinelData && (
          <FormaldehydeLayer data={sentinelData} mapRefs={mapRefs} />
        )}
      </section>
    </div>
  );
}

export default App;
