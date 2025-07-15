import { useContext } from "react";
import { LayerContext } from "../../context/LayerContext";

export default function Toggle({ mapId }) {
  const { activeLayers, toggleLayer } = useContext(LayerContext);

  const handleToggle = (mapId, layerId) => {
    console.log(`Toggling ${layerId} for map ${mapId}`);
    toggleLayer(`map${mapId}`, layerId); // "B" → "mapB"
  };

  const layers = [
    { id: "Formaldehyde", name: "Formaldehyde" },
    { id: "EmitV001", name: "Emit V001" },
    { id: "EmitV002", name: "Emit V002" },
    { id: "Wetlands", name: "Wetlands" },
    { id: "HydropowerDams", name: "HydropowerDams" },
  ];

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
      {layers.map((layer) => {
        // Get current visibility for this specific map + layer
        const isVisible =
          activeLayers[`map${mapId}`]?.[layer.id]?.visible || false;

        return (
          <button
            key={layer.id}
            style={{
              display: "block",
              margin: "5px 0",
              backgroundColor: isVisible ? "lightgreen" : "lightgray",
              border: "1px solid #ccc",
              padding: "5px 10px",
              borderRadius: "3px",
            }}
            onClick={() => {
              handleToggle(mapId, layer.id);
            }}
          >
            {layer.name} {isVisible ? "ON" : "OFF"}
          </button>
        );
      })}
    </div>
  );
}
