import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function FormaldehydeLayer() {
  const { mapRefA, mapRefC } = useContext(MapContext);

  useEffect(() => {
    if (mapRefA && mapRefC) {
      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      // Layer components now get .current from the refs
      if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
        if (!mapRefA.current.getSource("hcho-source-a"))
          mapRefA.current.addSource("hcho-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.current.addLayer({
          id: "hcho-layer-a",
          type: "raster",
          source: "hcho-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }

      //Map C
      if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
        if (!mapRefC.current.getSource("hcho-source-c"))
          mapRefC.current.addSource("hcho-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.current.addLayer({
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
      if (mapRefA.current) {
        if (mapRefA.current.getLayer("hcho-layer-a")) {
          mapRefA.current.removeLayer("hcho-layer-a");
        }
        if (mapRefA.current.getSource("hcho-source-a")) {
          mapRefA.current.removeSource("hcho-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("hcho-layer-c")) {
          mapRefC.current.removeLayer("hcho-layer-c");
        }
        if (mapRefC.current.getSource("hcho-source-c")) {
          mapRefC.current.removeSource("hcho-source-c");
        }
      }
    };
  }, [mapRefA, mapRefC]);

  return null;
}
