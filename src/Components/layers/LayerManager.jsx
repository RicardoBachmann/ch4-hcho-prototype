import { useContext, useEffect } from "react";
import { MapContext } from "../../context/MapContext";

export default function LayerManager() {
  const { mapRefA, mapRefB, mapRefC, mapsInitialized, activeMapLayers } =
    useContext(MapContext);

  // Visibility Control
  useEffect(() => {
    if (!mapsInitialized) return;

    // Map A
    if (mapRefA.current?.getLayer("HCHO-layer-a")) {
      const visibilityA = activeMapLayers.mapA === "HCHO" ? "visible" : "none";
      mapRefA.current.setLayoutProperty(
        "HCHO-layer-a",
        "visibility",
        visibilityA
      );
    }

    // Map B
    if (mapRefB.current?.getLayer("HCHO-layer-b")) {
      const visibilityB = activeMapLayers.mapB === "HCHO" ? "visible" : "none";
      mapRefB.current.setLayoutProperty(
        "HCHO-layer-b",
        "visibility",
        visibilityB
      );
    }

    // Map C
    if (mapRefC.current?.getLayer("HCHO-layer-c")) {
      const visibilityC = activeMapLayers.mapC === "HCHO" ? "visible" : "none";
      mapRefC.current.setLayoutProperty(
        "HCHO-layer-c",
        "visibility",
        visibilityC
      );
    }
  }, [activeMapLayers, mapsInitialized]);

  return null;
}
