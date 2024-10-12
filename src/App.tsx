import "./App.css";
import { useState } from "react";
import APISettings from "@/components/APISettings";
import GameUI from "./components/GameUI";

function App() {
  const [apiSettingsSet, setApiSettingsSet] = useState(false);

  // Function to update the state when API settings are saved
  const handleSettingsSave = () => {
    setApiSettingsSet(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">Neko's Treasure</h1>
        <APISettings onSettingsSave={handleSettingsSave} />
      </nav>
      <GameUI apiSettingsSet={apiSettingsSet} />
    </div>
  );
}

export default App;
