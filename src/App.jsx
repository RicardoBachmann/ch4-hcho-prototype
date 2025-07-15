import "./App.css";
import { MapProvider } from "./context/MapContext.jsx";
import { LayerProvider } from "./context/LayerContext.jsx";
import MainContainer from "./Components/maps/MainContainer.jsx";

function App() {
  return (
    <MapProvider>
      <LayerProvider>
        <MainContainer />
      </LayerProvider>
    </MapProvider>
  );
}

export default App;
