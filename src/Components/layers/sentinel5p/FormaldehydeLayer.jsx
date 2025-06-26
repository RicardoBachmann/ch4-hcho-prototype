import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";

export default function FormaldehydeLayer() {
  const { mapRefA, mapRefC, mapsInitialized } = useContext(MapContext);

  useEffect(() => {
    console.log("HCHO Layer: mapsInitialized =", mapsInitialized);
    console.log("HCHO Layer: mapRefA exists =", !!mapRefA.current);
    console.log(
      "HCHO Layer: mapRefA style loaded =",
      mapRefA.current?.isStyleLoaded()
    );

    if (!mapsInitialized || !mapRefA.current?.isStyleLoaded()) return;

    console.log("Creating HCHO layers!");
    const wmsUrl =
      "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";
    // MAP A
    if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
      if (!mapRefA.current.getSource("HCHO-source-a"))
        mapRefA.current.addSource("HCHO-source-a", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("HCHO-layer-a")) {
        mapRefA.current.addLayer({
          id: "HCHO-layer-a",
          type: "raster",
          source: "HCHO-source-a",
          layout: { visibility: "none" },
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }

    // MAP C
    if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
      if (!mapRefC.current.getSource("HCHO-source-c"))
        mapRefC.current.addSource("HCHO-source-c", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("HCHO-layer-c")) {
        mapRefC.current.addLayer({
          id: "HCHO-layer-c",
          type: "raster",
          source: "HCHO-source-c",
          layout: { visibility: "none" },
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }

    // Clean up
    return () => {
      if (mapRefA.current) {
        if (mapRefA.current.getLayer("HCHO-layer-a")) {
          mapRefA.current.removeLayer("HCHO-layer-a");
        }
        if (mapRefA.current.getSource("HCHO-source-a")) {
          mapRefA.current.removeSource("HCHO-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("HCHO-layer-c")) {
          mapRefC.current.removeLayer("HCHO-layer-c");
        }
        if (mapRefC.current.getSource("HCHO-source-c")) {
          mapRefC.current.removeSource("HCHO-source-c");
        }
      }
    };
  }, [mapsInitialized]);
  return null;
}
