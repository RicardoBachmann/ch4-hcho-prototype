import { useEffect, useRef } from "react";
import mapboxGl from "mapbox-gl";

export default function DamLayer({ damData, mapRefB }) {
  useEffect(() => {
    alert("DamLayer useEffect triggered!");
    console.log("damData flows in:", damData, mapRefB);
  }, [mapRefB, damData]);

  return null;
}
