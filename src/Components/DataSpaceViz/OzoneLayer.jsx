import { useEffect } from "react";

export default function OzoneLayer({ data, mapRefs }) {
  console.log("mapRefs structure:", mapRefs);

  useEffect(() => {
    if (mapRefs && mapRefs.mapA && mapRefs.mapC) {
      console.log("Adding O3-WMS layer to map A & C");

      const wmsUrl =
        "https://geoservice.dlr.de/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_O3_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefs.mapA.isStyleLoaded()) {
        if (!mapRefs.mapA.getSource("o3-source-a"))
          mapRefs.mapA.addSource("o3-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapA.addLayer({
          id: "o3-layer-a",
          type: "raster",
          source: "o3-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefs.mapC.isStyleLoaded()) {
        if (!mapRefs.mapC.getSource("o3-source-c"))
          mapRefs.mapC.addSource("o3-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapC.addLayer({
          id: "o3-layer-c",
          type: "raster",
          source: "o3-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefs.mapA) {
        if (mapRefs.mapA.getLayer("o3-layer-a")) {
          mapRefs.mapA.removeLayer("o3-layer-a");
        }
        if (mapRefs.mapA.getSource("o3-source-a")) {
          mapRefs.mapA.removeSource("o3-source-a");
        }
      }
      if (mapRefs.mapC) {
        if (mapRefs.mapC.getLayer("o3-layer-c")) {
          mapRefs.mapC.removeLayer("o3-layer-c");
        }
        if (mapRefs.mapC.getSource("o3-source-c")) {
          mapRefs.mapC.removeSource("o3-source-c");
        }
      }
    };
  }, [mapRefs]);

  return null;
}
