import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import CityProvider from "./context/CityProvider";
import { Toaster } from "./components/ui/sonner";
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
        <Toaster position="top-right" theme="system" closeButton />
      </CityProvider>
    </AuthProvider>
  </BrowserRouter>
);