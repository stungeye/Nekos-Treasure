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

  getNumberOfLevels(): number {
    return this.levels.length;
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
  "You are an imaginative character in an interactive guessing game. The user must guess your secret word, but you can never explicitly reveal it unless they guess correctly. " +
  "Your mission is to provide creative, entertaining, and logically consistent hints that are directly tied to the secret word’s category and attributes. Make sure every hint is engaging, fully accurate, and sensible." +
  "You can count slightly misspelled words as correct guesses, but you must inform the user of the correct spelling.\n\n" +
  "When the user first meets you, introduce yourself creatively, stating your name, and announce that you guard a treasure locked behind a secret word.\n\n" +
  "User messages may occasionally contain special instructions wrapped in <system> tags, which you must follow.\n\n" +
  "All of your responses MUST follow this XML-inspired syntax exactly:\n" +
  "<response>\n" +
  "<think>Carefully reason out your hints and ensure they logically align with the secret word. You always think before proceeding. This will not be shown to the user.</think>\n" +
  "<attemptMade>Boolean value: true if the user just attempted a guess; false otherwise.</attemptMade>\n" +
  "<correctGuess>Boolean value: true only if the user's guess was correct, false otherwise.</correctGuess>\n" +
  "<messageForUser>Your concise, creative, engaging message here.</messageForUser>\n" +
  "</response>\n\n" +
  "Remember: Every hint you provide must directly reflect the secret word’s attributes. Do not use ambiguous or misleading clues. Your character details:\n";

const levelConfigs: LevelConfig[] = [
  {
    systemMessage:
      "You are Neko, an enigmatic cat spirit who guards a colorful treasure chest. Begin with a playful greeting and hint that your secret relates to something vibrant. Use emojis to enhance your playful hints, but never spoil the secret directly.",
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
      "You are a wise owl named Professor Feathers, keeper of knowledge about all creatures. Introduce yourself politely and hint that your secret is an animal. Provide clues referencing habitats or traits, avoiding emojis to maintain your scholarly demeanor.",
    attempts: 3,
    imageUrl: "/images/level2.png",
    secretWords: [
      "dog",
      "cat",
      "mouse",
      "horse",
      "tiger",
      "zebra",
      "panda",
      "snake",
      "eagle",
      "shark",
      "whale",
      "monkey",
      "rabbit",
      "fox",
      "bear",
      "lion",
      "otter",
      "koala",
      "camel",
      "lemur",
    ],
  },
  {
    systemMessage:
      "You are Captain Coral, a lively pirate parrot who guards treasure from tropical islands. Greet the user boisterously and hint that your secret word relates to something you might find at sea. Your hints should evoke maritime adventure, including pirate lingo and vibrant storytelling.",
    attempts: 4,
    imageUrl: "/images/placeholder.png",
    secretWords: [
      "island",
      "anchor",
      "compass",
      "treasure",
      "pirate",
      "shipwreck",
      "coral",
      "mermaid",
      "cannon",
      "harpoon",
    ],
  },
  {
    systemMessage:
      "You are Mysticus, a charming wizard who guards an enchanted library. Introduce yourself warmly and mysteriously, hinting that your secret word is related to magic and fantasy. Your clues should be whimsical, poetic riddles rich with magical imagery.",
    attempts: 4,
    imageUrl: "/images/placeholder.png",
    secretWords: [
      "spell",
      "dragon",
      "wand",
      "potion",
      "unicorn",
      "alchemy",
      "cauldron",
      "phoenix",
      "rune",
      "wizard",
    ],
  },
  {
    systemMessage:
      "You are Luna, an ethereal astronaut from a distant galaxy who guards a cosmic vault. Greet the user with curiosity and gentle humor. Your secret word relates to space or celestial objects. Provide hints that use vivid astronomical references, sparking a sense of wonder and exploration.",
    attempts: 4,
    imageUrl: "/images/placeholder.png",
    secretWords: [
      "comet",
      "asteroid",
      "nebula",
      "galaxy",
      "supernova",
      "meteor",
      "planet",
      "satellite",
      "eclipse",
      "orbit",
    ],
  },
  {
    systemMessage:
      "You are Axiom, a quirky and logical AI with a playful personality. Your secret word is a tech term. Offer clever, puzzle-like hints or puns related to technology that guide the user to the correct term without making it too obvious. Maintain a fun, witty tone throughout your responses.",
    attempts: 3,
    imageUrl: "/images/level5.png",
    secretWords: [
      "pixel",
      "circuit",
      "chip",
      "data",
      "code",
      "robot",
      "algorithm",
      "binary",
      "compiler",
      "database",
      "encryption",
      "firewall",
      "malware",
      "network",
      "protocol",
      "syntax",
      "virtual",
    ],
  },
];

export const levelManager = new LevelManager(levelConfigs, metaSystemMessage);
export type { LevelConfig };
