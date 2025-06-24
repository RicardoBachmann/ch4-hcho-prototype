import { useEffect, useContext } from "react";
import { useEmitData } from "../../hooks/useEmitData";
import { MapContext } from "../../context/MapContext";

export default function MethaneEMITLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { emitData, loading, error } = useEmitData();
  useEffect(() => {
    console.log("🔍 DEBUG MapRefB:", mapRefB);
    console.log("🔍 Type:", typeof mapRefB);
    console.log("🔍 Is object?", mapRefB && typeof mapRefB === "object");
    console.log(
      "🔍 Has getSource?",
      mapRefB && typeof mapRefB.getSource === "function"
    );
    if (!mapsInitialized || !mapRefB || !emitData) return;

    // To see data structure sample
    console.log("EMIT data:", emitData.feed.entry[0]);

    // NASA-EMIT extract coordinates for polygon granules
    emitData.feed.entry.forEach((entry, index) => {
      // 1. Coordinates extraction and switch coord-props to the order: 1)lng 2)lat
      // (Mapbox dont accept NASA's default order of lat,lng)
      const polygonString = entry.polygons[0][0];
      const coordArray = polygonString.split(" ");
      const coordinatePairs = [];
      for (let i = 0; i < coordArray.length; i += 2) {
        const lat = parseFloat(coordArray[i]);
        const lng = parseFloat(coordArray[i + 1]);
        coordinatePairs.push([lng, lat]);
      }
      // 2. addSource
      // add source as polygon and creat for each an individual index for data improvment
      const sourceId = `ch4-source-${index}`;
      if (!mapRefB.getSource(sourceId)) {
        mapRefB.addSource(sourceId, {
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
        console.error(`Source ${sourceId} already exists, skipping`);
      }

      // 3. addLayer
      // add layer and get the id of NASA's entry.id prop
      const layerId = entry.id;
      if (!mapRefB.getLayer(layerId)) {
        mapRefB.addLayer({
          id: entry.id,
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

      // PNG extraction for each polygon granules
      // 4. Find and get all the links with png in it (no tifs)
      const extractPNG = entry.links.find((link) => {
        return link.title.includes("png");
      });

      if (extractPNG) {
        /* console.log("Original PNG URL:", extractPNG.href);*/

        // IMPORTANT: NASA URL --> Proxy URL
        // "https://data.lpdaac.earthdatacloud.nasa.gov/path/to/file.png"
        // to:
        // "/api/nasa/path/to/file.png"
        const nasaProxyUrl = extractPNG.href.replace(
          "https://data.lpdaac.earthdatacloud.nasa.gov",
          "/api/nasa"
        );

        /* console.log("NASA Proxy URL:", nasaProxyUrl);*/

        // 5. Load PNG & create blob
        // blob(): "Binary Large Object"
        // Container for raw binary data(NASA) to render NASA-PNG Data in Mapbox
        const loadPNG = async () => {
          try {
            /*
            console.log("Load PNG from:", nasaProxyUrl);*/

            // Test fetch with detailed logging
            const response = await fetch(nasaProxyUrl);

            /*
            console.log("NASA Response Status:", response.status);
            console.log("NASA Response Headers:", response.headers);*/

            if (!response.ok) {
              throw new Error(
                `NASA API Error: ${response.status} ${response.statusText}`
              );
            }

            // Create blob
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            /*
            console.log("PNG successfully loaded, size:", blob.size, "bytes");*/

            // 6. Add PNG Source
            const pngSourceId = `ch4-png-source-${index}`;
            if (!mapRefB.getSource(pngSourceId)) {
              mapRefB.addSource(pngSourceId, {
                type: "image",
                url: imageUrl,
                // EMIT Granules are mostly rectangular polygons
                // Mapbox takes these 4 points and "stretches" the PNG exactly between them!
                // NASA EMIT provides coordinates in clockwise order: TL→TR→BR→BL
                // First 4 coordinates form the rectangular projection boundary
                coordinates: coordinatePairs.slice(0, 4),
              });
              const pngLayerId = `ch4-png-layer-${index}`;
              if (!mapRefB.getLayer(pngLayerId)) {
                mapRefB.addLayer({
                  id: pngLayerId,
                  type: "raster",
                  source: `ch4-png-source-${index}`,
                  paint: {
                    "raster-opacity": 0.8,
                  },
                });
                /*
                console.log(" Add PNG Layer!");*/
              } else {
                console.warn(
                  `PNG Layer ${pngLayerId} already exists, skipping`
                );
              }
            }
          } catch (error) {
            console.error("PNG Loading Error:", error);
          }
        };
        loadPNG();
      }
    });
  }, [mapsInitialized, mapRefB, emitData]);
  return <></>;
}

// For separation of concerns: Use mapRefB to visualize the methane layer in mapViewB
// useEffect triggers only when mapInitialized becomes true and when new NASA EMIT data flows in
// mapRefB in dependency array is just an "ESLint passenger" - required by linting rules but doesn't trigger re-runs

//     console.log("First granule links:", data.feed.entry[0].links);
