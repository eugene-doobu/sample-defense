class Server {
  constructor() {
    this.dailyTheme = null;
    this.highScores = [];
    this.initDailyTheme();
  }

  async initDailyTheme() {
    // Get or create the global state
    const globalState = await $global.getGlobalState() || {};
    
    // Check if we need to generate a new daily theme
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    
    if (!globalState.currentThemeDate || globalState.currentThemeDate !== today) {
      // Generate a new theme for today
      const themeOptions = [
        {
          id: "melee-rush",
          name: "Melee Rush",
          description: "Melee monsters are more common and have increased attack power.",
          monsterTypeBoost: "melee",
          statBoosts: {
            attack: 20,
          },
          specialEffects: ["Melee monsters have 10% chance to stun on hit"],
        },
        {
          id: "ranged-dominance",
          name: "Ranged Dominance",
          description: "Ranged monsters are more common and have increased attack range.",
          monsterTypeBoost: "ranged",
          statBoosts: {
            attackDelay: -10, // Lower delay means faster attacks
          },
          specialEffects: ["Ranged attacks have 15% chance to slow targets"],
        },
        {
          id: "tank-fortress",
          name: "Tank Fortress",
          description: "Tank monsters are more common and have increased health.",
          monsterTypeBoost: "tank",
          statBoosts: {
            health: 30,
          },
          specialEffects: ["Tank monsters regenerate 1% health per second"],
        },
        {
          id: "speed-demons",
          name: "Speed Demons",
          description: "Fast monsters are more common and have increased movement speed.",
          monsterTypeBoost: "fast",
          statBoosts: {
            moveSpeed: 25,
          },
          specialEffects: ["Fast monsters have 20% chance to dodge attacks"],
        },
        {
          id: "poison-plague",
          name: "Poison Plague",
          description: "Monsters have a chance to apply poison effects.",
          monsterTypeBoost: "all",
          statBoosts: {},
          specialEffects: ["All monsters have 25% chance to poison targets", "Poison deals 2% max health per second"],
        },
      ];
      
      // Use the date as a seed for the random theme
      const seed = parseInt(today.replace(/-/g, ""));
      const randomIndex = seed % themeOptions.length;
      
      // Set the new theme
      globalState.currentTheme = themeOptions[randomIndex];
      globalState.currentThemeDate = today;
      
      // Save to global state
      await $global.updateGlobalState(globalState);
    }
    
    this.dailyTheme = globalState.currentTheme;
  }

  async getDailyTheme() {
    if (!this.dailyTheme) {
      await this.initDailyTheme();
    }
    return this.dailyTheme;
  }

  async submitScore(score, playerName) {
    // Validate score
    if (typeof score !== 'number' || score < 0) {
      throw new Error('Invalid score');
    }
    
    // Get current date for daily leaderboard
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    
    // Add score to collection
    await $global.addCollectionItem('scores', {
      playerName: playerName || $sender.account.substring(0, 8),
      score: score,
      date: today,
      account: $sender.account,
      timestamp: Date.now()
    });
    
    // Update user's high score if needed
    const userState = await $global.getUserState($sender.account) || {};
    if (!userState.highScore || score > userState.highScore) {
      await $global.updateUserState($sender.account, {
        highScore: score
      });
    }
    
    // Return daily top scores
    return this.getDailyLeaderboard();
  }

  async getDailyLeaderboard() {
    // Get current date
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    
    // Get scores for today
    const scores = await $global.getCollectionItems('scores', {
      filters: [
        {
          field: 'date',
          operator: '==',
          value: today
        }
      ],
      orderBy: [
        {
          field: 'score',
          direction: 'desc'
        }
      ],
      limit: 10
    });
    
    return scores;
  }

  async getAllTimeLeaderboard() {
    // Get all-time top scores
    const scores = await $global.getCollectionItems('scores', {
      orderBy: [
        {
          field: 'score',
          direction: 'desc'
        }
      ],
      limit: 10
    });
    
    return scores;
  }

  async getUserHighScore() {
    const userState = await $global.getUserState($sender.account) || {};
    return userState.highScore || 0;
  }

  async activateDivineHelp() {
    // This would typically involve a payment verification
    // For now, we'll just return a success response
    
    // Record that the user used divine help
    const userState = await $global.getUserState($sender.account) || {};
    const divineHelpCount = userState.divineHelpCount || 0;
    
    await $global.updateUserState($sender.account, {
      divineHelpCount: divineHelpCount + 1
    });
    
    return {
      success: true,
      effect: "divineWrath", // Could be random or based on some logic
      message: "Divine Wrath activated! All enemies have been destroyed."
    };
  }
}
