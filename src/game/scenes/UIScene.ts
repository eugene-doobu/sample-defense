import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  // UI elements
  private goldText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private playerHealthBar!: Phaser.GameObjects.Graphics;
  private enemyHealthBar!: Phaser.GameObjects.Graphics;
  
  // Game state
  private playerTowerHealth: number = 1000;
  private playerTowerMaxHealth: number = 1000;
  private enemyTowerHealth: number = 2000;
  private enemyTowerMaxHealth: number = 2000;
  
  constructor() {
    super("UIScene");
  }

  create() {
    // Get initial tower health values from game scene
    const data = this.scene.get("GameScene");
    if (data) {
      this.playerTowerHealth = data.data.playerTowerHealth || this.playerTowerHealth;
      this.playerTowerMaxHealth = this.playerTowerHealth;
      this.enemyTowerHealth = data.data.enemyTowerHealth || this.enemyTowerHealth;
      this.enemyTowerMaxHealth = this.enemyTowerHealth;
    }
    
    // Create UI elements
    this.createHealthBars();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  private createHealthBars() {
    // Player tower health bar
    this.playerHealthBar = this.add.graphics();
    this.updateHealthBar(this.playerHealthBar, 50, 80, this.playerTowerHealth, this.playerTowerMaxHealth);
    
    // Enemy tower health bar
    this.enemyHealthBar = this.add.graphics();
    this.updateHealthBar(this.enemyHealthBar, 450, 80, this.enemyTowerHealth, this.enemyTowerMaxHealth);
    
    // Health bar labels
    this.add.text(50, 60, "Your Tower", { 
      fontSize: "16px", 
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    });
    
    this.add.text(450, 60, "Enemy Tower", { 
      fontSize: "16px", 
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    });
  }

  private updateHealthBar(bar: Phaser.GameObjects.Graphics, x: number, y: number, health: number, maxHealth: number) {
    bar.clear();
    
    // Draw background
    bar.fillStyle(0x000000, 0.7);
    bar.fillRect(x, y, 300, 25);
    
    // Calculate health percentage
    const healthPercentage = Math.max(0, health / maxHealth);
    
    // Choose color based on health percentage
    let color;
    if (healthPercentage > 0.6) {
      color = 0x00ff00; // Green
    } else if (healthPercentage > 0.3) {
      color = 0xffff00; // Yellow
    } else {
      color = 0xff0000; // Red
    }
    
    // Draw health bar
    bar.fillStyle(color, 1);
    bar.fillRect(x, y, 300 * healthPercentage, 25);
    
    // Draw border
    bar.lineStyle(3, 0xffffff, 1);
    bar.strokeRect(x, y, 300, 25);
    
    // Add health text
    const healthText = `${Math.ceil(health)}/${maxHealth}`;
    const existingText = bar.getData("healthText") as Phaser.GameObjects.Text;
    
    if (existingText) {
      existingText.setText(healthText);
    } else {
      const text = this.add.text(x + 150, y + 12, healthText, {
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3
      }).setOrigin(0.5);
      
      bar.setData("healthText", text);
    }
  }

  private setupEventListeners() {
    // Listen for tower health updates
    const gameScene = this.scene.get("GameScene");
    gameScene.events.on("updateTowerHealth", (data: any) => {
      this.playerTowerHealth = data.player;
      this.enemyTowerHealth = data.enemy;
      
      this.updateHealthBar(this.playerHealthBar, 50, 80, this.playerTowerHealth, this.playerTowerMaxHealth);
      this.updateHealthBar(this.enemyHealthBar, 450, 80, this.enemyTowerHealth, this.enemyTowerMaxHealth);
    });
    
    // Listen for gold updates
    gameScene.events.on("updateGold", (amount: number) => {
      // Dispatch event to React component
      const event = new CustomEvent("updateGold", { detail: amount });
      document.dispatchEvent(event);
    });
    
    // Listen for experience updates
    gameScene.events.on("updateExperience", (amount: number) => {
      // Dispatch event to React component
      const event = new CustomEvent("updateExperience", { detail: amount });
      document.dispatchEvent(event);
    });
    
    // Listen for score updates
    gameScene.events.on("updateScore", (amount: number) => {
      // Dispatch event to React component
      const event = new CustomEvent("updateScore", { detail: amount });
      document.dispatchEvent(event);
    });
    
    // Listen for game over
    gameScene.events.on("gameOver", () => {
      // Dispatch event to React component
      const event = new CustomEvent("gameOver");
      document.dispatchEvent(event);
    });
    
    // Listen for monster summoning from React
    document.addEventListener("summonMonster", (e: any) => {
      if (e.detail && e.detail.type) {
        gameScene.events.emit("summonMonster", e.detail.type);
      }
    });
  }
}
