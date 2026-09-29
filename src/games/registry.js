import { mountMemoryGame } from "./memory-game/memory-game.js";
import { mountSquishTheBugs } from "./squish-the-bugs/squish-the-bugs.js";

export const games = [
  {
    slug: "squish-the-bugs",
    title: "Squish the Bugs",
    description: "Keep the picnic sandwich safe!",
    icon: "🐞",
    mount: mountSquishTheBugs,
  },
  {
    slug: "memory-garden",
    title: "Memory Garden",
    description: "Find the matching friends!",
    icon: "🃏",
    mount: mountMemoryGame,
  },
];
