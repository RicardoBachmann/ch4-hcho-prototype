import { useEffect, useContext } from "react";
import mapboxGl from "mapbox-gl";
import syncMaps from "@mapbox/mapbox-gl-sync-move";
import "mapbox-gl/dist/mapbox-gl.css";

import { MapContext } from "../../context/MapContext";
export default function MapSynchronizer({
  containerA,
  containerB,
  containerC,
}) {
  const { mapRefA, mapRefB, mapRefC, setMapsInitialized } =
    useContext(MapContext);

  // IMPORTANT! For sync map style has to be the same in all 3 Layer projection
  useEffect(() => {
    if (containerA && containerB && containerC) {
      console.log("All containers ready - creating maps!");

      mapboxGl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      console.log("MapBox Token:", import.meta.env.VITE_MAPBOX_TOKEN);

      const defaultPosition = [-90.96, -0.47];

      // Create Maps
      mapRefA.current = new mapboxGl.Map({
        container: containerA,
        center: defaultPosition,
        style: "mapbox://styles/mapbox/dark-v11",
        zoom: 4,
        attributionControl: false,
      });

      mapRefB.current = new mapboxGl.Map({
        container: containerB,
        center: defaultPosition,
        style: "mapbox://styles/mapbox/dark-v11",
        zoom: 4,
        attributionControl: true,
      });

      mapRefC.current = new mapboxGl.Map({
        container: containerC,
        center: defaultPosition,
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: 4,
        attributionControl: false,
      });

      // Setup function after all maps load
      const setupMaps = () => {
        console.log("All maps loaded - setting up sync!");
        syncMaps(mapRefA.current, mapRefB.current, mapRefC.current);
        mapRefA.current.scrollZoom.disable();
        mapRefA.current.dragPan.disable();
        mapRefC.current.scrollZoom.disable();
        mapRefC.current.dragPan.disable();
        setMapsInitialized(true); // ← Only here!
      };

      // Wait for all maps to load
      let mapsLoaded = 0;
      const checkAllMapsLoaded = () => {
        mapsLoaded++;
        console.log(`Map ${mapsLoaded}/3 loaded`);
        if (mapsLoaded === 3) {
          setupMaps();
        }
      };

      // Add event listeners
      mapRefA.current.on("load", checkAllMapsLoaded);
      mapRefB.current.on("load", checkAllMapsLoaded);
      mapRefC.current.on("load", checkAllMapsLoaded);
    }

    // Cleanup
    return () => {
      if (mapRefA.current) mapRefA.current.remove();
      if (mapRefB.current) mapRefB.current.remove();
      if (mapRefC.current) mapRefC.current.remove();
    };
  }, [containerA, containerB, containerC]);

  return null;
}
// Dataflow:
// 1 Conext creates empty refs
// 2 MapSynchronizer fills the refs with maps
// 3 Layer components use the filled refs with .current
