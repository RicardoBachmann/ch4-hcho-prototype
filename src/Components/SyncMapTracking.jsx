import React from "react";
import { useRef, useEffect } from "react";
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

  // !IMPORTANT! For sync map style has to be the same in all 3 Layer projection
  useEffect(() => {
    mapboxGl.accessToken =
      "pk.eyJ1IjoiZGV0cm9pdDMxMyIsImEiOiJjbTRqb3ljbTQwZnJxMmlzaTRtMWRzcnhpIn0.akOKBt52fpXDljrtyHo8wg";

    mapRefA.current = new mapboxGl.Map({
      container: mapContainerRefA.current,
      center: [sentinel5Position.longitude, sentinel5Position.latitude],
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: false,
    });

    mapRefB.current = new mapboxGl.Map({
      container: mapContainerRefB.current,
      center: [sentinel5Position.longitude, sentinel5Position.latitude],
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: true,
    });

    mapRefC.current = new mapboxGl.Map({
      container: mapContainerRefC.current,
      center: [sentinel5Position.longitude, sentinel5Position.latitude],
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: false,
    });

    mapRefA.current.on("load", () => {
      mapRefB.current.on("load", () => {
        mapRefC.current.on("load", () => {
          syncMaps(mapRefA.current, mapRefB.current, mapRefC.current);
        });
      });
    });

    mapRefA.current.scrollZoom.disable();
    mapRefA.current.dragPan.disable();

    mapRefC.current.scrollZoom.disable();
    mapRefC.current.dragPan.disable();

    return () => {
      if (mapRefA.current) mapRefA.current.remove();
      if (mapRefB.current) mapRefB.current.remove();
      if (mapRefC.current) mapRefC.current.remove();
    };
  }, [sentinel5Position]);

  // Dynamic Sentinel-5 data
  useEffect(() => {
    if (!mapRefB.current || !sentinel5Position) return;

    // Log the postion data to verify its correct
    console.log("Sentinel5 position:", sentinel5Position);

    // Create a function to update the map
    const updateMap = () => {
      try {
        // First check if valid coordinates
        if (!sentinel5Position.longitude || !sentinel5Position.latitude) {
          console.warn("Invalid position data:", sentinel5Position);
          return;
        }

        //Clear any existing markers (using a safer approach)
        const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
        existingMarkers.forEach((marker) => marker.remove());

        // Add new marker
        const marker = new mapboxGl.Marker({
          color: "#FF0000",
        })
          .setLngLat([sentinel5Position.longitude, sentinel5Position.latitude])
          .addTo(mapRefB.current);

        //Center the map on the marker
        mapRefB.current.flyTo({
          center: [sentinel5Position.longitude, sentinel5Position.latitude],
          zoom: 5,
          essential: true,
        });
        console.log("Map updated with new postion");
      } catch (error) {
        console.log("Error updating map:", error);
      }
    };

    // Check if map is loaded
    if (mapRefB.current.loaded()) {
      updateMap();
    } else {
      // If not loaded, wair for it
      mapRefB.current.once("load", updateMap);
    }
  }, [sentinel5Position]);

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
