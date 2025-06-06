import { useEffect } from "react";

export default function DamLayer({ damData, mapsInitialized, mapRefB }) {
  useEffect(() => {
    if (!mapsInitialized || !mapRefB || !damData) return;
    console.log("Dam data flows!!!:", damData);
  }, [damData, mapsInitialized, mapRefB]);
  return <></>;
}
