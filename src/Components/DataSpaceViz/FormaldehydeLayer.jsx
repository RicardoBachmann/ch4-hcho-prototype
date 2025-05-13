import { useEffect, useState } from "react";
import fetchDLRStacData from "../../sentinel5DLRdata";

export default function FormaldehydeLayer({ mapRefs }) {
  const [stacData, setStacData] = useState(null);

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
      if (firstItem.assets) {
        console.log("Available assets:", Object.keys(firstItem.assets));

        //HCHO GeoTIFF search
        if (firstItem.assets.hcho) {
          console.log("HCHO assets:", firstItem.assets.hcho);
          console.log("COG URL:", firstItem.assets.hcho.href);
        }
      }
    }
  }, [stacData]);

  return null;
}
