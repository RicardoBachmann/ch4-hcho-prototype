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
      <h2>Sentinel-5 Data:</h2>
      {sentinelData && sentinelData.formaldehyde && (
        <label>
          {" "}
          Current S5 Position:
          <ul style={{ listStyle: "none5" }}>
            <li>Latitude:{sentinel5Position.latitude.toFixed(3)}</li>
            <li>Longitude:{sentinel5Position.longitude.toFixed(3)}</li>
          </ul>
          <p>
            Instruments:{" "}
            {sentinelData.formaldehyde.features[0].properties.instruments}
          </p>
          <p>
            Processing Level:{" "}
            {
              sentinelData.formaldehyde.features[0].properties[
                "processing:level"
              ]
            }
          </p>
          <p>
            Spatial Resolution:
            {
              sentinelData.formaldehyde.features[0].properties[
                "s5p:spatial_resolution"
              ]
            }
          </p>
        </label>
      )}
      <hr />
      <h4>Formaldehyde HCHO</h4>
      {sentinelData.formaldehyde &&
        (() => {
          const formatDate = (dateString) => new Date(dateString).toUTCString();
          const properties = sentinelData.formaldehyde.features[0].properties;

          return (
            <div>
              <p>
                Date Time: <br />
                {formatDate(properties.datetime)}
              </p>
              <p>
                Start: <br />
                {formatDate(properties.start_datetime)}
              </p>
              <p>
                End: <br />
                {formatDate(properties.end_datetime)}
              </p>
              <p>
                Create: <br />
                {formatDate(properties.created)}
              </p>
              <p>
                Update: <br />
                {formatDate(properties.updated)}
              </p>
            </div>
          );
        })()}
      <hr />
      <h4>Sulfur Dioxide SO2</h4>
      {sentinelData.sulfurDioxide &&
        (() => {
          const formatDate = (dateString) => new Date(dateString).toUTCString();
          const properties = sentinelData.sulfurDioxide.features[0].properties;

          return (
            <div>
              <p>
                Date Time: <br />
                {formatDate(properties.datetime)}
              </p>
              <p>
                Start: <br />
                {formatDate(properties.start_datetime)}
              </p>
              <p>
                End: <br />
                {formatDate(properties.end_datetime)}
              </p>
              <p>
                Create: <br />
                {formatDate(properties.created)}
              </p>
              <p>
                Update: <br />
                {formatDate(properties.updated)}
              </p>
            </div>
          );
        })()}
      <hr />
      <h4>Ozone O3</h4>
      {sentinelData.ozone &&
        (() => {
          const formatDate = (dateString) => new Date(dateString).toUTCString();
          const properties = sentinelData.ozone.features[0].properties;

          return (
            <div>
              <p>
                Date Time: <br />
                {formatDate(properties.datetime)}
              </p>
              <p>
                Start: <br />
                {formatDate(properties.start_datetime)}
              </p>
              <p>
                End: <br />
                {formatDate(properties.end_datetime)}
              </p>
              <p>
                Create: <br />
                {formatDate(properties.created)}
              </p>
              <p>
                Update: <br />
                {formatDate(properties.updated)}
              </p>
            </div>
          );
        })()}
      <hr />
      <h4>Aerosol Index AI</h4>
      {sentinelData.aerosolIndex &&
        (() => {
          const formatDate = (dateString) => new Date(dateString).toUTCString();
          const properties = sentinelData.aerosolIndex.features[0].properties;

          return (
            <div>
              <p>
                Date Time: <br />
                {formatDate(properties.datetime)}
              </p>
              <p>
                Start: <br />
                {formatDate(properties.start_datetime)}
              </p>
              <p>
                End: <br />
                {formatDate(properties.end_datetime)}
              </p>
              <p>
                Create: <br />
                {formatDate(properties.created)}
              </p>
              <p>
                Update: <br />
                {formatDate(properties.updated)}
              </p>
            </div>
          );
        })()}
    </div>
  );
}
