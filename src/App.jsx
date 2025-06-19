import { useState } from "react";
import "./App.css";

import SyncMapTracking from "./Components/SyncMapTracking";
import Sentinel5Tracking from "./Components/Sentinel5Tracking";

function App() {
  // State to store the map instance that are initialized in SyncMapTracking
  // and needed by layer components to add visualizations (instances available all over the app hierarchy).
  const [mapInstance, setMapInstance] = useState(null);

  // Callback func passed to SyncMapTracking
  // Recevies map instance once they're initialized and ready for use
  const handleMapsReady = (refs) => {
    setMapInstance(refs);
  };

  // States and lower callback func for position tracking S5-Satellite
  const [isPositionLoaded, setIsPositionLoaded] = useState(false);
  const [sentinel5Position, setSentinel5Position] = useState({
    longitude: 0,
    latitude: 0,
    altitude: 0,
  });

  const handleSetPosition = (position) => {
    setSentinel5Position(position);
    setIsPositionLoaded(true);
  };

  return (
    <div>
      <section>
        {isPositionLoaded ? (
          <SyncMapTracking
            onLayerReady={handleMapsReady}
            sentinel5Position={sentinel5Position}
          />
        ) : (
          <div className="loading">Loading satellite position...</div>
        )}

        <Sentinel5Tracking setSentinel5Position={handleSetPosition} />
      </section>
    </div>
  );
}

export default App;
