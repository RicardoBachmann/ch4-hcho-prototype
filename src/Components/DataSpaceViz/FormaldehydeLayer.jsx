import { useEffect } from "react";

export default function FormaldehydeLayer(data, mapRef) {
  console.log("FormaldehydeData", data);

  useEffect(() => {
    mapRef.current.on("load", () => {
      mapRef.current.addSource("HCHO-data", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [data.coordinates[0]],
          },
        },
      });
    });
  }, []);

  return <></>;
}
