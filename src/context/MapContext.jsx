// Context State List = 6 items total (Global needed):
// mapRefA
// mapRefB
// mapRefC
// mapsInitialized
// activeMapLayers
// mapInstance

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
  const [activeMapLayers, setActiveMapLayers] = useState({
    mapA: null,
    mapB: null,
    mapC: null,
  });
  return (
    <MapContext.Provider
      value={{
        mapRefA,
        mapRefB,
        mapRefC,
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
