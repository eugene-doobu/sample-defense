import Phaser from "phaser";
import Assets from "../../assets.json";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Create loading text
    const loadingText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 50,
      "Loading...",
      {
        fontSize: "32px",
        color: "#ffffff"
      }
    ).setOrigin(0.5);
    
    // Create progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      this.cameras.main.width / 2 - 160,
      this.cameras.main.height / 2,
      320,
      50
    );
    
    // Update progress bar as assets load
    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        this.cameras.main.width / 2 - 150,
        this.cameras.main.height / 2 + 10,
        300 * value,
        30
      );
    });
    
    // Load assets
    this.loadAssets();
  }

  create() {
    // Create monster and enemy textures
    this.createMonsterTextures();
    
    // Start the game scene
    this.scene.start("GameScene");
  }

  private loadAssets() {
    // Load background
    this.load.image("background", Assets.images.background.url);
    
    // Load towers
    this.load.image("tower", Assets.images.tower.url);
    this.load.image("enemyTower", Assets.images.enemyTower.url);
    
    // Load UI assets
    this.load.image("panel", Assets.ui.panel.url);
    this.load.image("premiumPanel", Assets.ui.premiumPanel.url);
    this.load.image("goldIcon", Assets.ui.goldIcon.url);
    this.load.image("expIcon", Assets.ui.expIcon.url);
  }

  private createMonsterTextures() {
    // Create monster textures
    Object.keys(Assets.monsters).forEach(type => {
      // Create a texture for each monster type
      const monsterTexture = this.textures.createCanvas(`monster_${type}`, 50, 50);
      const context = monsterTexture.getContext();
      
      // Draw monster (simple colored circle for now)
      let color;
      switch (type) {
        case "basic":
          color = "#3498db"; // Blue
          break;
        case "tank":
          color = "#e74c3c"; // Red
          break;
        case "ranged":
          color = "#2ecc71"; // Green
          break;
        case "fast":
          color = "#f39c12"; // Orange
          break;
        default:
          color = "#9b59b6"; // Purple
      }
      
      // Fill circle
      context.fillStyle = color;
      context.beginPath();
      context.arc(25, 25, 20, 0, Math.PI * 2);
      context.fill();
      
      // Add border
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
      
      // Refresh texture
      monsterTexture.refresh();
    });
    
    // Create enemy textures
    Object.keys(Assets.enemies).forEach(type => {
      // Create a texture for each enemy type
      const enemyTexture = this.textures.createCanvas(`enemy_${type}`, 50, 50);
      const context = enemyTexture.getContext();
      
      // Draw enemy (simple colored square for now to distinguish from player monsters)
      let color;
      switch (type) {
        case "basic":
          color = "#3498db"; // Blue
          break;
        case "tank":
          color = "#e74c3c"; // Red
          break;
        case "ranged":
          color = "#2ecc71"; // Green
          break;
        case "fast":
          color = "#f39c12"; // Orange
          break;
        default:
          color = "#9b59b6"; // Purple
      }
      
      // Fill square
      context.fillStyle = color;
      context.fillRect(5, 5, 40, 40);
      
      // Add border
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.strokeRect(5, 5, 40, 40);
      
      // Refresh texture
      enemyTexture.refresh();
    });
  }
}
