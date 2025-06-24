import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function SulfurDioxide() {
  const { mapRefA, mapRefC } = useContext(MapContext);
  useEffect(() => {
    if (mapRefA && mapRefC) {
      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_SO2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
        if (!mapRefA.current.getSource("so2-source-a"))
          mapRefA.current.addSource("so2-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.current.addLayer({
          id: "so2-layer-a",
          type: "raster",
          source: "so2-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }

      //Map C
      if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
        if (!mapRefC.current.getSource("so2-source-c"))
          mapRefC.current.addSource("so2-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.current.addLayer({
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
      if (mapRefA.current) {
        if (mapRefA.current.getLayer("so2-layer-a")) {
          mapRefA.current.removeLayer("so2-layer-a");
        }
        if (mapRefA.current.getSource("so2-source-a")) {
          mapRefA.current.removeSource("so2-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("so2-layer-c")) {
          mapRefC.current.removeLayer("so2-layer-c");
        }
        if (mapRefC.current.getSource("so2-source-c")) {
          mapRefC.current.removeSource("so2-source-c");
        }
      }
    };
  }, [mapRefA, mapRefC]);

  return null;
}
