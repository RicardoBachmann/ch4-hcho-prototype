import React from "react";
import { useRef, useEffect } from "react";
import mapboxGl from "mapbox-gl";
import syncMaps from "@mapbox/mapbox-gl-sync-move";
import "mapbox-gl/dist/mapbox-gl.css";

export default function SyncMapTracking() {
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
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 10.12,
      attributionControl: false,
    });

    mapRefB.current = new mapboxGl.Map({
      container: mapContainerRefB.current,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 10.12,
      attributionControl: true,
    });

    mapRefC.current = new mapboxGl.Map({
      container: mapContainerRefC.current,
      center: [-74.0242, 40.6941],
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 10.12,
      attributionControl: false,
    });

    /*
    mapRefB.current.on("load", () => {
      mapRefB.current.addControl(
        new mapboxGl.AttributionControl({
          compact: true,
        })
      );
    });*/

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
  }, []);

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
