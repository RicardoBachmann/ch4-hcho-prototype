import { useRef, useEffect } from "react";

export default function MapContainerC({ onContainerReady }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && onContainerReady) {
      onContainerReady(containerRef.current);
    }
  }, [onContainerReady]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="map-container-c"
    />
  );
}
