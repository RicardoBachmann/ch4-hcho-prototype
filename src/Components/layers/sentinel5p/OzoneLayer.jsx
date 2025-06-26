import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";

export default function OzoneLayer() {
  const { mapRefA, mapRefC, mapsInitialized } = useContext(MapContext);

  useEffect(() => {
    console.log("O3 Layer: mapsInitialized =", mapsInitialized);
    console.log("O3 Layer: mapRefA exists =", !!mapRefA.current);
    console.log(
      "O3 Layer: mapRefA style loaded =",
      mapRefA.current?.isStyleLoaded()
    );

    if (!mapsInitialized || !mapRefA.current?.isStyleLoaded()) return;

    console.log("Creating O3 layers!");
    const wmsUrl =
      "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1O3&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";
    // MAP A
    if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
      if (!mapRefA.current.getSource("O3-source-a"))
        mapRefA.current.addSource("O3-source-a", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("O3-layer-a")) {
        mapRefA.current.addLayer({
          id: "O3-layer-a",
          type: "raster",
          source: "O3-source-a",
          layout: { visibility: "none" },
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }

    // MAP C
    if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
      if (!mapRefC.current.getSource("O3-source-c"))
        mapRefC.current.addSource("O3-source-c", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("O3-layer-c")) {
        mapRefC.current.addLayer({
          id: "O3-layer-c",
          type: "raster",
          source: "O3-source-c",
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
        if (mapRefA.current.getLayer("O3-layer-a")) {
          mapRefA.current.removeLayer("O3-layer-a");
        }
        if (mapRefA.current.getSource("O3-source-a")) {
          mapRefA.current.removeSource("O3-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("O3-layer-c")) {
          mapRefC.current.removeLayer("O3-layer-c");
        }
        if (mapRefC.current.getSource("O3-source-c")) {
          mapRefC.current.removeSource("O3-source-c");
        }
      }
    };
  }, [mapsInitialized]);
  return null;
}
