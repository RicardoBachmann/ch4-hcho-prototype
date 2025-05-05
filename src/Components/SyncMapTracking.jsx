import { useRef, useEffect, useState } from "react";
import mapboxGl from "mapbox-gl";
import syncMaps from "@mapbox/mapbox-gl-sync-move";
import "mapbox-gl/dist/mapbox-gl.css";

export default function SyncMapTracking({ sentinel5Position }) {
  const mapRefA = useRef(null);
  const mapRefB = useRef(null);
  const mapRefC = useRef(null);

  const mapContainerRefA = useRef(null);
  const mapContainerRefB = useRef(null);
  const mapContainerRefC = useRef(null);

  // State to track if maps are initialized
  const [mapsInitialized, setMapsInitialized] = useState(false);

  // !IMPORTANT! For sync map style has to be the same in all 3 Layer projection
  useEffect(() => {
    if (mapsInitialized) return;
    mapboxGl.accessToken =
      "pk.eyJ1IjoiZGV0cm9pdDMxMyIsImEiOiJjbTRqb3ljbTQwZnJxMmlzaTRtMWRzcnhpIn0.akOKBt52fpXDljrtyHo8wg";

    const defaultPosition = [-90.96, -0.47];
    mapRefA.current = new mapboxGl.Map({
      container: mapContainerRefA.current,
      center: defaultPosition,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: false,
    });

    mapRefB.current = new mapboxGl.Map({
      container: mapContainerRefB.current,
      center: defaultPosition,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: true,
    });

    mapRefC.current = new mapboxGl.Map({
      container: mapContainerRefC.current,
      center: defaultPosition,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: false,
    });

    const setupMaps = () => {
      syncMaps(mapRefA.current, mapRefB.current, mapRefC.current);
      mapRefA.current.scrollZoom.disable();
      mapRefA.current.dragPan.disable();

      mapRefC.current.scrollZoom.disable();
      mapRefC.current.dragPan.disable();
      setMapsInitialized(true);
    };

    // Wait for all maps to load
    let mapsLoaded = 0;
    const checkAllMapsLoaded = () => {
      mapsLoaded++;
      if (mapsLoaded === 3) {
        setupMaps();
      }
    };

    mapRefA.current.on("load", checkAllMapsLoaded);
    mapRefB.current.on("load", checkAllMapsLoaded);
    mapRefC.current.on("load", checkAllMapsLoaded);

    return () => {
      if (mapRefA.current) mapRefA.current.remove();
      if (mapRefB.current) mapRefB.current.remove();
      if (mapRefC.current) mapRefC.current.remove();
    };
  }, []);

  // Dynamic Sentinel-5 data
  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !sentinel5Position) return;

    // Skip if invalid coordinates
    if (!sentinel5Position.longitude || !sentinel5Position.latitude) {
      console.warn("Invalid position data:", sentinel5Position);
      return;
    }
    /*
    console.log("Updating marker with position:", sentinel5Position);*/

    try {
      // Clear any existing markers
      const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
      existingMarkers.forEach((marker) => marker.remove());

      // Add new marker
      const marker = new mapboxGl.Marker({
        color: "#FF0000",
      })
        .setLngLat([sentinel5Position.longitude, sentinel5Position.latitude])
        .addTo(mapRefB.current);

      // Center the map on the marker
      mapRefB.current.flyTo({
        center: [sentinel5Position.longitude, sentinel5Position.latitude],
        zoom: 5,
        essential: true,
        duration: 1500, // Smooth transition
      });

      /*console.log("Map updated with new position");*/
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [sentinel5Position, mapsInitialized]);

  return (
    <>
      <div
        className="map-container-wrapper"
        id="container"
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          height: "100vh",
        }}
      >
        <div ref={mapContainerRefA} style={{ flex: 1, height: "100%" }} />
        <div ref={mapContainerRefB} style={{ flex: 1, height: "100%" }} />
        <div ref={mapContainerRefC} style={{ flex: 1, height: "100%" }} />
      </div>
    </>
  );
}
