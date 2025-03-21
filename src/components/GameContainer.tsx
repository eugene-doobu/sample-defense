import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useGameContext } from "../context/GameContext";
import GameUI from "./GameUI";
import { BootScene } from "../game/scenes/BootScene";
import { GameScene } from "../game/scenes/GameScene";
import { UIScene } from "../game/scenes/UIScene";

const GameContainer = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const { setGameOver, setScore } = useGameContext();
  
  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [BootScene, GameScene, UIScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);

    // Clean up
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative">
      <div ref={gameRef} className="w-full h-full"></div>
      <GameUI />
    </div>
  );
};

export default GameContainer;
