import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function AerosolIndexLayer() {
  const { mapRefA, mapRefC } = useContext(MapContext);
  useEffect(() => {
    if (mapRefA && mapRefC) {
      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_AI&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
        if (!mapRefA.current.getSource("ai-source-a"))
          mapRefA.current.addSource("ai-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.current.addLayer({
          id: "ai-layer-a",
          type: "raster",
          source: "ai-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
        if (!mapRefC.current.getSource("ai-source-c"))
          mapRefC.current.addSource("ai-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.current.addLayer({
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
      if (mapRefA.current) {
        if (mapRefA.current.getLayer("ai-layer-a")) {
          mapRefA.current.removeLayer("ai-layer-a");
        }
        if (mapRefA.current.getSource("ai-source-a")) {
          mapRefA.current.removeSource("ai-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("ai-layer-c")) {
          mapRefC.current.removeLayer("ai-layer-c");
        }
        if (mapRefC.current.getSource("ai-source-c")) {
          mapRefC.current.removeSource("ai-source-c");
        }
      }
    };
  }, [mapRefA, mapRefC]);

  return null;
}
