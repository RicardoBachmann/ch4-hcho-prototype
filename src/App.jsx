import { useState, useEffect } from "react";
import { getAccessToken } from "./authService";
import "./App.css";
import fetchSentinelData from "./sentineldata";
import SyncMapTracking from "./Components/SyncMapTracking";
import Sentinel5Tracking from "./Components/Sentinel5Tracking";

function App() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [sentinelData, setSentinelData] = useState(null);

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
        const data = await fetchSentinelData();
        setSentinelData(data);
        console.log("Data:", data);
      } catch (error) {
        console.error("Error to get sentinel-data:", error);
        setError(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {token && <p>Token erfolgreich abgerufen!</p>}
      {!token && <p>Fehler:{error}!</p>}
      <section>
        <SyncMapTracking />
        <Sentinel5Tracking />
      </section>
    </div>
  );
}

export default App;
