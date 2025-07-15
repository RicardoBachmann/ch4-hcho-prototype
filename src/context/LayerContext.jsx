import { createContext, useState } from "react";

export const LayerContext = createContext({
  mapA: {
    Formaldehyde: { visible: true },
    EmitV001: { visible: false },
    EmitV002: { visible: false },
    Wetlands: { visible: true },
    HydropowerDams: { visible: true },
  },
  mapB: {
    Formaldehyde: { visible: true },
    EmitV001: { visible: false },
    EmitV002: { visible: false },
    Wetlands: { visible: true },
    HydropowerDams: { visible: true },
  },
  mapC: {
    Formaldehyde: { visible: true },
    EmitV001: { visible: false },
    EmitV002: { visible: false },
    Wetlands: { visible: true },
    HydropowerDams: { visible: true },
  },
});

export const LayerProvider = ({ children }) => {
  const [activeLayers, setActiveLayers] = useState({
    mapA: {
      Formaldehyde: { visible: true },
      EmitV001: { visible: false },
      EmitV002: { visible: false },
      Wetlands: { visible: true },
      HydropowerDams: { visible: true },
    },
    mapB: {
      Formaldehyde: { visible: true },
      EmitV001: { visible: false },
      EmitV002: { visible: false },
      Wetlands: { visible: true },
      HydropowerDams: { visible: true },
    },
    mapC: {
      Formaldehyde: { visible: true },
      EmitV001: { visible: false },
      EmitV002: { visible: false },
      Wetlands: { visible: true },
      HydropowerDams: { visible: true },
    },
  });
  function toggleLayer(mapId, layerId) {
    setActiveLayers((prev) => ({
      ...prev,
      [mapId]: {
        ...prev[mapId],
        [layerId]: {
          ...prev[mapId][layerId],
          visible: !prev[mapId][layerId].visible,
        },
      },
    }));
  }

  // Helper function to get specific map layers
  function getMapLayers(mapId) {
    return activeLayers[mapId] || {};
  }

  // Helper function to get specific layer config
  function getLayerConfig(mapId, layerId) {
    return activeLayers[mapId]?.[layerId] || { visible: false };
  }

  return (
    <LayerContext.Provider
      value={{
        activeLayers,
        toggleLayer,
        getMapLayers,
        getLayerConfig,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};
