import React from "react";
import { useRef, useEffect } from "react";
import mapboxGl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function SyncMapTracking() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxGl.accessToken =
      "pk.eyJ1IjoiZGV0cm9pdDMxMyIsImEiOiJjbTRqb3ljbTQwZnJxMmlzaTRtMWRzcnhpIn0.akOKBt52fpXDljrtyHo8wg";
    mapRef.current = new mapboxGl.Map({
      container: mapContainerRef.current,
      center: [-74.0242, 40.6941],
      zoom: 10.12,
    });
    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
    </>
  );
}
