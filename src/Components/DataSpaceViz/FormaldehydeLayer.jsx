import { useEffect } from "react";

export default function FormaldehydeLayer({ data, mapRefs }) {
  useEffect(() => {
    console.log("FormaldehydeLayer has been loaded");

    // Nur fortfahren, wenn die Kartenreferenzen vorhanden sind
    if (!mapRefs || !mapRefs.mapA) {
      console.log("Keine Map-Referenzen verfügbar");
      return;
    }

    // Funktion zum Hinzufügen eines Test-Layers
    const addTestLayer = () => {
      console.log("Versuche Test-Layer hinzuzufügen");

      try {
        // Vorhandenen Layer und Quelle entfernen, falls sie existieren
        if (mapRefs.mapA.getLayer("test-fill-layer")) {
          mapRefs.mapA.removeLayer("test-fill-layer");
        }
        if (mapRefs.mapA.getLayer("test-outline-layer")) {
          mapRefs.mapA.removeLayer("test-outline-layer");
        }
        if (mapRefs.mapA.getSource("test-source")) {
          mapRefs.mapA.removeSource("test-source");
        }

        // Aktuellen Kartenmittelpunkt ermitteln
        const center = mapRefs.mapA.getCenter();
        console.log("Kartenmittelpunkt:", center);

        // Ein Polygon um den aktuellen Kartenmittelpunkt erstellen
        const centerLng = center.lng;
        const centerLat = center.lat;
        const offset = 5; // 5 Grad in jede Richtung

        // Quelle mit einem Polygon um den aktuellen Mittelpunkt hinzufügen
        mapRefs.mapA.addSource("test-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { name: "Test Layer" },
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [centerLng - offset, centerLat - offset],
                      [centerLng + offset, centerLat - offset],
                      [centerLng + offset, centerLat + offset],
                      [centerLng - offset, centerLat + offset],
                      [centerLng - offset, centerLat - offset], // Schließen des Rings
                    ],
                  ],
                },
              },
            ],
          },
        });

        // Fill-Layer hinzufügen mit auffälliger Farbe
        mapRefs.mapA.addLayer({
          id: "test-fill-layer",
          type: "fill",
          source: "test-source",
          paint: {
            "fill-color": "#FF00FF", // Magenta für bessere Sichtbarkeit
            "fill-opacity": 0.5,
          },
        });

        // Outline-Layer hinzufügen
        mapRefs.mapA.addLayer({
          id: "test-outline-layer",
          type: "line",
          source: "test-source",
          paint: {
            "line-color": "#FF00FF",
            "line-width": 3,
          },
        });

        console.log("Test-Layer erfolgreich hinzugefügt");
      } catch (error) {
        console.error("Fehler beim Hinzufügen des Test-Layers:", error);
        console.error("Fehlerstapel:", error.stack);
      }
    };

    // Sicherstellen, dass wir den Layer hinzufügen, wenn die Karte bereit ist
    const setupLayer = () => {
      if (mapRefs.mapA.loaded()) {
        console.log("Karte ist geladen, füge Layer hinzu");
        addTestLayer();
      } else {
        console.log("Karte noch nicht geladen, warte auf 'load' Event");
        mapRefs.mapA.once("load", () => {
          console.log("Karten-Load-Event ausgelöst");
          addTestLayer();
        });
      }
    };

    // Einen kleinen Timeout hinzufügen, um sicherzustellen, dass Mapbox bereit ist
    setTimeout(setupLayer, 1000);

    // Aufräumen beim Entladen der Komponente
    return () => {
      if (mapRefs && mapRefs.mapA) {
        try {
          if (mapRefs.mapA.getLayer("test-fill-layer")) {
            mapRefs.mapA.removeLayer("test-fill-layer");
          }
          if (mapRefs.mapA.getLayer("test-outline-layer")) {
            mapRefs.mapA.removeLayer("test-outline-layer");
          }
          if (mapRefs.mapA.getSource("test-source")) {
            mapRefs.mapA.removeSource("test-source");
          }
        } catch (error) {
          console.error("Fehler beim Aufräumen:", error);
        }
      }
    };
  }, [mapRefs]);

  return null;
}
