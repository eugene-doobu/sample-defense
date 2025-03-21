import { useEffect, useState } from "react";
import "./App.css";
import GameContainer from "./components/GameContainer";
import MainMenu from "./components/MainMenu";
import { GameProvider } from "./context/GameContext";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <GameProvider>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900">
        {!gameStarted ? (
          <MainMenu onStartGame={() => setGameStarted(true)} />
        ) : (
          <GameContainer />
        )}
      </div>
    </GameProvider>
  );
}

export default App;
