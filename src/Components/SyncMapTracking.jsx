import { useRef, useEffect, useState } from "react";
import mapboxGl from "mapbox-gl";
import syncMaps from "@mapbox/mapbox-gl-sync-move";
import "mapbox-gl/dist/mapbox-gl.css";

import FormaldehydeLayer from "../Components/DataSpaceViz/FormaldehydeLayer";
import SulfurDioxide from "../Components/DataSpaceViz/SulfurDioxideLayer";
import OzoneLayer from "../Components/DataSpaceViz/OzoneLayer";
import AerosolIndexLayer from "../Components/DataSpaceViz/AerosolIndexLayer";

// import NitrogenDioxideLayer from "../Components/DataSpaceViz/NitrogenDioxideLayer";
// import CarbonMonoxideLayer from "../Components/DataSpaceViz/CarbonMonoxideLayer";
// import MethanLayer from "../Components/DataSpaceViz/MethanLayer";

import LayerToggle from "./LayerToggle";

export default function SyncMapTracking({
  sentinel5Position, // Live coordinates
  onLayerReady, // Callback for map instances to share with app.jsx
  sentinelData, // S5-data for visual layers
}) {
  // Refs(DOM anchor) for Mabpox-maps
  const mapContainerRefA = useRef(null);
  const mapContainerRefB = useRef(null);
  const mapContainerRefC = useRef(null);
  // Refs to initialised Mapbox map instances
  const mapRefA = useRef(null);
  const mapRefB = useRef(null);
  const mapRefC = useRef(null);

  // State to track if maps are initialized attempting to interact with these (def. coding)
  const [mapsInitialized, setMapsInitialized] = useState(false);

  // States to switch between S5-product layers in Map A-C
  // Stores which data layer is active on which map
  const [activeMapLayers, setActiveMapLayers] = useState({
    mapA: null,
    mapC: null,
  });

  const activeLayerA = activeMapLayers.mapA;
  const activeLayerC = activeMapLayers.mapC;

  /*

  // Function enable switching between data layers by
  // checking whether a layer is already active and activating or deactivating it accordingly
  const handleToggleMapA = (layerId) => {
    setActiveMapLayers((prev) => ({
      ...prev,
      mapA: prev.mapA === layerId ? null : layerId,
    }));
  };

  const handleToggleMapC = (layerId) => {
    setActiveMapLayers((prev) => ({
      ...prev,
      mapC: prev.mapC === layerId ? null : layerId,
    }));
  };

  // Toggle Map A
  useEffect(() => {
    if (!mapsInitialized) return;
    // In  Mapbox, each layer has an associated data source. (Delete all A-layers)
    const layerIdsA = [
      "hcho-layer-a",
      "so2-layer-a",
      "o3-layer-a",
      "ai-layer-a",
    ];

    // Runs of each layerIds(A-C) and remove existing layer and its source.
    layerIdsA.forEach((id) => {
      if (mapRefA.current && mapRefA.current.getLayer(id)) {
        mapRefA.current.removeLayer(id);
      }
      // Every layer an associated data source.
      // This line converts a layer name into the cooresponding sosurce name
      // so that both can be removed.
      const sourceId = id.replace("-layer-", "-source-");
      if (mapRefA.current.getSource(sourceId)) {
        mapRefA.current.removeSource(sourceId);
      }
    });
  }, [activeLayerA, mapsInitialized]);

  // Toggle Map C
  useEffect(() => {
    if (!mapsInitialized) return;
    const layerIdsC = [
      "hcho-layer-c",
      "so2-layer-c",
      "o3-layer-c",
      "ai-layer-c",
    ];

    layerIdsC.forEach((id) => {
      if (mapRefC.current && mapRefC.current.getLayer(id)) {
        mapRefC.current.removeLayer(id);
      }
      const sourceId = id.replace("-layer-", "-source-");
      if (mapRefC.current.getSource(sourceId)) {
        mapRefC.current.removeSource(sourceId);
      }
    });
  }, [activeLayerC, mapsInitialized]);

  /*
  // Effect to inform the parent when layers change
  // Dataperformance!
  useEffect(() => {
    if (!mapsInitialized) return;

    // In  Mapbox, each layer has an associated data source. (Delete all A-layers)
    const layerIdsA = [
      "hcho-layer-a",
      "so2-layer-a",
      "o3-layer-a",
      "ai-layer-a",
    ];

    // Runs of each layerIds(A-C) and remove existing layer and its source.
    layerIdsA.forEach((id) => {
      if (mapRefA.current.getLayer(id)) {
        mapRefA.current.removeLayer(id);
      }
      // Every layer an associated data source.
      // This line converts a layer name into the cooresponding sosurce name
      // so that both can be removed.
      const sourceId = id.replace("-layer-", "-source-");
      if (mapRefA.current.getSource(sourceId)) {
        mapRefA.current.removeSource(sourceId);
      }
    });

    // In  Mapbox, each layer has an associated data source. (Delete all A-layers)
    const layerIdsC = [
      "hcho-layer-c",
      "so2-layer-c",
      "o3-layer-c",
      "ai-layer-c",
    ];

    layerIdsC.forEach((id) => {
      if (mapRefC.current.getLayer(id)) {
        mapRefC.current.removeLayer(id);
      }
      const sourceId = id.replace("-layer-", "-source-");
      if (mapRefC.current.getSource(sourceId)) {
        mapRefC.current.removeSource(sourceId);
      }
    });
  }, [activeMapLayers, mapsInitialized]);
  */

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

      // Provides the initialised map instances of the parent component.
      // This callback function enables other components (such as FormaldehydeLayer),
      // directly access the map references and add their own layers,
      // without having to create new map instances.
      if (onLayerReady) {
        onLayerReady({
          mapA: mapRefA.current,
          mapB: mapRefB.current,
          mapC: mapRefC.current,
        });
      }
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

  // Dynamic Sentinel-5 data
  useEffect(() => {
    if (!mapsInitialized || !mapRefB.current || !sentinel5Position) return;

    // Skip if invalid coordinates
    if (!sentinel5Position.longitude || !sentinel5Position.latitude) {
      console.warn("Invalid position data:", sentinel5Position);
      return;
    }

    try {
      // Clear any existing markers
      const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
      existingMarkers.forEach((marker) => marker.remove());

      // Add new marker
      const marker = new mapboxGl.Marker({
        color: "#FF0000",
      })
        .setLngLat([sentinel5Position.longitude, sentinel5Position.latitude])
        .addTo(mapRefB.current);

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
  }, [sentinel5Position, mapsInitialized]);

  // New effect for rendering map layer data once and save it
  useEffect(() => {
    console.log("Layer initialization useEffect running");
    // Sobald einer der folgenden Bedingungen zurifft, wird die funktion sofort beendet
    if (!mapsInitialized || !mapRefA.current || !mapRefB.current) return;
    // Create all layers with visible prop on
    // Map A

    // Funktion parameters sind in map und mapId
    createAllLayersForMap(mapRefA.current, "a");
    createAllLayersForMap(mapRefC.current, "c");

    // Function for creating all layers for map
    function createAllLayersForMap(map, mapId) {
      console.log(`Creating all layers for map ${mapId}`);
      createLayer("hcho", map, mapId);
      createLayer("so2", map, mapId);
      createLayer("o3", map, mapId);
      createLayer("ai", map, mapId);
    }

    // Assist function for creating a single layer
    function createLayer(layerType, map, mapId) {
      console.log(`Creating layer ${layerType} from map ${mapId}`);
      let layerId = `${layerType}-layer-${mapId}`;
      let sourceId = `${layerType}-source-${mapId}`;

      if (!map.getSource(sourceId)) {
        console.log(`Adding source ${sourceId}`);
        map.addSource(sourceId, {
          type: "raster",
          tiles: [
            `https://geoservice.dlr.de/eoc/atmosphere/wms?SERVICE=WMS&REQUEST=GetMap&LAYERS=S5P_TROPOMI_L3_P1D_${layerType}_v2&FORMAT=image/png&TRANSPARENT=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&VERSION=1.3.0`,
          ],
          tileSize: 256,
        });
        console.log(`Source ${sourceId} added successfully`);
      }

      // Create layer if not exist
      if (!map.getLayer(layerId)) {
        console.log(`Adding layer ${layerId}`);
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

  // Visibility control for Map A
  useEffect(() => {
    console.log("Visible control for Map A loaded:");
    if (!mapsInitialized || !mapRefA.current) return;
    console.log("Maps not initialized yet or mapRefA is null");

    const allLayerIds = [
      "hcho-layer-a",
      "so2-layer-a",
      "o3-layer-a",
      "ai-layer-a",
    ];

    // Set all layers default of invisible
    allLayerIds.forEach((layerId) => {
      if (mapRefA.current.getLayer(layerId)) {
        console.log("Set layer:", layerId, "to invisible");
        mapRefA.current.setLayoutProperty(layerId, "visibility", "none");
      } else {
        console.log("Layer", layerId, "not found on map");
      }
    });
    if (activeLayerA) {
      const activeLayerId = `${activeLayerA}-layer-a`;
      if (mapRefA.current.getLayer(activeLayerId)) {
        console.log("Set layer:", layerId, "to visible");
        mapRefA.current.setLayoutProperty(
          activeLayerId,
          "visibility",
          "visible"
        );
      } else {
        console.log("Active layer", activeLayerId, "not found on map");
      }
    } else {
      console.log("No active Layer for Map A");
    }
  }, [activeLayerA, mapsInitialized]);

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
          {/* 
          <LayerToggle
            // Current active layer (null or layerId e.g("hcho"))
            isActive={activeMapLayers.mapA}
            // Callback function, that runs when user select a layer
            setIsActive={(layerId) => handleToggleMapA(layerId)}
            // ID, that specifies which map this LayerToggle applies to (A or C)
            mapId="A"
            targetMap="A"
          />
 */}
        </div>

        <div style={{ flex: 1, height: "100%" }}>
          <div
            ref={mapContainerRefB}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div style={{ flex: 1, position: "relative", height: "100%" }}>
          <div
            ref={mapContainerRefC}
            style={{ width: "100%", height: "100%" }}
          />
          {/* 
          <LayerToggle
            isActive={activeMapLayers.mapC}
            setIsActive={(layerId) => handleToggleMapC(layerId)}
            mapId="C"
            targetMap="C"
          />
           */}
        </div>
      </div>

      {/* Layer-Rendering

      {/*Render Layer only if mapRefs & date are available (def.coding)*/}
      {mapsInitialized && sentinelData && (
        <>
          {/*Map A Layer*/}
          {/*{activeMapLayers.mapA === "hcho" && (
          <FormaldehydeLayer
            data={sentinelData.formaldehyde}
            // Passes all three Mapbox map instances to the layer component.
            // Component must know on which map it should render its data.
            // Because of map-sync, component need access to all 3 refs
            mapRefs={{
              mapA: mapRefA.current,
              mapB: mapRefB.current,
              mapC: mapRefC.current,
            }}
            // Specifies on which of the three maps the layer should actually be rendered
            // targetMap-prop instructed to render data-layers only an the specific map
            targetMap="A"
          />
          )}
          {activeMapLayers.mapA === "so2" && (
            <SulfurDioxide
              data={sentinelData.sulfurDioxide}
              mapRefs={{
                mapA: mapRefA.current,
                mapB: mapRefB.current,
                mapC: mapRefC.current,
              }}
              targetMap="A"
            />
          )}
          {activeMapLayers.mapA === "o3" && (
            <OzoneLayer
              data={sentinelData.ozone}
              mapRefs={{
                mapA: mapRefA.current,
                mapB: mapRefB.current,
                mapC: mapRefC.current,
              }}
              targetMap="A"
            />
          )}
          {activeMapLayers.mapA === "ai" && (
            <AerosolIndexLayer
              data={sentinelData.aerosolIndex}
              mapRefs={{
                mapA: mapRefA.current,
                mapB: mapRefB.current,
                mapC: mapRefC.current,
              }}
              targetMap="A"
            />
          )}
          {/*Map C Layer*/}
          {/*activeMapLayers.mapC === "hcho" && (
          <FormaldehydeLayer
            data={sentinelData.formaldehyde}
            mapRefs={{
              mapA: mapRefA.current,
              mapB: mapRefB.current,
              mapC: mapRefC.current,
            }}
            targetMap="C"
          />
          )}
          {activeMapLayers.mapC === "so2" && (
            <SulfurDioxide
              data={sentinelData.sulfurDioxide}
              mapRefs={{
                mapA: mapRefA.current,
                mapB: mapRefB.current,
                mapC: mapRefC.current,
              }}
              targetMap="C"
            />
          )}
          {activeMapLayers.mapC === "o3" && (
            <OzoneLayer
              data={sentinelData.ozone}
              mapRefs={{
                mapA: mapRefA.current,
                mapB: mapRefB.current,
                mapC: mapRefC.current,
              }}
              targetMap="C"
            />
          )}
          {activeMapLayers.mapC === "ai" && (
            <AerosolIndexLayer
              data={sentinelData.aerosolIndex}
              mapRefs={{
                mapA: mapRefA.current,
                mapB: mapRefB.current,
                mapC: mapRefC.current,
              }}
              targetMap="C"
            />
          )}
          */}
        </>
      )}
    </>
  );
}
