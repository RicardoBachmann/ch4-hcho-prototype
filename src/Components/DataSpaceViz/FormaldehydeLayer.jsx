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

  useEffect(() => {
    if (cogUrl) {
      console.log("COG URL ready to use:", cogUrl);
    }
  }, [cogUrl]);

  return null;
}
