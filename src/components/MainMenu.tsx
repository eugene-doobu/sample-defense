import { useState } from "react";
import { useGameContext } from "../context/GameContext";
import Assets from "../assets.json";

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const { dailyTheme } = useGameContext();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">Tower Defense Battle</h1>
      
      {dailyTheme && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 text-green-400">Today's Theme: {dailyTheme.name}</h2>
          <p className="mb-2">{dailyTheme.description}</p>
          <div className="mt-3">
            <h3 className="font-semibold text-yellow-300">Special Effects:</h3>
            <ul className="list-disc pl-5 mt-1">
              {dailyTheme.specialEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={onStartGame}
          className="py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
        >
          Start Game
        </button>
        
        <button
          onClick={() => setShowRules(!showRules)}
          className="py-2 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {showRules ? "Hide Rules" : "Show Rules"}
        </button>
      </div>

      {showRules && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-blue-300">Game Rules</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Summon monsters to attack the enemy tower while defending your own</li>
            <li>Collect gold over time to summon more monsters</li>
            <li>Defeat enemy monsters to gain experience and level up</li>
            <li>Choose upgrades when you level up to strengthen your army</li>
            <li>The game ends when your tower is destroyed or time runs out (10 minutes)</li>
            <li>Your goal is to score as many points as possible by destroying enemy units and damaging their tower</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
