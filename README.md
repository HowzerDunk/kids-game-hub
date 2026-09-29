# Esme's Playground

A mobile-first, account-free collection of cheerful browser games for a child to play on iPhone, Android, tablet, or desktop. The first game is **Memory Garden**, a matching game with four difficulty levels and favorite-character cards.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Vite prints a local URL. Open it in a browser, then select **Memory Garden** from the home screen.

Build a production version with:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  main.js                   Site router and game mounting
  games/
    registry.js             Games shown on the home screen
    memory-game/            Memory Garden logic and scoped styles
  styles/                   Shared site styles
public/games/memory-game/   Memory Garden card images
Memory Game/                Original local source (kept outside Git)
```

## Add a game

Create `src/games/<game-name>/` with a module exporting a `mount(root)` function and scoped CSS. Store its public images, sound files, and similar static assets in `public/games/<game-name>/`. Add one entry to `src/games/registry.js` with its title, description, icon, and mount function. The hub automatically shows it on the game-selection screen.

## Notes

The original Memory Game had a large Vinext/Cloudflare starter and Capacitor Android packaging. The web hub uses the working standalone browser implementation with Vite, so it has no database, login, or server dependency. The original folder is intentionally left untouched as a local reference; Android files and APK output are not included in this web repository.

The project is structured so a web app manifest and service worker can be added later for PWA installation without changing individual game modules.
