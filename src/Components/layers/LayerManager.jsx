import { useContext, useEffect } from "react";
import { MapContext } from "../../context/MapContext";

export default function LayerManager() {
  const { mapRefA, mapRefC, mapsInitialized, activeMapLayers } =
    useContext(MapContext);

  useEffect(() => {
    if (!mapRefA.current || !mapRefC.current || !mapsInitialized) return;

    // Wait until both maps have loaded style
    const waitForStyles = () => {
      if (
        mapRefA.current?.isStyleLoaded() &&
        mapRefC.current?.isStyleLoaded()
      ) {
        console.log("Both map styles loaded, creating layers");
        createLayersForMap(mapRefA.current, "a");
        createLayersForMap(mapRefC.current, "c");
      } else {
        console.log("Still waiting for map styles...");
        setTimeout(waitForStyles, 100); // Retry in 100ms
      }
    };

    waitForStyles();
  }, [mapsInitialized]);

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

  function createLayersForMap(map, mapId) {
    const layers = ["HCHO", "SO2", "O3", "AI"];

    layers.forEach((layer) => {
      const sourceId = `${layer}-source-${mapId}`;
      const layerId = `${layer}-layer-${mapId}`;

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [
            `/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_${layer}_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0`,
          ],
          tileSize: 256,
        });

        map.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          layout: { visibility: "none" },
          paint: { "raster-opacity": 0.7 },
        });
      }
    });
  }
  return null;
}
