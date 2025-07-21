import { useContext, useEffect } from "react";

import useWaterbodyGlwd3 from "../../../hooks/useWaterbodyGlwd3";
import { MapContext } from "../../../context/MapContext";

export default function WaterbodyLayer() {
  const { mapRefB, mapRefA, mapsInitialized } = useContext(MapContext);
  const { waterbodyGlwd3 } = useWaterbodyGlwd3();

  useEffect(() => {
    if (
      !mapRefA?.current ||
      !mapRefB?.current ||
      !mapsInitialized ||
      !waterbodyGlwd3
    )
      return;

    const layerConfig = {
      id: "waterbody-polygons",
      source: "waterbody-area",
      type: "fill",
      paint: {
        "fill-color": [
          "match",
          ["get", "DN"], //GLWD-Attribut
          1,
          "#2563eb", // Lake - blue
          4,
          "#16a34a", // Freshwater Marsh - green (Methan!)
          5,
          "#065f46", // Swamp Forest - dark green (Amazonas!)
          8,
          "#7c2d12", // Bog/Peatland - brown (CH4-Bomber!)
          "#64748b", // Default grey
        ],
        "fill-opacity": 0.7,
      },
    };

    const sourceConfig = {
      type: "geojson",
      data: waterbodyGlwd3,
    };

    // Add to both Maps(A&B)
    [mapRefA, mapRefB].forEach((mapRef) => {
      mapRef.current.addSource("waterbody-area", sourceConfig);
      mapRef.current.addLayer(layerConfig);
    });

    return () => {
      [mapRefA, mapRefB].forEach((mapRef) => {
        if (mapRef.current) {
          if (mapRef.current.getLayer("waterbody-polygons")) {
            mapRef.current.removeLayer("waterbody-polygons");
          }
          if (mapRef.current.getLayer("waterbody-polygons")) {
            mapRef.current.removeLayer("waterbody-polygons");
          }
        }
      });
    };
  }, [mapRefB, mapRefA, mapsInitialized, waterbodyGlwd3]);

  return null;
}

// Renders waterbody polygons on both map instances (A & B) with DN-based color coding
