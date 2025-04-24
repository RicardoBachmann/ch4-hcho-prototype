import { useState, useEffect } from "react";
import { getAccessToken } from "./authService";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const accessToken = getAccessToken;
        setToken(accessToken);
      } catch (error) {
        setError(error.message);
        console.error(`Error getting Token:`, error);
      }
    }
    fetchToken();
  }, []);

  return (
    <div>
      {token && <p>Token erfolgreich abgerufen!</p>}
      {!token && <p>Fehler:{error}!</p>}
    </div>
  );
}

export default App;
