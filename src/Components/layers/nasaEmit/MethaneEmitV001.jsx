import { useEffect, useContext } from "react";
import useEmitV001Data from "../../../hooks/useEmitV001Data";
import { MapContext } from "../../../context/MapContext";

export default function MethaneEmitV001() {
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { emitV001Data, loading, error } = useEmitV001Data();

  console.log("Hook loading state:", loading);
  console.log("Hook error state:", error);
  console.log("EMIT V001 data loaded:", emitV001Data);

  useEffect(() => {
    if (!mapRefB || !mapsInitialized) return;
    console.log("EMIT V001 data loaded:", emitV001Data);
  }, [emitV001Data]);
}
