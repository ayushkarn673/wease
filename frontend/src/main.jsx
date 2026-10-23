import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import CityProvider from "./context/CityProvider";
import ThemedToaster from "./components/shared/ThemedToaster";
import "leaflet/dist/leaflet.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CityProvider>
        {/* Respect the OS "reduce motion" setting for every animation in the app. */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
        <ThemedToaster />
      </CityProvider>
    </AuthProvider>
  </BrowserRouter>
);