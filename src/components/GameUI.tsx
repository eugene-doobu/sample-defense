import { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import UpgradePanel from "./UpgradePanel";
import MonsterSelection from "./MonsterSelection";
import GameOverPanel from "./GameOverPanel";
import Assets from "../assets.json";

const GameUI = () => {
  const { 
    gold, 
    experience, 
    level, 
    gameTime, 
    setGameTime, 
    score,
    gameOver,
    setGold,
    setExperience,
    setScore,
    setGameOver
  } = useGameContext();
  
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Experience needed for next level (simple formula)
  const expNeeded = level * 100;
  const expPercentage = Math.min(100, Math.floor((experience / expNeeded) * 100));

  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
      setTimeLeft(prev => Math.max(0, prev - 1));
      
      // Game over when time runs out
      if (timeLeft <= 1) {
        setGameOver(true);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameOver, timeLeft]);

  // Show upgrade panel when level up
  useEffect(() => {
    if (experience >= expNeeded) {
      setShowUpgradePanel(true);
    }
  }, [experience, expNeeded]);

  // Listen for game events from Phaser
  useEffect(() => {
    const handleUpdateGold = (e: any) => {
      setGold(prev => prev + e.detail);
    };
    
    const handleUpdateExperience = (e: any) => {
      setExperience(prev => prev + e.detail);
    };
    
    const handleUpdateScore = (e: any) => {
      setScore(prev => prev + e.detail);
    };
    
    const handleGameOver = () => {
      setGameOver(true);
    };
    
    // Add event listeners
    document.addEventListener("updateGold", handleUpdateGold);
    document.addEventListener("updateExperience", handleUpdateExperience);
    document.addEventListener("updateScore", handleUpdateScore);
    document.addEventListener("gameOver", handleGameOver);
    
    // Clean up
    return () => {
      document.removeEventListener("updateGold", handleUpdateGold);
      document.removeEventListener("updateExperience", handleUpdateExperience);
      document.removeEventListener("updateScore", handleUpdateScore);
      document.removeEventListener("gameOver", handleGameOver);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Top UI Bar */}
      <div 
        className="fixed top-0 left-0 right-0 p-3 pointer-events-auto z-50"
        style={{
          backgroundImage: `url(${Assets.ui.panel.url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderBottom: '2px solid #8b5a2b',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-yellow-400 bg-gray-900 bg-opacity-70 p-2 rounded-lg shadow-lg">
              <img src={Assets.ui.goldIcon.url} alt="Gold" className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">{gold}</span>
            </div>
            
            <div className="flex items-center text-blue-400 bg-gray-900 bg-opacity-70 p-2 rounded-lg shadow-lg">
              <span className="mr-2 text-xl">⏱️</span>
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-green-400 bg-gray-900 bg-opacity-70 p-2 rounded-lg shadow-lg">
              <span className="mr-2 text-xl">🏆</span>
              <span className="text-xl font-bold">{score}</span>
            </div>
            
            <div className="flex flex-col w-48 bg-gray-900 bg-opacity-70 p-2 rounded-lg shadow-lg">
              <div className="flex justify-between text-sm">
                <span className="text-white font-bold">Level {level}</span>
                <span className="text-purple-300">{experience}/{expNeeded} XP</span>
              </div>
              <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-purple-500 h-full" 
                  style={{ width: `${expPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Monster Selection Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-3 pointer-events-auto z-50"
        style={{
          backgroundImage: `url(${Assets.ui.panel.url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderTop: '2px solid #8b5a2b',
          boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.5)'
        }}
      >
        <MonsterSelection />
      </div>
      
      {/* Upgrade Panel (shown on level up) */}
      {showUpgradePanel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 pointer-events-auto z-50">
          <div 
            className="relative p-6 rounded-lg max-w-2xl w-full"
            style={{
              backgroundImage: `url(${Assets.ui.premiumPanel.url})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              boxShadow: '0 0 20px rgba(138, 43, 226, 0.7)'
            }}
          >
            <UpgradePanel onClose={() => setShowUpgradePanel(false)} />
          </div>
        </div>
      )}
      
      {/* Game Over Panel */}
      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 pointer-events-auto z-50">
          <div 
            className="relative p-6 rounded-lg max-w-2xl w-full"
            style={{
              backgroundImage: `url(${Assets.ui.premiumPanel.url})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              boxShadow: '0 0 20px rgba(255, 0, 0, 0.7)'
            }}
          >
            <GameOverPanel score={score} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
