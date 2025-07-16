import { useEffect, useContext } from "react";

import { useTropicalDamData } from "../../../hooks/useTropicalDamData";
import { MapContext } from "../../../context/MapContext";

export default function DamLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { damData } = useTropicalDamData(); // Add loading, error states for control panel UI

  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !damData) return;

    mapRefB.current.addSource("dams", {
      type: "geojson",
      data: damData,
    });

    mapRefB.current.addLayer({
      id: "dam-points",
      source: "dams",
      type: "circle",
      paint: {
        "circle-radius": 5,
        "circle-color": "red",
      },
    });

    return () => {
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("dam-points")) {
          mapRefB.current.removeLayer("dam-points");
        }

        if (mapRefB.current.getSource("dams")) {
          mapRefB.current.removeSource("dams");
        }
      }
    };
  }, [damData, mapRefB, mapsInitialized]);
  return null;
}

// Tropical Hydro-dams GeoJSON Layer
// Renders 403 tropical dam locations as optimized GeoJSON layer
// Data source: /data/hydropower-tropical-dams.geojson
