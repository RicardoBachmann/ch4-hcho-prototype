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
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 10.12,
    });

    try {
      mapRefB.current = new mapboxGl.Map({
        container: mapContainerRefB.current,
        center: [-74.0242, 40.6941],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: 10.12,
      });
      console.log("Map B erfolgreich initialisiert");
    } catch (error) {
      console.error("Fehler bei Map B:", error);
    }

    try {
      mapRefC.current = new mapboxGl.Map({
        container: mapContainerRefC.current,
        center: [-74.0242, 40.6941],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: 10.12,
      });
      console.log("Map C erfolgreich initialisiert");
    } catch (error) {
      console.error("Fehler bei Map C:", error);
    }

    mapRefA.current.on("load", () => {
      console.log("Map A ist gelade");
      mapRefB.current.on("load", () => {
        console.log("Map B ist gelade");
        mapRefC.current.on("load", () => {
          console.log("Map C ist gelade");
          console.log("Starte sync");
          syncMaps(mapRefA.current, mapRefB.current, mapRefC.current);
        });
      });
    });

    console.log("Map methods available:", Object.keys(mapRefA.current));
    console.log("Is .on a function?", typeof mapRefA.current.on === "function");
    console.log("____________");
    console.log("Container A:", mapContainerRefA.current);
    console.log("Container B:", mapContainerRefB.current);
    console.log("Container C:", mapContainerRefC.current);
    console.log("_______________");
    console.log(
      "Sind Container A und B identisch?",
      mapContainerRefA.current === mapContainerRefB.current
    );
    console.log(
      "Sind Container B und C identisch?",
      mapContainerRefB.current === mapContainerRefC.current
    );
    console.log("_______SYNC________");
    console.log("syncMaps Funktion:", syncMaps);
    console.log("syncMaps typeof:", typeof syncMaps);

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
          height: "900px",
        }}
      >
        <div ref={mapContainerRefA} style={{ flex: 1, height: "100%" }} />
        <div ref={mapContainerRefB} style={{ flex: 1, height: "100%" }} />
        <div ref={mapContainerRefC} style={{ flex: 1, height: "100%" }} />
      </div>
    </>
  );
}
