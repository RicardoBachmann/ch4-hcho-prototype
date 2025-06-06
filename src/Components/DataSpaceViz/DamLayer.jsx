import { useEffect } from "react";
import mapboxGl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function DamLayer({ damData, mapsInitialized, mapRefB }) {
  useEffect(() => {
    if (!mapsInitialized || !mapRefB || !damData) return;

    const createMarkers = () => {
      damData.features.forEach((feature) => {
        const coords = feature.geometry.coordinates;
        console.log("Creating marker at:", coords);
        const marker = new mapboxGl.Marker({
          color: "#00FF00",
        })
          .setLngLat(coords)
          .addTo(mapRefB);
      });

      if (damData.features.length > 0) {
        const firstDam = damData.features[0].geometry.coordinates;
        mapRefB.flyTo({
          center: firstDam,
          zoom: 8,
        });
      }
    };

    if (!mapRefB.isStyleLoaded()) {
      mapRefB.on("load", createMarkers);
    } else {
      createMarkers();
    }
  }, [damData, mapsInitialized, mapRefB]);
}
