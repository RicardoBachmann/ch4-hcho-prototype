import { useContext, useEffect } from "react";
import { MapContext } from "../../context/MapContext";

/*

import FormaldehydeLayer from "./sentinel5p/FormaldehydeLayer";
import AerosolIndexLayer from "./sentinel5p/AerosolIndexLayer";
import SulfurDioxideLayer from "./sentinel5p/SulfurDioxideLayer";
import OzoneLayer from "./sentinel5p/OzoneLayer";

export default function LayerManager() {
  const { mapRefA, mapRefC, mapsInitialized, activeMapLayers } =
    useContext(MapContext);

  useEffect(() => {
    if (!mapsInitialized || !mapRefA.current || !mapRefC.current) return;
    console.log("Updating visibility:", activeMapLayers);
    if (!mapRefA.current.isStyleLoaded() || !mapRefC.current.isStyleLoaded())
      return;

    updateVisibility(mapRefA.current, "a", activeMapLayers.mapA);
    updateVisibility(mapRefC.current, "c", activeMapLayers.mapC);
  }, [activeMapLayers, mapsInitialized, mapRefA, mapRefC]);

  function updateVisibility(map, mapId, activeLayer) {
    const allLayers = ["HCHO", "SO2", "O3", "AI"];

    allLayers.forEach((layer) => {
      const layerId = `${layer}-layer-${mapId}`;
      if (map.getLayer(layerId)) {
        const visibility = activeLayer === layer ? "visible" : "none";
        map.setLayoutProperty(layerId, "visibility", visibility);
        console.log(`Set ${layerId} to ${visibility}`);
      }
    });
  }

  return (
    <>
      <FormaldehydeLayer />
      <AerosolIndexLayer />
      <SulfurDioxideLayer />
      <OzoneLayer />
    </>
  );
}


*/

export default function LayerManager() {
  const { mapRefA, mapRefB, mapRefC, mapsInitialized, activeMapLayers } =
    useContext(MapContext);

  // Create HCHO layer
  useEffect(() => {
    if (!mapsInitialized || !mapRefA.current || !mapRefC.current) return;

    // Wait for both styles
    const waitAndCreate = () => {
      if (
        mapRefA.current?.isStyleLoaded() &&
        mapRefC.current?.isStyleLoaded()
      ) {
        console.log("Creating HCHO layer");
        createHCHOLayer();
      } else {
        setTimeout(waitAndCreate, 100);
      }
    };

    waitAndCreate();
  }, [mapsInitialized]);

  function createHCHOLayer() {
    const wmsUrl =
      "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

    // Map A
    mapRefA.current.addSource("hcho-source-a", {
      type: "raster",
      tiles: [wmsUrl],
      tileSize: 256,
    });

    mapRefA.current.addLayer({
      id: "hcho-layer-a",
      type: "raster",
      source: "hcho-source-a",
      layout: { visibility: "none" },
      paint: { "raster-opacity": 0.7 },
    });

    // Map B
    mapRefB.current.addSource("hcho-source-b", {
      type: "raster",
      tiles: [wmsUrl],
      tileSize: 256,
    });

    mapRefB.current.addLayer({
      id: "hcho-layer-b",
      type: "raster",
      source: "hcho-source-b",
      layout: { visibility: "none" },
      paint: { "raster-opacity": 0.7 },
    });

    // Map C
    mapRefC.current.addSource("hcho-source-c", {
      type: "raster",
      tiles: [wmsUrl],
      tileSize: 256,
    });

    mapRefC.current.addLayer({
      id: "hcho-layer-c",
      type: "raster",
      source: "hcho-source-c",
      layout: { visibility: "none" },
      paint: { "raster-opacity": 0.7 },
    });

    console.log("HCHO layers A/B/C created");
  }

  // Visibility Control
  useEffect(() => {
    if (!mapsInitialized) return;

    // Map A
    if (mapRefA.current?.getLayer("hcho-layer-a")) {
      const visibilityA = activeMapLayers.mapA === "HCHO" ? "visible" : "none";
      mapRefA.current.setLayoutProperty(
        "hcho-layer-a",
        "visibility",
        visibilityA
      );
    }

    // Map B
    if (mapRefB.current?.getLayer("hcho-layer-b")) {
      const visibilityB = activeMapLayers.mapB === "HCHO" ? "visible" : "none";
      mapRefB.current.setLayoutProperty(
        "hcho-layer-b",
        "visibility",
        visibilityB
      );
    }

    // Map C
    if (mapRefC.current?.getLayer("hcho-layer-c")) {
      const visibilityC = activeMapLayers.mapC === "HCHO" ? "visible" : "none";
      mapRefC.current.setLayoutProperty(
        "hcho-layer-c",
        "visibility",
        visibilityC
      );
    }
  }, [activeMapLayers, mapsInitialized]);

  return null;
}
