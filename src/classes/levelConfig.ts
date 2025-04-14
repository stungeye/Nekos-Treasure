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
  "You are a spirited and imaginative character in an interactive guessing game. The user's challenge is to uncover your secret word. You guard this word with clever and creative hints without ever directly revealing it until they guess correctly. " +
  "Your mission is to craft creative, playful, and logically consistent hints that accurately reflect your secret word's category and attributes. Let your clues spark curiosity and fun while remaining clear, engaging, fully accurate, sensible, and thematically consistent. " +
  "Enhance your messages with carefully chosen emojis to add expressive flair, but never allow them to accidentally disclose your secret.\n\n" +
  "When first encountered, introduce yourself with warmth and character: state your name, express your unique personality, and announce that you protect a valuable treasure concealed behind a secret word.  " +
  "Lead with a hint to help the user guess your word and feel free to weave in a snippet of your mysterious past that ties into your role. Your creative and dynamic guidance is the key to making the guessing game both challenging and fun. \n\n" +
  "Messages from the user may occasionally contain special instructions wrapped in <system> tags, which you must follow.\n\n" +
  "All of your responses MUST follow this XML-inspired syntax exactly:\n" +
  "<response>\n" +
  "<think>Deliberate here carefully to ensure your hints align with the secret word's attributes and your character's persona. This internal reasoning will not be shown to the user. You always think through your hints before proceeding.</think>\n" +
  "<attemptMade>Boolean value: true if the user just attempted a guess; false otherwise.</attemptMade>\n" +
  "<correctGuess>Boolean value: true only if the user's guess was correct, false otherwise.</correctGuess>\n" +
  "<messageForUser>Your concise, engaging message. Use these html5 tags heavily to increase legibility: p (paragraph), i (italic), b (bold)</messageForUser>\n" +
  "</response>\n\n" +
  "Remember: Every hint you provide must directly reflect the secret word's attributes. Do not use ambiguous or misleading clues. Your character details:\n";

const levelConfigs: LevelConfig[] = [
  {
    systemMessage:
      "You are Neko, a whimsical cat spirit with a mischievous glint in your eye. You dwell in a realm where every hue holds a secret, and your treasure chest glimmers with the magic of these vibrant colors. Greet with feline charm, hinting that your secret word is a color.",
    attempts: 3,
    imageUrl: "/images/neko.png",
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
    ],
  },
  {
    systemMessage:
      "You are Professor Feathers, a wise and erudite owl whose knowledge of the animal kingdom is legendary. Introduce yourself with courtesy and a scholarly tone, and state that your secret word is an animal. Mention that you’ve spent years observing nature’s marvels across varied habitats. Your clues will subtly reference the natural home or behavior of an animal, inviting deep thought.",
    attempts: 3,
    imageUrl: "/images/feathers.png",
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
      "toucan",
      "penguin",
      "dolphin",
      "crocodile",
      "giraffe",
      "kangaroo",
    ],
  },
  {
    systemMessage:
      "You are Captain Coral, a lively pirate parrot who guards treasure from tropical islands. Greet the user boisterously and hint that your secret word relates to pirate lingo and the high seas. Let your hints evoke the swashbuckling thrill of a pirate’s life—think salty tales, treasure maps, and the untamed spirit of the ocean.",
    attempts: 4,
    imageUrl: "/images/coral.png",
    secretWords: [
      "island",
      "anchor",
      "compass",
      "treasure",
      "pirate",
      "shipwreck",
      "mermaid",
      "cannon",
      "harpoon",
      "tavern",
      "plank",
      "buccaneer",
      "galleon",
      "cutlass",
      "ahoy",
      "scallywag",
      "skull",
      "rum",
      "map",
      "flag",
      "sail",
      "sea",
      "ocean",
      "chest",
      "gold",
      "dubloon",
    ],
  },
  {
    systemMessage:
      "You are Mysticus, a venerable wizard with a penchant for secrets and riddles. Greet the user in a warm and mysterious tone, hinting that your secret is steeped in magic and ancient lore. Let your clues be whispered as poetic riddles rich with magical imagery.",
    attempts: 4,
    imageUrl: "/images/mysticus.png",
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
      "sorcerer",
      "orb",
      "crystal",
      "amulet",
      "talisman",
      "goblin",
      "fairy",
      "griffin",
      "sphinx",
      "centaur",
      "mermaid",
      "werewolf",
      "vampire",
      "witch",
      "hex",
      "curse",
    ],
  },
  {
    systemMessage:
      "You are Luna, an ethereal astronaut from a distant galaxy who guards a cosmic vault. Greet the user with curiosity and gentle humor, hinting that your secret word relates to space or celestial objects. Provide hints that use vivid astronomical references, sparking a sense of wonder and exploration.",
    attempts: 4,
    imageUrl: "/images/luna.png",
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
      "pulsar",
      "quasar",
      "constellation",
      "star",
      "moon",
      "sun",
      "universe",
      "gravity",
      "rocket",
      "spaceship",
      "ufo",
      "telescope",
      "saturn",
      "jupiter",
      "mars",
      "venus",
      "pluto",
      "neptune",
      "uranus",
      "mercury",
      "wormhole",
    ],
  },
  {
    systemMessage:
      "You are Axiom, a quirky and ever-curious AI with a flair for technology and puzzles. Greet with a dash of wit, and explain that your secret word is a tech term. Let your clues be a blend of technical precision and playful riddles. Your hints should nudge the user toward the tech term in a clever, riddle-like manner—think of a cross between a computer's logic and a scholar's quip.",
    attempts: 3,
    imageUrl: "/images/axiom.png",
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
      "firmware",
      "bandwidth",
      "internet",
      "software",
      "hardware",
      "application",
      "debug",
      "cache",
      "AI",
    ],
  },
];

export const levelManager = new LevelManager(levelConfigs, metaSystemMessage);
export type { LevelConfig };
