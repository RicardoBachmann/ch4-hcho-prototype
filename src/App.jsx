import "./App.css";
import { MapProvider } from "./context/MapContext.jsx";
import MainContainer from "./Components/maps/MainContainer.jsx";

function App() {
  return (
    <MapProvider>
      <MainContainer />
    </MapProvider>
  );
}

export default App;
