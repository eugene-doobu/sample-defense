import Phaser from "phaser";
import { Monster } from "../../types/gameTypes";
import { getEnemyMonsters } from "../../data/monsters";

export class GameScene extends Phaser.Scene {
  // Game objects
  private playerTower!: Phaser.GameObjects.Sprite;
  private enemyTower!: Phaser.GameObjects.Sprite;
  private playerMonsters: Phaser.Physics.Arcade.Sprite[] = [];
  private enemyMonsters: Phaser.Physics.Arcade.Sprite[] = [];
  
  // Game state
  private playerTowerHealth: number = 1000;
  private enemyTowerHealth: number = 1500; // Reduced from 2000 to 1500
  private goldGenerationTimer: number = 0;
  private goldGenerationRate: number = 1000; // ms between gold generation
  private goldBoostActive: boolean = false;
  private goldBoostTimer: number = 0;
  private difficultyTimer: number = 0;
  private difficultyLevel: number = 1;
  private enemySpawnTimer: number = 0;
  private enemySpawnRate: number = 4000; // Increased from 3000 to 4000 (slower spawns)
  private gameActive: boolean = true;
  
  // Monster data
  private monsterData: { [key: string]: any } = {};
  
  constructor() {
    super("GameScene");
  }

  create() {
    // Set up background
    this.add.image(400, 300, "background");
    
    // Set up towers
    this.playerTower = this.physics.add.sprite(100, 300, "tower");
    this.playerTower.setImmovable(true);
    this.playerTower.setCollideWorldBounds(true);
    
    this.enemyTower = this.physics.add.sprite(700, 300, "enemyTower");
    this.enemyTower.setImmovable(true);
    this.enemyTower.setCollideWorldBounds(true);
    
    // Set up physics
    this.physics.world.setBounds(0, 0, 800, 600);
    
    // Initialize monster data
    this.initMonsterData();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start UI scene
    this.scene.launch("UIScene", {
      playerTowerHealth: this.playerTowerHealth,
      enemyTowerHealth: this.enemyTowerHealth
    });
    
    // Start enemy spawning
    this.enemySpawnTimer = this.time.now;
    this.difficultyTimer = this.time.now;
    this.goldGenerationTimer = this.time.now;
    
    // Give initial gold boost
    this.grantGold(100); // Give extra starting gold
  }

  update(time: number, delta: number) {
    if (!this.gameActive) return;
    
    // Generate gold over time
    if (time > this.goldGenerationTimer) {
      this.generateGold();
      this.goldGenerationTimer = time + this.goldGenerationRate;
    }
    
    // Check if gold boost is active
    if (this.goldBoostActive) {
      this.goldBoostTimer -= delta;
      if (this.goldBoostTimer <= 0) {
        this.goldBoostActive = false;
      }
    }
    
    // Increase difficulty over time
    if (time > this.difficultyTimer) {
      this.increaseDifficulty();
      this.difficultyTimer = time + 60000; // Every minute
    }
    
    // Spawn enemies
    if (time > this.enemySpawnTimer) {
      this.spawnEnemy();
      this.enemySpawnTimer = time + this.enemySpawnRate;
    }
    
    // Update all monsters
    this.updateMonsters(delta);
    
    // Check for game over
    if (this.playerTowerHealth <= 0) {
      this.gameOver();
    }
    
    // Check for victory
    if (this.enemyTowerHealth <= 0) {
      this.victory();
    }
  }

  private initMonsterData() {
    // Initialize player monster data
    const enemyMonsters = getEnemyMonsters();
    enemyMonsters.forEach(monster => {
      this.monsterData[monster.id] = monster;
    });
  }

  private setupEventListeners() {
    // Listen for monster summon events from UI
    document.addEventListener("summonMonster", (e: any) => {
      this.summonPlayerMonster(e.detail);
    });
    
    // Listen for gold boost events
    document.addEventListener("goldBoost", (e: any) => {
      this.activateGoldBoost(e.detail.percentage, e.detail.duration);
    });
  }

