import React, { useEffect } from "react";
export default function FormaldehydeLayer({ mapRefs }) {
  useEffect(() => {
    if (!mapRefs || !mapRefs.mapA) return;

    console.log("Adding Formaldehyde layer to map A ");

    const map = mapRefs.mapA;

    if (map.getSource("hcho-source")) {
      map.removeLayer("hcho-layer");
      map.removeSource("hcho-source");
    }
    map.addSource("hcho-source", {
      type: "raster",
      tiles: ["https://maps.s5p-pal.com/hcho/year/{z}/{x}/{y}.png"],
      titleSize: 256,
    });
    map.addLayer({
      id: "hcho-layer",
      type: "raster",
      source: "hcho-source",
      paint: { "raster-opacity": 0.7 },
    });

    return () => {
      if (map.getSource("hcho-source")) {
        map.removeLayer("hcho-layer");
        map.removeSource("hcho-source");
      }
    };
  }, [mapRefs]);

  return null;
}
