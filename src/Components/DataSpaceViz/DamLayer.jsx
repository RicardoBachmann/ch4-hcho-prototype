import { useEffect, useContext } from "react";
import mapboxGl from "mapbox-gl";

import { useTropicalDamData } from "../../hooks/useTropicalDamData";
import { MapContext } from "../../context/MapContext";

export default function DamLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { damData, loading, error } = useTropicalDamData();
  useEffect(() => {
    // Wait for all dependencies: map initialization, map reference, and dam data
    // Note: ?. (optional chaining) prevents crash if mapRefB is null/undefined
    if (!mapsInitialized || !mapRefB?.current || !damData) return;

    console.log("Creating markers...");

    damData.features.forEach((item, index) => {
      const el = document.createElement("div");
      el.style.width = "10px";
      el.style.height = "10px";
      el.style.background = "red";
      el.style.borderRadius = "50%";

      const marker = new mapboxGl.Marker(el)
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
