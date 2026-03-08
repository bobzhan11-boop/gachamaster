// ===================================================================
// GACHAMASTER - Capsule Collection Game Engine
// ===================================================================

// ===== Sound Engine (Web Audio API) =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function ensureAudio() { if (!audioCtx) audioCtx = new AudioCtx(); }

function playSound(type) {
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  switch (type) {
    case "pull":
      osc.type = "sine"; osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now); osc.stop(now + 0.2); break;
    case "open":
      osc.type = "sine"; osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15); break;
    case "common":
      osc.type = "triangle"; osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now); osc.stop(now + 0.2); break;
    case "rare":
      osc.type = "sine"; osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now); osc.stop(now + 0.35); break;
    case "sr":
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now); osc.stop(now + 0.5); break;
    case "ssr":
      // Fanfare!
      [0, 0.1, 0.2, 0.3, 0.45].forEach((t, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sine";
        o.frequency.setValueAtTime([523, 659, 784, 1047, 1319][i], now + t);
        g.gain.setValueAtTime(0.12, now + t);
        g.gain.exponentialRampToValueAtTime(0.01, now + t + 0.2);
        o.start(now + t); o.stop(now + t + 0.25);
      });
      break;
    case "coin":
      osc.type = "sine"; osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1); break;
    case "buy":
      osc.type = "square"; osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15); break;
  }
}

// ===== Item Database =====
const ITEMS = {
  starter: [
    // Common (60%)
    { id: "s_01", name: "Rubber Duck", emoji: "🦆", rarity: "C", desc: "A classic yellow duck" },
    { id: "s_02", name: "Pencil", emoji: "✏️", rarity: "C", desc: "Sharp and ready to write" },
    { id: "s_03", name: "Button", emoji: "🔘", rarity: "C", desc: "A round plastic button" },
    { id: "s_04", name: "Marble", emoji: "🔮", rarity: "C", desc: "A glass marble with swirls" },
    { id: "s_05", name: "Eraser", emoji: "🧽", rarity: "C", desc: "Wipes away mistakes" },
    { id: "s_06", name: "Paper Clip", emoji: "📎", rarity: "C", desc: "Keeps things together" },
    { id: "s_07", name: "Sticker", emoji: "⭐", rarity: "C", desc: "A shiny star sticker" },
    { id: "s_08", name: "Whistle", emoji: "📯", rarity: "C", desc: "Toot toot!" },
    // Rare (25%)
    { id: "s_09", name: "Toy Car", emoji: "🏎️", rarity: "R", desc: "A miniature race car" },
    { id: "s_10", name: "Yo-Yo", emoji: "🪀", rarity: "R", desc: "Goes up and down" },
    { id: "s_11", name: "Mini Robot", emoji: "🤖", rarity: "R", desc: "Beep boop beep" },
    { id: "s_12", name: "Dice Set", emoji: "🎲", rarity: "R", desc: "Roll for luck" },
    { id: "s_13", name: "Snow Globe", emoji: "🔮", rarity: "R", desc: "Shake for snowfall" },
    // SR (12%)
    { id: "s_14", name: "Gold Watch", emoji: "⌚", rarity: "SR", desc: "Ticks with elegance" },
    { id: "s_15", name: "Crystal Ball", emoji: "🔮", rarity: "SR", desc: "See your future" },
    { id: "s_16", name: "Music Box", emoji: "🎵", rarity: "SR", desc: "Plays a gentle melody" },
    // SSR (3%)
    { id: "s_17", name: "Golden Dragon", emoji: "🐉", rarity: "SSR", desc: "Legendary! A golden dragon figurine" },
    { id: "s_18", name: "Diamond Ring", emoji: "💍", rarity: "SSR", desc: "Sparkles eternally" },
  ],
  animals: [
    { id: "a_01", name: "Kitten", emoji: "🐱", rarity: "C", desc: "Tiny and fluffy" },
    { id: "a_02", name: "Puppy", emoji: "🐶", rarity: "C", desc: "Loyal little friend" },
    { id: "a_03", name: "Bunny", emoji: "🐰", rarity: "C", desc: "Hop hop hop" },
    { id: "a_04", name: "Hamster", emoji: "🐹", rarity: "C", desc: "Cheeks full of seeds" },
    { id: "a_05", name: "Fish", emoji: "🐟", rarity: "C", desc: "Blub blub" },
    { id: "a_06", name: "Chick", emoji: "🐤", rarity: "C", desc: "Chirp chirp" },
    { id: "a_07", name: "Frog", emoji: "🐸", rarity: "C", desc: "Ribbit!" },
    { id: "a_08", name: "Turtle", emoji: "🐢", rarity: "C", desc: "Slow and steady" },
    { id: "a_09", name: "Fox", emoji: "🦊", rarity: "R", desc: "Clever and sly" },
    { id: "a_10", name: "Owl", emoji: "🦉", rarity: "R", desc: "Wise night watcher" },
    { id: "a_11", name: "Penguin", emoji: "🐧", rarity: "R", desc: "Waddles with style" },
    { id: "a_12", name: "Koala", emoji: "🐨", rarity: "R", desc: "Sleepy tree hugger" },
    { id: "a_13", name: "Red Panda", emoji: "🦝", rarity: "SR", desc: "Fluffy and adorable" },
    { id: "a_14", name: "Dolphin", emoji: "🐬", rarity: "SR", desc: "Jumps through waves" },
    { id: "a_15", name: "Peacock", emoji: "🦚", rarity: "SR", desc: "Dazzling feather display" },
    { id: "a_16", name: "Phoenix", emoji: "🔥", rarity: "SSR", desc: "Rises from the ashes!" },
    { id: "a_17", name: "Unicorn", emoji: "🦄", rarity: "SSR", desc: "Mythical and magical!" },
  ],
  space: [
    { id: "sp_01", name: "Star", emoji: "⭐", rarity: "C", desc: "A twinkling star" },
    { id: "sp_02", name: "Moon", emoji: "🌙", rarity: "C", desc: "Crescent moonlight" },
    { id: "sp_03", name: "Comet", emoji: "☄️", rarity: "C", desc: "Streaks across the sky" },
    { id: "sp_04", name: "Rocket", emoji: "🚀", rarity: "C", desc: "3... 2... 1... Launch!" },
    { id: "sp_05", name: "Satellite", emoji: "🛰️", rarity: "C", desc: "Orbiting Earth" },
    { id: "sp_06", name: "Telescope", emoji: "🔭", rarity: "C", desc: "See the stars up close" },
    { id: "sp_07", name: "Astronaut", emoji: "👨‍🚀", rarity: "R", desc: "Space explorer" },
    { id: "sp_08", name: "Alien", emoji: "👽", rarity: "R", desc: "We come in peace" },
    { id: "sp_09", name: "Saturn", emoji: "🪐", rarity: "R", desc: "Beautiful rings" },
    { id: "sp_10", name: "UFO", emoji: "🛸", rarity: "R", desc: "Unidentified and flying" },
    { id: "sp_11", name: "Nebula Crystal", emoji: "💎", rarity: "SR", desc: "Born from stardust" },
    { id: "sp_12", name: "Wormhole", emoji: "🌀", rarity: "SR", desc: "Portal to another dimension" },
    { id: "sp_13", name: "Galaxy Core", emoji: "🌌", rarity: "SSR", desc: "The heart of a galaxy!" },
    { id: "sp_14", name: "Infinity Stone", emoji: "💠", rarity: "SSR", desc: "Ultimate cosmic power!" },
  ],
  food: [
    { id: "f_01", name: "Apple", emoji: "🍎", rarity: "C", desc: "Crisp and juicy" },
    { id: "f_02", name: "Pizza", emoji: "🍕", rarity: "C", desc: "Cheesy goodness" },
    { id: "f_03", name: "Cookie", emoji: "🍪", rarity: "C", desc: "Chocolate chip!" },
    { id: "f_04", name: "Rice Ball", emoji: "🍙", rarity: "C", desc: "Simple and filling" },
    { id: "f_05", name: "Donut", emoji: "🍩", rarity: "C", desc: "Sprinkle covered" },
    { id: "f_06", name: "Taco", emoji: "🌮", rarity: "C", desc: "Crunchy delight" },
    { id: "f_07", name: "Sushi", emoji: "🍣", rarity: "R", desc: "Fresh from the sea" },
    { id: "f_08", name: "Ramen", emoji: "🍜", rarity: "R", desc: "Steaming hot bowl" },
    { id: "f_09", name: "Cake", emoji: "🎂", rarity: "R", desc: "Happy birthday!" },
    { id: "f_10", name: "Boba Tea", emoji: "🧋", rarity: "R", desc: "Chewy pearls inside" },
    { id: "f_11", name: "Truffle", emoji: "🍫", rarity: "SR", desc: "Rich chocolate truffle" },
    { id: "f_12", name: "Golden Apple", emoji: "🍏", rarity: "SR", desc: "Enchanted fruit" },
    { id: "f_13", name: "Ambrosia", emoji: "✨", rarity: "SSR", desc: "Food of the gods!" },
    { id: "f_14", name: "Rainbow Cake", emoji: "🌈", rarity: "SSR", desc: "Tastes like pure happiness!" },
  ],
  anime: [
    // Common (48%)
    { id: "an_01", name: "Kunai", emoji: "🗡️", rarity: "C", desc: "A sharp throwing knife" },
    { id: "an_02", name: "Scroll", emoji: "📜", rarity: "C", desc: "Ancient jutsu scroll" },
    { id: "an_03", name: "Headband", emoji: "🎗️", rarity: "C", desc: "Village headband" },
    { id: "an_04", name: "Rice Ball", emoji: "🍙", rarity: "C", desc: "Ninja fuel" },
    { id: "an_05", name: "Shuriken", emoji: "✴️", rarity: "C", desc: "Spinning star blade" },
    { id: "an_06", name: "Sandals", emoji: "🩴", rarity: "C", desc: "Standard ninja sandals" },
    { id: "an_07", name: "Smoke Bomb", emoji: "💨", rarity: "C", desc: "Poof! Vanish!" },
    // Rare (28%)
    { id: "an_08", name: "Shadow Clone", emoji: "👥", rarity: "R", desc: "Is that the real one?" },
    { id: "an_09", name: "Summoning Toad", emoji: "🐸", rarity: "R", desc: "A loyal summoned toad" },
    { id: "an_10", name: "Chakra Orb", emoji: "🔵", rarity: "R", desc: "Pure concentrated chakra" },
    { id: "an_11", name: "Puppet", emoji: "🎭", rarity: "R", desc: "Battle puppet with hidden weapons" },
    { id: "an_12", name: "Sand Gourd", emoji: "🏺", rarity: "R", desc: "Contains enchanted sand" },
    // SR (17%)
    { id: "an_13", name: "Sharingan Eye", emoji: "👁️", rarity: "SR", desc: "The eye that copies all" },
    { id: "an_14", name: "Rasengan", emoji: "🌀", rarity: "SR", desc: "Spiraling sphere of power" },
    // SSR (7%)
    { id: "an_15", name: "Nine-Tail Fox", emoji: "🦊", rarity: "SSR", desc: "Legendary tailed beast!" },
    { id: "an_16", name: "Sage Mode", emoji: "🐉", rarity: "SSR", desc: "Ultimate sage transformation!" },
  ],
  heroes: [
    // Common (45%)
    { id: "h_01", name: "Shield", emoji: "🛡️", rarity: "C", desc: "A vibranium shield" },
    { id: "h_02", name: "Web Shooter", emoji: "🕸️", rarity: "C", desc: "Thwip thwip!" },
    { id: "h_03", name: "Mask", emoji: "🎭", rarity: "C", desc: "Secret identity protection" },
    { id: "h_04", name: "Cape", emoji: "🦸", rarity: "C", desc: "No capes! ...or maybe yes" },
    { id: "h_05", name: "Boots", emoji: "🥾", rarity: "C", desc: "Rocket-powered boots" },
    { id: "h_06", name: "Gloves", emoji: "🧤", rarity: "C", desc: "Power-enhancing gloves" },
    { id: "h_07", name: "Belt", emoji: "⚙️", rarity: "C", desc: "Utility belt with gadgets" },
    // Rare (28%)
    { id: "h_08", name: "Hammer", emoji: "🔨", rarity: "R", desc: "Only the worthy may lift it" },
    { id: "h_09", name: "Iron Armor", emoji: "🤖", rarity: "R", desc: "High-tech power suit" },
    { id: "h_10", name: "Arrow", emoji: "🏹", rarity: "R", desc: "Never misses the mark" },
    { id: "h_11", name: "Claws", emoji: "✊", rarity: "R", desc: "Adamantium claws" },
    { id: "h_12", name: "Ring", emoji: "💚", rarity: "R", desc: "Power ring of will" },
    // SR (18%)
    { id: "h_13", name: "Arc Reactor", emoji: "💙", rarity: "SR", desc: "Miniaturized arc reactor" },
    { id: "h_14", name: "Mjolnir", emoji: "⚡", rarity: "SR", desc: "Thunder god's weapon" },
    // SSR (9%)
    { id: "h_15", name: "Infinity Gauntlet", emoji: "🌟", rarity: "SSR", desc: "Snap! Half the universe!" },
    { id: "h_16", name: "Vibranium Suit", emoji: "🐾", rarity: "SSR", desc: "The Black Panther rises!" },
  ],
  magic: [
    // Common (45%)
    { id: "mk_01", name: "Castle", emoji: "🏰", rarity: "C", desc: "A fairytale castle" },
    { id: "mk_02", name: "Crown", emoji: "👑", rarity: "C", desc: "Fit for royalty" },
    { id: "mk_03", name: "Rose", emoji: "🌹", rarity: "C", desc: "An enchanted rose" },
    { id: "mk_04", name: "Apple", emoji: "🍎", rarity: "C", desc: "Don't eat this one!" },
    { id: "mk_05", name: "Mirror", emoji: "🪞", rarity: "C", desc: "Mirror mirror on the wall" },
    { id: "mk_06", name: "Pumpkin", emoji: "🎃", rarity: "C", desc: "Turns into a carriage at midnight" },
    { id: "mk_07", name: "Tiara", emoji: "👸", rarity: "C", desc: "A princess tiara" },
    // Rare (27%)
    { id: "mk_08", name: "Glass Slipper", emoji: "👠", rarity: "R", desc: "Perfect fit!" },
    { id: "mk_09", name: "Magic Lamp", emoji: "🪔", rarity: "R", desc: "Three wishes inside" },
    { id: "mk_10", name: "Fairy", emoji: "🧚", rarity: "R", desc: "Grants wishes with pixie dust" },
    { id: "mk_11", name: "Magic Carpet", emoji: "🪁", rarity: "R", desc: "A whole new world!" },
    { id: "mk_12", name: "Snowflake", emoji: "❄️", rarity: "R", desc: "Let it go!" },
    // SR (19%)
    { id: "mk_13", name: "Trident", emoji: "🔱", rarity: "SR", desc: "Rules the ocean waves" },
    { id: "mk_14", name: "Magic Wand", emoji: "🪄", rarity: "SR", desc: "Bibbidi-bobbidi-boo!" },
    // SSR (9%)
    { id: "mk_15", name: "Enchanted Beast", emoji: "🦁", rarity: "SSR", desc: "True love breaks the curse!" },
    { id: "mk_16", name: "Genie", emoji: "🧞", rarity: "SSR", desc: "Phenomenal cosmic power!" },
  ],
};

