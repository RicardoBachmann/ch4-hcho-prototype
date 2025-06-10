import { useEffect } from "react";

export default function AerosolIndexLayer({ data, mapRefs }) {
  console.log("mapRefs structure:", mapRefs);

  useEffect(() => {
    if (mapRefs && mapRefs.mapA && mapRefs.mapC) {
      console.log("Adding AI-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_AI&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefs.mapA.isStyleLoaded()) {
        if (!mapRefs.mapA.getSource("ai-source-a"))
          mapRefs.mapA.addSource("ai-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapA.addLayer({
          id: "ai-layer-a",
          type: "raster",
          source: "ai-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefs.mapC.isStyleLoaded()) {
        if (!mapRefs.mapC.getSource("ai-source-c"))
          mapRefs.mapC.addSource("ai-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapC.addLayer({
          id: "ai-layer-c",
          type: "raster",
          source: "ai-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefs.mapA) {
        if (mapRefs.mapA.getLayer("ai-layer-a")) {
          mapRefs.mapA.removeLayer("ai-layer-a");
        }
        if (mapRefs.mapA.getSource("ai-source-a")) {
          mapRefs.mapA.removeSource("ai-source-a");
        }
      }
      if (mapRefs.mapC) {
        if (mapRefs.mapC.getLayer("ai-layer-c")) {
          mapRefs.mapC.removeLayer("ai-layer-c");
        }
        if (mapRefs.mapC.getSource("ai-source-c")) {
          mapRefs.mapC.removeSource("ai-source-c");
        }
      }
    };
  }, [mapRefs]);

  return null;
}
