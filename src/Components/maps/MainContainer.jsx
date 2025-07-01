import { useState } from "react";
import MapContainerA from "./containers/MapContainerA.jsx";
import MapContainerB from "./containers/MapContainerB.jsx";
import MapContainerC from "./containers/MapContainerC.jsx";
import MapSynchronizer from "./MapSynchronizer.jsx";
import LayerManager from "../layers/LayerManager.jsx";

import FormaldehydeLayer from "../layers/sentinel5p/FormaldehydeLayer.jsx";

//import LayerToggle from "../ui/LayerToggle.jsx";
// import ControlPanel from "../ui/ControlPanel.jsx";

import Toggle from "../ui/Toggle.jsx";

export default function MainContainer({}) {
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
          <Toggle mapId="A" />
        </div>

        {/* Map B */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <MapContainerB onContainerReady={setContainerB} />
          <Toggle mapId="B" />
          {/*<ControlPanel
            sentinelPosition={sentinelPosition}
            collectionData={collectionData}
            loading={loading}
            error={error}
          />*/}
        </div>

        {/* Map C */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <MapContainerC onContainerReady={setContainerC} />
          <Toggle mapId="C" />
        </div>
      </div>

      {/* Logic Component */}
      <FormaldehydeLayer />
      <LayerManager />
      <MapSynchronizer
        containerA={containerA}
        containerB={containerB}
        containerC={containerC}
      />
    </>
  );
}
