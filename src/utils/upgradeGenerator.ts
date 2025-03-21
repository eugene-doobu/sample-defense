import { UpgradeOption, Monster } from "../types/gameTypes";
import { getAdvancedMonsters } from "../data/monsters";
import { getCommanders } from "../data/commanders";

export const generateUpgradeOptions = (
  currentLevel: number,
  playerMonsters: Monster[]
): UpgradeOption[] => {
  const options: UpgradeOption[] = [];
  const advancedMonsters = getAdvancedMonsters();
  const commanders = getCommanders();
  
  // Add new monster option if not all advanced monsters are unlocked
  const unlockedMonsterTypes = playerMonsters.map(m => m.type);
  const availableNewMonsters = advancedMonsters.filter(
    m => !unlockedMonsterTypes.includes(m.type)
  );
  
  if (availableNewMonsters.length > 0 && Math.random() > 0.3) {
    const randomMonster = availableNewMonsters[Math.floor(Math.random() * availableNewMonsters.length)];
    options.push({
      id: `new_monster_${randomMonster.id}`,
      type: "newMonster",
      name: `Unlock ${randomMonster.name}`,
      description: `Allows you to summon ${randomMonster.name} units`,
      value: randomMonster
    });
  }
  
  // Add monster upgrade options
  if (playerMonsters.length > 0 && Math.random() > 0.2) {
    const randomMonster = playerMonsters[Math.floor(Math.random() * playerMonsters.length)];
    
    // Generate random stat boost
    const statBoosts = [
      {
        stat: "attack",
        value: 10,
        name: "Attack Boost",
        description: `Increase ${randomMonster.name}'s attack by 10`
      },
      {
        stat: "health",
        value: 30,
        name: "Health Boost",
        description: `Increase ${randomMonster.name}'s health by 30`
      },
      {
        stat: "moveSpeed",
        value: 20,
        name: "Speed Boost",
        description: `Increase ${randomMonster.name}'s movement speed by 20`
      },
      {
        stat: "attackDelay",
        value: -100, // Negative because lower delay is better
        name: "Attack Speed",
        description: `Decrease ${randomMonster.name}'s attack delay by 0.1s`
      }
    ];
    
    const randomStatBoost = statBoosts[Math.floor(Math.random() * statBoosts.length)];
    
    options.push({
      id: `upgrade_monster_${randomMonster.id}_${randomStatBoost.stat}`,
      type: "upgradeMonster",
      name: randomStatBoost.name,
      description: randomStatBoost.description,
      value: {
        monsterId: randomMonster.id,
        stats: {
          [randomStatBoost.stat]: randomMonster[randomStatBoost.stat as keyof Monster] + randomStatBoost.value
        }
      }
    });
  }
  
  // Add commander option if level is appropriate (every 3 levels)
  if (currentLevel % 3 === 0) {
    const randomCommander = commanders[Math.floor(Math.random() * commanders.length)];
    options.push({
      id: `commander_${randomCommander.id}`,
      type: "commander",
      name: `Recruit ${randomCommander.name}`,
      description: `${randomCommander.specialSkill.description}`,
      value: randomCommander
    });
  }
  
  // Add gold boost option
  options.push({
    id: "gold_boost",
    type: "goldBoost",
    name: "Gold Rush",
    description: "Increase gold generation by 20% for 30 seconds",
    value: {
      percentage: 20,
      duration: 30
    }
  });
  
  // Ensure we have at least 3 options
  while (options.length < 3) {
    // Add generic attack boost for all monsters
    options.push({
      id: `global_attack_boost_${Math.random()}`,
      type: "upgradeMonster",
      name: "Global Attack",
      description: "Increase all monsters' attack by 5",
      value: {
        monsterId: "all",
        stats: {
          attack: 5
        }
      }
    });
  }
  
  // Shuffle and return only 3 options
  return shuffleArray(options).slice(0, 3);
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
