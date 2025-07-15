import { useContext, useEffect } from "react";
import { MapContext } from "../../context/MapContext";
import { LayerContext } from "../../context/LayerContext";

export default function LayerManager() {
  const { mapRefA, mapRefB, mapRefC, mapsInitialized } = useContext(MapContext);
  const { activeLayers } = useContext(LayerContext);

  // TODO: REFACTOR - Replace mapping with self-registering layers
  const LAYER_MAPPING = {
    Formaldehyde: {
      mapA: "HCHO-layer-a",
      mapB: "HCHO-layer-b",
      mapC: "HCHO-layer-c",
    },
    EmitV001: {
      mapA: "CH4V001-layer-a",
      mapB: "CH4V001-layer-b",
      mapC: "CH4V001-layer-c",
    },
    EmitV002: {
      mapA: "CH4V002-layer-a",
      mapB: "CH4V002-layer-b",
      mapC: "CH4V002-layer-c",
    },
    Wetlands: {
      mapA: "wetland-layer",
      mapB: "wetland-layer",
      mapC: "wetland-layer",
    },
    HydropowerDams: {
      mapA: "dam-points",
      mapB: "dam-points",
      mapC: "dam-points",
    },
  };

  // Map References für einfachere Iteration
  const mapRefs = {
    mapA: mapRefA,
    mapB: mapRefB,
    mapC: mapRefC,
  };

  useEffect(() => {
    if (!mapsInitialized) return;

    // Für jede Map
    Object.entries(activeLayers).forEach(([mapId, mapLayers]) => {
      const mapRef = mapRefs[mapId];
      if (!mapRef?.current) return;

      // Für jeden Layer in dieser Map
      Object.entries(mapLayers).forEach(([layerId, layerConfig]) => {
        const mapboxLayerId = LAYER_MAPPING[layerId]?.[mapId];

        if (mapboxLayerId && mapRef.current.getLayer(mapboxLayerId)) {
          const visibility = layerConfig.visible ? "visible" : "none";
          mapRef.current.setLayoutProperty(
            mapboxLayerId,
            "visibility",
            visibility
          );

          console.log(`Set ${mapboxLayerId} on ${mapId} to ${visibility}`);
        }
      });
    });
  }, [activeLayers, mapsInitialized]);

  return null;
}

/* 
TODO: FUTURE REFACTOR IDEAS
- Replace LAYER_MAPPING with self-registering layers
- Each layer component registers its own mapbox IDs
- Move to event-driven architecture instead of useEffect polling
- Add support for opacity, blend modes, z-index
*/
