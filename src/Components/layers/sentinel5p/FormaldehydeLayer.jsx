import { useEffect, useContext } from "react";
import { MapContext } from "../../../context/MapContext";

export default function FormaldehydeLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);

  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current) return;

    const waitAndCreate = () => {
      if (mapRefB.current?.isStyleLoaded()) {
        console.log("HCHO Layer mapB: Creating layer");
        createHCHOLayer();
      } else {
        console.log("HCHO Layer mapB: Waiting for styles...");
        setTimeout(waitAndCreate, 100);
      }
    };
    waitAndCreate();

    function createHCHOLayer() {
      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

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
    }
    // Clean up
    return () => {
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("HCHO-layer-b")) {
          mapRefB.current.removeLayer("HCHO-layer-b");
        }
        if (mapRefB.current.getSource("HCHO-source-b")) {
          mapRefB.current.removeSource("HCHO-source-b");
        }
      }
    };
  }, [mapsInitialized]);

  return null;
}

// WMS layer component for HCHO visualization on Map B
// waitAndCreate: isStyleLoaded() checks until Style is ready → Create layer (Mapbox loads asynchron)
// Layer Type: Raster tiles with 70% opacity
// Handles: DLR atmosphere service integration, layer creation, cleanup
