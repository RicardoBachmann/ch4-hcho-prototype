import { useContext } from "react";
import { MapContext } from "../../context/MapContext";

export default function Toggle({ mapId }) {
  const { activeMapLayers, setActiveMapLayers, mapsInitialized } =
    useContext(MapContext);
  const layers = [
    { id: "HCHO", name: "Formaldehyde" },
    {
      id: "SO2",
      name: "Sulfur Dioxide",
    },
    { id: "O3", name: "Ozone" },
    {
      id: "AI",
      name: "Aerosol Index",
    },
  ];

  const handleToggle = (layerId) => {
    if (!mapsInitialized) return;

    console.log(`Toggling ${layerId} for map ${mapId}`);
    setActiveMapLayers((prev) => ({
      ...prev,
      [`map${mapId}`]: prev[`map${mapId}`] === layerId ? null : layerId,
    }));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      {layers.map((layer) => (
        <button
          key={layer.id}
          style={{ display: "block", margin: "5px 0" }}
          onClick={() => {
            handleToggle(layer.id);
          }}
        >
          {layer.name}
        </button>
      ))}
    </div>
  );
}
