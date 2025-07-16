import { useEffect, useContext } from "react";

import { useHydroReservoirData } from "../../../hooks/useHydroReservoirData";
import { MapContext } from "../../../context/MapContext";

export default function HydroReserviorLayer() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { hydroReserviorData } = useHydroReservoirData();

  useEffect(() => {
    if (!mapRefB || !mapsInitialized || !hydroReserviorData) return;

    console.log("hydroReservior flow:", hydroReserviorData);
  }, [mapRefB, mapsInitialized, hydroReserviorData]);

  return null;
}