  private summonPlayerMonster(monsterData: Monster) {
    // Create sprite for the monster
    const monster = this.physics.add.sprite(
      this.playerTower.x + 50,
      this.playerTower.y + Phaser.Math.Between(-50, 50),
      `monster_${monsterData.type}`
    );
    
    // Set monster properties
    monster.setData("stats", {...monsterData}); // Clone monster data to avoid reference issues
    monster.setData("target", null);
    monster.setData("attackTimer", 0);
    monster.setData("health", monsterData.health);
    monster.setData("maxHealth", monsterData.maxHealth);
    
    // Add health bar
    this.addHealthBar(monster);
    
    // Add to player monsters array
    this.playerMonsters.push(monster);
    
    // Set up collision with enemy monsters
    this.physics.add.overlap(
      monster,
      this.enemyMonsters,
      this.handleMonsterCollision,
      undefined,
      this
    );
    
    // Set up collision with enemy tower
    this.physics.add.overlap(
      monster,
      this.enemyTower,
      this.handleTowerCollision,
      undefined,
      this
    );
    
    // Debug log
    console.log(`Summoned player monster: ${monsterData.name}, ID: ${monsterData.id}`);
    console.log(`Current player monsters: ${this.playerMonsters.length}`);
  }

  private spawnEnemy() {
    // Get random enemy type based on difficulty
    const enemyMonsters = getEnemyMonsters();
    const randomIndex = Phaser.Math.Between(0, enemyMonsters.length - 1);
    const enemyData = enemyMonsters[randomIndex];
    
    // Scale enemy stats based on difficulty (reduced scaling)
    const scaledEnemyData = {
      ...enemyData,
      health: enemyData.health * (1 + (this.difficultyLevel - 1) * 0.15), // Reduced from 0.2 to 0.15
      maxHealth: enemyData.health * (1 + (this.difficultyLevel - 1) * 0.15), // Reduced from 0.2 to 0.15
      attack: enemyData.attack * (1 + (this.difficultyLevel - 1) * 0.08) // Reduced from 0.1 to 0.08
    };
    
    // Create sprite for the enemy
    const enemy = this.physics.add.sprite(
      this.enemyTower.x - 50,
      this.enemyTower.y + Phaser.Math.Between(-50, 50),
      `enemy_${enemyData.type}`
    );
    
    // Set enemy properties
    enemy.setData("stats", {...scaledEnemyData}); // Clone enemy data to avoid reference issues
    enemy.setData("target", null);
    enemy.setData("attackTimer", 0);
    enemy.setData("health", scaledEnemyData.health);
    enemy.setData("maxHealth", scaledEnemyData.maxHealth);
    
    // Add health bar
    this.addHealthBar(enemy);
    
    // Add to enemy monsters array
    this.enemyMonsters.push(enemy);
    
    // Set up collision with player monsters
    this.physics.add.overlap(
      enemy,
      this.playerMonsters,
      this.handleMonsterCollision,
      undefined,
      this
    );
    
    // Set up collision with player tower
    this.physics.add.overlap(
      enemy,
      this.playerTower,
      this.handleTowerCollision,
      undefined,
      this
    );
    
    // Debug log
    console.log(`Spawned enemy: ${enemyData.name}, ID: ${enemyData.id}`);
    console.log(`Current enemy monsters: ${this.enemyMonsters.length}`);
  }

  private addHealthBar(monster: Phaser.GameObjects.Sprite) {
    const healthBar = this.add.graphics();
    monster.setData("healthBar", healthBar);
    
    // Update health bar initially
    this.updateHealthBar(monster);
  }

  private updateHealthBar(monster: Phaser.GameObjects.Sprite) {
    const healthBar = monster.getData("healthBar") as Phaser.GameObjects.Graphics;
    if (!healthBar) return;
    
    const health = monster.getData("health");
    const maxHealth = monster.getData("maxHealth");
    const healthPercentage = Math.max(0, health / maxHealth);
    
    healthBar.clear();
    
    // Background
    healthBar.fillStyle(0x000000, 0.5);
    healthBar.fillRect(monster.x - 15, monster.y - 20, 30, 5);
    
    // Health
    healthBar.fillStyle(healthPercentage > 0.5 ? 0x00ff00 : healthPercentage > 0.25 ? 0xffff00 : 0xff0000, 1);
    healthBar.fillRect(monster.x - 15, monster.y - 20, 30 * healthPercentage, 5);
  }

