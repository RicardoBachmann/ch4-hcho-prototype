import { useState } from "react";
import { useSentinelData } from "../hooks/useSentinelData";

export default function ControlPanel({ sentinel5Position }) {
  const { collectionData, loading, error } = useSentinelData();

  const productTypes = [
    {
      id: "hcho",
      name: "Formaldehyde HCHO",
      dataSource: collectionData.formaldehyde,
    },
    {
      id: "so2",
      name: "Sulfur Dioxide SO2",
      dataSource: collectionData.sulfurDioxide,
    },
    {
      id: "o3",
      name: "Ozone O3",
      dataSource: collectionData.ozone,
    },
    {
      id: "ai",
      name: "Aerosol Index AI",
      dataSource: collectionData.aerosolIndex,
    },
  ];
  const [showProduct, setShowProduct] = useState({});
  const [activeButtons, setActiveButtons] = useState([]);

  function handleShowProduct(id) {
    setShowProduct((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }
  if (loading) return <div>Loading Sentinel data...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        border: "1px solid red",
        borderRadius: "5px",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      <h2>Sentinel-5 Data:</h2>
      {collectionData && collectionData.formaldehyde && (
        <label>
          {" "}
          Current S5 Position:
          <ul style={{ listStyle: "none" }}>
            <li>Latitude:{sentinel5Position.latitude.toFixed(3)}</li>
            <li>Longitude:{sentinel5Position.longitude.toFixed(3)}</li>
          </ul>
          <p>
            Instruments:{" "}
            {collectionData.formaldehyde.features[0].properties.instruments}
          </p>
          <p>
            Processing Level:{" "}
            {
              collectionData.formaldehyde.features[0].properties[
                "processing:level"
              ]
            }
          </p>
          <p>
            Spatial Resolution:
            {
              collectionData.formaldehyde.features[0].properties[
                "s5p:spatial_resolution"
              ]
            }
          </p>
        </label>
      )}
      <hr />

      {productTypes.map((item) => {
        if (!item.dataSource) return null;
        const properties = item.dataSource.features[0].properties;
        // Helper function to convert date/time string for all product types
        const formatDate = (dateString) => new Date(dateString).toUTCString();
        return (
          <div>
            <button
              onClick={() => {
                handleShowProduct(item.id);
                if (activeButtons.includes(item.id)) {
                  setActiveButtons(
                    activeButtons.filter((id) => id !== item.id)
                  );
                } else {
                  setActiveButtons([...activeButtons, item.id]);
                }
              }}
              style={{
                backgroundColor: activeButtons.includes(item.id)
                  ? "red"
                  : "black",
              }}
            >
              {item.name}
            </button>
            {showProduct[item.id] && (
              <ul style={{ listStyle: "none" }}>
                <li>
                  Date Time: <br />
                  {formatDate(properties.datetime)}
                </li>
                <li>
                  Start: <br />
                  {formatDate(properties.start_datetime)}
                </li>
                <li>
                  End: <br />
                  {formatDate(properties.end_datetime)}
                </li>
                <li>
                  Create: <br />
                  {formatDate(properties.created)}
                </li>
                <li>
                  Update: <br />
                  {formatDate(properties.updated)}
                </li>
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
