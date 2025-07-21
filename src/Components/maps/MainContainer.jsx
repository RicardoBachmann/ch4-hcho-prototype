import { useState } from "react";
import MapContainerA from "./containers/MapContainerA.jsx";
import MapContainerB from "./containers/MapContainerB.jsx";
import MapContainerC from "./containers/MapContainerC.jsx";
import MapSynchronizer from "./MapSynchronizer.jsx";
import LayerManager from "../layers/LayerManager.jsx";

import FormaldehydeLayer from "../layers/sentinel5p/FormaldehydeLayer.jsx";
import FormaldehydeTimeline from "../layers/sentinel5p/FormaldehydeTimeline.jsx";
import HydroBarrierLayer from "../layers/spatial/HydroBarrierLayer.jsx";
import HydroReserviorLayer from "../layers/spatial/HydroReserviorLayer.jsx";
import MethaneEmitV001 from "../layers/nasaEmit/MethaneEmitV001.jsx";
import MethaneEmitV002 from "../layers/nasaEmit/MethaneEmitV002.jsx";
import WetlandLayer from "../layers/ghgCenter/WetlandLayer.jsx";
import WaterbodyLayer from "../layers/spatial/WaterbodyLayer.jsx";

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
      <WetlandLayer />
      <WaterbodyLayer />
      <HydroReserviorLayer />
      <FormaldehydeLayer />
      <FormaldehydeTimeline />
      <HydroBarrierLayer />
      <MethaneEmitV001 />
      <MethaneEmitV002 />
      <LayerManager />
      <MapSynchronizer
        containerA={containerA}
        containerB={containerB}
        containerC={containerC}
      />
    </>
  );
}