  private updateMonsters(delta: number) {
    // Update player monsters
    for (let i = this.playerMonsters.length - 1; i >= 0; i--) {
      const monster = this.playerMonsters[i];
      const stats = monster.getData("stats") as Monster;
      
      // Check if monster is dead
      if (monster.getData("health") <= 0) {
        const healthBar = monster.getData("healthBar");
        if (healthBar) healthBar.destroy();
        monster.destroy();
        this.playerMonsters.splice(i, 1);
        continue;
      }
      
      // Update health bar
      this.updateHealthBar(monster);
      
      // Find target if none
      if (!monster.getData("target") || !monster.getData("target").active) {
        if (this.enemyMonsters.length > 0) {
          // Target closest enemy
          let closestEnemy = this.enemyMonsters[0];
          let closestDistance = Phaser.Math.Distance.Between(
            monster.x, monster.y,
            closestEnemy.x, closestEnemy.y
          );
          
          for (let j = 1; j < this.enemyMonsters.length; j++) {
            const distance = Phaser.Math.Distance.Between(
              monster.x, monster.y,
              this.enemyMonsters[j].x, this.enemyMonsters[j].y
            );
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestEnemy = this.enemyMonsters[j];
            }
          }
          
          monster.setData("target", closestEnemy);
        } else {
          // Target enemy tower if no enemies
          monster.setData("target", this.enemyTower);
        }
      }
      
      // Move towards target
      const target = monster.getData("target");
      if (target && target.active) {
        const distance = Phaser.Math.Distance.Between(
          monster.x, monster.y,
          target.x, target.y
        );
        
        // If in attack range, attack
        if (distance <= stats.attackRange) {
          // Stop movement
          monster.setVelocity(0, 0);
          
          // Attack logic
          const attackTimer = monster.getData("attackTimer") - delta;
          if (attackTimer <= 0) {
            this.attackTarget(monster, target);
            monster.setData("attackTimer", stats.attackDelay);
          } else {
            monster.setData("attackTimer", attackTimer);
          }
        } else {
          // Move towards target
          const angle = Phaser.Math.Angle.Between(
            monster.x, monster.y,
            target.x, target.y
          );
          
          const velocityX = Math.cos(angle) * stats.moveSpeed;
          const velocityY = Math.sin(angle) * stats.moveSpeed;
          
          monster.setVelocity(velocityX, velocityY);
        }
      } else {
        // Target is gone, find new target
        monster.setData("target", null);
        monster.setVelocity(0, 0);
      }
    }
    
    // Update enemy monsters (similar logic to player monsters)
    for (let i = this.enemyMonsters.length - 1; i >= 0; i--) {
      const enemy = this.enemyMonsters[i];
      const stats = enemy.getData("stats") as Monster;
      
      // Check if enemy is dead
      if (enemy.getData("health") <= 0) {
        // Grant experience when enemy is defeated
        this.grantExperience(stats);
        
        // Grant gold when enemy is defeated
        this.grantGold(15 + stats.level * 5); // Increased gold reward
        
        const healthBar = enemy.getData("healthBar");
        if (healthBar) healthBar.destroy();
        enemy.destroy();
        this.enemyMonsters.splice(i, 1);
        continue;
      }
      
      // Update health bar
      this.updateHealthBar(enemy);
      
      // Find target if none
      if (!enemy.getData("target") || !enemy.getData("target").active) {
        if (this.playerMonsters.length > 0) {
          // Target closest player monster
          let closestMonster = this.playerMonsters[0];
          let closestDistance = Phaser.Math.Distance.Between(
            enemy.x, enemy.y,
            closestMonster.x, closestMonster.y
          );
          
          for (let j = 1; j < this.playerMonsters.length; j++) {
            const distance = Phaser.Math.Distance.Between(
              enemy.x, enemy.y,
              this.playerMonsters[j].x, this.playerMonsters[j].y
            );
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestMonster = this.playerMonsters[j];
            }
          }
          
          enemy.setData("target", closestMonster);
        } else {
          // Target player tower if no player monsters
          enemy.setData("target", this.playerTower);
        }
      }
      
