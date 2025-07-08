import { useContext, useEffect } from "react";
import { MapContext } from "../../../context/MapContext";
import useLpjEosimData from "../../../hooks/useLpjEosimData";

export default function WetlandLayer() {
  console.log("WetlandLayer component mounted!");
  const { mapRefB, mapsInitialized } = useContext(MapContext);
  const { lpjEosimData } = useLpjEosimData();

  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !lpjEosimData) {
      console.log("Early return - conditions not met");
      return;
    }
    console.log("LPJ-EOSIM data loaded:", lpjEosimData);
    console.log("First LPJ-EOSIM entry structure:", lpjEosimData.feed.entry[0]);

    async function processWetlandsPNG(entry) {
      console.log("processWetlandsPNG called!");

      const pngLink = entry.links[7];
      console.log("PNG URL:", pngLink.href);
      if (!pngLink) return;

      const nasaProxyUrl = pngLink.href.replace(
        "https://data.lpdaac.earthdatacloud.nasa.gov",
        "/api/nasa"
      );

      try {
        const response = await fetch(nasaProxyUrl);
        if (!response.ok) {
          throw new Error(
            `NASA API Error: ${response.status} ${response.statusText}`
          );
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
      } catch (error) {
        console.error(`PNG loading failed:`, error);
        return null;
      }
    }

    function addWetlandRasterLayer(mapsInitialized, mapRefB, imageUrl, entry) {
      if (!mapsInitialized || !mapRefB.current || !imageUrl) return;
      const sourceId = "wetland-source";
      const [lat_min, lng_min, lat_max, lng_max] = entry.boxes[0]
        .split(" ")
        .map(Number);

      const coordinates = [
        [-170, 80], // Top-left
        [170, 80], // Top-right
        [170, -80], // Bottom-right
        [-170, -80], // Bottom-left
      ];

      console.log("Box values:", { lat_min, lng_min, lat_max, lng_max });
      console.log("Coordinates:", coordinates);
      if (!mapRefB.current.getSource(sourceId)) {
        mapRefB.current.addSource(sourceId, {
          type: "image",
          url: imageUrl,
          coordinates: coordinates,
        });
      } else {
        console.warn(`PNG Source ${sourceId} already exists, skipping`);
      }
      const layerId = "wetland-layer";
      if (!mapRefB.current.getLayer(layerId)) {
        mapRefB.current.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          paint: {
            "raster-opacity": 0.8,
          },
        });
      } else {
        console.warn(`PNG Layer ${layerId} already exists, skipping`);
      }
    }
    const loadAddLayer = async () => {
      const entry = lpjEosimData.feed.entry[0];
      const imageUrl = await processWetlandsPNG(entry);
      if (imageUrl) {
        addWetlandRasterLayer(mapsInitialized, mapRefB, imageUrl, entry);
      }
    };
    console.log("About to call loadAddLayer");
    console.log(
      "Debug: lpjEosimData structure:",
      lpjEosimData.feed.entry[0].links[7]
    );
    loadAddLayer();
  }, [mapsInitialized, mapRefB, lpjEosimData]);

  return null;
}
