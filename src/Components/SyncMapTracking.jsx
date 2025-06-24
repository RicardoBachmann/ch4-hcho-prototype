import { useRef, useEffect, useState, useContext } from "react";
import mapboxGl from "mapbox-gl";
import syncMaps from "@mapbox/mapbox-gl-sync-move";
import "mapbox-gl/dist/mapbox-gl.css";

import MethaneEMITLayer from "./DataSpaceViz/MethaneEMITLayer";
import DamLayer from "./DataSpaceViz/DamLayer";

import LayerToggle from "./ui/LayerToggle.jsx";
import ControlPanel from "./ui/ControlPanel.jsx";
import { useSatellitePosition } from "../hooks/useSatellitePosition";
import { MapContext } from "../context/MapContext.jsx";

export default function SyncMapTracking() {
  const { sentinelPosition, loading, error } = useSatellitePosition();
  // Refs(DOM anchor) for Mabpox-maps
  const mapContainerRefA = useRef(null);
  const mapContainerRefB = useRef(null);
  const mapContainerRefC = useRef(null);

  const {
    mapRefA,
    mapRefB,
    mapRefC,
    mapsInitialized,
    setMapsInitialized,
    activeMapLayers,
    setActiveMapLayers,
  } = useContext(MapContext);

  // States for click-based reverse geocoding feature
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [clickedLocation, setClickedLocation] = useState("");
  const [geocodingData, setGeocodingData] = useState(null);

  const activeLayerA = activeMapLayers.mapA;
  const activeLayerC = activeMapLayers.mapC;
  console.log(
    "Current active product Layer-A:",
    activeLayerA,
    "Current active product Layer-C:",
    activeLayerC
  );

  // Function enable switching between data layers by
  // checking whether a layer is already active and activating or deactivating it accordingly
  const handleToggleMapA = (layerId) => {
    console.log("Toggle Map-A called with layer-Id:", layerId);
    setActiveMapLayers((prev) => {
      const newState = {
        ...prev,
        mapA: prev.mapA === layerId ? null : layerId,
      };

      console.log("New state after toggle:", newState);
      return newState;
    });
  };

  const handleToggleMapC = (layerId) => {
    console.log("Toggle Map-C called with layer-Id:", layerId);
    setActiveMapLayers((prev) => {
      const newState = {
        ...prev,
        mapC: prev.mapC === layerId ? null : layerId,
      };

      console.log("New state after toggle:", newState);
      return newState;
    });
  };

  // !IMPORTANT! For sync map style has to be the same in all 3 Layer projection
  useEffect(() => {
    if (mapsInitialized) return;
    mapboxGl.accessToken =
      "pk.eyJ1IjoiZGV0cm9pdDMxMyIsImEiOiJjbTRqb3ljbTQwZnJxMmlzaTRtMWRzcnhpIn0.akOKBt52fpXDljrtyHo8wg";

    const defaultPosition = [-90.96, -0.47];
    mapRefA.current = new mapboxGl.Map({
      container: mapContainerRefA.current,
      center: defaultPosition,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: false,
    });

    mapRefB.current = new mapboxGl.Map({
      container: mapContainerRefB.current,
      center: defaultPosition,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: true,
    });

    mapRefC.current = new mapboxGl.Map({
      container: mapContainerRefC.current,
      center: defaultPosition,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 4,
      attributionControl: false,
    });

    const setupMaps = () => {
      syncMaps(mapRefA.current, mapRefB.current, mapRefC.current);
      mapRefA.current.scrollZoom.disable();
      mapRefA.current.dragPan.disable();

      mapRefC.current.scrollZoom.disable();
      mapRefC.current.dragPan.disable();
      setMapsInitialized(true);
    };

    // Wait for all maps to load
    let mapsLoaded = 0;
    const checkAllMapsLoaded = () => {
      mapsLoaded++;
      if (mapsLoaded === 3) {
        setupMaps();
      }
    };

    mapRefA.current.on("load", checkAllMapsLoaded);
    mapRefB.current.on("load", checkAllMapsLoaded);
    mapRefC.current.on("load", checkAllMapsLoaded);

    return () => {
      if (mapRefA.current) mapRefA.current.remove();
      if (mapRefB.current) mapRefB.current.remove();
      if (mapRefC.current) mapRefC.current.remove();
    };
  }, []);

  // Sentinel-5 Satellite postion data
  useEffect(() => {
    if (
      !mapsInitialized ||
      !mapRefB.current ||
      !sentinelPosition?.longitude ||
      !sentinelPosition?.latitude
    )
      return;

    // Skip if invalid coordinates
    if (!sentinelPosition.longitude || !sentinelPosition.latitude) {
      console.warn("Invalid position data:", sentinelPosition);
      return;
    }

    try {
      /*
      // Clear any existing markers
      const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
      existingMarkers.forEach((marker) => marker.remove()); */

      // Clear only SATELLITE markers, not dam markers!!!!!
      const existingSatelliteMarkers = document.querySelectorAll(
        ".mapboxgl-marker.satellite-marker"
      );
      existingSatelliteMarkers.forEach((marker) => marker.remove());

      // Add new marker
      const marker = new mapboxGl.Marker({
        color: "#FF0000",
      })
        .setLngLat([sentinelPosition.longitude, sentinelPosition.latitude])
        .addTo(mapRefB.current);

      // Mark as satellite marker
      marker.getElement().classList.add("satellite-marker");

      // Center the map on the marker
      /*mapRefB.current.flyTo({
        center: [sentinel5Position.longitude, sentinel5Position.latitude],
        zoom: 5,
        essential: true,
        duration: 1500, // Smooth transition
      });*/
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [sentinelPosition, mapsInitialized]);

  // Rendering map layer-data once and save it
  useEffect(() => {
    // Sobald einer der folgenden Bedingungen zurifft, wird die funktion sofort beendet
    if (!mapsInitialized || !mapRefA.current || !mapRefB.current) return;
    // Create all layers with visible prop on
    // Map A

    // Funktion parameters sind in map und mapId
    createAllLayersForMap(mapRefA.current, "a");
    createAllLayersForMap(mapRefC.current, "c");

    // Function for creating all layers for map
    function createAllLayersForMap(map, mapId) {
      createLayer("HCHO", map, mapId);
      createLayer("SO2", map, mapId);
      createLayer("O3", map, mapId);
      createLayer("AI", map, mapId);
    }

    // Assist function for creating a single layer
    function createLayer(layerType, map, mapId) {
      let layerId = `${layerType}-layer-${mapId}`;
      let sourceId = `${layerType}-source-${mapId}`;

      const wmsLayerType = `${layerType}_v2`;

      if (!map.getSource(sourceId)) {
        try {
          console.log(
            `Adding source ${sourceId} with layer ${wmsLayerType} successfully`
          );
          map.addSource(sourceId, {
            type: "raster",
            tiles: [
              `/api/dlr/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_${wmsLayerType}&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0`,
            ],
            tileSize: 256,
          });
          console.log(`Source ${sourceId} added successfully`);
        } catch (error) {
          console.error(`Error adding source ${sourceId}:`, error);
        }
      }

      // Create layer if not exist
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          layout: {
            visibility: "none",
          },
          paint: {
            "raster-opacity": 0.7,
          },
        });
        console.log(`Layer ${layerId} added successfully`);
      }
    }
  }, [mapsInitialized]); // runs once when map mounted

  useEffect(() => {
    if (mapsInitialized && mapRefA.current) {
      setTimeout(() => {
        console.log("===LAYER DEBUG===");
        console.log(
          "All Layer:",
          mapRefA.current.getStyle().layers.map((l) => l.id)
        );
        console.log(
          "HCHO layer exists:",
          !!mapRefA.current.getLayer("HCHO-layer-a")
        );
        console.log(
          "HCHO Source exists:",
          !!mapRefA.current.getSource("HCHO-source-a")
        );
      }, 3000);
    }
  }, [mapsInitialized]);

  // Visibility control for Map-A
  useEffect(() => {
    if (!mapsInitialized || !mapRefA.current) {
      return;
    }

    const allLayerIds = [
      "HCHO-layer-a",
      "SO2-layer-a",
      "O3-layer-a",
      "AI-layer-a",
    ];

    // Set all layers default of invisible
    allLayerIds.forEach((layerId) => {
      if (mapRefA.current.getLayer(layerId)) {
        mapRefA.current.setLayoutProperty(layerId, "visibility", "none");
      }
    });
    if (activeLayerA) {
      const activeLayerId = `${activeLayerA}-layer-a`;
      if (mapRefA.current.getLayer(activeLayerId)) {
        mapRefA.current.setLayoutProperty(
          activeLayerId,
          "visibility",
          "visible"
        );
      } else {
        console.error("Active layer", activeLayerId, "not found on map");
      }
    }
  }, [activeLayerA, mapsInitialized]);

  // Visibility control for Map-C
  useEffect(() => {
    if (!mapsInitialized || !mapRefC.current) {
      return;
    }

    const allLayerIds = [
      "HCHO-layer-c",
      "SO2-layer-c",
      "O3-layer-c",
      "AI-layer-c",
    ];

    console.log("=== VISIBILITY DEBUG MAP-C ===");
    console.log("activeLayerC:", activeLayerC);

    // Set all layers default of invisible
    allLayerIds.forEach((layerId) => {
      if (mapRefC.current.getLayer(layerId)) {
        mapRefC.current.setLayoutProperty(layerId, "visibility", "none");
        console.log(`Set ${layerId} to NONE`);
      }
    });
    // Show active layer
    if (activeLayerC) {
      const activeLayerId = `${activeLayerC}-layer-c`;
      if (mapRefC.current.getLayer(activeLayerId)) {
        mapRefC.current.setLayoutProperty(
          activeLayerId,
          "visibility",
          "visible"
        );
        console.log(`Set ${activeLayerId} to visible`);

        // DEBUG: Check if its really visible
        setTimeout(() => {
          const visibility = mapRefC.current.getLayoutProperty(
            activeLayerId,
            "visibility"
          );
          console.log(`${activeLayerId} visibility after setting:`, visibility);
        }, 1000);
      } else {
        console.error("Active layer", activeLayerId, "not found on map");
      }
    }
  }, [activeLayerC, mapsInitialized]);

  // Cursor-Location information (Reverse geocoding)

  useEffect(() => {
    if (!mapRefB.current) return;
    const getCoordinates = (e) => {
      const coords = e.lngLat;
      setClickedCoordinates(coords);
    };
    mapRefB.current.on("click", getCoordinates);

    // Event Cleanup
    return () => {
      if (mapRefB.current) {
        mapRefB.current.off("click", getCoordinates);
      }
    };
  }, []);

  /*
  useEffect(() => {
    if (clickedCoordinates) {
      console.log("Clicked coordinations:", clickedCoordinates);
    }
  }, [clickedCoordinates]);*/

  // try/catch for error handling
  useEffect(() => {
    if (!clickedCoordinates) return;
    {
      async function getCoordinatesData() {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${clickedCoordinates.lng},${clickedCoordinates.lat}.json?access_token=pk.eyJ1IjoiZGV0cm9pdDMxMyIsImEiOiJjbTRqb3ljbTQwZnJxMmlzaTRtMWRzcnhpIn0.akOKBt52fpXDljrtyHo8wg`
          );
          const data = await response.json();
          setGeocodingData(data);
          console.log("geocading:", data);
          if (data.features.length > 0) {
            console.log("clicked location is:", data.features[0].place_name);
            const selectedFeature = data.features.find(
              (item) => item.place_name
            );
            setClickedLocation(selectedFeature.place_name);
          } else {
            setClickedLocation("Ozean");
          }
        } catch (error) {
          console.error("Error fetching reverse geocoding data:", error);
          setClickedLocation("Error loading location");
        }
      }
      getCoordinatesData();
    }
  }, [clickedCoordinates]);

  return (
    <>
      <div
        className="map-container-wrapper"
        id="container"
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          height: "100vh",
        }}
      >
        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <div
            ref={mapContainerRefA}
            style={{ width: "100%", height: "100%" }}
          />
          <LayerToggle
            // Current active layer (null or layerId e.g("hcho"))
            isActive={activeMapLayers.mapA}
            // Callback function, that runs when user select a layer
            setIsActive={(layerId) => handleToggleMapA(layerId)}
            // ID, that specifies which map this LayerToggle applies to (A or C)
            mapId="A"
            targetMap="A"
          />
        </div>

        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <div
            ref={mapContainerRefB}
            style={{ width: "100%", height: "100%" }}
          />
          <ControlPanel />
          <MethaneEMITLayer />
          <DamLayer />

          {clickedLocation && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                backgroundColor: "black",
                padding: "5px",
                zIndex: 1000,
              }}
            >
              {clickedLocation}
            </div>
          )}
        </div>

        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <div
            ref={mapContainerRefC}
            style={{ width: "100%", height: "100%" }}
          />

          <LayerToggle
            isActive={activeMapLayers.mapC}
            setIsActive={(layerId) => handleToggleMapC(layerId)}
            mapId="C"
            targetMap="C"
          />
        </div>
      </div>
    </>
  );
}