// ===== Machine Definitions =====
const MACHINES = [
  { id: "starter", name: "Starter Machine", collection: "starter", cost: 10, unlockCost: 0, unlockGems: 0,
    rates: { C: 60, R: 25, SR: 12, SSR: 3 } },
  { id: "animals", name: "Animal Kingdom", collection: "animals", cost: 15, unlockCost: 500, unlockGems: 0,
    rates: { C: 55, R: 28, SR: 13, SSR: 4 } },
  { id: "space", name: "Space Explorer", collection: "space", cost: 25, unlockCost: 2000, unlockGems: 3,
    rates: { C: 50, R: 28, SR: 16, SSR: 6 } },
  { id: "food", name: "Foodie Paradise", collection: "food", cost: 20, unlockCost: 1000, unlockGems: 1,
    rates: { C: 52, R: 28, SR: 14, SSR: 6 } },
  { id: "anime", name: "Anime Heroes", collection: "anime", cost: 30, unlockCost: 3000, unlockGems: 5,
    rates: { C: 48, R: 28, SR: 17, SSR: 7 } },
  { id: "heroes", name: "Super Heroes", collection: "heroes", cost: 35, unlockCost: 5000, unlockGems: 8,
    rates: { C: 45, R: 28, SR: 18, SSR: 9 } },
  { id: "magic", name: "Magic Kingdom", collection: "magic", cost: 40, unlockCost: 8000, unlockGems: 10,
    rates: { C: 45, R: 27, SR: 19, SSR: 9 } },
];

// ===== Upgrades =====
const UPGRADES = [
  { id: "luck", name: "Lucky Charm", emoji: "🍀",
    desc: "Increases SR & SSR drop rates",
    maxLevel: 10, baseCost: 200, costMul: 1.8,
    effect: (lvl) => `+${lvl * 0.5}% SSR rate` },
  { id: "multi", name: "Multi-Pull Discount", emoji: "🎰",
    desc: "Reduces x10 pull cost",
    maxLevel: 5, baseCost: 300, costMul: 2,
    effect: (lvl) => `${lvl * 5}% discount` },
  { id: "coins", name: "Coin Magnet", emoji: "🧲",
    desc: "Earn bonus coins from duplicates",
    maxLevel: 10, baseCost: 150, costMul: 1.6,
    effect: (lvl) => `+${lvl * 20}% duplicate coins` },
  { id: "auto", name: "Auto Collector", emoji: "⚡",
    desc: "Earn passive coins over time",
    maxLevel: 8, baseCost: 500, costMul: 2.2,
    effect: (lvl) => `${lvl * 2} coins/min` },
];

