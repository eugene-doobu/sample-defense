import { Monster } from "../types/gameTypes";
import Assets from "../assets.json";

// Basic monster types for the game
export const monsters = [
  {
    type: "basic",
    name: "기본 전사",
    emoji: "⚔️",
    cost: 50,
    description: "기본적인 근접 공격 유닛"
  },
  {
    type: "tank",
    name: "탱커",
    emoji: "🛡️",
    cost: 100,
    description: "높은 체력을 가진 방어 유닛"
  },
  {
    type: "ranged",
    name: "궁수",
    emoji: "🏹",
    cost: 80,
    description: "원거리 공격이 가능한 유닛"
  },
  {
    type: "fast",
    name: "스카우트",
    emoji: "💨",
    cost: 70,
    description: "빠른 이동 속도를 가진 유닛"
  }
];

export const getBasicMonsters = (): Monster[] => {
  return [
    {
      id: "basic",
      name: "Basic Fighter",
      type: "basic",
      health: 100,
      maxHealth: 100,
      attack: 10,
      attackDelay: 1000, // ms
      moveSpeed: 100,
      attackRange: 50,
      attackType: "melee",
      splashDamage: false,
      maxTargets: 1,
      cost: 50,
      sprite: Assets.monsters.basic.url,
      statusEffects: [],
      level: 1
    },
    {
      id: "tank",
      name: "Tank Warrior",
      type: "tank",
      health: 200,
      maxHealth: 200,
      attack: 8,
      attackDelay: 1500, // ms
      moveSpeed: 70,
      attackRange: 40,
      attackType: "melee",
      splashDamage: false,
      maxTargets: 1,
      cost: 100,
      sprite: Assets.monsters.tank.url,
      statusEffects: [],
      level: 1
    },
    {
      id: "ranged",
      name: "Archer",
      type: "ranged",
      health: 70,
      maxHealth: 70,
      attack: 15,
      attackDelay: 1200, // ms
      moveSpeed: 90,
      attackRange: 200,
      attackType: "ranged",
      splashDamage: false,
      maxTargets: 1,
      cost: 80,
      sprite: Assets.monsters.ranged.url,
      statusEffects: [],
      level: 1
    },
    {
      id: "fast",
      name: "Scout",
      type: "fast",
      health: 60,
      maxHealth: 60,
      attack: 7,
      attackDelay: 800, // ms
      moveSpeed: 150,
      attackRange: 30,
      attackType: "melee",
      splashDamage: false,
      maxTargets: 1,
      cost: 70,
      sprite: Assets.monsters.fast.url,
      statusEffects: [],
      level: 1
    }
  ];
};

export const getAdvancedMonsters = (): Monster[] => {
  return [
    {
      id: "splash",
      name: "Berserker",
      type: "splash",
      health: 120,
      maxHealth: 120,
      attack: 12,
      attackDelay: 1100, // ms
      moveSpeed: 95,
      attackRange: 60,
      attackType: "melee",
      splashDamage: true,
      maxTargets: 3,
      cost: 120,
      sprite: Assets.monsters.basic.url, // Using placeholder
      statusEffects: [],
      level: 1
    },
    {
      id: "poison",
      name: "Venomancer",
      type: "poison",
      health: 80,
      maxHealth: 80,
      attack: 8,
      attackDelay: 1300, // ms
      moveSpeed: 85,
      attackRange: 150,
      attackType: "ranged",
      splashDamage: false,
      maxTargets: 1,
      cost: 130,
      sprite: Assets.monsters.ranged.url, // Using placeholder
      statusEffects: [
        {
          type: "poison",
          value: 3,
          duration: 5000
        }
      ],
      level: 1
    },
    {
      id: "shock",
      name: "Thunderer",
      type: "shock",
      health: 90,
      maxHealth: 90,
      attack: 10,
      attackDelay: 1400, // ms
      moveSpeed: 80,
      attackRange: 180,
      attackType: "ranged",
      splashDamage: false,
      maxTargets: 1,
      cost: 140,
      sprite: Assets.monsters.ranged.url, // Using placeholder
      statusEffects: [
        {
          type: "shock",
          value: 5,
          duration: 3000
        }
      ],
      level: 1
    },
    {
      id: "slow",
      name: "Frost Mage",
      type: "slow",
      health: 75,
      maxHealth: 75,
      attack: 9,
      attackDelay: 1200, // ms
      moveSpeed: 75,
      attackRange: 170,
      attackType: "ranged",
      splashDamage: false,
      maxTargets: 1,
      cost: 120,
      sprite: Assets.monsters.ranged.url, // Using placeholder
      statusEffects: [
        {
          type: "slow",
          value: 30, // 30% slow
          duration: 4000
        }
      ],
      level: 1
    }
  ];
};

export const getEnemyMonsters = (): Monster[] => {
  // Similar to player monsters but with significantly weaker stats
  const basicMonsters = getBasicMonsters();
  
  return basicMonsters.map(monster => ({
    ...monster,
    id: `enemy_${monster.id}`,
    health: monster.health * 0.6, // Reduced from 0.8 to 0.6
    maxHealth: monster.health * 0.6, // Reduced from 0.8 to 0.6
    attack: monster.attack * 0.7, // Reduced from 0.9 to 0.7
    moveSpeed: monster.moveSpeed * 0.9, // Added movement speed reduction
    attackDelay: monster.attackDelay * 1.2, // Added attack delay increase (slower attacks)
    sprite: Assets.enemies[monster.type as keyof typeof Assets.enemies]?.url || monster.sprite
  }));
};