      // Move towards target
      const target = enemy.getData("target");
      if (target && target.active) {
        const distance = Phaser.Math.Distance.Between(
          enemy.x, enemy.y,
          target.x, target.y
        );
        
        // If in attack range, attack
        if (distance <= stats.attackRange) {
          // Stop movement
          enemy.setVelocity(0, 0);
          
          // Attack logic
          const attackTimer = enemy.getData("attackTimer") - delta;
          if (attackTimer <= 0) {
            this.attackTarget(enemy, target);
            enemy.setData("attackTimer", stats.attackDelay);
          } else {
            enemy.setData("attackTimer", attackTimer);
          }
        } else {
          // Move towards target
          const angle = Phaser.Math.Angle.Between(
            enemy.x, enemy.y,
            target.x, target.y
          );
          
          const velocityX = Math.cos(angle) * stats.moveSpeed;
          const velocityY = Math.sin(angle) * stats.moveSpeed;
          
          enemy.setVelocity(velocityX, velocityY);
        }
      } else {
        // Target is gone, find new target
        enemy.setData("target", null);
        enemy.setVelocity(0, 0);
      }
    }
  }

  private attackTarget(attacker: Phaser.GameObjects.Sprite, target: Phaser.GameObjects.Sprite) {
    const stats = attacker.getData("stats") as Monster;
    
    // Create attack effect
    this.createAttackEffect(attacker, target, stats.attackType);
    
    // Apply damage
    if (target === this.playerTower) {
      this.playerTowerHealth -= stats.attack;
      this.events.emit("updateTowerHealth", {
        player: this.playerTowerHealth,
        enemy: this.enemyTowerHealth
      });
      
      // Check for game over
      if (this.playerTowerHealth <= 0) {
        this.gameOver();
      }
    } else if (target === this.enemyTower) {
      this.enemyTowerHealth -= stats.attack;
      this.events.emit("updateTowerHealth", {
        player: this.playerTowerHealth,
        enemy: this.enemyTowerHealth
      });
      
      // Grant gold for damaging enemy tower
      this.grantGold(stats.attack / 8); // Increased gold reward (was /10)
      
      // Update score
      this.updateScore(stats.attack);
      
      // Check for victory
      if (this.enemyTowerHealth <= 0) {
        this.victory();
      }
    } else {
      // Monster attacking another monster
      const targetHealth = target.getData("health") - stats.attack;
      target.setData("health", targetHealth);
      
      // Apply status effects if any
      if (stats.statusEffects && stats.statusEffects.length > 0) {
        stats.statusEffects.forEach(effect => {
          this.applyStatusEffect(target, effect);
        });
      }
      
      // If splash damage, damage nearby enemies
      if (stats.splashDamage && stats.maxTargets > 1) {
        this.applySplashDamage(attacker, target, stats);
      }
    }
  }

  private createAttackEffect(attacker: Phaser.GameObjects.Sprite, target: Phaser.GameObjects.Sprite, attackType: string) {
    if (attackType === "ranged") {
      // Create projectile effect
      const angle = Phaser.Math.Angle.Between(
        attacker.x, attacker.y,
        target.x, target.y
      );
      
      const projectile = this.add.circle(attacker.x, attacker.y, 5, 0xffffff);
      
      this.tweens.add({
        targets: projectile,
        x: target.x,
        y: target.y,
        duration: 300,
        onComplete: () => {
          projectile.destroy();
          
          // Create impact effect
          const impact = this.add.circle(target.x, target.y, 10, 0xff0000);
          this.tweens.add({
            targets: impact,
            alpha: 0,
            scale: 0.5,
            duration: 200,
            onComplete: () => impact.destroy()
          });
        }
      });
    } else {
      // Melee attack effect
      const impact = this.add.circle(target.x, target.y, 15, 0xff0000);
      this.tweens.add({
        targets: impact,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        onComplete: () => impact.destroy()
      });
    }
  }

  private applySplashDamage(attacker: Phaser.GameObjects.Sprite, primaryTarget: Phaser.GameObjects.Sprite, stats: Monster) {
    // Determine which array to check for nearby targets
    const isPlayerMonster = this.playerMonsters.includes(attacker as any);
    const targetArray = isPlayerMonster ? this.enemyMonsters : this.playerMonsters;
    
    // Find nearby targets
    const nearbyTargets = targetArray.filter(target => {
      if (target === primaryTarget) return false;
      
      const distance = Phaser.Math.Distance.Between(
        primaryTarget.x, primaryTarget.y,
        target.x, target.y
      );
      
      return distance <= 50; // Splash radius
    });
    
    // Limit to max targets
    const targetsToHit = nearbyTargets.slice(0, stats.maxTargets - 1);
    
    // Apply damage to nearby targets
    targetsToHit.forEach(target => {
      const targetHealth = target.getData("health") - stats.attack * 0.5; // Splash damage is 50% of normal damage
      target.setData("health", targetHealth);
      
      // Create splash effect
      const splashEffect = this.add.circle(target.x, target.y, 10, 0xff9900);
      this.tweens.add({
        targets: splashEffect,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        onComplete: () => splashEffect.destroy()
      });
    });
  }

  private applyStatusEffect(target: Phaser.GameObjects.Sprite, effect: any) {
    // Apply different effects based on type
    switch (effect.type) {
      case "slow":
        // Slow down target
        const currentStats = target.getData("stats");
        const slowedStats = {
          ...currentStats,
          moveSpeed: currentStats.moveSpeed * (1 - effect.value / 100)
        };
        target.setData("stats", slowedStats);
        
        // Reset after duration
        this.time.delayedCall(effect.duration, () => {
          if (target.active) {
            target.setData("stats", currentStats);
          }
        });
        break;
        
      case "poison":
        // Apply poison damage over time
        const poisonInterval = this.time.addEvent({
          delay: 1000, // Every second
          repeat: effect.duration / 1000 - 1,
          callback: () => {
            if (target.active) {
              const health = target.getData("health") - effect.value;
              target.setData("health", health);
              
              // Create poison effect
              const poisonEffect = this.add.circle(target.x, target.y, 15, 0x00ff00);
              this.tweens.add({
                targets: poisonEffect,
                alpha: 0,
                scale: 0.5,
                duration: 200,
                onComplete: () => poisonEffect.destroy()
              });
            } else {
              poisonInterval.remove();
            }
          }
        });
        break;
        
      case "shock":
        // Apply immediate extra damage
        const health = target.getData("health") - effect.value;
        target.setData("health", health);
        
        // Create shock effect
        const shockEffect = this.add.circle(target.x, target.y, 20, 0x00ffff);
        this.tweens.add({
          targets: shockEffect,
          alpha: 0,
          scale: 0.5,
          duration: 300,
          onComplete: () => shockEffect.destroy()
        });
        break;
    }
  }

  private handleMonsterCollision(monster1: Phaser.GameObjects.Sprite, monster2: Phaser.GameObjects.Sprite) {
    //private handleMonsterCollision(monster1: Phaser.GameObjects.Sprite, monster2: Phaser.GameObjects.Sprite) {
    // Set each other as targets if they don't have targets
    if (!monster1.getData("target")) {
      monster1.setData("target", monster2);
    }
    
    if (!monster2.getData("target")) {
      monster2.setData("target", monster1);
    }
  }

  private handleTowerCollision(monster: Phaser.GameObjects.Sprite, tower: Phaser.GameObjects.Sprite) {
    // Set tower as target
    monster.setData("target", tower);
  }

  private generateGold() {
    // Calculate gold to generate
    let goldAmount = 15; // Increased from 10 to 15 (base gold per second)
    
    // Apply gold boost if active
    if (this.goldBoostActive) {
      goldAmount *= 1.3; // Increased from 1.2 to 1.3 (30% boost)
    }
    
    this.grantGold(goldAmount);
  }

  private grantGold(amount: number) {
    // Dispatch event to update gold in UI
    const event = new CustomEvent("updateGold", { detail: amount });
    document.dispatchEvent(event);
  }

  private grantExperience(enemyStats: Monster) {
    // Calculate experience based on enemy stats
    const expAmount = 10 + enemyStats.level * 5;
    
    // Dispatch event to update experience in UI
    const event = new CustomEvent("updateExperience", { detail: expAmount });
    document.dispatchEvent(event);
  }

  private updateScore(amount: number) {
    // Dispatch event to update score in UI
    const event = new CustomEvent("updateScore", { detail: amount });
    document.dispatchEvent(event);
  }

  private increaseDifficulty() {
    this.difficultyLevel++;
    
    // Make enemies spawn faster but at a slower rate than before
    this.enemySpawnRate = Math.max(1500, this.enemySpawnRate - 200); // Changed from 1000/300 to 1500/200
  }

  private activateGoldBoost(percentage: number, duration: number) {
    this.goldBoostActive = true;
    this.goldBoostTimer = duration * 1000; // Convert to ms
  }

  private gameOver() {
    if (!this.gameActive) return;
    
    this.gameActive = false;
    
    // Dispatch game over event
    const event = new CustomEvent("gameOver");
    document.dispatchEvent(event);
    
    // Stop all physics and timers
    this.physics.pause();
    this.time.removeAllEvents();
    
    // Create game over text
    this.add.text(400, 300, "Game Over", {
      fontSize: "64px",
      color: "#ff0000"
    }).setOrigin(0.5);
  }

  private victory() {
    if (!this.gameActive) return;
    
    this.gameActive = false;
    
    // Dispatch game over event with victory
    const event = new CustomEvent("gameOver", { detail: { victory: true } });
    document.dispatchEvent(event);
    
    // Stop all physics and timers
    this.physics.pause();
    this.time.removeAllEvents();
    
    // Create victory text
    this.add.text(400, 300, "Victory!", {
      fontSize: "64px",
      color: "#00ff00"
    }).setOrigin(0.5);
  }
}
