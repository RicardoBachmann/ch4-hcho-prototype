/*import { useEffect } from "react";

export default function FormaldehydeLayer({ mapRefs }) {
  console.log("mapRefs structure:", mapRefs);

  useEffect(() => {
    if (mapRefs && mapRefs.mapA && mapRefs.mapC) {
      console.log("Adding HCHO-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0&TIME=2025-06-09";

      //Map A
      if (mapRefs.mapA.isStyleLoaded()) {
        if (!mapRefs.mapA.getSource("hcho-source-a"))
          mapRefs.mapA.addSource("hcho-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapA.addLayer({
          id: "hcho-layer-a",
          type: "raster",
          source: "hcho-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }

      //Map C
      if (mapRefs.mapC.isStyleLoaded()) {
        if (!mapRefs.mapC.getSource("hcho-source-c"))
          mapRefs.mapC.addSource("hcho-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapC.addLayer({
          id: "hcho-layer-c",
          type: "raster",
          source: "hcho-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefs.mapA) {
        if (mapRefs.mapA.getLayer("hcho-layer-a")) {
          mapRefs.mapA.removeLayer("hcho-layer-a");
        }
        if (mapRefs.mapA.getSource("hcho-source-a")) {
          mapRefs.mapA.removeSource("hcho-source-a");
        }
      }
      if (mapRefs.mapC) {
        if (mapRefs.mapC.getLayer("hcho-layer-c")) {
          mapRefs.mapC.removeLayer("hcho-layer-c");
        }
        if (mapRefs.mapC.getSource("hcho-source-c")) {
          mapRefs.mapC.removeSource("hcho-source-c");
        }
      }
    };
  }, [mapRefs]);

  return null;
}
*/
