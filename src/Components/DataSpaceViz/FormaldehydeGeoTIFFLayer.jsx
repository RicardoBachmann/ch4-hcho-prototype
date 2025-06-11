import { useEffect } from "react";

export default function FormaldehydeGeoTIFFLayer({ sentinelData, mapRefA }) {
  console.log("GeoTIFF data flows in", sentinelData);

  useEffect(() => {
    console.log("GeoTIFF useEffect triggered");
    console.log("MapRefA:", !!mapRefA?.current);
    console.log("sentinel hcho data:", !!sentinelData?.formaldehyde);
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

    // Map A
    if (mapRefA.current.isStyleLoaded()) {
      const geoTIFFSourceId = "hcho-geotiff-source";

      if (!mapRefA.current.getSource(geoTIFFSourceId)) {
        mapRefA.current.addSource(geoTIFFSourceId, {
          type: "image",
          url: url,
          coordinates: coordinatesBbox,
        });
        mapRefA.current.addLayer({
          id: "hcho-geotiff-layer",
          type: "raster",
          source: geoTIFFSourceId,
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
  }, [sentinelData, mapRefA]);
  return <></>;
}
