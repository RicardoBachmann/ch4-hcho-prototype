import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";
import { useSentinelData } from "../../../hooks/useSentinelData";

export default function FormaldehydeLayer() {
  const { mapRefA, mapRefB, mapRefC, mapsInitialized } = useContext(MapContext);
  const { collectionData } = useSentinelData();

  useEffect(() => {
    if (
      !mapsInitialized ||
      !mapRefA.current ||
      !mapRefB.current ||
      !mapRefC.current
    )
      return;

    const waitAndCreate = () => {
      if (
        mapRefA.current?.isStyleLoaded() &&
        mapRefB.current?.isStyleLoaded() &&
        mapRefC.current?.isStyleLoaded()
      ) {
        console.log("HCHO Layer: Creating layer");
        createHCHOLayer();
      } else {
        console.log("HCHO Layer: Waiting for styles...");
        setTimeout(waitAndCreate, 100);
      }
    };
    waitAndCreate();

    console.log("Dataflow:", collectionData);

    function createHCHOLayer() {
      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      // Map A
      mapRefA.current.addSource("HCHO-source-a", {
        type: "raster",
        tiles: [wmsUrl],
        tileSize: 256,
      });

      mapRefA.current.addLayer({
        id: "HCHO-layer-a",
        type: "raster",
        source: "HCHO-source-a",
        layout: { visibility: "none" },
        paint: { "raster-opacity": 0.7 },
      });

      // Map B
      mapRefB.current.addSource("HCHO-source-b", {
        type: "raster",
        tiles: [wmsUrl],
        tileSize: 256,
      });

      mapRefB.current.addLayer({
        id: "HCHO-layer-b",
        type: "raster",
        source: "HCHO-source-b",
        layout: { visibility: "none" },
        paint: { "raster-opacity": 0.7 },
      });

      // Map C
      mapRefC.current.addSource("HCHO-source-c", {
        type: "raster",
        tiles: [wmsUrl],
        tileSize: 256,
      });

      mapRefC.current.addLayer({
        id: "HCHO-layer-c",
        type: "raster",
        source: "HCHO-source-c",
        layout: { visibility: "none" },
        paint: { "raster-opacity": 0.7 },
      });

      console.log("HCHO layers A/B/C created");
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
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("HCHO-layer-b")) {
          mapRefB.current.removeLayer("HCHO-layer-b");
        }
        if (mapRefB.current.getSource("HCHO-source-b")) {
          mapRefB.current.removeSource("HCHO-source-b");
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
