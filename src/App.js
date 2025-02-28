import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Use state to check if notifications are enabled
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  // Request notification permission on load
  useEffect(() => {
    // Handle "beforeinstallprompt" event to show install button
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setIsInstallable(true);
      setDeferredPrompt(e);
    };

    // Listen to beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Request notification permission when the app loads
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          setIsPushEnabled(true);
        } else {
          console.log("Notification permission denied.");
        }
      });
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Trigger install prompt when user clicks install button
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome);
        setIsInstallable(false);
        setDeferredPrompt(null);
      });
    }
  };

  // Function to send a dummy push notification every 10 seconds
  const sendDummyNotification = () => {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready
        .then((registration) => {
          const options = {
            body: "This is a dummy push notification every 10 seconds.",
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            data: { url: "/" },
          };
          registration.showNotification("Dummy Notification", options);
        })
        .catch((error) => {
          console.error("Error showing notification:", error);
        });
    }
  };

  // Start sending dummy push notifications every 10 seconds
  useEffect(() => {
    if (isPushEnabled) {
      const intervalId = setInterval(sendDummyNotification, 10000);
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [isPushEnabled]);

  return (
    <div className="App">
      <h1>Welcome to My PWA</h1>
      {isInstallable && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
      {isPushEnabled && <p>Push notifications are enabled!</p>}
    </div>
  );
}

export default App;