// ===== Achievements =====
const ACHIEVEMENTS = [
  { id: "first_pull", name: "First Pull!", emoji: "🎰", desc: "Pull your first capsule", target: 1, stat: "totalPulls", reward: 50, rewardType: "coins" },
  { id: "pull_10", name: "Getting Started", emoji: "🔟", desc: "Pull 10 capsules", target: 10, stat: "totalPulls", reward: 100, rewardType: "coins" },
  { id: "pull_50", name: "Addict", emoji: "🤩", desc: "Pull 50 capsules", target: 50, stat: "totalPulls", reward: 300, rewardType: "coins" },
  { id: "pull_100", name: "Gacha Master", emoji: "👑", desc: "Pull 100 capsules", target: 100, stat: "totalPulls", reward: 2, rewardType: "gems" },
  { id: "pull_500", name: "Whale", emoji: "🐋", desc: "Pull 500 capsules", target: 500, stat: "totalPulls", reward: 5, rewardType: "gems" },
  { id: "first_ssr", name: "Jackpot!", emoji: "🌟", desc: "Get your first SSR", target: 1, stat: "totalSSR", reward: 200, rewardType: "coins" },
  { id: "ssr_5", name: "Lucky Star", emoji: "💫", desc: "Get 5 SSR items", target: 5, stat: "totalSSR", reward: 500, rewardType: "coins" },
  { id: "collect_10", name: "Collector", emoji: "📦", desc: "Collect 10 unique items", target: 10, stat: "uniqueItems", reward: 150, rewardType: "coins" },
  { id: "collect_30", name: "Hoarder", emoji: "🏠", desc: "Collect 30 unique items", target: 30, stat: "uniqueItems", reward: 500, rewardType: "coins" },
  { id: "collect_all", name: "Completionist", emoji: "🏆", desc: "Collect ALL items", target: 111, stat: "uniqueItems", reward: 10, rewardType: "gems" },
  { id: "machine_2", name: "Explorer", emoji: "🗺️", desc: "Unlock 2 machines", target: 2, stat: "machinesUnlocked", reward: 200, rewardType: "coins" },
  { id: "machine_3", name: "Adventurer", emoji: "🧭", desc: "Unlock 3 machines", target: 3, stat: "machinesUnlocked", reward: 500, rewardType: "coins" },
  { id: "machine_all", name: "Tycoon", emoji: "💰", desc: "Unlock ALL machines", target: 7, stat: "machinesUnlocked", reward: 5, rewardType: "gems" },
  // SSR tiers
  { id: "ssr_10", name: "SSR Hunter", emoji: "🎯", desc: "Get 10 SSR items", target: 10, stat: "totalSSR", reward: 1000, rewardType: "coins" },
  { id: "ssr_25", name: "SSR Legend", emoji: "🏅", desc: "Get 25 SSR items", target: 25, stat: "totalSSR", reward: 3, rewardType: "gems" },
  { id: "ssr_50", name: "SSR God", emoji: "👼", desc: "Get 50 SSR items", target: 50, stat: "totalSSR", reward: 10, rewardType: "gems" },
  // Sell tiers
  { id: "sell_1", name: "First Sale", emoji: "🏷️", desc: "Sell 1 duplicate", target: 1, stat: "totalSold", reward: 30, rewardType: "coins" },
  { id: "sell_10", name: "Merchant", emoji: "🛒", desc: "Sell 10 duplicates", target: 10, stat: "totalSold", reward: 200, rewardType: "coins" },
  { id: "sell_50", name: "Trade Master", emoji: "⚖️", desc: "Sell 50 duplicates", target: 50, stat: "totalSold", reward: 2, rewardType: "gems" },
  { id: "sell_100", name: "Trade King", emoji: "🤴", desc: "Sell 100 duplicates", target: 100, stat: "totalSold", reward: 5, rewardType: "gems" },
  // Pull tiers
  { id: "pull_200", name: "Obsessed", emoji: "😵", desc: "Pull 200 capsules", target: 200, stat: "totalPulls", reward: 500, rewardType: "coins" },
  { id: "pull_1000", name: "No Life", emoji: "💀", desc: "Pull 1000 capsules", target: 1000, stat: "totalPulls", reward: 10, rewardType: "gems" },
  // Collection tiers
  { id: "collect_50", name: "Museum Curator", emoji: "🏛️", desc: "Collect 50 unique items", target: 50, stat: "uniqueItems", reward: 3, rewardType: "gems" },
  { id: "collect_80", name: "Almost There", emoji: "🔥", desc: "Collect 80 unique items", target: 80, stat: "uniqueItems", reward: 5, rewardType: "gems" },
  // Coin earning tiers
  { id: "earn_1k", name: "Money Maker", emoji: "💵", desc: "Earn 1,000 total coins", target: 1000, stat: "totalCoinsEarned", reward: 100, rewardType: "coins" },
  { id: "earn_10k", name: "Rich", emoji: "💰", desc: "Earn 10,000 total coins", target: 10000, stat: "totalCoinsEarned", reward: 3, rewardType: "gems" },
  { id: "earn_50k", name: "Millionaire", emoji: "🤑", desc: "Earn 50,000 total coins", target: 50000, stat: "totalCoinsEarned", reward: 10, rewardType: "gems" },
];

// ===== Daily Check-in Rewards =====
const CHECKIN_REWARDS = [
  { day: 1, emoji: "⭐", amount: 50, type: "coins" },
  { day: 2, emoji: "⭐", amount: 75, type: "coins" },
  { day: 3, emoji: "⭐", amount: 100, type: "coins" },
  { day: 4, emoji: "♦", amount: 1, type: "gems" },
  { day: 5, emoji: "⭐", amount: 150, type: "coins" },
  { day: 6, emoji: "⭐", amount: 200, type: "coins" },
  { day: 7, emoji: "♦", amount: 3, type: "gems" },
];

// ===== Game State =====
let state = {
  coins: 100,
  gems: 5,
  currentMachine: "starter",
  unlockedMachines: ["starter"],
  collection: {},
  upgrades: { luck: 0, multi: 0, coins: 0, auto: 0 },
  totalPulls: 0,
  totalSSR: 0,
  totalCoinsEarned: 100,
  totalCoinsSpent: 0,
  totalSold: 0,
  // Daily check-in
  checkinDay: 0,        // 0-6 (which day in the 7-day cycle)
  lastCheckin: null,     // date string "YYYY-MM-DD"
  // Free pull
  lastFreePull: 0,       // timestamp
  // Achievements
  claimedAchievements: [],
};

// Load save
function loadGame() {
  const saved = localStorage.getItem("gachamaster-save");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    } catch(e) {}
  }
}

function saveGame() {
  localStorage.setItem("gachamaster-save", JSON.stringify(state));
}

loadGame();

// ===== Helper Functions =====
function getRates(machineId) {
  const machine = MACHINES.find(m => m.id === machineId);
  const base = { ...machine.rates };
  const luckBonus = state.upgrades.luck * 0.5;
  base.SSR = Math.min(base.SSR + luckBonus, 20);
  base.SR = Math.min(base.SR + luckBonus * 0.5, 30);
  base.C = 100 - base.R - base.SR - base.SSR;
  return base;
}

