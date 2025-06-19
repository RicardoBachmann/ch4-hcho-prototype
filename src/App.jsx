import { useState } from "react";
import "./App.css";

import SyncMapTracking from "./Components/SyncMapTracking";

function App() {
  // State to store the map instance that are initialized in SyncMapTracking
  // and needed by layer components to add visualizations (instances available all over the app hierarchy).
  const [mapInstance, setMapInstance] = useState(null);

  // Callback func passed to SyncMapTracking
  // Recevies map instance once they're initialized and ready for use
  const handleMapsReady = (refs) => {
    setMapInstance(refs);
  };

  return (
    <div>
      <section>
        <SyncMapTracking onLayerReady={handleMapsReady} />
      </section>
    </div>
  );
}

export default App;
