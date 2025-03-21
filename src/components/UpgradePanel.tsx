import { useState } from "react";
import { useGameContext } from "../context/GameContext";
import { UpgradeOption } from "../types/gameTypes";
import { generateUpgradeOptions } from "../utils/upgradeGenerator";

interface UpgradePanelProps {
  onClose: () => void;
}

const UpgradePanel = ({ onClose }: UpgradePanelProps) => {
  const { level, setLevel, experience, setExperience, playerMonsters, upgradeMonster, setCommander } = useGameContext();
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOption[]>(generateUpgradeOptions(level, playerMonsters));
  
  const handleSelectUpgrade = (option: UpgradeOption) => {
    // Apply the selected upgrade
    switch (option.type) {
      case "newMonster":
        // Will be handled by the game scene
        const event = new CustomEvent("unlockMonster", { detail: option.value });
        document.dispatchEvent(event);
        break;
      case "upgradeMonster":
        if (option.value.monsterId && option.value.stats) {
          upgradeMonster(option.value.monsterId, option.value.stats);
        }
        break;
      case "commander":
        setCommander(option.value);
        break;
      case "goldBoost":
        // Will be handled by the game scene
        const goldEvent = new CustomEvent("goldBoost", { detail: option.value });
        document.dispatchEvent(goldEvent);
        break;
    }
    
    // Level up and reset experience
    setLevel(level + 1);
    setExperience(0);
    onClose();
  };
  
  const handleReroll = () => {
    // Could cost gold or other resources
    setUpgradeOptions(generateUpgradeOptions(level, playerMonsters));
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">Level Up!</h2>
      <p className="text-center mb-6 text-gray-300">Choose an upgrade to continue</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {upgradeOptions.map((option) => (
          <div 
            key={option.id}
            className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex flex-col items-center"
            onClick={() => handleSelectUpgrade(option)}
          >
            <h3 className="font-semibold mb-2 text-center text-blue-300">{option.name}</h3>
            <p className="text-sm text-center text-gray-300">{option.description}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleReroll}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Reroll Options
        </button>
        
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default UpgradePanel;
