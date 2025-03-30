interface LevelConfig {
  systemMessage: string;
  attempts: number;
  imageUrl: string;
  secretWords: string[];
}

class LevelManager {
  private levels: LevelConfig[];
  private currentLevelIndex: number;
  private currentSecretWord: string | null;
  private metaSystemPrompt: string;

  constructor(levels: LevelConfig[], metaSystemPrompt: string) {
    this.levels = levels;
    this.currentLevelIndex = 0;
    this.currentSecretWord = null;
    this.metaSystemPrompt = metaSystemPrompt;
  }

  getCurrentLevelConfig(): LevelConfig {
    return this.levels[this.currentLevelIndex];
  }

  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  getSystemMessage(): string {
    return (
      this.metaSystemPrompt +
      this.getCurrentLevelConfig().systemMessage +
      `\n\Your secret word: ${this.getSecretWord()}`
    );
  }

  getSecretWord(): string {
    if (!this.currentSecretWord) {
      const currentLevel = this.getCurrentLevelConfig();
      const availableWords = currentLevel.secretWords;
      if (availableWords.length === 0) {
        throw new Error("No available secret words for this level");
      }
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      this.currentSecretWord = availableWords[randomIndex];
    }
    return this.currentSecretWord;
  }

  advanceLevel(): boolean {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      this.currentSecretWord = null; // Reset secret word for new level
      return true;
    }
    return false;
  }

  resetGame() {
    this.currentLevelIndex = 0;
    this.currentSecretWord = null;
  }

  isGameComplete(): boolean {
    return this.currentLevelIndex === this.levels.length - 1;
  }
}

const metaSystemMessage =
  "You are a character in an interactive guessing game. The user is trying to guess your secret word, but don't give it to them directly unless they guess it correctly. " +
  "Provide engaging, contextual, and concise responses. When you first meet the user, you will introduce yourself and let them know that you have a treasure that can be unlocked with a secret word.\n\n" +
  "User messages will sometimes come with special system instructions to follow in <system> tags.\n\n" +
  "All of your response MUST be in the following xml inspired syntax:\n" +
  "<think>[This is an optional scratch pad for you to write notes to yourself. It will not be displayed to the user.]</think>\n" +
  "<response>\n" +
  "<attemptMade>[Boolean value. Use 'true' only if the user's most recent message includes an attempt to guess the secret word, 'false' otherwise.]</attemptMade>\n" +
  "<correctGuess>[Boolean value. Use 'true' only if the user's guess was correct, 'false' otherwise.]</correctGuess>\n" +
  "<messageForUser>[Your message for the user goes here.]</messageForUser>\n" +
  "</response>\n\n" +
  "Your character information:\n";

const levelConfigs: LevelConfig[] = [
  {
    systemMessage:
      "You are a mysterious cat named Neko. Be creative and have fun. You will never say your secret word before the user has guessed it. Start off with a hint about the word's category. Make sure your hints are tricky and fully accurate! You use emoji to increase engagement but you will never give away the secret word using an emoji.",
    attempts: 3,
    imageUrl: "/images/level1.png",
    secretWords: [
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "pink",
      "brown",
      "black",
      "white",
      "gray",
      "gold",
      "silver",
      "bronze",
    ],
  },
  {
    systemMessage:
      "You are a wise owl. The secret word for this level is related to celestial bodies.",
    attempts: 3,
    imageUrl: "/images/level2.png",
    secretWords: ["sun", "moon", "star", "planet", "galaxy"],
  },
  // Add more levels as needed
];

export const levelManager = new LevelManager(levelConfigs, metaSystemMessage);
export type { LevelConfig };
