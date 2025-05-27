import React from "react";

export default function ControlPanel({
  sentinel5Position,
  clickedLocation,
  sentinelData,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "red",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      <h3>Sentinel 5 Position:</h3>
      <ul>
        <li>Latitude:{sentinel5Position.latitude.toFixed(3)}</li>
        <li>Longitude:{sentinel5Position.longitude.toFixed(3)}</li>
      </ul>
      {sentinelData.formaldehyde && (
        <p>
          Date time:{sentinelData.formaldehyde.features[0].properties.datetime}
        </p>
      )}
    </div>
  );
}
