import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function SulfurDioxide() {
  const { mapRefA, mapRefC } = useContext(MapContext);
  useEffect(() => {
    if (mapRefA && mapRefC) {
      console.log("Adding SO2-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_SO2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.isStyleLoaded()) {
        if (!mapRefA.getSource("so2-source-a"))
          mapRefA.addSource("so2-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.addLayer({
          id: "so2-layer-a",
          type: "raster",
          source: "so2-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }

      //Map C
      if (mapRefC.isStyleLoaded()) {
        if (!mapRefC.getSource("so2-source-c"))
          mapRefC.addSource("so2-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.addLayer({
          id: "so2-layer-c",
          type: "raster",
          source: "so2-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefA) {
        if (mapRefA.getLayer("so2-layer-a")) {
          mapRefA.removeLayer("so2-layer-a");
        }
        if (mapRefA.getSource("so2-source-a")) {
          mapRefA.removeSource("so2-source-a");
        }
      }
      if (mapRefC) {
        if (mapRefC.getLayer("so2-layer-c")) {
          mapRefC.removeLayer("so2-layer-c");
        }
        if (mapRefC.getSource("so2-source-c")) {
          mapRefC.removeSource("so2-source-c");
        }
      }
    };
  }, []);

  return null;
}
