import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function FormaldehydeLayer() {
  const { mapRefA, mapRefB, mapRefC } = useContext(MapContext);

  useEffect(() => {
    if (mapRefA && mapRefB && mapRefC) {
      console.log("Adding HCHO-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.isStyleLoaded()) {
        if (!mapRefA.getSource("hcho-source-a"))
          mapRefA.addSource("hcho-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.addLayer({
          id: "hcho-layer-a",
          type: "raster",
          source: "hcho-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }

      //Map C
      if (mapRefC.isStyleLoaded()) {
        if (!mapRefC.getSource("hcho-source-c"))
          mapRefC.addSource("hcho-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.addLayer({
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
      if (mapRefA) {
        if (mapRefA.getLayer("hcho-layer-a")) {
          mapRefA.removeLayer("hcho-layer-a");
        }
        if (mapRefA.getSource("hcho-source-a")) {
          mapRefA.removeSource("hcho-source-a");
        }
      }
      if (mapRefC) {
        if (mapRefC.getLayer("hcho-layer-c")) {
          mapRefC.removeLayer("hcho-layer-c");
        }
        if (mapRefC.getSource("hcho-source-c")) {
          mapRefC.removeSource("hcho-source-c");
        }
      }
    };
  }, [mapRefA, mapRefC]);

  return null;
}
