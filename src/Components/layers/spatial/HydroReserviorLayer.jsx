import { useEffect, useContext } from "react";

import { useHydroReservoirData } from "../../../hooks/useHydroReservoirData";
import { MapContext } from "../../../context/MapContext";

export default function HydroReservoirLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { hydroReservoirData } = useHydroReservoirData();

  useEffect(() => {
    if (!mapRefB || !mapsInitialized || !hydroReservoirData) return;

    console.log("Hydro Reservoirs data flow:", hydroReservoirData);
    console.log(hydroReservoirData.features.length);
    console.log(
      "Hydro Reservoirs type:",
      hydroReservoirData.features[0].geometry.type
    );

    mapRefB.current.addSource("hydro-reservoirs", {
      type: "geojson",
      data: hydroReservoirData,
    });

    mapRefB.current.addLayer({
      id: "hydro-reservoirs-polygons",
      source: "hydro-reservoirs",
      type: "fill",
      paint: {
        "fill-color": "lime",
        "fill-opacity": 0.6,
      },
    });

    // Cleanup for Layer & Source
    return () => {
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("hydro-reservoirs-polygons")) {
          mapRefB.current.removeLayer("hydro-reservoirs-polygons");
        }
        if (mapRefB.current.getSource("hydro-reservoirs")) {
          mapRefB.current.removeSource("hydro-reservoirs");
        }
      }
    };
  }, [mapRefB, mapsInitialized, hydroReservoirData]);

  return null;
}

// Tropical Hydro-Reservoirs
