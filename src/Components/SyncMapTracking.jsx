import React from "react";
import { useRef, useEffect } from "react";
import mapboxGl from "mapbox-gl";
import syncMaps from "@mapbox/mapbox-gl-sync-move";
import "mapbox-gl/dist/mapbox-gl.css";

export default function SyncMapTracking() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const mapRefA = useRef(null);
  const mapRefB = useRef(null);
  const mapRefC = useRef(null);

  const mapContainerRefA = useRef(null);
  const mapContainerRefB = useRef(null);
  const mapContainerRefC = useRef(null);
  useEffect(() => {
    mapboxGl.accessToken =
      "pk.eyJ1IjoiZGV0cm9pdDMxMyIsImEiOiJjbTRqb3ljbTQwZnJxMmlzaTRtMWRzcnhpIn0.akOKBt52fpXDljrtyHo8wg";

    mapRefA.current = new mapboxGl.Map({
      container: mapContainerRefA.current,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/standard",
      zoom: 10.12,
    });

    mapRefB.current = new mapboxGl.Map({
      container: mapContainerRefB.current,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/standard-satellite",
      zoom: 10.12,
    });

    mapRefC.current = new mapboxGl.Map({
      container: mapContainerRefC.current,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/standard",
      zoom: 10.12,
    });

    mapRefA.current.on("load", () => {
      mapRefB.current.on("load", () => {
        mapRefC.current.on("load", () => {
          syncMaps(mapRefA.current, [mapRefB.current, mapRefC.current]);
          syncMaps(mapRefB.current, [mapRefA.current, mapRefC.current]);
          syncMaps(mapRefC.current, [mapRefA.current, mapRefB.current]);
        });
      });
    });

    return () => {
      if (mapRefA.current) mapRefA.current.remove();
      if (mapRefB.current) mapRefB.current.remove();
      if (mapRefC.current) mapRefC.current.remove();
    };
  }, []);

  return (
    <>
      <div
        className="map-container-wrapper"
        id="container"
        style={{
          display: "flex",
          width: "100%",
          height: "500px",
        }}
      >
        <div ref={mapContainerRefA} style={{ flex: 1, heigt: "100%" }} />
        <div ref={mapContainerRefB} style={{ flex: 1, heigt: "100%" }} />
        <div ref={mapContainerRefC} style={{ flex: 1, heigt: "100%" }} />
      </div>
    </>
  );
}
