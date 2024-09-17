import "./App.css";
import APISettings from "@/components/APISettings";
import GameUI from "./components/GameUI";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">Neko's Treasure</h1>
        <APISettings />
      </nav>
      <GameUI />
    </div>
  );
}

export default App;
