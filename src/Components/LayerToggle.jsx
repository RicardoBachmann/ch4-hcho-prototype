import { useState } from "react";

export default function LayerToggle() {
  const [activeLayerMapA, setActiveLayerMapA] = useState(null);
  const [activeLayerMapC, setActiveLayerMapC] = useState(null);

  const productLayers = [
    {
      id: "hcho",
      displayName: "Formaldehyde (HCHO)",
    },
    {
      id: "so2",
      displayName: "Sulfur Dioxide (SO2)",
    },
    {
      id: "o3",
      displayName: "Ozone (O3)",
    },
    { id: "ai", displayName: "Aerosol Index (AI)" },
  ];

  function handleChangeLayer(id, activeLayerMapA, activeLayerMapC) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "black",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      {productLayers.map((layer) => (
        <button key={layer.id}>{layer.displayName}</button>
      ))}
    </div>
  );
}
