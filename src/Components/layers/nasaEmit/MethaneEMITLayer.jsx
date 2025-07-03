import { useEffect, useContext } from "react";
import useEmitData from "../../../hooks/useEmitData";
import { MapContext } from "../../../context/MapContext";

export default function MethaneEMITLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { emitData } = useEmitData(); // Add loading, error states for control panel UI
  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !emitData) {
      console.log("Early return - conditions not met");
      return;
    }
    console.log("EMIT V002 data loaded:", emitData);
    console.log("EMIT V002 data structure sample:", emitData.feed.entry[0]);
    console.log("EMIT V002 granules:", emitData?.feed?.entry?.length);

    function transformCoordinates(polygonString) {
      // Coordinates extraction, switch coord-props to the order: 1)lng 2)lat and push in coordinatePairs
      // (Mapbox dont accept NASA's default order of lat,lng)
      const coordArray = polygonString.split(" ");
      const coordinatePairs = [];
      for (let i = 0; i < coordArray.length; i += 2) {
        const lat = parseFloat(coordArray[i]);
        const lng = parseFloat(coordArray[i + 1]);
        coordinatePairs.push([lng, lat]);
      }
      return coordinatePairs;
    }

    function addPolygonLayer(coordinatePairs, sourceId, layerId, mapRefB) {
      // Add Source as polygon and creat for each an individual index for data improvment
      if (!mapRefB.current.getSource(sourceId)) {
        mapRefB.current.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [coordinatePairs],
            },
          },
        });
      } else {
        console.warn(`Source ${sourceId} already exists, skipping`);
      }

      // Add Layer and get the id of NASA's entry.id prop
      if (!mapRefB.current.getLayer(layerId)) {
        mapRefB.current.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {},
          paint: {
            "line-color": "#FF0000",
            "line-width": 2,
          },
        });
      } else {
        console.warn(`Layer ${layerId} already exists, skipping`);
      }
    }

    function addPngLayer(imageUrl, coordinatePairs, index, mapRefB) {
      const pngSourceId = `CH4-png-source-${index}`;
      // Source-Check
      if (!mapRefB.current.getSource(pngSourceId)) {
        mapRefB.current.addSource(pngSourceId, {
          type: "image",
          url: imageUrl,
          coordinates: coordinatePairs.slice(0, 4),
        });
      } else {
        console.warn(`PNG Source ${pngSourceId} already exists, skipping`);
      }
      // Layer-Check
      const pngLayerId = `CH4-png-layer-${index}`;
      if (!mapRefB.current.getLayer(pngLayerId)) {
        mapRefB.current.addLayer({
          id: pngLayerId,
          type: "raster",
          source: pngSourceId,
          paint: {
            "raster-opacity": 0.8,
          },
        });
      } else {
        console.warn(`PNG Layer ${pngLayerId} already exists, skipping`);
      }
    }

    // Load, process & create blob
    async function processPngOverlay(entry) {
      const extractPNG = entry.links.find((link) => {
        return link.title.includes("png");
      });
      if (!extractPNG) return null;

      // IMPORTANT: NASA URL --> Proxy URL
      // "https://data.lpdaac.earthdatacloud.nasa.gov/path/to/file.png"
      // to:
      // "/api/nasa/path/to/file.png"
      const nasaProxyUrl = extractPNG.href.replace(
        "https://data.lpdaac.earthdatacloud.nasa.gov",
        "/api/nasa"
      );

      try {
        const response = await fetch(nasaProxyUrl);
        if (!response.ok) {
          throw new Error(
            `NASA API Error: ${response.status} ${response.statusText}`
          );
        }
        // Container for raw binary data(NASA) to render NASA-PNG Data in Mapbox
        // blob(): "Binary Large Object"
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        /* console.log("PNG successfully loaded, size:", blob.size, "bytes"); */
        return imageUrl;
      } catch (error) {
        console.error(`PNG loading failed:`, error);
        return null;
      }
    }

    // NASA-EMIT forEach orchestrated granules
    emitData.feed.entry.forEach(async (entry, index) => {
      const polygonString = entry.polygons[0][0];
      const coordinatePairs = transformCoordinates(polygonString);

      const sourceId = `CH4-source-${index}`;
      const layerId = entry.id;

      addPolygonLayer(coordinatePairs, sourceId, layerId, mapRefB);
      const imageUrl = await processPngOverlay(entry);
      if (imageUrl) {
        addPngLayer(imageUrl, coordinatePairs, index, mapRefB);
      }
    });
  }, [mapsInitialized, mapRefB, emitData]);
  return;
}

// Renders NASA EMIT Methane V002 granules as red polygon outlines + PNG overlays on mapB
// 4 seperate functions: transformCoordinates() | addPolygonLayer() | processPngOverlay() | addPngLayer()
// Data flow: NASA bytes → Blob (cache) → Browser URL → Mapbox rendering
// mapRefB in dependency array is just an "ESLint passenger" - required by linting rules but doesn't trigger re-runs

// TODO: Add helper functions for ID generation (generateIds(index, entryId))
