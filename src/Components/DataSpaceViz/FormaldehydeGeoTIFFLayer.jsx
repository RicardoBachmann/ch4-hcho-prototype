import { useEffect } from "react";

/*
export default function FormaldehydeGeoTIFFLayer({
  sentinelData,
  mapRefA,
  isActive,
}) {
  console.log("🧪 GEOTIFF KOMPONENTE LÄDT", new Date().toLocaleTimeString());
  console.log("🧪 Props:", {
    hasSentinelData: !!sentinelData,
    hasMapRef: !!mapRefA?.current,
    isActive,
  });

  console.log("GeoTIFF data flows in", sentinelData);

  useEffect(() => {
    console.log("GeoTIFF useEffect triggered");
    console.log("MapRefA:", !!mapRefA?.current);
    console.log("sentinel hcho data:", !!sentinelData?.formaldehyde);

    if (!isActive) return;
    if (!mapRefA?.current || !sentinelData?.formaldehyde) {
      console.log("Early return - missing dependencies");
      return;
    }
    console.log("Creating GeoTIFF layer");
    const originalUrl = sentinelData.formaldehyde.features[0].assets.hcho.href;
    const url = originalUrl.replace(
      "https://download.geoservice.dlr.de",
      "/api/dlr-download"
    );
    console.log("Original URL:", originalUrl);
    console.log("Proxy URL:", url);
    // Transform DLR STAC bbox [minLng, minLat, maxLng, maxLat]
    // Mapbox image source needs 4 corner coordinates in clockwise order starting top-left
    const bbox = sentinelData.formaldehyde.features[0].properties["proj:bbox"]; // minLng (-180), minLat (-90), maxLng (180), maxLat (90)
    const coordinatesBbox = [
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
    ];
    console.log("🔍 Teste Original URL direkt:", originalUrl);
    fetch(originalUrl, { method: "HEAD", mode: "no-cors" })
      .then(() => console.log("✅ Original URL erreichbar"))
      .catch((err) => console.log("❌ Original URL Fehler:", err));

    // Map A
    if (mapRefA.current.isStyleLoaded()) {
      const geoTIFFSourceId = "hcho-geotiff-source";

      console.log("Map style is loaded");

      if (!mapRefA.current.getSource(geoTIFFSourceId)) {
        console.log("Adding source...");

        mapRefA.current.addSource(geoTIFFSourceId, {
          type: "image",
          url: originalUrl,
          coordinates: coordinatesBbox,
        });

        console.log("✅ Source added");

        mapRefA.current.addLayer({
          id: "hcho-geotiff-layer",
          type: "raster",
          source: originalUrl,
          paint: {
            "raster-opacity": 0.7,
          },
        });

        console.log("✅ Layer added");

        // Test ob Layer existiert
        setTimeout(() => {
          const layerExists = mapRefA.current.getLayer("hcho-geotiff-layer");
          console.log("🔍 Layer check:", !!layerExists);
        }, 1000);
      } else {
        console.log("⚠️ Source already exists");
      }
    } else {
      console.log("❌ Map style not loaded yet");
    }
    return;
  }, [sentinelData, mapRefA, isActive]);
  return <></>;
}
*/

export default function FormaldehydeGeoTIFFLayer({
  sentinelData,
  mapRefA,
  isActive,
}) {
  console.log("🧪 GEOTIFF KOMPONENTE LÄDT", new Date().toLocaleTimeString());

  useEffect(() => {
    console.log("🔄 useEffect - isActive:", isActive);

    if (!isActive || !mapRefA?.current || !sentinelData?.formaldehyde) {
      return;
    }

    console.log("✅ Erstelle GeoTIFF Layer mit CORS Proxy");

    const originalUrl = sentinelData.formaldehyde.features[0].assets.hcho.href;
    const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      originalUrl
    )}`;

    console.log("🔗 Original URL:", originalUrl);
    console.log("🔗 CORS Proxy URL:", corsProxyUrl);

    const bbox = sentinelData.formaldehyde.features[0].properties["proj:bbox"];
    const coordinates = [
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
    ];

    const sourceId = "hcho-geotiff-source";

    // Cleanup
    if (mapRefA.current.getLayer("hcho-geotiff-layer")) {
      mapRefA.current.removeLayer("hcho-geotiff-layer");
    }
    if (mapRefA.current.getSource(sourceId)) {
      mapRefA.current.removeSource(sourceId);
    }

    // Add source and layer
    mapRefA.current.addSource(sourceId, {
      type: "image",
      url: "https://picsum.photos/1024/512",
      coordinates: coordinates,
    });

    mapRefA.current.addLayer({
      id: "hcho-geotiff-layer",
      type: "raster",
      source: sourceId,
      paint: { "raster-opacity": 1.0 },
    });

    console.log("🎉 GeoTIFF Layer mit CORS Proxy hinzugefügt!");
  }, [sentinelData, mapRefA, isActive]);

  return null;
}
