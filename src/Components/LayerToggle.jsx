export default function LayerToggle({
  isActive,
  setIsActive,
  mapId,
  targetMap,
}) {
  console.log(
    "LayerToggle rendering with isActive:",
    isActive,
    "mapId:",
    mapId,
    "targetMap:",
    targetMap
  );
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

  // Toggle Layer A
  const handleToggleMapA = (layerId) => {
    console.log("Button clicked:", layerId);
    console.log("Current active layer:", isActive);
    console.log("Target map:", targetMap);
    console.log("mapId:", mapId);
    // Decision logic: Activate or deactivate?
    // Deactivate the layer if already active
    if (isActive === layerId) {
      setIsActive(null);
      console.log("Deactivating layer");
    } else {
      console.log("Activating layer:", layerId);
      setIsActive(layerId); // Activate the new layer
    }
  };

  // Toggle Layer C
  const handleToggleMapC = (layerId) => {
    console.log("Button clicked:", layerId);
    console.log("Current active layer:", isActive);
    console.log("Target map:", targetMap);
    console.log("mapId:", mapId);
    // Decision logic: Activate or deactivate?
    // Deactivate the layer if already active
    if (isActive === layerId) {
      setIsActive(null);
      console.log("Deactivating layer");
    } else {
      console.log("Activating layer:", layerId);
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
            console.log("Button clicked for", layer.id, "on map", mapId);
            if (mapId === "A") {
              handleToggleMapA(layer.id);
            } else if (mapId === "C") {
              handleToggleMapC(layer.id);
            }
          }}
          style={{ backgroundColor: isActive === layer.id ? "green" : null }}
        >
          {layer.displayName}
        </button>
      ))}
    </div>
  );
}
