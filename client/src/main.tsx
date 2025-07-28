import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker, setupPWAInstall } from "./lib/pwa";
import { setupOfflineHandling } from "./lib/offline";

// Register service worker for PWA functionality
registerServiceWorker();

// Setup PWA install detection
setupPWAInstall();

// Setup offline handling
setupOfflineHandling();

createRoot(document.getElementById("root")!).render(<App />);
