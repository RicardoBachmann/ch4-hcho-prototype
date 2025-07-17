import { useContext, useEffect } from "react";

import useWaterbodyGlwd3 from "../../../hooks/useWaterbodyGlwd3";
import { MapContext } from "../../../context/MapContext";

export default function WaterbodyLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { waterbodyGlwd3 } = useWaterbodyGlwd3();

  useEffect(() => {
    if (!mapRefB?.current || !mapsInitialized || !waterbodyGlwd3) return;

    mapRefB.current.addSource("waterbody-area", {
      type: "geojson",
      data: waterbodyGlwd3,
    });

    mapRefB.current.addLayer({
      id: "waterbody-polygons",
      source: "waterbody-area",
      type: "fill",
      paint: {
        "fill-color": "#ef4444",
        "fill-opacity": 0.8,
      },
    });

    return () => {
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("waterbody-polygons")) {
          mapRefB.current.removeLayer("waterbody-polygons");
        }
        if (mapRefB.current.getSource("waterbody-area")) {
          mapRefB.current.removeSource("waterbody-area");
        }
      }
    };
  }, [mapRefB, mapsInitialized, waterbodyGlwd3]);

  return null;
}
