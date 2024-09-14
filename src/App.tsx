import APISettings from "@/components/APISettings";
import "./App.css";

function App() {
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">Neko's Treasure</h1>
        <APISettings />
      </nav>
    </>
  );
}

export default App;
