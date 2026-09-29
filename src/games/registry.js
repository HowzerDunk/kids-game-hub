import { mountMemoryGame } from "./memory-game/memory-game.js";

export const games = [
  {
    slug: "memory-garden",
    title: "Memory Garden",
    description: "Find the matching friends!",
    icon: "🃏",
    mount: mountMemoryGame,
  },
];
