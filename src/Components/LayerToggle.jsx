export default function LayerToggle({ isActive, setIsActive }) {
  const productLayers = [
    {
      id: "HCHO",
      displayName: "Formaldehyde (HCHO)",
    },
    {
      id: "SO2",
      displayName: "Sulfur Dioxide (SO2)",
    },
    {
      id: "O3",
      displayName: "Ozone (O3)",
    },
    { id: "AI", displayName: "Aerosol Index (AI)" },
  ];

  const handleToggle = (layerId) => {
    // Decision logic: Activate or deactivate?
    // Deactivate the layer if already active
    if (isActive === layerId) {
      setIsActive(null);
    } else {
      setIsActive(layerId); // Activate the new layer
    }
  };

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
        <button
          key={layer.id}
          onClick={() => {
            handleToggle(layer.id);
          }}
          style={{ backgroundColor: isActive === layer.id ? "green" : null }}
        >
          {layer.displayName}
        </button>
      ))}
    </div>
  );
}
