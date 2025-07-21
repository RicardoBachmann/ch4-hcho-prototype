import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";

export default function HchoLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);

  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current) return;

    const waitAndCreate = () => {
      if (mapRefB.current?.isStyleLoaded()) {
        console.log("HCHO-Layer mapB: Creating layer");
        createHCHOLayer();
      } else {
        console.log("HCHO-Layer mapB: Waiting for styles...");
        setTimeout(waitAndCreate, 100);
      }
    };
    waitAndCreate();

    function createHCHOLayer() {
      const wmtsUrl =
        "https://services.terrascope.be/wmts/v2?layer=TERRASCOPE_S5P_L3_HCHO_TD_V2&style=&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:3857:{z}&TileCol={x}&TileRow={y}&TIME=2025-07-19";

      // Map B
      mapRefB.current.addSource("HCHO-source", {
        type: "raster",
        tiles: [wmtsUrl],
        tileSize: 256,
      });

      mapRefB.current.addLayer({
        id: "HCHO-layer",
        type: "raster",
        source: "HCHO-source",
        paint: {
          layout: { visibility: "none" },
          paint: { "raster-opacity": 0.3 },
        },
      });

      return () => {
        if (mapRefB.current) {
          if (mapRefB.current.getLayer("HCHO-layer")) {
            mapRefB.current.removeLayer("HCHO-layer");
          }
          if (mapRefB.current.getSource("HCHO-source")) {
            mapRefB.current.removeSource("HCHO-source");
          }
        }
      };
    }
    createHCHOLayer();
  }, [mapRefB, mapsInitialized]);

  return null;
}
