import { Theme } from "../types/gameTypes";

// List of possible themes
const themeOptions: Theme[] = [
  {
    id: "melee-rush",
    name: "Melee Rush",
    description: "Melee monsters are more common and have increased attack power.",
    monsterTypeBoost: "melee",
    statBoosts: {
      attack: 20,
    },
    specialEffects: ["Melee monsters have 10% chance to stun on hit"],
  },
  {
    id: "ranged-dominance",
    name: "Ranged Dominance",
    description: "Ranged monsters are more common and have increased attack range.",
    monsterTypeBoost: "ranged",
    statBoosts: {
      attackDelay: -10, // Lower delay means faster attacks
    },
    specialEffects: ["Ranged attacks have 15% chance to slow targets"],
  },
  {
    id: "tank-fortress",
    name: "Tank Fortress",
    description: "Tank monsters are more common and have increased health.",
    monsterTypeBoost: "tank",
    statBoosts: {
      health: 30,
    },
    specialEffects: ["Tank monsters regenerate 1% health per second"],
  },
  {
    id: "speed-demons",
    name: "Speed Demons",
    description: "Fast monsters are more common and have increased movement speed.",
    monsterTypeBoost: "fast",
    statBoosts: {
      moveSpeed: 25,
    },
    specialEffects: ["Fast monsters have 20% chance to dodge attacks"],
  },
  {
    id: "poison-plague",
    name: "Poison Plague",
    description: "Monsters have a chance to apply poison effects.",
    monsterTypeBoost: "all",
    statBoosts: {},
    specialEffects: ["All monsters have 25% chance to poison targets", "Poison deals 2% max health per second"],
  },
];

export const generateDailyTheme = (): Theme => {
  // Use the current date as a seed for the random theme
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple pseudo-random number generator using the seed
  const randomIndex = seed % themeOptions.length;
  
  return themeOptions[randomIndex];
};
