import { useEffect } from "react";

export default function NitrogenDioxideLayer({ data, mapRefs }) {
  console.log("mapRefs structure:", mapRefs);

  useEffect(() => {
    if (mapRefs && mapRefs.mapA && mapRefs.mapC) {
      console.log("Adding NO2-WMS layer to map A & C");

      const wmsUrl =
        "https://geoservice.dlr.de/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_NO2_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefs.mapA.isStyleLoaded()) {
        if (!mapRefs.mapA.getSource("no2-source-a"))
          mapRefs.mapA.addSource("no2-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapA.addLayer({
          id: "no2-layer-a",
          type: "raster",
          source: "no2-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefs.mapC.isStyleLoaded()) {
        if (!mapRefs.mapC.getSource("no2-source-c"))
          mapRefs.mapC.addSource("no2-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapC.addLayer({
          id: "no2-layer-c",
          type: "raster",
          source: "no2-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefs.mapA) {
        if (mapRefs.mapA.getLayer("no2-layer-a")) {
          mapRefs.mapA.removeLayer("no2-layer-a");
        }
        if (mapRefs.mapA.getSource("no2-source-a")) {
          mapRefs.mapA.removeSource("no2-source-a");
        }
      }
      if (mapRefs.mapC) {
        if (mapRefs.mapC.getLayer("no2-layer-c")) {
          mapRefs.mapC.removeLayer("no2-layer-c");
        }
        if (mapRefs.mapC.getSource("no2-source-c")) {
          mapRefs.mapC.removeSource("no2-source-c");
        }
      }
    };
  }, [mapRefs]);

  return null;
}
