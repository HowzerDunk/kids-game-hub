import "./nail-salon.css";

const nailDefinitions = [
  { id: "thumb", label: "Thumb", x: 80, y: 447, width: 58, height: 83, rotate: -38 },
  { id: "pointer", label: "Pointer finger", x: 184, y: 190, width: 54, height: 88 },
  { id: "middle", label: "Middle finger", x: 286, y: 98, width: 56, height: 92 },
  { id: "ring", label: "Ring finger", x: 389, y: 90, width: 54, height: 88 },
  { id: "pinky", label: "Pinky finger", x: 486, y: 153, width: 49, height: 78, rotate: 4 },
];

const palettes = {
  colors: [
    { id: "coral", label: "Coral", value: "#ff746f" },
    { id: "pink", label: "Pink", value: "#f29ac1" },
    { id: "purple", label: "Purple", value: "#a784e9" },
    { id: "blue", label: "Blue", value: "#65bce8" },
    { id: "mint", label: "Mint", value: "#79d7b1" },
    { id: "yellow", label: "Yellow", value: "#ffd45d" },
    { id: "white", label: "Pearl", value: "#fff7eb" },
  ],
  designs: [
    { id: "none", label: "No design", icon: "✕" },
    { id: "dots", label: "Polka dots", icon: "●" },
    { id: "stripe", label: "Rainbow stripe", icon: "🌈" },
    { id: "heart", label: "Heart", icon: "♥" },
    { id: "sparkle", label: "Sparkles", icon: "✨" },
  ],
  characters: [
    { id: "none", label: "No character", icon: "✕" },
    { id: "flower", label: "Flower", icon: "🌼" },
    { id: "kitty", label: "Kitty", icon: "🐱" },
    { id: "frog", label: "Frog", icon: "🐸" },
    { id: "unicorn", label: "Unicorn", icon: "🦄" },
    { id: "butterfly", label: "Butterfly", icon: "🦋" },
  ],
};

const blankNail = () => ({ color: "#fff7eb", design: "none", character: "none" });

function designMarkup(nail, width, height) {
  if (nail.character !== "none") {
    const character = palettes.characters.find(({ id }) => id === nail.character);
    return `<text class="nail-character" x="0" y="${height * 0.13}" aria-hidden="true">${character.icon}</text>`;
  }

  if (nail.design === "dots") {
    return `<g class="nail-art-mark" fill="#fff8d7"><circle cx="-12" cy="-19" r="6"/><circle cx="11" cy="-2" r="7"/><circle cx="-9" cy="22" r="6"/></g>`;
  }
  if (nail.design === "stripe") {
    return `<g class="nail-art-mark" fill="none" stroke-linecap="round"><path d="M-${width * 0.32} -10Q0 3 ${width * 0.32} -10" stroke="#fff4a8" stroke-width="8"/><path d="M-${width * 0.32} 4Q0 17 ${width * 0.32} 4" stroke="#78d8e2" stroke-width="7"/></g>`;
  }
  if (nail.design === "heart") {
    return `<text class="nail-symbol nail-art-mark" x="0" y="10" aria-hidden="true">♥</text>`;
  }
  if (nail.design === "sparkle") {
    return `<text class="nail-symbol nail-art-mark" x="0" y="10" aria-hidden="true">✦</text>`;
  }
  return "";
}

function nailMarkup(definition, nail, selected) {
  const { x, y, width, height, rotate = 0 } = definition;
  return `
    <g class="salon-nail${selected ? " is-selected" : ""}" data-nail="${definition.id}" role="button" tabindex="0" aria-label="${definition.label}${selected ? ", selected" : ""}" aria-pressed="${selected}" transform="translate(${x} ${y}) rotate(${rotate})">
      <rect class="nail-hit" x="-${width * 0.85}" y="-${height * 0.72}" width="${width * 1.7}" height="${height * 1.55}" rx="${width * 0.7}"/>
      <rect class="nail-shadow" x="-${width / 2 + 3}" y="-${height / 2 + 1}" width="${width + 6}" height="${height + 7}" rx="${width * 0.44}"/>
      <rect class="nail-polish" x="-${width / 2}" y="-${height / 2}" width="${width}" height="${height}" rx="${width * 0.4}" fill="${nail.color}"/>
      <path class="nail-shine" d="M-${width * 0.23} -${height * 0.25}Q-${width * 0.08} -${height * 0.37} ${width * 0.08} -${height * 0.29}"/>
      ${designMarkup(nail, width, height)}
    </g>`;
}

