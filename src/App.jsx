import React, { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Routes from "./Routes";
import AppPromo from "./components/AppPromo";
import OfflineBanner from "./components/ui/OfflineBanner";
import OneSignal from "@onesignal/capacitor-plugin";
import { Capacitor } from "@capacitor/core";

function App() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const initOneSignal = async () => {
        try {
          await OneSignal.initialize("5b4c867b-da23-4cfb-a96b-68264cd7b09b");
          await OneSignal.Notifications.requestPermission(true);
        } catch (err) {
          console.error("Failed to initialize OneSignal:", err);
        }
      };
      initOneSignal();
    }
  }, []);

  return (
    <AuthProvider>
      <Routes />
      <AppPromo />
      <OfflineBanner />
    </AuthProvider>
  );
}

export default App;
