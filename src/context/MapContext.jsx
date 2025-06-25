import { createContext, useState, useRef } from "react";

export const MapContext = createContext({
  // Provider Container
  mapRefA: null,
  mapRefB: null,
  mapRefC: null,
  mapsInitialized: false,
  activeMapLayers: null,
});
export const MapProvider = ({ children }) => {
  const mapRefA = useRef(null);
  const mapRefB = useRef(null);
  const mapRefC = useRef(null);

  const [mapsInitialized, setMapsInitialized] = useState(false);
  // Object that saves which layer is currently active
  const [activeMapLayers, setActiveMapLayers] = useState({
    mapA: null,
    mapB: null,
    mapC: null,
  });
  return (
    <MapContext.Provider
      value={{
        // Context returns real Ref objects, not .current
        mapRefA: mapRefA,
        mapRefB: mapRefB,
        mapRefC: mapRefC,
        mapsInitialized,
        setMapsInitialized,
        activeMapLayers,
        setActiveMapLayers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Global State Managment

// Context Items(5 total):
// - mapRefA/B/C: Individual map references for syncMaps functionality
// - mapsInitialized: Defensive coding for timing-safe map interactions
// - activeMapLayer: Global layer toggle state for mapA/B/C

// Architecture Decision: Individual refs over grouped oobjects
// Reason: syncMaps requires separate ref parameters

// Future Consideration: Hybrid approach for responsive design scenarios
// (bulk operations, mobile layout changes, performance optimizations)
