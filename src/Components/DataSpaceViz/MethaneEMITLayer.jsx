import { useEffect } from "react";

export default function MethaneEMITLayer({
  emitData,
  mapsInitialized,
  mapRefB,
}) {
  useEffect(() => {
    if (!mapsInitialized || !mapRefB || !emitData) return;

    // 1. NASA-EMIT Extract coordinates
    // Single granule
    /*const polygonString = emitData.feed.entry[0].polygons[0][0];*/
    // Multi granules

    /*
    const coordinatePairs = [];
    for (let i = 0; i < coordArray.length; i += 2) {
      const lat = parseFloat(coordArray[i]);
      const lng = parseFloat(coordArray[i + 1]);
      coordinatePairs.push([lng, lat]);
    }*/

    console.log("EMIT data:", emitData);

    emitData.feed.entry.forEach((entry, index) => {
      const polygonString = entry.polygons[0][0];
      const coordArray = polygonString.split(" ");

      const coordinatePairs = [];
      for (let i = 0; i < coordArray.length; i += 2) {
        const lat = parseFloat(coordArray[i]);
        const lng = parseFloat(coordArray[i + 1]);
        coordinatePairs.push([lng, lat]);
      }

      mapRefB.addSource(`ch4-source-${index}`, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinatePairs],
          },
        },
      });

      mapRefB.addLayer({
        id: entry.id,
        type: "line",
        source: `ch4-source-${index}`,
        layout: {},
        paint: {
          "line-color": "#FF0000",
          "line-width": 2,
        },
      });
    });

    /*
    // 2. Red Polygon Source und Layer
    if (!mapRefB.getSource("ch4-source")) {
      mapRefB.addSource("ch4-source", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinatePairs],
          },
        },
      });

      mapRefB.addLayer({
        id: "ch4-layer-stroke",
        type: "line",
        source: "ch4-source",
        layout: {},
        paint: {
          "line-color": "#FF0000",
          "line-width": 2,
        },
      });
    }*/

    // 3. PNG URL find/extract
    const extractPNG = emitData.feed.entry[0].links.find((link) => {
      return link.title.includes(".png");
    });

    if (extractPNG) {
      console.log("Original PNG URL:", extractPNG.href);

      // IMPORTANT: NASA URL --> Proxy URL
      // "https://data.lpdaac.earthdatacloud.nasa.gov/path/to/file.png"
      // to:
      //// "/api/nasa/path/to/file.png"
      const nasaProxyUrl = extractPNG.href.replace(
        "https://data.lpdaac.earthdatacloud.nasa.gov",
        "/api/nasa"
      );

      console.log("NASA Proxy URL:", nasaProxyUrl);

      // 4. Load PNG & create blob
      // blob(): "Binary Large Object"
      // Container for raw binary data(NASA) to render NASA-PNG Data in Mapbox
      const loadPNG = async () => {
        try {
          console.log("Load PNG from:", nasaProxyUrl);

          // Test fetch with detailed logging
          const response = await fetch(nasaProxyUrl);

          console.log("NASA Response Status:", response.status);
          console.log("NASA Response Headers:", response.headers);

          if (!response.ok) {
            throw new Error(
              `NASA API Error: ${response.status} ${response.statusText}`
            );
          }

          // Create blob
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);

          console.log("PNG successfully loaded, size:", blob.size, "bytes");

          // Add PNG Source
          if (!mapRefB.getSource("ch4-png-source")) {
            mapRefB.addSource("ch4-png-source", {
              type: "image",
              url: imageUrl,
              // EMIT Granules are mostly rectangular polygons
              // Mapbox takes these 4 points and "stretches" the PNG exactly between them!
              // NASA EMIT provides coordinates in clockwise order: TL→TR→BR→BL
              // First 4 coordinates form the rectangular projection boundary
              coordinates: coordinatePairs.slice(0, 4),
            });

            mapRefB.addLayer({
              id: "ch4-png-layer",
              type: "raster",
              source: "ch4-png-source",
              paint: {
                "raster-opacity": 0.8,
              },
            });

            console.log(" Add PNG Layer!");
          }
        } catch (error) {
          console.error("PNG Loading Error:", error);

          // Fallback: Display polygon only
          console.log("Fallback: Show only polygon without PNG");
        }
      };

      // PNG load asynchron
      loadPNG();
    }
  }, [mapsInitialized, mapRefB, emitData]);
  return <></>;
}

// For separation of concerns: Use mapRefB to visualize the methane layer in mapViewB
// useEffect triggers only when mapInitialized becomes true and when new NASA EMIT data flows in
// mapRefB in dependency array is just an "ESLint passenger" - required by linting rules but doesn't trigger re-runs
