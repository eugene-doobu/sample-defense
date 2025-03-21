import React from "react";
import { monsters } from "../data/monsters";
import { useGameContext } from "../context/GameContext";

const MonsterSelection: React.FC = () => {
  const { gold, setGold } = useGameContext();

  const summonMonster = (type: string, cost: number) => {
    // Check if player has enough gold
    if (gold < cost) {
      console.log("Not enough gold!");
      return;
    }

    // Deduct gold
    setGold(gold - cost);

    // Get monster data from the monsters array
    const monsterData = monsters.find(m => m.type === type);
    if (!monsterData) {
      console.error(`Monster type ${type} not found!`);
      return;
    }

    // Dispatch event to summon monster
    const event = new CustomEvent("summonMonster", { 
      detail: {
        id: type,
        type: type,
        name: monsterData.name,
        health: type === "tank" ? 200 : type === "ranged" ? 70 : type === "fast" ? 60 : 100,
        maxHealth: type === "tank" ? 200 : type === "ranged" ? 70 : type === "fast" ? 60 : 100,
        attack: type === "tank" ? 8 : type === "ranged" ? 15 : type === "fast" ? 7 : 10,
        attackDelay: type === "tank" ? 1500 : type === "ranged" ? 1200 : type === "fast" ? 800 : 1000,
        moveSpeed: type === "tank" ? 70 : type === "ranged" ? 90 : type === "fast" ? 150 : 100,
        attackRange: type === "ranged" ? 200 : type === "tank" ? 40 : type === "fast" ? 30 : 50,
        attackType: type === "ranged" ? "ranged" : "melee",
        splashDamage: false,
        maxTargets: 1,
        cost: cost,
        statusEffects: [],
        level: 1
      }
    });
    document.dispatchEvent(event);
    
    console.log(`Summoned ${monsterData.name} for ${cost} gold`);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">소환 가능한 몬스터</h2>
      <div className="grid grid-cols-2 gap-2">
        {monsters.map((monster) => (
          <button
            key={monster.type}
            onClick={() => summonMonster(monster.type, monster.cost)}
            className={`flex items-center justify-between p-2 rounded ${
              gold >= monster.cost
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={gold < monster.cost}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-2">{monster.emoji}</span>
              <div>
                <div className="text-white font-medium">{monster.name}</div>
                <div className="text-xs text-gray-300">{monster.description}</div>
              </div>
            </div>
            <div className="text-yellow-300 font-bold">{monster.cost}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonsterSelection;
