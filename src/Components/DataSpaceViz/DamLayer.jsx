import { useEffect, useRef } from "react";
import mapboxGl from "mapbox-gl";

export default function DamLayer({ damData, mapRefB, mapsInitialized }) {
  useEffect(() => {
    // Wait for all dependencies: map initialization, map reference, and dam data
    // Note: ?. (optional chaining) prevents crash if mapRefB is null/undefined
    if (!mapsInitialized || !mapRefB?.current || !damData) return;

    console.log("Creating markers...");
    damData.features.forEach((item, index) => {
      const marker = new mapboxGl.Marker()
        .setLngLat([item.geometry.coordinates[0], item.geometry.coordinates[1]])
        .addTo(mapRefB.current);
      console.log(`Marker ${index} getLngLat:`, marker.getLngLat());
    });
    // All dam locations markers + Sentinel Satellite
    const allMarkers = document.querySelectorAll(".mapboxgl-marker");
    console.log("Found markers in DOM:", allMarkers.length);
  }, [damData, mapRefB, mapsInitialized]);
  return null;
}
