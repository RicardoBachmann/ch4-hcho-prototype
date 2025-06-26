import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";

export default function AerosolIndexLayer() {
  const { mapRefA, mapRefC, mapsInitialized } = useContext(MapContext);

  useEffect(() => {
    console.log("AI Layer: mapsInitialized =", mapsInitialized);
    console.log("AI Layer: mapRefA exists =", !!mapRefA.current);
    console.log(
      "AI Layer: mapRefA style loaded =",
      mapRefA.current?.isStyleLoaded()
    );

    if (!mapsInitialized || !mapRefA.current || !mapRefC.current) return;
    if (!mapRefA.current.isStyleLoaded() || !mapRefC.current.isStyleLoaded())
      return;
    console.log("Creating AI layers!");
    const wmsUrl =
      "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_AI&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";
    // MAP A
    if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
      if (!mapRefA.current.getSource("AI-source-a"))
        mapRefA.current.addSource("AI-source-a", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("AI-layer-a")) {
        mapRefA.current.addLayer({
          id: "AI-layer-a",
          type: "raster",
          source: "AI-source-a",
          layout: { visibility: "none" },
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }

    // MAP C
    if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
      if (!mapRefC.current.getSource("AI-source-c"))
        mapRefC.current.addSource("AI-source-c", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefC.current.getLayer("AI-layer-c")) {
        mapRefC.current.addLayer({
          id: "AI-layer-c",
          type: "raster",
          source: "AI-source-c",
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
        if (mapRefA.current.getLayer("AI-layer-a")) {
          mapRefA.current.removeLayer("AI-layer-a");
        }
        if (mapRefA.current.getSource("AI-source-a")) {
          mapRefA.current.removeSource("AI-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("AI-layer-c")) {
          mapRefC.current.removeLayer("AI-layer-c");
        }
        if (mapRefC.current.getSource("AI-source-c")) {
          mapRefC.current.removeSource("AI-source-c");
        }
      }
    };
  }, [
    mapsInitialized,
    mapRefA.current?.isStyleLoaded(),
    mapRefC.current?.isStyleLoaded(),
  ]);
  return null;
}
