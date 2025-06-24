import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function OzoneLayer() {
  const { mapRefA, mapRefC } = useContext(MapContext);

  useEffect(() => {
    if (mapRefA && mapRefC) {
      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_O3&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
        if (!mapRefA.current.getSource("o3-source-a"))
          mapRefA.current.addSource("o3-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.current.addLayer({
          id: "o3-layer-a",
          type: "raster",
          source: "o3-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
        if (!mapRefC.current.getSource("o3-source-c"))
          mapRefC.current.addSource("o3-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.current.addLayer({
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
      if (mapRefA.current) {
        if (mapRefA.current.getLayer("o3-layer-a")) {
          mapRefA.current.removeLayer("o3-layer-a");
        }
        if (mapRefA.current.getSource("o3-source-a")) {
          mapRefA.current.removeSource("o3-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("o3-layer-c")) {
          mapRefC.current.removeLayer("o3-layer-c");
        }
        if (mapRefC.current.getSource("o3-source-c")) {
          mapRefC.current.removeSource("o3-source-c");
        }
      }
    };
  }, [mapRefA, mapRefC]);

  return null;
}
