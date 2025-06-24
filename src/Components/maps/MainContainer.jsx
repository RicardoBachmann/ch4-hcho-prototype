import { useState } from "react";
import MapContainerA from "./containers/MapContainerA";
import MapContainerB from "./containers/MapContainerB";
import MapContainerC from "./containers/MapContainerC";
import MapSynchronizer from "./MapSynchronizer";

import LayerToggle from "../ui/LayerToggle";
import ControlPanel from "../ui/ControlPanel";

export default function MainContainer() {
  const [containerA, setContainerA] = useState(null);
  const [containerB, setContainerB] = useState(null);
  const [containerC, setContainerC] = useState(null);

  return (
    <>
      {/* Layout Container */}
      <div
        className="map-container-wrapper"
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          height: "100vh",
        }}
      >
        {/* Map A */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <MapContainerA onContainerReady={setContainerA} />
          <LayerToggle mapId="A" />
        </div>

        {/* Map B */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <MapContainerB onContainerReady={setContainerB} />
          <ControlPanel />
        </div>

        {/* Map C */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <MapContainerC onContainerReady={setContainerC} />
          <LayerToggle mapId="C" />
        </div>
      </div>

      {/* Logic Component */}
      <MapSynchronizer
        containerA={containerA}
        containerB={containerB}
        containerC={containerC}
      />
    </>
  );
}
