import { mountMemoryGame } from "./memory-game/memory-game.js";
import { mountSquishTheBugs } from "./squish-the-bugs/squish-the-bugs.js";
import { mountDressUp } from "./dress-up/dress-up.js";

export const games = [
  {
    slug: "dress-up",
    title: "Dress Up",
    description: "Make a fun outfit!",
    icon: "👗",
    mount: mountDressUp,
  },
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
