import { useEffect } from "react";

export default function FormaldehydeGeoTIFFLayer({
  sentinelData,
  mapRefA,
  isActive,
}) {
  console.log("GEOTIFF component laod...", new Date().toLocaleTimeString());

  useEffect(() => {
    console.log("useEffect - isActive:", isActive);

    if (!isActive || !mapRefA?.current || !sentinelData?.formaldehyde) {
      return;
    }

    console.log("Create GeoTIFF Layer with CORS Proxy");

    const originalUrl = sentinelData.formaldehyde.features[0].assets.hcho.href;
    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(
      originalUrl
    )}`;

    console.log("Original URL:", originalUrl);
    console.log("CORS Proxy URL:", corsProxyUrl);

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
      url: originalUrl,
      coordinates: coordinates,
    });

    mapRefA.current.addLayer({
      id: "hcho-geotiff-layer",
      type: "raster",
      source: sourceId,
      paint: { "raster-opacity": 1.0 },
    });
    // Nach dem addLayer:
    setTimeout(() => {
      console.log("LAYER DEBUG:");
      console.log(
        "- Layer exists:",
        !!mapRefA.current.getLayer("hcho-geotiff-layer")
      );
      console.log("- Source exists:", !!mapRefA.current.getSource(sourceId));
      console.log(
        "- All layers:",
        mapRefA.current.getStyle().layers.map((l) => l.id)
      );
      console.log(
        "- Layer visibility:",
        mapRefA.current.getLayoutProperty("hcho-geotiff-layer", "visibility")
      );
    }, 2000);
    console.log("GeoTIFF Layer add with CORS Proxy!");
  }, [sentinelData, mapRefA, isActive]);

  return null;
}
