import { useEffect, useContext } from "react";

import { useHydroBarrierData } from "../../../hooks/useHydroBarrierData";
import { MapContext } from "../../../context/MapContext";

export default function DamLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { barrierData } = useHydroBarrierData(); // Add loading, error states for control panel UI

  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !barrierData) return;

    mapRefB.current.addSource("hydro-barriers", {
      type: "geojson",
      data: barrierData,
    });

    mapRefB.current.addLayer({
      id: "barrier-points",
      source: "hydro-barriers",
      type: "circle",
      paint: {
        "circle-radius": 5,
        "circle-color": "red",
      },
    });

    return () => {
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("barrier-points")) {
          mapRefB.current.removeLayer("barrier-points");
        }

        if (mapRefB.current.getSource("hydro-barriers")) {
          mapRefB.current.removeSource("hydro-barriers");
        }
      }
    };
  }, [barrierData, mapRefB, mapsInitialized]);
  return null;
}

// Tropical Hydro-barriers GeoJSON Layer
// Renders 219 tropical dam barrier points as optimized GeoJSON layer
// Data source: /data/hydropower_barriers_gdw_2024.geojson
