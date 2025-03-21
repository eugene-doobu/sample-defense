import { Commander } from "../types/gameTypes";
import Assets from "../assets.json";

export const getCommanders = (): Commander[] => {
  return [
    {
      id: "commander1",
      name: "General Valor",
      attackBoost: 15, // 15% attack boost to all monsters
      specialSkill: {
        name: "Battle Cry",
        description: "Increases attack speed of all monsters by 30% for 10 seconds",
        cooldown: 30, // seconds
        effect: "attackSpeedBoost"
      },
      sprite: Assets.commanders.commander1.url
    },
    {
      id: "commander2",
      name: "Archmage Frost",
      attackBoost: 10,
      specialSkill: {
        name: "Blizzard",
        description: "Slows all enemy monsters by 50% for 8 seconds",
        cooldown: 40,
        effect: "slowEnemies"
      },
      sprite: Assets.commanders.commander2.url
    },
    {
      id: "commander3",
      name: "Captain Shield",
      attackBoost: 5,
      specialSkill: {
        name: "Fortify",
        description: "Increases health of all monsters by 30% for 15 seconds",
        cooldown: 45,
        effect: "healthBoost"
      },
      sprite: Assets.commanders.commander3.url
    }
  ];
};
