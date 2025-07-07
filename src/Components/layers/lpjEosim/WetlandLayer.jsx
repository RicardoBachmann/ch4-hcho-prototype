import { useContext, useEffect } from "react";
import { MapContext } from "../../../context/MapContext";
import useLpjEosimData from "../../../hooks/useLpjEosimData";

export default function WetlandLayer() {
  console.log("🟢 WetlandLayer component mounted!");
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { lpjEosimData } = useLpjEosimData();

  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !lpjEosimData) {
      console.log("Early return - conditions not met");
      return;
    }
    console.log("LPJ-EOSIM data loaded:", lpjEosimData);
  }, [mapsInitialized, mapRefB, lpjEosimData]);

  return null;
}
