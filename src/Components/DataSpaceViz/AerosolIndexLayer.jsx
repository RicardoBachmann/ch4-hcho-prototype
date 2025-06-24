import { useEffect } from "react";

export default function AerosolIndexLayer() {
  useEffect(() => {
    if (mapRefA && mapRefC) {
      console.log("Adding AI-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_AI&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.isStyleLoaded()) {
        if (!mapRefA.getSource("ai-source-a"))
          mapRefs.mapA.addSource("ai-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.addLayer({
          id: "ai-layer-a",
          type: "raster",
          source: "ai-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefC.isStyleLoaded()) {
        if (!mapRefC.getSource("ai-source-c"))
          mapRefC.addSource("ai-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.addLayer({
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
      if (mapRefA) {
        if (mapRefA.getLayer("ai-layer-a")) {
          mapRefA.removeLayer("ai-layer-a");
        }
        if (mapRefA.getSource("ai-source-a")) {
          mapRefA.removeSource("ai-source-a");
        }
      }
      if (mapRefC) {
        if (mapRefC.getLayer("ai-layer-c")) {
          mapRefC.removeLayer("ai-layer-c");
        }
        if (mapRefC.getSource("ai-source-c")) {
          mapRefC.removeSource("ai-source-c");
        }
      }
    };
  }, [mapRefA, mapRefC]);

  return null;
}