export function mountNailSalon(root) {
  let selectedNail = null;
  let activePalette = "colors";
  const nails = Object.fromEntries(nailDefinitions.map(({ id }) => [id, blankNail()]));

  root.className = "nail-salon-game";
  root.innerHTML = `
    <main class="nail-salon-shell">
      <section class="salon-hand-panel" aria-label="Choose a fingernail">
        <div class="salon-heading">
          <span aria-hidden="true">💅</span>
          <div><strong>Nail Salon</strong><small data-instruction>Tap a nail!</small></div>
        </div>
        <div class="salon-hand-wrap">
          <svg class="salon-hand" viewBox="0 0 600 780" role="group" aria-label="Hand with five selectable fingernails" data-hand>
            <defs>
              <linearGradient id="salon-skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d99068"/><stop offset=".55" stop-color="#c87857"/><stop offset="1" stop-color="#ae6048"/></linearGradient>
              <filter id="hand-shadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#6f3f4d" flood-opacity=".24"/></filter>
            </defs>
            <path class="hand-model" d="M190 770C177 721 154 676 127 630C111 602 91 574 64 552L29 520C4 496 3 462 26 443C47 426 72 431 92 455L143 514L145 188C145 153 166 132 194 132C222 132 240 155 240 188L240 383C240 396 258 398 260 383L260 91C260 54 284 31 314 31C345 31 366 57 363 94L350 371C350 386 369 389 373 372L384 74C387 39 412 20 441 25C470 30 487 54 483 87L454 386C453 402 472 407 478 391L493 139C498 108 520 91 546 96C572 101 587 124 582 154L533 500C524 574 497 636 450 681L420 710L414 770Z"/>
            <path class="hand-highlight" d="M185 597C224 628 278 642 342 634C410 626 466 589 492 531"/>
            <path class="hand-knuckle" d="M174 443Q194 431 216 444M281 440Q312 427 342 441M380 432Q412 420 443 435M473 449Q498 440 523 454"/>
            <g data-nail-layer></g>
          </svg>
          <div class="salon-pointer" data-pointer aria-hidden="true">☝️</div>
        </div>
      </section>

      <section class="salon-controls" aria-label="Nail decorations">
        <div class="salon-step" data-step>
          <span class="step-badge">1</span><span aria-hidden="true">👆</span>
          <span class="step-arrow">›</span>
          <span class="step-badge">2</span><span aria-hidden="true">🎨</span>
        </div>
        <div class="salon-tabs" data-tabs></div>
        <div class="salon-options" data-options aria-live="polite"></div>
        <button class="salon-reset" type="button" data-reset><span aria-hidden="true">↻</span> Start over</button>
      </section>
    </main>`;

  const handLayer = root.querySelector("[data-nail-layer]");
  const instruction = root.querySelector("[data-instruction]");

  function currentNail() {
    return selectedNail ? nails[selectedNail] : null;
  }

  function renderHand() {
    handLayer.innerHTML = nailDefinitions.map((definition) => nailMarkup(definition, nails[definition.id], definition.id === selectedNail)).join("");
    handLayer.querySelectorAll("[data-nail]").forEach((button) => {
      const select = () => {
        selectedNail = button.dataset.nail;
        instruction.textContent = "Now choose something!";
        root.querySelector("[data-pointer]").classList.add("is-hidden");
        renderHand();
        renderOptions();
      };
      button.addEventListener("click", select);
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      });
    });
  }

  function renderTabs() {
    const tabs = [
      { id: "colors", label: "Colors", icon: "🎨" },
      { id: "designs", label: "Designs", icon: "✨" },
      { id: "characters", label: "Friends", icon: "😊" },
    ];
    root.querySelector("[data-tabs]").innerHTML = tabs.map((tab) => `
      <button type="button" data-tab="${tab.id}" class="${activePalette === tab.id ? "is-selected" : ""}" aria-pressed="${activePalette === tab.id}">
        <span aria-hidden="true">${tab.icon}</span><small>${tab.label}</small>
      </button>`).join("");
    root.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
      activePalette = button.dataset.tab;
      renderTabs();
      renderOptions();
    }));
  }

  function selectedOption(option) {
    const nail = currentNail();
    if (!nail) return false;
    if (activePalette === "colors") return nail.color === option.value;
    if (activePalette === "designs") return nail.design === option.id && nail.character === "none";
    return nail.character === option.id;
  }

  function renderOptions() {
    const container = root.querySelector("[data-options]");
    const disabled = !selectedNail;
    container.classList.toggle("is-waiting", disabled);
    container.innerHTML = palettes[activePalette].map((option) => `
      <button type="button" data-option="${option.id}" class="${selectedOption(option) ? "is-selected" : ""}" ${disabled ? "disabled" : ""} aria-label="${option.label}" aria-pressed="${selectedOption(option)}" style="--swatch:${option.value || "#fff8ea"}">
        ${activePalette === "colors" ? '<i aria-hidden="true"></i>' : `<span aria-hidden="true">${option.icon}</span>`}
      </button>`).join("");
    container.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => {
      const option = palettes[activePalette].find(({ id }) => id === button.dataset.option);
      const nail = currentNail();
      if (!nail) return;
      if (activePalette === "colors") nail.color = option.value;
      if (activePalette === "designs") {
        nail.design = option.id;
        nail.character = "none";
      }
      if (activePalette === "characters") {
        nail.character = option.id;
        if (option.id !== "none") nail.design = "none";
      }
      renderHand();
      renderOptions();
      root.querySelector(`[data-nail="${selectedNail}"]`)?.classList.add("just-painted");
    }));
  }

  root.querySelector("[data-reset]").addEventListener("click", () => {
    nailDefinitions.forEach(({ id }) => { nails[id] = blankNail(); });
    selectedNail = null;
    instruction.textContent = "Tap a nail!";
    root.querySelector("[data-pointer]").classList.remove("is-hidden");
    renderHand();
    renderOptions();
  });

  renderHand();
  renderTabs();
  renderOptions();
}
