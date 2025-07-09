import { useContext, useEffect } from "react";
import { MapContext } from "../../../context/MapContext";

export default function WetlandLayer() {
  console.log("WetlandLayer component mounted!");
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current) {
      console.log("Early return - conditions not met");
      return;
    }
    /*
    console.log("LPJ-EOSIM data loaded:", lpjEosimData);
    console.log("First LPJ-EOSIM entry structure:", lpjEosimData.feed.entry[0]);*/

    const waitAndCreate = () => {
      if (mapRefB.current?.isStyleLoaded()) {
        console.log("Wetland Layer mapB: Creating layer");
        createWetlandLayer();
      } else {
        console.log("Wetland Layer mapB: Waiting for styles...");
        setTimeout(waitAndCreate, 100);
      }
    };
    waitAndCreate();

    function createWetlandLayer() {
      const wmsUrl =
        "https://earth.gov/ghgcenter/api/raster/searches/05dbc16251570f995029001fcf6c930e/tiles/WebMercatorQuad/{z}/{x}/{y}?colormap_name=magma&rescale=0%2C3e-9&reScale=0%2C3e-9&assets=ensemble-mean-ch4-wetlands-emissions";

      mapRefB.current.addSource("wetland-source", {
        type: "raster",
        tiles: [wmsUrl],
        tileSize: 256,
      });
      mapRefB.current.addLayer({
        id: "wetland-layer",
        type: "raster",
        source: "wetland-source",
        layout: { visibility: "visible" },
        paint: {
          "raster-opacity": 0.7,
          "raster-blend": "screen",
        },
      });
    }
    //Cleanup

    return () => {
      if (mapRefB.current) {
        if (mapRefB.current.getLayer("wetland-layer")) {
          mapRefB.current.removeLayer("wetland-layer");
        }
        if (mapRefB.current.getSource("wetland-source"))
          mapRefB.current.removeSource("wetland-source");
      }
    };
  }, [mapsInitialized]);

  return null;
}
