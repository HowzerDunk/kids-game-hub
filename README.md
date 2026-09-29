# Esme's Playground

A mobile-first, account-free collection of cheerful browser games for a child to play on iPhone, Android, tablet, or desktop. It currently includes **Memory Garden**, a matching game with favorite-character cards, and **Squish the Bugs**, a picnic-saving ant-tapping game.

## Development

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

## PWA installation and offline play

The production site needs **HTTPS** before browsers will install it and enable its service worker. `localhost` is also treated as secure for local testing.

On iPhone or iPad, open the deployed site in Safari, tap **Share**, choose **Add to Home Screen**, enable **Open as Web App** when Safari offers it, then launch Esme's Playground from the new icon.

On Android, open the deployed site in Chrome or another supported browser and use its **Install** or **Add to Home Screen** option when available.

To test the production PWA locally, run `npm run build`, then `npm run preview`. Open the preview URL in a Chromium browser, load the site once, and use the browser's install option or DevTools Application panel to inspect the manifest and service worker. The app shell, icons, JavaScript, styles, and Memory Garden images are precached so previously loaded games can reopen while offline. Rebuild and redeploy to publish a new service-worker version.

## Project structure

```text
src/
  app/site-config.js        Shared site name, description, and colors
  main.js                   Site router and game mounting
  games/
    registry.js             Games shown on the home screen
    memory-game/            Memory Garden logic and scoped styles
  styles/                   Shared site styles
public/
  icons/                    Temporary PWA and Apple home-screen icons
  games/memory-game/        Memory Garden card images
Memory Game/                Original local source (kept outside Git)
```

## Add a game

Create `src/games/<game-name>/` with a module exporting a `mount(root)` function and scoped CSS. Store its public images, sound files, and similar static assets in `public/games/<game-name>/`. Add one entry to `src/games/registry.js` with its title, description, icon, and mount function. The hub automatically shows it on the game-selection screen.

## Notes

The original Memory Game had a large Vinext/Cloudflare starter and Capacitor Android packaging. The web hub uses the working standalone browser implementation with Vite, so it has no database, login, or server dependency. The original folder is intentionally left untouched as a local reference; Android files and APK output are not included in this web repository.

PWA configuration lives in `vite.config.js`. It generates the manifest and production service worker without involving individual game modules. Replace the temporary icons in `public/icons/` when final branding is ready.
