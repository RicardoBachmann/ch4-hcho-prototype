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
  const { mapRefA, mapRefC, mapsInitialized, activeMapLayers } =
    useContext(MapContext);

  // 🎯 ERSTMAL: Alle Layer hier erstellen (Debugging)
  useEffect(() => {
    if (!mapsInitialized || !mapRefA.current || !mapRefC.current) return;

    // Wait for both styles
    const waitAndCreate = () => {
      if (
        mapRefA.current?.isStyleLoaded() &&
        mapRefC.current?.isStyleLoaded()
      ) {
        console.log("✅ BOTH STYLES LOADED - Creating all layers");
        createAllLayers();
      } else {
        console.log("⏳ Waiting for styles...");
        setTimeout(waitAndCreate, 100);
      }
    };

    waitAndCreate();
  }, [mapsInitialized]);

  function createAllLayers() {
    console.log("🎯 Creating HCHO layers");
    createLayer("HCHO", "S5P_TROPOMI_L3_P1D_HCHO");

    console.log("🎯 Creating SO2 layers");
    createLayer("SO2", "S5P_TROPOMI_L3_P1D_SO2");

    console.log("🎯 Creating O3 layers");
    createLayer("O3", "S5P_TROPOMI_L3_P1D_O3");

    console.log("🎯 Creating AI layers");
    createLayer("AI", "S5P_TROPOMI_L3_P1D_AI");
  }

  function createLayer(layerType, wmsLayer) {
    const wmsUrl = `/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=${wmsLayer}&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0`;

    // Map A
    const sourceIdA = `${layerType}-source-a`;
    const layerIdA = `${layerType}-layer-a`;

    if (!mapRefA.current.getSource(sourceIdA)) {
      mapRefA.current.addSource(sourceIdA, {
        type: "raster",
        tiles: [wmsUrl],
        tileSize: 256,
        // ✅ ADD ERROR HANDLING:
        maxzoom: 10, // Prevent too high zoom requests
        scheme: "xyz", // Ensure correct tile scheme
      });
    }

    if (!mapRefA.current.getLayer(layerIdA)) {
      mapRefA.current.addLayer({
        id: layerIdA,
        type: "raster",
        source: sourceIdA,
        layout: { visibility: "none" },
        paint: {
          "raster-opacity": 0.7,
          "raster-fade-duration": 0, // ✅ Prevent fade errors
        },
      });

      // ✅ ADD ERROR LISTENER:
      mapRefA.current.on("error", (e) => {
        if (e.sourceId === sourceIdA) {
          console.warn(`Layer ${layerIdA} failed to load:`, e);
        }
      });

      console.log(`✅ Created ${layerIdA}`);
    }

    // Map C (same pattern)
    const sourceIdC = `${layerType}-source-C`;
    const layerIdC = `${layerType}-layer-c`;

    if (!mapRefC.current.getSource(sourceIdC)) {
      mapRefC.current.addSource(sourceIdC, {
        type: "raster",
        tiles: [wmsUrl],
        tileSize: 256,
        // ✅ ADD ERROR HANDLING:
        maxzoom: 10, // Prevent too high zoom requests
        scheme: "xyz", // Ensure correct tile scheme
      });
    }

    if (!mapRefC.current.getLayer(layerIdC)) {
      mapRefC.current.addLayer({
        id: layerIdC,
        type: "raster",
        source: sourceIdC,
        layout: { visibility: "none" },
        paint: {
          "raster-opacity": 0.7,
          "raster-fade-duration": 0, // ✅ Prevent fade errors
        },
      });

      // ✅ ADD ERROR LISTENER:
      mapRefC.current.on("error", (e) => {
        if (e.sourceId === sourceIdC) {
          console.warn(`Layer ${layerIdC} failed to load:`, e);
        }
      });
      console.log(`✅ Created ${layerIdC}`);
    }
  }

  // Visibility Control
  useEffect(() => {
    if (!mapsInitialized || !mapRefA.current || !mapRefC.current) return;
    if (!mapRefA.current.isStyleLoaded() || !mapRefC.current.isStyleLoaded())
      return;

    updateVisibility(mapRefA.current, "a", activeMapLayers.mapA);
    updateVisibility(mapRefC.current, "c", activeMapLayers.mapC);
  }, [activeMapLayers, mapsInitialized]);

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

  return null; // Keine individual components
}
