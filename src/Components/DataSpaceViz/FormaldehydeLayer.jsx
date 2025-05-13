import { useEffect } from "react";
import fetchDLRStacData from "../../sentinel5DLRdata";

export default function FormaldehydeLayer({ mapRefs }) {
  useEffect(() => {
    fetchDLRStacData().then((data) => {
      console.log(data);
    });
  }, [mapRefs]);

  return null;
}
