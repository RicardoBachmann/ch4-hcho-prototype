import { useEffect, useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function OzoneLayer() {
  const { mapRefA, mapRefC } = useContext(MapContext);

  useEffect(() => {
    if (mapRefA && mapRefC) {
      console.log("Adding O3-WMS layer to map A & C");

      const wmsUrl =
        "/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_O3&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefA.isStyleLoaded()) {
        if (!mapRefA.getSource("o3-source-a"))
          mapRefA.addSource("o3-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefA.addLayer({
          id: "o3-layer-a",
          type: "raster",
          source: "o3-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
      //Map C
      if (mapRefC.isStyleLoaded()) {
        if (!mapRefC.getSource("o3-source-c"))
          mapRepC.addSource("o3-source-c", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefC.addLayer({
          id: "o3-layer-c",
          type: "raster",
          source: "o3-source-c",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefA) {
        if (mapRefA.getLayer("o3-layer-a")) {
          mapRefA.removeLayer("o3-layer-a");
        }
        if (mapRefA.getSource("o3-source-a")) {
          mapRefA.removeSource("o3-source-a");
        }
      }
      if (mapRefC) {
        if (mapRefC.getLayer("o3-layer-c")) {
          mapRefC.removeLayer("o3-layer-c");
        }
        if (mapRefC.getSource("o3-source-c")) {
          mapRefC.removeSource("o3-source-c");
        }
      }
    };
  }, []);

  return null;
}
