import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { generateDailyTheme } from "../utils/themeGenerator";
import { Theme, Monster, Commander } from "../types/gameTypes";

interface GameContextType {
  gold: number;
  setGold: (gold: number) => void;
  experience: number;
  setExperience: (experience: number) => void;
  level: number;
  setLevel: (level: number) => void;
  dailyTheme: Theme | null;
  playerMonsters: Monster[];
  addMonster: (monster: Monster) => void;
  upgradeMonster: (monsterId: string, stats: Partial<Monster>) => void;
  commander: Commander | null;
  setCommander: (commander: Commander) => void;
  gameTime: number;
  setGameTime: (time: number) => void;
  score: number;
  setScore: (score: number) => void;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gold, setGold] = useState(100);
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [dailyTheme, setDailyTheme] = useState<Theme | null>(null);
  const [playerMonsters, setPlayerMonsters] = useState<Monster[]>([]);
  const [commander, setCommander] = useState<Commander | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Generate daily theme based on the current date
    const theme = generateDailyTheme();
    setDailyTheme(theme);
  }, []);

  const addMonster = (monster: Monster) => {
    setPlayerMonsters((prev) => [...prev, monster]);
  };

  const upgradeMonster = (monsterId: string, stats: Partial<Monster>) => {
    setPlayerMonsters((prev) =>
      prev.map((monster) =>
        monster.id === monsterId ? { ...monster, ...stats } : monster
      )
    );
  };

  return (
    <GameContext.Provider
      value={{
        gold,
        setGold,
        experience,
        setExperience,
        level,
        setLevel,
        dailyTheme,
        playerMonsters,
        addMonster,
        upgradeMonster,
        commander,
        setCommander,
        gameTime,
        setGameTime,
        score,
        setScore,
        gameOver,
        setGameOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
