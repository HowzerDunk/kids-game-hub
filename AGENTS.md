# Esme's Playground

This is a mobile-first children's game website made primarily for the project owner's niece.

- Support current iPhone Safari, Android Chrome, and desktop browsers.
- Design every interaction for touch first: large targets, no hover-only controls, and phone portrait layouts.
- Keep each game self-contained under `src/games/<game-name>/`. A game may own its logic, styles, configuration, and static assets in `public/games/<game-name>/`.
- Put shared navigation and site styling in `src/app/`, `src/components/`, or `src/styles/`; do not let a game leak global styles.
- Preserve working game behavior. Do not rewrite game logic without a concrete reason, and test a game after structural work.
- Avoid dependencies and architecture that do not provide a clear benefit. The site requires no player accounts.
- Keep UI accessible and readable: semantic controls, useful labels, visible keyboard focus, and reduced-motion support.
- Add new games to `src/games/registry.js` after creating their module so the home screen can discover them.
- Run `npm run build` before handing off changes.
