import { useEffect, useContext } from "react";
import useEmitV002Data from "../../../hooks/useEmitV002Data";
import { MapContext } from "../../../context/MapContext";

export default function MethaneEmitV002() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { emitV002Data } = useEmitV002Data(); // Add loading, error states for control panel UI
  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !emitV002Data) {
      console.log("Early return - conditions V002 not met");
      return;
    }

    console.log("EMIT V002 data loaded:", emitV002Data);
    console.log("EMIT V002 data structure sample:", emitV002Data.feed.entry[0]);
    console.log("EMIT V002 granules:", emitV002Data?.feed?.entry?.length);

    // Helper function for consistent ID generation across EMIT versions
    function generateIds(version, index, entryId) {
      return {
        sourceId: `CH4${version}-source-${index}`,
        layerId: entryId,
        pngSourceId: `CH4${version}-png-source-${index}`,
        pngLayerId: `CH4${version}-png-layer-${index}`,
      };
    }

    // Transforms NASA's lat,lng coordinate strings to Mapbox-compatible [lng,lat] arrays
    function transformCoordinates(polygonString) {
      const coordArray = polygonString.split(" ");
      const coordinatePairs = [];
      // Loop through array, taking 2 values at a time (lat + lng pairs)
      for (let i = 0; i < coordArray.length; i += 2) {
        // index (0,2,4...) latitude
        const lat = parseFloat(coordArray[i]);
        // index (1,3,5...) longitude
        const lng = parseFloat(coordArray[i + 1]);
        // Mapbox wants [longitude, latitude] order (opposite of NASA!)
        coordinatePairs.push([lng, lat]);
      }
      return coordinatePairs;
    }

    // Creates GeoJSON polygon source and red outline layer for methane hotspot boundaries
    function addPolygonLayer(coordinatePairs, sourceId, layerId, mapRefB) {
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

    function addPngLayer(
      imageUrl,
      coordinatePairs,
      pngSourceId,
      pngLayerId,
      mapRefB
    ) {
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

    // Fetches PNG from NASA via proxy, creates blob URL, and adds as raster overlay
    async function processPngOverlay(entry) {
      const extractPng = entry.links.find((link) => {
        return link.title.includes("png");
      });

      if (!extractPng) return null;

      // IMPORTANT: NASA URL --> Proxy URL
      // "https://data.lpdaac.earthdatacloud.nasa.gov/path/to/file.png"
      // to:
      // "/api/nasa/path/to/file.png"
      const nasaProxyUrl = extractPng.href.replace(
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

    // NASA-EMITV002 forEach orchestrated granules
    emitV002Data.feed.entry.forEach(async (entry, index) => {
      const polygonString = entry.polygons[0][0];
      const coordinatePairs = transformCoordinates(polygonString);

      const { sourceId, layerId, pngSourceId, pngLayerId } = generateIds(
        "V002",
        index,
        entry.id
      );
      addPolygonLayer(coordinatePairs, sourceId, layerId, mapRefB);
      const imageUrl = await processPngOverlay(entry);
      if (imageUrl) {
        // Adds PNG overlay as Mapbox image source with 80% opacity for methane concentration visualization
        addPngLayer(
          imageUrl,
          coordinatePairs,
          pngSourceId,
          pngLayerId,
          mapRefB
        );
      }
    });
  }, [mapsInitialized, mapRefB, emitV002Data]);
  return;
}

// Renders NASA EMIT Methane V002 granules as red polygon outlines + PNG overlays on mapB
// V002: COMPREHENSIVE COVERAGE - all scenes regardless of plume detection + uncertainty data
// Enhanced algorithms with improved spectral filtering and bias correction

// Data flow: NASA bytes → Blob (cache) → Browser URL → Mapbox rendering
// mapRefB in dependency array is just an "ESLint passenger" - required by linting rules but doesn't trigger re-runs
