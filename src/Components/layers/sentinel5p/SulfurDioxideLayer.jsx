import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";

export default function SulfurDioxideLayer() {
  const { mapRefA, mapRefC, mapsInitialized } = useContext(MapContext);

  useEffect(() => {
    console.log("SO2 Layer: mapsInitialized =", mapsInitialized);
    console.log("SO2 Layer: mapRefA exists =", !!mapRefA.current);
    console.log(
      "SO2 Layer: mapRefA style loaded =",
      mapRefA.current?.isStyleLoaded()
    );

    if (!mapsInitialized || !mapRefA.current || !mapRefC.current) return;
    if (!mapRefA.current.isStyleLoaded() || !mapRefC.current.isStyleLoaded())
      return;

    console.log("Creating SO2 layers!");
    const wmsUrl =
      "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_SO2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";
    // MAP A
    if (mapRefA.current && mapRefA.current.isStyleLoaded()) {
      if (!mapRefA.current.getSource("SO2-source-a"))
        mapRefA.current.addSource("SO2-source-a", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("SO2-layer-a")) {
        mapRefA.current.addLayer({
          id: "SO2-layer-a",
          type: "raster",
          source: "SO2-source-a",
          layout: { visibility: "none" },
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }

    // MAP C
    if (mapRefC.current && mapRefC.current.isStyleLoaded()) {
      if (!mapRefC.current.getSource("SO2-source-c"))
        mapRefC.current.addSource("SO2-source-c", {
          type: "raster",
          tiles: [wmsUrl],
          tileSize: 256,
        });
      if (!mapRefA.current.getLayer("SO2-layer-c")) {
        mapRefC.current.addLayer({
          id: "SO2-layer-c",
          type: "raster",
          source: "SO2-source-c",
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
        if (mapRefA.current.getLayer("SO2-layer-a")) {
          mapRefA.current.removeLayer("SO2-layer-a");
        }
        if (mapRefA.current.getSource("SO2-source-a")) {
          mapRefA.current.removeSource("SO2-source-a");
        }
      }
      if (mapRefC.current) {
        if (mapRefC.current.getLayer("SO2-layer-c")) {
          mapRefC.current.removeLayer("SO2-layer-c");
        }
        if (mapRefC.current.getSource("SO2-source-c")) {
          mapRefC.current.removeSource("SO2-source-c");
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
