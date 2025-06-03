import React from "react";

export default function MethaneEMITLayer(emitData) {
  emitData().then((result) => {
    console.log("Test completed:", result);
  });
  return <></>;
}
