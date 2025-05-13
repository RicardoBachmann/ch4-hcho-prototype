import { useEffect, useState } from "react";
import fetchDLRStacData from "../../sentinel5DLRdata";

export default function FormaldehydeLayer({ mapRefs }) {
  const [stacData, setStacData] = useState(null);
  const [cogUrl, setCogUrl] = useState(null);

  useEffect(() => {
    fetchDLRStacData().then((data) => {
      console.log("Received data:", data);
      setStacData(data);
    });
  }, [mapRefs]);

  useEffect(() => {
    if (stacData && stacData.features && stacData.features.length > 0) {
      const firstItem = stacData.features[0];
      console.log("First STAC item", firstItem);
      if (firstItem.assets && firstItem.assets.hcho) {
        const url = firstItem.assets.hcho.href;
        setCogUrl(url);
        console.log("COG URL saved", url);
      }
    }
  }, [stacData]);

  console.log("mapRefs structure:", mapRefs);

  useEffect(() => {
    if (cogUrl && mapRefs && mapRefs.mapA) {
      console.log("Adding WMS layers to map A and C");

      const wmsUrl =
        "https://geoservice.dlr.de/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_HCHO_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0";

      //Map A
      if (mapRefs.mapA.isStyleLoaded()) {
        if (!mapRefs.mapA.getSource("hcho-source-a"))
          mapRefs.mapA.addSource("hcho-source-a", {
            type: "raster",
            tiles: [wmsUrl],
            tileSize: 256,
          });
        mapRefs.mapA.addLayer({
          id: "hcho-layer-a",
          type: "raster",
          source: "hcho-source-a",
          paint: {
            "raster-opacity": 0.7,
          },
        });
      }
    }
    // Clean up
    return () => {
      if (mapRefs.mapA) {
        if (mapRefs.mapA.getLayer("hcho-layer-a")) {
          mapRefs.mapA.removeLayer("hcho-layer-a");
        }
        if (mapRefs.mapA.getSource("hcho-source-a")) {
          mapRefs.mapA.removeSource("hcho-source-a");
        }
      }
    };
  }, [cogUrl, mapRefs]);

  return null;
}
