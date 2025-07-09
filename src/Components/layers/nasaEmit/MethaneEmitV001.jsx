import { useEffect, useContext } from "react";
import useEmitV001Data from "../../../hooks/useEmitV001Data";
import { MapContext } from "../../../context/MapContext";

export default function MethaneEmitV001() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { emitV001Data, loading, error } = useEmitV001Data();

  useEffect(() => {
    if (!mapRefB || !mapsInitialized || !emitV001Data) {
      console.log("Early return - conditions V001 not met");
      return;
    }

    console.log("EMIT V001 data loaded:", emitV001Data);
    console.log("EMIT V001 data structure sample:", emitV001Data.feed.entry[0]);
    console.log("EMIT V001 granules:", emitV001Data?.feed?.entry?.length);

    // Helper function for consistent ID generation across EMIT versions
    function generateIds(version, index, entryId) {
      return {
        sourceId: `CH4${version}-source-${index}`,
        layerId: entryId,
        pngSourceId: `CH4${version}-png-${index}`,
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
        console.error(`PNG laoding failed:`, error);
        return null;
      }
    }

    // NASA-EMITV001 forEach orchestrated granules
    emitV001Data.feed.entry.forEach(async (entry, index) => {
      const polygonString = entry.polygons[0][0];
      const coordinatePairs = transformCoordinates(polygonString);

      const { sourceId, layerId, pngSourceId, pngLayerId } = generateIds(
        "V001",
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
  }, [emitV001Data, mapRefB, mapsInitialized]);
}

// Renders NASA EMIT Methane V001 granules as red polygon outlines + PNG overlays on mapB
// V001: SELECTIVE HOTSPOT DETECTION - only granules with confirmed methane plume complexes
// Single enhancement data layer, pre-filtered for methane detection confidence
// Focuses on South America bounding box for targeted anomaly investigation

// Data flow: NASA bytes → Blob (cache) → Browser URL → Mapbox rendering
// mapRefB in dependency array is just an "ESLint passenger" - required by linting rules but doesn't trigger re-runs
