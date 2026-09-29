import "./styles/global.css";
import { games } from "./games/registry.js";

const app = document.querySelector("#app");
let cleanup = () => {};

function navigate(path) {
  window.location.hash = path;
}

function renderHome() {
  document.title = "Esme's Playground";
  app.innerHTML = `
    <main class="hub-shell">
      <header class="hub-header"><a href="#/" class="hub-brand" aria-label="Esme's Playground home">🌼 <span>Esme's <small>Playground</small></span></a></header>
      <section class="hub-intro"><p>PLAY, LEARN &amp; SMILE</p><h1>Pick a game!</h1><span aria-hidden="true">✨</span></section>
      <section class="game-list" aria-label="Games">
        ${games.map((game) => `<a class="game-tile" href="#/games/${game.slug}"><span class="game-icon" aria-hidden="true">${game.icon}</span><span><strong>${game.title}</strong><small>${game.description}</small></span><b aria-hidden="true">Play →</b></a>`).join("")}
      </section>
    </main>`;
}

function renderGame(slug) {
  const game = games.find((item) => item.slug === slug);
  if (!game) {
    navigate("/");
    return;
  }
  document.title = `${game.title} · Esme's Playground`;
  app.innerHTML = `<main class="game-page"><header class="game-page-header"><a href="#/" class="home-link">← All games</a><span>Esme's Playground</span></header><div id="game-root"></div></main>`;
  cleanup = game.mount(document.querySelector("#game-root"));
}

function render() {
  cleanup();
  cleanup = () => {};
  const path = window.location.hash.replace(/^#/, "") || "/";
  const match = path.match(/^\/games\/([^/]+)$/);
  if (match) renderGame(match[1]);
  else renderHome();
}

window.addEventListener("hashchange", render);
render();
