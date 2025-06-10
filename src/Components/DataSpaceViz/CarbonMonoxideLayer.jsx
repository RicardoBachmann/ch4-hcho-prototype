import { useEffect } from "react";

export default function CarbonMonoxideLayer({ data, mapRefs }) {
  console.log("mapRefs structure:", mapRefs);

  useEffect(() => {
    if (mapRefs && mapRefs.mapA && mapRefs.mapC) {
      console.log("Adding CO-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_CO&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefs.mapA.isStyleLoaded()) {
        if (!mapRefs.mapA.getSource("co-source-a"))
          mapRefs.mapA.addSource("co-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapA.addLayer({
          id: "co-layer-a",
          type: "raster",
          source: "co-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefs.mapC.isStyleLoaded()) {
        if (!mapRefs.mapC.getSource("co-source-c"))
          mapRefs.mapC.addSource("co-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapC.addLayer({
          id: "co-layer-c",
          type: "raster",
          source: "co-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefs.mapA) {
        if (mapRefs.mapA.getLayer("co-layer-a")) {
          mapRefs.mapA.removeLayer("co-layer-a");
        }
        if (mapRefs.mapA.getSource("co-source-a")) {
          mapRefs.mapA.removeSource("co-source-a");
        }
      }
      if (mapRefs.mapC) {
        if (mapRefs.mapC.getLayer("co-layer-c")) {
          mapRefs.mapC.removeLayer("co-layer-c");
        }
        if (mapRefs.mapC.getSource("co-source-c")) {
          mapRefs.mapC.removeSource("co-source-c");
        }
      }
    };
  }, [mapRefs]);

  return null;
}
