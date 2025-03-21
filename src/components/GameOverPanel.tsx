import { useEffect, useState } from "react";

interface GameOverPanelProps {
  score: number;
}

const GameOverPanel = ({ score }: GameOverPanelProps) => {
  const [highScore, setHighScore] = useState(0);
  
  useEffect(() => {
    // Get high score from local storage
    const savedHighScore = localStorage.getItem("towerDefenseHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    // Update high score if current score is higher
    if (score > highScore) {
      localStorage.setItem("towerDefenseHighScore", score.toString());
      setHighScore(score);
    }
  }, [score]);
  
  const handlePlayAgain = () => {
    window.location.reload();
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-3xl font-bold mb-4 text-red-500">Game Over</h2>
      
      <div className="mb-6">
        <p className="text-xl mb-2">Your Score: <span className="text-yellow-400">{score}</span></p>
        <p className="text-lg">High Score: <span className="text-green-400">{highScore}</span></p>
      </div>
      
      {score > highScore && (
        <div className="bg-yellow-600 bg-opacity-30 p-3 rounded-lg mb-6">
          <p className="text-yellow-300 font-semibold">New High Score!</p>
        </div>
      )}
      
      <button
        onClick={handlePlayAgain}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverPanel;