function pullItem(machineId) {
  const rates = getRates(machineId);
  const items = ITEMS[machineId];
  const roll = Math.random() * 100;
  let rarity;
  if (roll < rates.SSR) rarity = "SSR";
  else if (roll < rates.SSR + rates.SR) rarity = "SR";
  else if (roll < rates.SSR + rates.SR + rates.R) rarity = "R";
  else rarity = "C";

  const pool = items.filter(i => i.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function addItem(item) {
  state.collection[item.id] = (state.collection[item.id] || 0) + 1;
  const isNew = state.collection[item.id] === 1;

  // Duplicate coins
  if (!isNew) {
    const dupBonus = 1 + state.upgrades.coins * 0.2;
    const baseCoins = { C: 2, R: 5, SR: 15, SSR: 50 }[item.rarity];
    const earned = Math.floor(baseCoins * dupBonus);
    state.coins += earned;
    state.totalCoinsEarned += earned;
  }

  if (item.rarity === "SSR") state.totalSSR++;
  state.totalPulls++;
  return isNew;
}

function getPullCost(machineId, multi = false) {
  const machine = MACHINES.find(m => m.id === machineId);
  let cost = machine.cost;
  if (multi) {
    const discount = 1 - state.upgrades.multi * 0.05;
    cost = Math.floor(cost * 10 * discount);
  }
  return cost;
}

// ===== UI Updates =====
function updateUI() {
  document.getElementById("coinAmount").textContent = state.coins.toLocaleString();
  document.getElementById("gemAmount").textContent = state.gems;

  const cost1 = getPullCost(state.currentMachine);
  const cost10 = getPullCost(state.currentMachine, true);
  document.getElementById("costAmount").textContent = cost1;
  document.getElementById("pullBtn").classList.toggle("disabled", state.coins < cost1);
  document.getElementById("pull10Btn").classList.toggle("disabled", state.coins < cost10);

  saveGame();
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function spawnFloatingCoin(x, y) {
  const container = document.getElementById("floatCoins");
  const el = document.createElement("div");
  el.className = "float-coin";
  el.textContent = "⭐";
  el.style.left = x + "px";
  el.style.top = y + "px";
  container.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function spawnSSRParticles() {
  const container = document.createElement("div");
  container.className = "ssr-particles";
  document.body.appendChild(container);
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "ssr-particle";
    p.style.left = "50%";
    p.style.top = "50%";
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    p.style.animationDelay = Math.random() * 0.3 + "s";
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), 2000);
}

// ===== Machine Rendering =====
function renderMachineTabs() {
  const tabs = document.getElementById("machineTabs");
  tabs.innerHTML = MACHINES.map(m => {
    const unlocked = state.unlockedMachines.includes(m.id);
    const active = state.currentMachine === m.id;
    return `<button class="machine-tab ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''}"
      data-machine="${m.id}" onclick="selectMachine('${m.id}')">
      ${unlocked ? m.name : '🔒 ' + m.name}
    </button>`;
  }).join("");
}

function renderMachine() {
  const machine = MACHINES.find(m => m.id === state.currentMachine);
  document.getElementById("machineName").textContent = machine.name;

  const rates = getRates(state.currentMachine);
  document.getElementById("machineRates").innerHTML =
    `<span class="rate-tag rate-C">C ${rates.C.toFixed(0)}%</span>
     <span class="rate-tag rate-R">R ${rates.R.toFixed(0)}%</span>
     <span class="rate-tag rate-SR">SR ${rates.SR.toFixed(1)}%</span>
     <span class="rate-tag rate-SSR">SSR ${rates.SSR.toFixed(1)}%</span>`;

  // Floating capsules inside globe
  const colors = ["#f43f5e", "#3b82f6", "#a855f7", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
  const globe = document.getElementById("capsulesInside");
  globe.innerHTML = "";
  for (let i = 0; i < 12; i++) {
    const cap = document.createElement("div");
    cap.className = "mini-capsule";
    cap.style.background = colors[i % colors.length];
    cap.style.left = (15 + Math.random() * 65) + "%";
    cap.style.top = (15 + Math.random() * 60) + "%";
    cap.style.animationDelay = (Math.random() * 3) + "s";
    cap.style.animationDuration = (2.5 + Math.random() * 2) + "s";
    globe.appendChild(cap);
  }

  renderMachineTabs();
  updateUI();
}

function selectMachine(id) {
  const machine = MACHINES.find(m => m.id === id);
  if (!state.unlockedMachines.includes(id)) {
    // Try to unlock
    if (state.coins >= machine.unlockCost && state.gems >= machine.unlockGems) {
      state.coins -= machine.unlockCost;
      state.gems -= machine.unlockGems;
      state.totalCoinsSpent += machine.unlockCost;
      state.unlockedMachines.push(id);
      showToast(`Unlocked ${machine.name}!`);
      playSound("buy");
    } else {
      showToast(`Need ⭐${machine.unlockCost} + ♦${machine.unlockGems} to unlock`);
      return;
    }
  }
  state.currentMachine = id;
  renderMachine();
}

// ===== Pull Mechanics =====
let pulling = false;
let revealState = "idle"; // idle, capsule, item, multi

function pull() {
  if (pulling) return;
  const cost = getPullCost(state.currentMachine);
  if (state.coins < cost) { showToast("Not enough coins!"); return; }

  pulling = true;
  state.coins -= cost;
  state.totalCoinsSpent += cost;
  updateUI();
  playSound("pull");

  // Shake machine
  document.getElementById("machine").classList.add("shaking");
  setTimeout(() => document.getElementById("machine").classList.remove("shaking"), 400);

  const item = pullItem(state.currentMachine);
  const isNew = addItem(item);

  setTimeout(() => showSingleReveal(item, isNew), 500);
}

function pull10() {
  if (pulling) return;
  const cost = getPullCost(state.currentMachine, true);
  if (state.coins < cost) { showToast("Not enough coins!"); return; }

  pulling = true;
  state.coins -= cost;
  state.totalCoinsSpent += cost;
  updateUI();
  playSound("pull");

  document.getElementById("machine").classList.add("shaking");
  setTimeout(() => document.getElementById("machine").classList.remove("shaking"), 400);

  const items = [];
  for (let i = 0; i < 10; i++) {
    const item = pullItem(state.currentMachine);
    const isNew = addItem(item);
    items.push({ item, isNew });
  }

  setTimeout(() => showMultiReveal(items), 500);
}

function showSingleReveal(item, isNew) {
  const overlay = document.getElementById("revealOverlay");
  const capsuleReveal = document.getElementById("capsuleReveal");
  const itemReveal = document.getElementById("itemReveal");
  const multiReveal = document.getElementById("multiReveal");
  const shell = document.getElementById("capsuleShell");

  capsuleReveal.classList.remove("hidden");
  itemReveal.classList.add("hidden");
  multiReveal.classList.add("hidden");
  shell.className = "capsule-shell rarity-" + item.rarity;
  document.getElementById("revealCloseText").textContent = "TAP TO OPEN";

  overlay.classList.add("active");
  revealState = "capsule";

  overlay._item = item;
  overlay._isNew = isNew;
}

function showMultiReveal(items) {
  const overlay = document.getElementById("revealOverlay");
  const capsuleReveal = document.getElementById("capsuleReveal");
  const itemReveal = document.getElementById("itemReveal");
  const multiReveal = document.getElementById("multiReveal");

  capsuleReveal.classList.add("hidden");
  itemReveal.classList.add("hidden");
  multiReveal.classList.remove("hidden");
  document.getElementById("revealCloseText").textContent = "CLOSE";

  const grid = document.getElementById("multiGrid");
  grid.innerHTML = items.map((entry, i) => {
    const { item, isNew } = entry;
    return `<div class="multi-item rarity-${item.rarity}" style="animation-delay:${i * 0.08}s">
      <span class="multi-emoji">${item.emoji}</span>
      <span class="multi-name">${item.name}</span>
      <span class="multi-rarity rarity-${item.rarity}">${item.rarity}</span>
      ${isNew ? '<span style="color:#22c55e;font-size:9px;font-weight:800;">NEW</span>' : ''}
    </div>`;
  }).join("");

  // Play sound for best item
  const best = items.reduce((a, b) => {
    const order = { C: 0, R: 1, SR: 2, SSR: 3 };
    return order[a.item.rarity] >= order[b.item.rarity] ? a : b;
  });
  if (best.item.rarity === "SSR") { playSound("ssr"); spawnSSRParticles(); }
  else if (best.item.rarity === "SR") playSound("sr");
  else if (best.item.rarity === "R") playSound("rare");
  else playSound("common");

  overlay.classList.add("active");
  revealState = "multi";
  updateUI();
}

function closeReveal() {
  const overlay = document.getElementById("revealOverlay");

  if (revealState === "capsule") {
    // Open capsule -> show item
    const item = overlay._item;
    const isNew = overlay._isNew;
    const shell = document.getElementById("capsuleShell");
    shell.classList.add("opening");
    playSound("open");

    setTimeout(() => {
      document.getElementById("capsuleReveal").classList.add("hidden");
      const itemReveal = document.getElementById("itemReveal");
      itemReveal.classList.remove("hidden");

      const bg = document.getElementById("itemRarityBg");
      bg.className = "item-rarity-bg rarity-" + item.rarity;
      document.getElementById("itemEmoji").textContent = item.emoji;
      document.getElementById("itemName").textContent = item.name;
      const rarityLabel = document.getElementById("itemRarityLabel");
      rarityLabel.textContent = item.rarity;
      rarityLabel.className = "item-rarity-label rarity-" + item.rarity;
      document.getElementById("itemDesc").textContent = item.desc;
      const newBadge = document.getElementById("revealNew");
      if (isNew) newBadge.classList.remove("hidden");
      else newBadge.classList.add("hidden");

      document.getElementById("revealCloseText").textContent = "CLOSE";

      if (item.rarity === "SSR") { playSound("ssr"); spawnSSRParticles(); }
      else if (item.rarity === "SR") playSound("sr");
      else if (item.rarity === "R") playSound("rare");
      else playSound("common");

      revealState = "item";
      shell.classList.remove("opening");
      updateUI();
    }, 500);

  } else {
    // Close overlay
    overlay.classList.remove("active");
    revealState = "idle";
    pulling = false;
    updateUI();
  }
}

// ===== Tab Navigation =====
function switchTab(tab) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add("active");

  document.getElementById("gameArea").classList.toggle("hidden", tab !== "machine");
  document.getElementById("rewardsPanel").classList.toggle("hidden", tab !== "rewards");
  document.getElementById("collectionPanel").classList.toggle("hidden", tab !== "collection");
  document.getElementById("shopPanel").classList.toggle("hidden", tab !== "shop");
  document.getElementById("statsPanel").classList.toggle("hidden", tab !== "stats");
  document.getElementById("chatPanel").classList.toggle("hidden", tab !== "chat");

  if (tab === "rewards") { renderRewards(); loadAndRenderPublicFeedback(); }
  if (tab === "collection") renderCollection();
  if (tab === "shop") renderShop();
  if (tab === "stats") renderStats();
  if (tab === "chat") { renderChatUI(); scrollChatToBottom(); }
}

// ===== Collection =====
function renderCollection(filterRarity = "all") {
  const allItems = Object.values(ITEMS).flat();
  const filtered = filterRarity === "all" ? allItems : allItems.filter(i => i.rarity === filterRarity);
  const owned = allItems.filter(i => state.collection[i.id] > 0).length;

  document.getElementById("collectionProgress").textContent = `${owned} / ${allItems.length}`;

  document.getElementById("collectionGrid").innerHTML = filtered.map(item => {
    const count = state.collection[item.id] || 0;
    const isOwned = count > 0;
    return `<div class="collection-item rarity-${item.rarity} ${isOwned ? 'owned' : 'not-owned'}">
      ${count > 1 ? `<span class="coll-count">x${count}</span>` : ''}
      <span class="coll-emoji">${isOwned ? item.emoji : '?'}</span>
      <span class="coll-name">${isOwned ? item.name : '???'}</span>
      <span class="coll-rarity rarity-${item.rarity}">${item.rarity}</span>
    </div>`;
  }).join("");

  // Filter button handlers
  document.querySelectorAll("#collectionFilter .filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.rarity === filterRarity);
    btn.onclick = () => renderCollection(btn.dataset.rarity);
  });
}

// ===== Shop =====
function renderShop() {
  document.getElementById("shopItems").innerHTML = UPGRADES.map(up => {
    const lvl = state.upgrades[up.id];
    const maxed = lvl >= up.maxLevel;
    const cost = Math.floor(up.baseCost * Math.pow(up.costMul, lvl));
    return `<div class="shop-card">
      <span class="shop-icon">${up.emoji}</span>
      <div class="shop-info">
        <div class="shop-name">${up.name}</div>
        <div class="shop-desc">${up.desc}</div>
        <div class="shop-level">Lv.${lvl}/${up.maxLevel} — ${up.effect(lvl)}</div>
      </div>
      <button class="shop-buy ${maxed ? 'maxed' : ''}"
        onclick="buyUpgrade('${up.id}')"
        ${maxed ? 'disabled' : ''}>
        ${maxed ? 'MAX' : '⭐ ' + cost}
      </button>
    </div>`;
  }).join("");

  // Unlock machines section
  const lockMachines = MACHINES.filter(m => !state.unlockedMachines.includes(m.id));
  if (lockMachines.length > 0) {
    document.getElementById("shopItems").innerHTML += `
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
        <h3 style="font-family:'Fredoka One',cursive;margin-bottom:12px;">Unlock Machines</h3>
        ${lockMachines.map(m => `
          <div class="shop-card">
            <span class="shop-icon">🎰</span>
            <div class="shop-info">
              <div class="shop-name">${m.name}</div>
              <div class="shop-desc">${ITEMS[m.id].length} items to collect</div>
            </div>
            <button class="shop-buy" onclick="selectMachine('${m.id}')">
              ⭐${m.unlockCost} ${m.unlockGems > 0 ? '♦' + m.unlockGems : ''}
            </button>
          </div>
        `).join("")}
      </div>`;
  }
}

function buyUpgrade(id) {
  const up = UPGRADES.find(u => u.id === id);
  const lvl = state.upgrades[id];
  if (lvl >= up.maxLevel) return;
  const cost = Math.floor(up.baseCost * Math.pow(up.costMul, lvl));
  if (state.coins < cost) { showToast("Not enough coins!"); return; }

  state.coins -= cost;
  state.totalCoinsSpent += cost;
  state.upgrades[id]++;
  playSound("buy");
  showToast(`${up.name} upgraded to Lv.${state.upgrades[id]}!`);
  renderShop();
  renderMachine();
  updateUI();
}

// ===== Stats =====
function renderStats() {
  const allItems = Object.values(ITEMS).flat();
  const owned = allItems.filter(i => state.collection[i.id] > 0).length;
  const totalDups = Object.values(state.collection).reduce((a, b) => a + Math.max(b - 1, 0), 0);

  // Get current boosted rates for active machine
  const currentRates = getRates(state.currentMachine);
  const baseMachine = MACHINES.find(m => m.id === state.currentMachine);
  const baseRates = baseMachine.rates;

  // Calculate upgrade effects
  const luckBonus = state.upgrades.luck * 0.5;
  const multiDiscount = state.upgrades.multi * 5;
  const dupCoinBonus = state.upgrades.coins * 20;
  const autoCoinsPerMin = state.upgrades.auto * 2;
  const isLuckBoosted = adState.luckBoostEnd > Date.now();

  document.getElementById("statsGrid").innerHTML = [
    ["Total Pulls", state.totalPulls],
    ["SSR Obtained", state.totalSSR],
    ["SSR Rate (Actual)", state.totalPulls > 0 ? (state.totalSSR / state.totalPulls * 100).toFixed(2) + "%" : "N/A"],
    ["Items Collected", `${owned} / ${allItems.length}`],
    ["Completion", (owned / allItems.length * 100).toFixed(1) + "%"],
    ["Total Duplicates", totalDups],
    ["Coins Earned (Total)", state.totalCoinsEarned.toLocaleString()],
    ["Coins Spent (Total)", state.totalCoinsSpent.toLocaleString()],
    ["Machines Unlocked", `${state.unlockedMachines.length} / ${MACHINES.length}`],
    // Current machine boosted rates
    ["── Current Machine ──", baseMachine.name],
    ["Current SSR Rate", currentRates.SSR.toFixed(1) + "%" + (luckBonus > 0 || isLuckBoosted ? " (boosted)" : "")],
    ["Current SR Rate", currentRates.SR.toFixed(1) + "%" + (luckBonus > 0 || isLuckBoosted ? " (boosted)" : "")],
    ["Base SSR Rate", baseRates.SSR + "%"],
    ["Base SR Rate", baseRates.SR + "%"],
    // Upgrade levels and effects
    ["── Upgrades ──", ""],
    ["Lucky Charm", `Lv.${state.upgrades.luck} → +${luckBonus.toFixed(1)}% SSR`],
    ["Multi-Pull Discount", `Lv.${state.upgrades.multi} → ${multiDiscount}% off`],
    ["Coin Magnet", `Lv.${state.upgrades.coins} → +${dupCoinBonus}% dup coins`],
    ["Auto Collector", `Lv.${state.upgrades.auto} → ${autoCoinsPerMin} coins/min`],
    // Active boosts
    ...(isLuckBoosted ? [["2x Luck Boost", "ACTIVE"]] : []),
  ].map(([label, value]) => `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
    </div>
  `).join("");

  // Reset button
  document.getElementById("statsGrid").innerHTML += `
    <div style="margin-top:20px;text-align:center;">
      <button onclick="resetGame()" style="padding:10px 24px;border-radius:50px;
        background:rgba(248,81,73,0.15);color:#f85149;border:1px solid rgba(248,81,73,0.3);
        font-family:inherit;font-weight:700;cursor:pointer;">Reset All Progress</button>
    </div>`;
}

function resetGame() {
  if (confirm("Are you sure? This will erase ALL progress!")) {
    localStorage.removeItem("gachamaster-save");
    location.reload();
  }
}

// ===== Auto Collector =====
setInterval(() => {
  if (state.upgrades.auto > 0) {
    const earned = state.upgrades.auto * 2;
    state.coins += earned;
    state.totalCoinsEarned += earned;
    updateUI();
  }
}, 60000);

// Also give 1 coin every 10 seconds if auto is active
setInterval(() => {
  if (state.upgrades.auto > 0) {
    const rate = state.upgrades.auto;
    const perTick = Math.max(Math.floor(rate / 3), 1);
    state.coins += perTick;
    state.totalCoinsEarned += perTick;
    updateUI();
  }
}, 10000);

// ===== FREE PULL TIMER =====
const FREE_PULL_INTERVAL = 5 * 60 * 1000; // 5 minutes

function updateFreePullTimer() {
  const btn = document.getElementById("freePullBtn");
  const text = document.getElementById("freePullText");
  const elapsed = Date.now() - (state.lastFreePull || 0);
  const remaining = FREE_PULL_INTERVAL - elapsed;

  if (remaining <= 0) {
    btn.disabled = false;
    btn.classList.add("ready");
    text.textContent = "FREE PULL!";
  } else {
    btn.disabled = true;
    btn.classList.remove("ready");
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    text.textContent = `FREE in ${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

function freePull() {
  if (pulling) return;
  const elapsed = Date.now() - (state.lastFreePull || 0);
  if (elapsed < FREE_PULL_INTERVAL) return;

  state.lastFreePull = Date.now();
  pulling = true;
  playSound("pull");

  document.getElementById("machine").classList.add("shaking");
  setTimeout(() => document.getElementById("machine").classList.remove("shaking"), 400);

  const item = pullItem(state.currentMachine);
  const isNew = addItem(item);

  setTimeout(() => showSingleReveal(item, isNew), 500);
  updateFreePullTimer();
  saveGame();
}

setInterval(updateFreePullTimer, 1000);

// ===== DAILY CHECK-IN =====
function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function canCheckin() {
  return state.lastCheckin !== getTodayStr();
}

function dailyCheckin() {
  if (!canCheckin()) { showToast("Already checked in today!"); return; }

  const day = state.checkinDay;
  const reward = CHECKIN_REWARDS[day];

  if (reward.type === "coins") {
    state.coins += reward.amount;
    state.totalCoinsEarned += reward.amount;
    showToast(`Check-in Day ${day + 1}: +${reward.amount} coins!`);
  } else {
    state.gems += reward.amount;
    showToast(`Check-in Day ${day + 1}: +${reward.amount} gems!`);
  }

  state.lastCheckin = getTodayStr();
  state.checkinDay = (state.checkinDay + 1) % 7;
  playSound("coin");
  updateUI();
  renderRewards();
  updateRewardBadge();
}

// ===== ACHIEVEMENTS =====
function getAchievementProgress(ach) {
  switch (ach.stat) {
    case "totalPulls": return state.totalPulls;
    case "totalSSR": return state.totalSSR;
    case "uniqueItems": return Object.keys(state.collection).length;
    case "machinesUnlocked": return state.unlockedMachines.length;
    case "totalSold": return state.totalSold || 0;
    case "totalCoinsEarned": return state.totalCoinsEarned || 0;
    default: return 0;
  }
}

function claimAchievement(id) {
  if (state.claimedAchievements.includes(id)) return;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  const progress = getAchievementProgress(ach);
  if (progress < ach.target) return;

  state.claimedAchievements.push(id);
  if (ach.rewardType === "coins") {
    state.coins += ach.reward;
    state.totalCoinsEarned += ach.reward;
    showToast(`Achievement: ${ach.name} — +${ach.reward} coins!`);
  } else {
    state.gems += ach.reward;
    showToast(`Achievement: ${ach.name} — +${ach.reward} gems!`);
  }
  playSound("ssr");
  updateUI();
  renderRewards();
  updateRewardBadge();
}

// ===== SELL DUPLICATES =====
function sellDuplicate(itemId) {
  const count = state.collection[itemId] || 0;
  if (count <= 1) return; // Keep at least 1

  const allItems = Object.values(ITEMS).flat();
  const item = allItems.find(i => i.id === itemId);
  const sellPrice = { C: 3, R: 8, SR: 25, SSR: 80 }[item.rarity];

  state.collection[itemId]--;
  state.totalSold = (state.totalSold || 0) + 1;
  state.coins += sellPrice;
  state.totalCoinsEarned += sellPrice;
  playSound("coin");
  showToast(`Sold ${item.name} for ⭐${sellPrice}`);
  updateUI();
  renderRewards();
}

// ===== RENDER REWARDS PANEL =====
function renderRewards() {
  // Daily Check-in
  const checkinGrid = document.getElementById("checkinGrid");
  const todayCheckedIn = state.lastCheckin === getTodayStr();
  // After check-in, checkinDay already points to NEXT day
  // So claimed days are: all days before checkinDay (when checked in today), or before checkinDay (when not yet)
  const lastClaimedIndex = todayCheckedIn ? (state.checkinDay - 1 + 7) % 7 : -1;

  checkinGrid.innerHTML = CHECKIN_REWARDS.map((r, i) => {
    let isClaimed = false;
    if (todayCheckedIn) {
      // Days 0 through lastClaimedIndex are claimed
      isClaimed = i <= lastClaimedIndex;
    } else {
      // Days 0 through checkinDay-1 are claimed from previous days
      isClaimed = i < state.checkinDay;
    }
    const isToday = i === state.checkinDay && !todayCheckedIn;

    return `<div class="checkin-day ${isClaimed ? 'claimed' : ''} ${isToday ? 'today' : ''}">
      <span class="checkin-day-num">Day ${i + 1}</span>
      <span class="checkin-reward">${isClaimed ? '✅' : r.emoji}</span>
      <span class="checkin-amount">${r.type === 'coins' ? '⭐' + r.amount : '♦' + r.amount}</span>
    </div>`;
  }).join("");

  document.getElementById("checkinStreak").textContent = `Day ${state.checkinDay}/7`;
  const checkinBtn = document.getElementById("checkinBtn");
  if (canCheckin()) {
    checkinBtn.disabled = false;
    checkinBtn.textContent = "Check In Today! 🎁";
  } else {
    checkinBtn.disabled = true;
    checkinBtn.textContent = "✅ Checked in today!";
  }

  // Achievements
  document.getElementById("achievementsList").innerHTML = ACHIEVEMENTS.map(ach => {
    const progress = getAchievementProgress(ach);
    const completed = progress >= ach.target;
    const claimed = state.claimedAchievements.includes(ach.id);
    const pct = Math.min(progress / ach.target * 100, 100);
    const rewardStr = ach.rewardType === "coins" ? `⭐${ach.reward}` : `♦${ach.reward}`;

    let btnHtml;
    if (claimed) btnHtml = `<button class="ach-reward-btn done">Claimed</button>`;
    else if (completed) btnHtml = `<button class="ach-reward-btn claimable" onclick="claimAchievement('${ach.id}')">${rewardStr}</button>`;
    else btnHtml = `<button class="ach-reward-btn locked">${progress}/${ach.target}</button>`;

    return `<div class="achievement-card ${completed ? 'completed' : ''} ${claimed ? 'claimed' : ''}">
      <span class="ach-icon">${ach.emoji}</span>
      <div class="ach-info">
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
        <div class="ach-progress"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
      </div>
      ${btnHtml}
    </div>`;
  }).join("");

  // Sell Duplicates
  const allItems = Object.values(ITEMS).flat();
  const sellable = allItems.filter(i => (state.collection[i.id] || 0) > 1);
  const sellGrid = document.getElementById("sellGrid");

  if (sellable.length === 0) {
    sellGrid.innerHTML = '<p style="color:var(--text-dim);font-size:13px;">No duplicates to sell yet. Keep pulling!</p>';
  } else {
    sellGrid.innerHTML = sellable.map(item => {
      const count = state.collection[item.id];
      const sellPrice = { C: 3, R: 8, SR: 25, SSR: 80 }[item.rarity];
      return `<div class="sell-card">
        <span class="sell-emoji">${item.emoji}</span>
        <div class="sell-info">
          <div class="sell-name">${item.name}</div>
          <div class="sell-count">x${count} owned</div>
        </div>
        <button class="sell-btn" onclick="sellDuplicate('${item.id}')">Sell ⭐${sellPrice}</button>
      </div>`;
    }).join("");
  }
}

// ===== REWARD BADGE (notification dot) =====
function updateRewardBadge() {
  const hasCheckin = canCheckin();
  const hasAchievement = ACHIEVEMENTS.some(a => {
    return !state.claimedAchievements.includes(a.id) && getAchievementProgress(a) >= a.target;
  });
  const badge = document.getElementById("rewardBadge");
  badge.classList.toggle("hidden", !hasCheckin && !hasAchievement);
}

// ===== REWARDED ADS SYSTEM =====
// In production, replace simulateAd() with real SDK calls:
// - Google AdMob (mobile): admob.showRewardedAd()
// - Unity Ads: UnityAds.show('rewardedVideo')
// - IronSource, AppLovin, etc.
// Each completed ad view earns you ~$0.01-0.05 real revenue

const AD_DAILY_LIMIT = 10;
const AD_COOLDOWN = 30000; // 30 seconds between ads
const AD_DURATION = 5000;  // 5 seconds to watch

let adState = {
  adsWatchedToday: 0,
  lastAdDate: null,
  lastAdTime: 0,
  pendingReward: null,
  luckBoostEnd: 0,
};

// Load ad state
function loadAdState() {
  const saved = localStorage.getItem("gachamaster-ads");
  if (saved) {
    try { adState = { ...adState, ...JSON.parse(saved) }; } catch(e) {}
  }
  // Reset daily count if new day
  if (adState.lastAdDate !== getTodayStr()) {
    adState.adsWatchedToday = 0;
    adState.lastAdDate = getTodayStr();
    saveAdState();
  }
}
function saveAdState() {
  localStorage.setItem("gachamaster-ads", JSON.stringify(adState));
}
loadAdState();

function canWatchAd() {
  if (adState.adsWatchedToday >= AD_DAILY_LIMIT) return { ok: false, reason: "Daily limit reached (10/10)" };
  if (Date.now() - adState.lastAdTime < AD_COOLDOWN) {
    const secs = Math.ceil((AD_COOLDOWN - (Date.now() - adState.lastAdTime)) / 1000);
    return { ok: false, reason: `Wait ${secs}s cooldown` };
  }
  return { ok: true };
}

function startWatchAd(rewardType) {
  const check = canWatchAd();
  if (!check.ok) { showToast(check.reason); return; }

  adState.pendingReward = rewardType;
  const overlay = document.getElementById("adOverlay");
  const progressFill = document.getElementById("adProgressFill");
  const timerEl = document.getElementById("adTimer");
  const skipEl = document.getElementById("adSkip");

  overlay.classList.add("active");
  progressFill.style.width = "0%";
  skipEl.textContent = "";
  skipEl.className = "ad-skip";

  let elapsed = 0;
  const interval = setInterval(() => {
    elapsed += 100;
    const pct = Math.min((elapsed / AD_DURATION) * 100, 100);
    progressFill.style.width = pct + "%";

    const remaining = Math.ceil((AD_DURATION - elapsed) / 1000);
    if (remaining > 0) {
      timerEl.textContent = `Reward in ${remaining}s...`;
    } else {
      timerEl.textContent = "Reward ready!";
    }

    if (elapsed >= AD_DURATION) {
      clearInterval(interval);
      skipEl.textContent = "✓ Collect Reward";
      skipEl.className = "ad-skip ready";
      skipEl.onclick = () => collectAdReward();
    }
  }, 100);
}

function collectAdReward() {
  const overlay = document.getElementById("adOverlay");
  overlay.classList.remove("active");

  const reward = adState.pendingReward;
  adState.adsWatchedToday++;
  adState.lastAdTime = Date.now();
  adState.pendingReward = null;
  saveAdState();

  switch (reward) {
    case "machine":
    case "coins30":
      state.coins += 30;
      state.totalCoinsEarned += 30;
      showToast("Ad reward: +30 coins!");
      playSound("coin");
      break;
    case "coins80":
      state.coins += 80;
      state.totalCoinsEarned += 80;
      showToast("Ad reward: +80 coins!");
      playSound("coin");
      break;
    case "gem":
      state.gems += 1;
      showToast("Ad reward: +1 gem!");
      playSound("sr");
      break;
    case "freepull": {
      const item = pullItem(state.currentMachine);
      const isNew = addItem(item);
      showToast("Ad reward: Free pull!");
      setTimeout(() => showSingleReveal(item, isNew), 300);
      break;
    }
    case "luck2x":
      adState.luckBoostEnd = Date.now() + 3 * 60 * 1000; // 3 minutes
      saveAdState();
      showToast("2x Luck Boost active for 3 minutes!");
      playSound("ssr");
      updateLuckBoostUI();
      break;
  }

  updateUI();
  updateAdUI();
}

function updateAdUI() {
  const remaining = AD_DAILY_LIMIT - adState.adsWatchedToday;
  const el = document.getElementById("adRemaining");
  if (el) el.textContent = `${remaining} ads left today`;

  const badge = document.getElementById("adCountBadge");
  if (badge) badge.textContent = `${adState.adsWatchedToday}/${AD_DAILY_LIMIT} today`;

  // Disable main ad button if can't watch
  const btn = document.getElementById("adWatchBtn");
  const check = canWatchAd();
  btn.disabled = !check.ok;
}

// Override getRates to include luck boost
const _originalGetRates = getRates;
getRates = function(machineId) {
  const rates = _originalGetRates(machineId);
  if (adState.luckBoostEnd > Date.now()) {
    rates.SSR = Math.min(rates.SSR * 2, 30);
    rates.SR = Math.min(rates.SR * 1.5, 40);
    rates.C = 100 - rates.R - rates.SR - rates.SSR;
  }
  return rates;
};

function updateLuckBoostUI() {
  // Re-render machine to show updated rates
  renderMachine();
}

// Check luck boost timer
setInterval(() => {
  if (adState.luckBoostEnd > 0 && adState.luckBoostEnd <= Date.now()) {
    adState.luckBoostEnd = 0;
    saveAdState();
    showToast("2x Luck Boost expired!");
    renderMachine();
  }
  updateAdUI();
}, 1000);

// ===== FEEDBACK SYSTEM =====
let feedbackState = {
  type: "suggestion",
  rating: 0,
  history: [],
};

function loadFeedback() {
  const saved = localStorage.getItem("gachamaster-feedback");
  if (saved) {
    try { feedbackState = { ...feedbackState, ...JSON.parse(saved) }; } catch(e) {}
  }
}
function saveFeedback() {
  localStorage.setItem("gachamaster-feedback", JSON.stringify(feedbackState));
}
loadFeedback();

function openFeedback() {
  document.getElementById("feedbackOverlay").classList.add("active");
  document.getElementById("feedbackText").value = "";
  feedbackState.rating = 0;
  feedbackState.type = "suggestion";
  updateStarUI();
  updateFeedbackTypeUI();
  renderFeedbackHistory();
}

function closeFeedback() {
  document.getElementById("feedbackOverlay").classList.remove("active");
}

function selectFeedbackType(type) {
  feedbackState.type = type;
  updateFeedbackTypeUI();
}

function updateFeedbackTypeUI() {
  document.querySelectorAll(".fb-type-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === feedbackState.type);
  });
}

function setRating(n) {
  feedbackState.rating = n;
  updateStarUI();
}

function updateStarUI() {
  document.querySelectorAll("#starRating .star").forEach(star => {
    const val = parseInt(star.dataset.star);
    star.textContent = val <= feedbackState.rating ? "★" : "☆";
    star.classList.toggle("filled", val <= feedbackState.rating);
  });
}

function submitFeedback() {
  const text = document.getElementById("feedbackText").value.trim();
  if (!text) { showToast("Please write something first!"); return; }

  const entry = {
    type: feedbackState.type,
    rating: feedbackState.rating,
    text: text,
    date: new Date().toISOString(),
    stats: {
      pulls: state.totalPulls,
      collection: Object.keys(state.collection).length,
      machines: state.unlockedMachines.length,
    }
  };

  feedbackState.history.unshift(entry);
  if (feedbackState.history.length > 20) feedbackState.history = feedbackState.history.slice(0, 20);
  saveFeedback();

  // Post to Supabase if logged in
  if (isSupabaseConfigured() && currentUser) {
    submitFeedbackOnline(entry).catch(() => {});
  }

  showToast("Thank you for your feedback!");
  playSound("coin");

  // Reward player for giving feedback
  state.coins += 20;
  state.totalCoinsEarned += 20;
  updateUI();

  document.getElementById("feedbackText").value = "";
  feedbackState.rating = 0;
  updateStarUI();
  renderFeedbackHistory();
}

function renderFeedbackHistory() {
  const list = document.getElementById("feedbackHistoryList");
  if (feedbackState.history.length === 0) {
    list.innerHTML = '<p class="fb-no-history">No feedback sent yet.</p>';
    return;
  }
  list.innerHTML = feedbackState.history.slice(0, 5).map(fb => {
    const date = new Date(fb.date).toLocaleDateString();
    const typeEmoji = { suggestion: "💡", bug: "🐛", love: "❤️" }[fb.type] || "💬";
    const stars = fb.rating > 0 ? "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating) : "";
    return `<div class="fb-history-item">
      <div class="fb-history-meta">
        <span>${typeEmoji} ${fb.type} — ${date}</span>
        <span class="fb-history-stars">${stars}</span>
      </div>
      <div class="fb-history-text">${fb.text.substring(0, 100)}${fb.text.length > 100 ? '...' : ''}</div>
    </div>`;
  }).join("");
}

// ===================================================================
// SUPABASE INTEGRATION - Login, Cloud Save, Chat, Public Feedback
// ===================================================================

let isGuest = true;
let cloudSaveInterval = null;

// ===== Login / Register UI =====
function showLoginForm() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("forgotPasswordForm").classList.add("hidden");
  hideLoginMessage();
}

function showRegisterForm() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("forgotPasswordForm").classList.add("hidden");
  hideLoginMessage();
  renderPasswordRules();
}

function showForgotPasswordForm() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("forgotPasswordForm").classList.remove("hidden");
  hideLoginMessage();
  // Copy email from login form if already entered
  const loginEmail = document.getElementById("loginEmail").value.trim();
  if (loginEmail) {
    document.getElementById("resetEmail").value = loginEmail;
  }
}

function showLoginMessage(msg, type) {
  const el = document.getElementById("loginMessage");
  el.textContent = msg;
  el.className = "login-message " + type;
  el.classList.remove("hidden");
}

function hideLoginMessage() {
  document.getElementById("loginMessage").classList.add("hidden");
}

function renderPasswordRules() {
  const container = document.getElementById("passwordRules");
  container.innerHTML = PASSWORD_RULES.map(rule => `
    <div class="pw-rule" id="pw-rule-${rule.id}">
      <span class="pw-rule-icon">&#9675;</span>
      <span>${rule.label}</span>
    </div>
  `).join("");
}

function updatePasswordStrength() {
  const password = document.getElementById("regPassword").value;
  const result = validatePassword(password);

  // Update strength bar
  const fill = document.getElementById("strengthFill");
  const label = document.getElementById("strengthLabel");
  fill.className = "strength-fill " + (password ? result.strength : "");
  label.className = "strength-label " + (password ? result.strength : "");
  label.textContent = password ? result.strength.charAt(0).toUpperCase() + result.strength.slice(1) : "";

  // Update rules
  result.results.forEach(r => {
    const el = document.getElementById("pw-rule-" + r.id);
    if (el) {
      el.className = "pw-rule" + (r.passed ? " passed" : "");
      el.querySelector(".pw-rule-icon").innerHTML = r.passed ? "&#10003;" : "&#9675;";
    }
  });

  // Also re-check confirm password match if user already typed in it
  const confirm = document.getElementById("regPasswordConfirm").value;
  if (confirm) checkPasswordMatch();
}

function checkPasswordMatch() {
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regPasswordConfirm").value;
  const hint = document.getElementById("regPasswordMatchHint");

  if (!confirm) {
    hint.textContent = "";
    hint.className = "form-hint-inline";
    return;
  }

  if (password === confirm) {
    hint.textContent = "Passwords match";
    hint.className = "form-hint-inline success";
  } else {
    hint.textContent = "Passwords do not match";
    hint.className = "form-hint-inline error";
  }
}

async function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) { showLoginMessage("Please fill in all fields", "error"); return; }

  if (!ensureSupabase()) {
    showLoginMessage("Supabase is still loading. Please wait a moment and try again.", "error");
    return;
  }

  showLoginMessage("Logging in...", "info");

  try {
    const result = await signInWithEmail(email, password);
    if (result.error) {
      showLoginMessage(result.error, "error");
      return;
    }

    // Login successful - load cloud data
    await onLoginSuccess();
  } catch (e) {
    showLoginMessage("Connection error. Check your internet and Supabase config.", "error");
  }
}

async function handleRegister() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regPasswordConfirm").value;

  if (!username || !email || !password || !confirmPassword) {
    showLoginMessage("Please fill in all fields", "error");
    return;
  }

  // Check passwords match
  if (password !== confirmPassword) {
    showLoginMessage("Passwords do not match!", "error");
    return;
  }

  // Validate password strength before sending
  const pv = validatePassword(password);
  if (!pv.allPassed) {
    showLoginMessage("Password does not meet all requirements", "error");
    return;
  }

  // Validate username
  const uv = validateUsername(username);
  if (!uv.ok) {
    showLoginMessage(uv.msg, "error");
    return;
  }

  // Validate email
  if (!validateEmail(email)) {
    showLoginMessage("Please enter a valid email address", "error");
    return;
  }

  if (!ensureSupabase()) {
    showLoginMessage("Supabase is still loading. Please wait a moment and try again.", "error");
    return;
  }

  showLoginMessage("Creating account...", "info");

  try {
    const result = await signUpWithEmail(email, password, username);
    if (result.error) {
      showLoginMessage(result.error, "error");
      return;
    }

    if (result.needsVerification) {
      showLoginMessage(result.message, "success");
      // Switch to login form so they can log in after verifying
      document.getElementById("registerForm").classList.add("hidden");
      document.getElementById("loginForm").classList.remove("hidden");
      document.getElementById("forgotPasswordForm").classList.add("hidden");
      // Pre-fill email
      document.getElementById("loginEmail").value = email;
    }
  } catch (e) {
    showLoginMessage("Error: " + e.message, "error");
  }
}

async function handleForgotPassword() {
  const email = document.getElementById("resetEmail").value.trim();
  if (!email) {
    showLoginMessage("Please enter your email address", "error");
    return;
  }

  if (!ensureSupabase()) {
    showLoginMessage("Supabase is still loading. Please wait a moment and try again.", "error");
    return;
  }

  showLoginMessage("Sending reset link...", "info");

  try {
    const result = await resetPassword(email);
    if (result.error) { showLoginMessage(result.error, "error"); return; }
    showLoginMessage(result.message, "success");
  } catch (e) {
    showLoginMessage("Connection error. Check your internet.", "error");
  }
}

function playAsGuest() {
  isGuest = true;
  document.getElementById("loginOverlay").classList.add("hidden");
  updateUserBadge();
  initGame();
}

async function onLoginSuccess() {
  isGuest = false;
  document.getElementById("loginOverlay").classList.add("hidden");
  updateUserBadge();

  // Load cloud save - prefer cloud if newer
  const cloudResult = await loadFromCloud();
  if (cloudResult.data) {
    const localSave = localStorage.getItem("gachamaster-save");
    let useCloud = true;

    if (localSave) {
      // Compare: use whichever has more pulls (as a proxy for "more progress")
      try {
        const localState = JSON.parse(localSave);
        if (localState.totalPulls > (cloudResult.data.totalPulls || 0)) {
          useCloud = false;
        }
      } catch (e) {}
    }

    if (useCloud) {
      state = { ...state, ...cloudResult.data };
      saveGame(); // Save cloud data to localStorage too
      showToast("Cloud save loaded!");
    } else {
      // Upload local data to cloud
      saveToCloud(state);
      showToast("Local save is newer, synced to cloud");
    }
  } else {
    // No cloud save - upload local
    saveToCloud(state);
  }

  initGame();
  startCloudAutoSave();
  startChatSubscription();
  updateLastSeen();
  updatePlayerCount();

  // Keep updating last_seen every 2 minutes so player stays "online"
  setInterval(updateLastSeen, 120000);
}

function updateUserBadge() {
  const badge = document.getElementById("userBadge");
  const nameEl = document.getElementById("userName");
  const avatarEl = document.getElementById("userAvatar");

  badge.classList.remove("hidden");

  if (!isGuest && currentUser && currentUser.profile) {
    nameEl.textContent = currentUser.profile.username;
    avatarEl.textContent = currentUser.profile.avatar || "🎮";
  } else {
    nameEl.textContent = "Guest";
    avatarEl.textContent = "🎮";
  }
}

function showUserMenu() {
  const overlay = document.getElementById("userMenuOverlay");
  overlay.classList.remove("hidden");

  const nameEl = document.getElementById("userMenuName");
  const emailEl = document.getElementById("userMenuEmail");
  const avatarEl = document.getElementById("userMenuAvatar");
  const cloudSaveBtn = document.getElementById("cloudSaveBtn");
  const cloudLoadBtn = document.getElementById("cloudLoadBtn");
  const upgradeBtn = document.getElementById("upgradeAccountBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!isGuest && currentUser) {
    nameEl.textContent = currentUser.profile?.username || "Player";
    emailEl.textContent = currentUser.email || "";
    avatarEl.textContent = currentUser.profile?.avatar || "🎮";
    cloudSaveBtn.classList.remove("hidden");
    cloudLoadBtn.classList.remove("hidden");
    upgradeBtn.classList.add("hidden");
    logoutBtn.textContent = "🚪 Log Out";
  } else {
    nameEl.textContent = "Guest";
    emailEl.textContent = "No account";
    avatarEl.textContent = "🎮";
    cloudSaveBtn.classList.add("hidden");
    cloudLoadBtn.classList.add("hidden");
    if (isSupabaseConfigured()) {
      upgradeBtn.classList.remove("hidden");
    }
    logoutBtn.textContent = "🚪 Back to Login";
  }
}

function hideUserMenu() {
  document.getElementById("userMenuOverlay").classList.add("hidden");
}

async function handleLogout() {
  hideUserMenu();
  if (!isGuest) {
    await saveToCloud(state);
    await signOutUser();
  }
  currentUser = null;
  isGuest = true;
  stopCloudAutoSave();
  unsubscribeFromChat();

  if (isSupabaseConfigured()) {
    document.getElementById("loginOverlay").classList.remove("hidden");
  }
}

// ===== Cloud Auto-Save =====
function startCloudAutoSave() {
  if (cloudSaveInterval) clearInterval(cloudSaveInterval);
  cloudSaveInterval = setInterval(() => {
    if (!isGuest && currentUser) {
      saveToCloud(state);
    }
  }, 300000); // Every 5 minutes
}

function stopCloudAutoSave() {
  if (cloudSaveInterval) { clearInterval(cloudSaveInterval); cloudSaveInterval = null; }
}

function triggerCloudSave() {
  if (!isGuest && currentUser) {
    saveToCloud(state);
  }
}

async function manualCloudSave() {
  hideUserMenu();
  if (isGuest || !currentUser) { showToast("Log in to use cloud saves"); return; }
  const result = await saveToCloud(state);
  if (result.error) showToast("Save failed: " + result.error);
  else showToast("Saved to cloud!");
}

async function manualCloudLoad() {
  hideUserMenu();
  if (isGuest || !currentUser) { showToast("Log in to use cloud saves"); return; }
  const result = await loadFromCloud();
  if (result.error) { showToast("Load failed: " + result.error); return; }
  if (!result.data) { showToast("No cloud save found"); return; }
  state = { ...state, ...result.data };
  saveGame();
  renderMachine();
  updateUI();
  showToast("Cloud save loaded!");
}

// ===== Chat Functions =====
let chatMessages = [];
let chatLoaded = false;

function renderChatUI() {
  const inputBar = document.getElementById("chatInputBar");
  const loginPrompt = document.getElementById("chatLoginPrompt");

  if (isGuest || !currentUser) {
    inputBar.classList.add("hidden");
    loginPrompt.classList.remove("hidden");
  } else {
    inputBar.classList.remove("hidden");
    loginPrompt.classList.add("hidden");
  }

  if (!chatLoaded && isSupabaseConfigured()) {
    loadInitialChat();
  }
}

async function loadInitialChat() {
  chatLoaded = true;
  const result = await loadRecentChat(50);
  if (result.data && result.data.length > 0) {
    chatMessages = result.data;
    renderChatMessages();
  }
}

function renderChatMessages() {
  const container = document.getElementById("chatMessages");
  const emptyEl = document.getElementById("chatEmpty");

  if (chatMessages.length === 0) {
    emptyEl.classList.remove("hidden");
    return;
  }

  emptyEl.classList.add("hidden");

  // Only render messages, keep empty element
  const msgHtml = chatMessages.map(msg => {
    const isOwn = currentUser && msg.user_id === currentUser.id;
    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Escape HTML to prevent XSS
    const safeMsg = escapeHtml(msg.message);
    const safeName = escapeHtml(msg.username);
    return `<div class="chat-msg ${isOwn ? 'own' : ''}">
      <span class="chat-msg-avatar">${msg.avatar || '🎮'}</span>
      <div class="chat-msg-body">
        <div class="chat-msg-header">
          <span class="chat-msg-name">${safeName}</span>
          <span class="chat-msg-time">${time}</span>
        </div>
        <div class="chat-msg-text">${safeMsg}</div>
      </div>
    </div>`;
  }).join("");

  container.innerHTML = `<div class="chat-empty hidden" id="chatEmpty"><p>No messages yet. Say hello!</p></div>` + msgHtml;
  scrollChatToBottom();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function scrollChatToBottom() {
  const container = document.getElementById("chatMessages");
  container.scrollTop = container.scrollHeight;
}

async function sendChat() {
  if (isGuest || !currentUser) { showToast("Log in to chat!"); return; }

  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  const result = await sendChatMessage(text);
  if (result.error) { showToast("Failed to send: " + result.error); return; }
}

function startChatSubscription() {
  if (!isSupabaseConfigured()) return;
  subscribeToChatMessages((newMsg) => {
    chatMessages.push(newMsg);
    // Keep max 100 messages in memory
    if (chatMessages.length > 100) chatMessages = chatMessages.slice(-100);

    const chatPanel = document.getElementById("chatPanel");
    if (!chatPanel.classList.contains("hidden")) {
      renderChatMessages();
    } else {
      // Show badge
      const badge = document.getElementById("chatBadge");
      if (badge) badge.classList.remove("hidden");
    }
  });
}

// ===== Public Feedback =====
async function loadAndRenderPublicFeedback() {
  if (!isSupabaseConfigured()) {
    document.getElementById("publicFeedbackSection").classList.add("hidden");
    return;
  }

  const result = await loadPublicFeedback(20);
  const list = document.getElementById("publicFeedbackList");

  if (!result.data || result.data.length === 0) {
    list.innerHTML = '<p class="fb-loading">No community feedback yet. Be the first!</p>';
    return;
  }

  list.innerHTML = result.data.map(fb => {
    const date = new Date(fb.created_at).toLocaleDateString();
    const typeEmoji = { suggestion: "💡", bug: "🐛", love: "❤️" }[fb.type] || "💬";
    const stars = fb.rating > 0 ? "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating) : "";
    const safeMsg = escapeHtml(fb.message).substring(0, 200);
    const safeName = escapeHtml(fb.username);
    return `<div class="public-fb-card">
      <div class="public-fb-header">
        <span class="public-fb-user">${safeName}</span>
        <span class="public-fb-type">${typeEmoji} ${fb.type}</span>
      </div>
      <div class="public-fb-text">${safeMsg}</div>
      <div class="public-fb-meta">
        <span>${date}</span>
        <span class="public-fb-stars">${stars}</span>
      </div>
    </div>`;
  }).join("");
}

// ===== Player Count =====
async function updatePlayerCount() {
  if (!sb) return;

  const counts = await getPlayerCount();
  const badge = document.getElementById("playerCountBadge");
  const text = document.getElementById("playerCountText");
  const chatText = document.getElementById("chatOnlineText");

  if (counts.total > 0) {
    badge.classList.remove("hidden");
    text.textContent = `${counts.online} online`;
    if (chatText) chatText.textContent = `${counts.online} online`;
  }

  const loginCount = document.getElementById("loginPlayerCount");
  if (loginCount && counts.total > 0) {
    loginCount.textContent = `${counts.total} players registered | ${counts.online} online now`;
  }
}

// Update player count every 2 minutes
setInterval(updatePlayerCount, 120000);

// ===== Override pull/buy/checkin to trigger cloud save =====
const _originalPull = pull;
pull = function() {
  _originalPull();
  triggerCloudSave();
};

const _originalPull10 = pull10;
pull10 = function() {
  _originalPull10();
  triggerCloudSave();
};

const _originalBuyUpgrade = buyUpgrade;
buyUpgrade = function(id) {
  _originalBuyUpgrade(id);
  triggerCloudSave();
};

const _originalDailyCheckin = dailyCheckin;
dailyCheckin = function() {
  _originalDailyCheckin();
  triggerCloudSave();
};

// ===== Initialization =====
function initGame() {
  renderMachine();
  updateUI();
  updateFreePullTimer();
  updateRewardBadge();
  updateAdUI();
}

async function startApp() {
  // sb may already be initialized by supabase-config.js auto-init
  // If not, try again (handles edge cases with slow CDN)
  if (isSupabaseConfigured() && !sb) {
    let attempts = 0;
    while (!window.supabase && attempts < 25) {
      await new Promise(r => setTimeout(r, 200));
      attempts++;
    }
    initSupabase();
  }

  if (sb) {
    // Check if user arrived from email confirmation link
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const isEmailConfirm = hash.includes('type=signup') || hash.includes('type=email') ||
                           params.get('type') === 'signup' || params.get('type') === 'email';

    // Supabase is ready - check for existing session
    try {
      const user = await getCurrentSession();
      if (user) {
        if (isEmailConfirm) {
          // Clean URL
          history.replaceState(null, '', window.location.pathname);
          showToast("Email verified! Welcome to GachaMaster!");
        }
        await onLoginSuccess();
        return;
      }
    } catch (e) {
      console.warn('Session check failed:', e);
    }

    // If they came from confirmation but no session yet, show success on login page
    if (isEmailConfirm) {
      history.replaceState(null, '', window.location.pathname);
      updatePlayerCount();
      renderPasswordRules();
      document.getElementById("loginOverlay").classList.remove("hidden");
      showLoginMessage("Email verified successfully! You can now log in.", "success");
      return;
    }

    // Show login screen
    updatePlayerCount();
    renderPasswordRules();
    document.getElementById("loginOverlay").classList.remove("hidden");
    return;
  }

  // No Supabase available - play as guest directly
  document.getElementById("loginOverlay").classList.add("hidden");
  isGuest = true;
  updateUserBadge();
  initGame();
}

startApp();

// ===== Admin Console (password protected) =====
window.admin = function(password) {
  if (password !== 'bob2026master') {
    console.log('%c Access Denied ', 'background:red;color:white;font-size:16px;');
    return;
  }
  console.log('%c Admin Mode Activated ', 'background:green;color:white;font-size:16px;');
  return {
    addCoins: function(n) { state.coins += n; saveGame(); updateUI(); console.log('Added ' + n + ' coins'); },
    addGems: function(n) { state.gems += n; saveGame(); updateUI(); console.log('Added ' + n + ' gems'); },
    maxOut: function() { state.coins = 999999999; state.gems = 99999; saveGame(); updateUI(); console.log('Maxed out!'); },
    unlockAll: function() {
      MACHINES.forEach(function(m) { if (!state.unlockedMachines.includes(m.id)) state.unlockedMachines.push(m.id); });
      saveGame(); renderMachine(); console.log('All machines unlocked!');
    },
    reset: function() { localStorage.removeItem('gachamaster-save'); location.reload(); },
    getState: function() { return JSON.parse(JSON.stringify(state)); },
  };
};
