import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setIsInstallable(true);
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

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

  return (
    <div className="App">
      <h1>Welcome to My PWA</h1>
      {isInstallable && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
    </div>
  );
}

export default App;
