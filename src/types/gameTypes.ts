export interface Monster {
  id: string;
  name: string;
  type: string;
  health: number;
  maxHealth: number;
  attack: number;
  attackDelay: number;
  moveSpeed: number;
  attackRange: number;
  attackType: "melee" | "ranged";
  splashDamage: boolean;
  maxTargets: number;
  cost: number;
  sprite: string;
  statusEffects: StatusEffect[];
  level: number;
}

export interface StatusEffect {
  type: "slow" | "shock" | "poison" | "reflect";
  value: number;
  duration: number;
}

export interface Commander {
  id: string;
  name: string;
  attackBoost: number;
  specialSkill: SpecialSkill;
  sprite: string;
}

export interface SpecialSkill {
  name: string;
  description: string;
  cooldown: number;
  effect: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  monsterTypeBoost: string;
  statBoosts: {
    health?: number;
    attack?: number;
    moveSpeed?: number;
    attackDelay?: number;
  };
  specialEffects: string[];
}

export interface UpgradeOption {
  id: string;
  type: "newMonster" | "upgradeMonster" | "commander" | "goldBoost";
  name: string;
  description: string;
  value: any;
}

export interface GameState {
  playerTowerHealth: number;
  enemyTowerHealth: number;
  gold: number;
  experience: number;
  level: number;
  timeRemaining: number;
  score: number;
}
