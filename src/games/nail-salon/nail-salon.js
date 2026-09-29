import "./nail-salon.css";

// Nail outlines traced in the hand artwork's 680 × 984 coordinate system.
// Color and character art share these exact silhouettes.
const nailDefinitions = [
  { id: "thumb", label: "Thumb", x: 578, y: 440, width: 72, height: 82,
    outline: "M590 405 C603 405 613 412 609 425 C602 442 585 462 576 473 C568 484 550 474 548 464 C547 452 566 425 577 413 C581 409 585 406 590 405 Z" },
  { id: "pointer", label: "Pointer", x: 419, y: 126, width: 56, height: 84,
    outline: "M403 91 C413 85 432 88 441 98 C447 109 439 148 435 157 C430 170 407 169 399 157 C391 145 395 109 398 99 C399 95 400 93 403 91 Z" },
  { id: "middle", label: "Middle", x: 306, y: 65, width: 56, height: 90,
    outline: "M289 27 C300 20 321 23 327 32 C335 44 330 85 327 96 C323 112 292 111 286 99 C279 87 281 46 284 35 C285 31 286 29 289 27 Z" },
  { id: "ring", label: "Ring", x: 199, y: 123, width: 52, height: 84,
    outline: "M182 88 C191 82 210 84 218 92 C223 103 220 143 216 154 C212 167 189 166 181 155 C173 143 176 108 177 99 C178 94 179 90 182 88 Z" },
  { id: "pinky", label: "Pinky", x: 75, y: 236, width: 48, height: 74,
    outline: "M60 207 C69 201 82 203 87 213 C92 225 97 248 93 259 C90 272 71 272 65 263 C58 252 53 224 55 215 C56 211 57 209 60 207 Z" },
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
    ...[
      ["moana", "Moana"], ["thelma", "Thelma"], ["shrek", "Shrek"],
      ["zootopia", "Zootopia"], ["sing", "Sing"], ["home", "Home"],
      ["pets", "Secret Life of Pets"], ["leo", "Leo"],
      ["outback", "Back to the Outback"], ["coco", "Coco"],
    ].map(([id, label]) => ({ id, label, image: `${import.meta.env.BASE_URL}games/memory-game/characters/${id}.webp` })),
  ],
};

const blankNail = () => ({ color: "transparent", design: "none", character: "none" });

function designMarkup(nail, width, height, clipId) {
  if (nail.character !== "none") {
    const character = palettes.characters.find(({ id }) => id === nail.character);
    return `<image class="nail-character" href="${character.image}" x="-${width / 2}" y="-${height / 2}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" aria-hidden="true"/>`;
  }

  if (nail.design === "dots") {
    return `<g class="nail-art-mark" fill="#fff8d7"><circle cx="-${width * 0.18}" cy="-${height * 0.2}" r="${width * 0.09}"/><circle cx="${width * 0.17}" cy="0" r="${width * 0.1}"/><circle cx="-${width * 0.14}" cy="${height * 0.2}" r="${width * 0.09}"/></g>`;
  }
  if (nail.design === "stripe") {
    return `<g class="nail-art-mark" fill="none" stroke-linecap="round"><path d="M-${width * 0.32} -6Q0 2 ${width * 0.32} -6" stroke="#fff4a8" stroke-width="5"/><path d="M-${width * 0.32} 4Q0 12 ${width * 0.32} 4" stroke="#78d8e2" stroke-width="4"/></g>`;
  }
  if (nail.design === "heart") {
    return `<text class="nail-symbol nail-art-mark" x="0" y="10" aria-hidden="true">♥</text>`;
  }
  if (nail.design === "sparkle") {
    return `<text class="nail-symbol nail-art-mark" x="0" y="10" aria-hidden="true">✦</text>`;
  }
  return "";
}

function nailMarkup(definition, nail, selected, highlighted) {
  const { x, y, width, height, rotate = 0 } = definition;
  const nailPath = definition.outline;
  // Translate the traced outline to nail-local coordinates, shared by the clip and fill.
  const outlineTransform = `translate(${-x} ${-y})`;
  return `
    <g class="salon-nail${highlighted ? " is-selected" : ""}${nail.color === "transparent" ? " is-clear" : ""}" data-nail="${definition.id}" role="button" tabindex="0" aria-label="${definition.label}${selected ? ", selected" : ""}" aria-pressed="${selected}" transform="translate(${x} ${y}) rotate(${rotate})">
      <ellipse class="nail-hit" rx="${Math.max(34, width * 0.9)}" ry="${Math.max(42, height * 0.72)}"/>
      <path class="nail-selection" d="${nailPath}" transform="${outlineTransform}"/>
      <path class="nail-polish" d="${nailPath}" transform="${outlineTransform}" fill="${nail.color}"/>
      <path class="nail-shine" clip-path="url(#salon-clip-${definition.id})" d="M-${width * 0.2} -${height * 0.24}Q-${width * 0.05} -${height * 0.36} ${width * 0.1} -${height * 0.29}"/>
      <defs><clipPath id="salon-clip-${definition.id}"><path d="${nailPath}" transform="${outlineTransform}"/></clipPath></defs>
      ${designMarkup(nail, width, height, `salon-clip-${definition.id}`)}
    </g>`;
}

export function mountNailSalon(root) {
  let selectedNail = null;
  let showHighlight = false;
  let activePalette = "colors";
  const nails = Object.fromEntries(nailDefinitions.map(({ id }) => [id, blankNail()]));

  root.className = "nail-salon-game";
  root.innerHTML = `
    <main class="nail-salon-shell">
      <section class="salon-hand-panel" aria-label="Choose a fingernail">
        <div class="salon-heading">
          <span class="salon-heading-mark" aria-hidden="true">✦</span>
          <div><strong>Nail Salon</strong><small data-instruction>Choose a nail</small></div>
        </div>
        <div class="salon-hand-wrap">
          <div class="salon-hand" role="group" aria-label="Hand with five selectable fingernails" data-hand>
            <img src="${import.meta.env.BASE_URL}games/nail-salon/hand-base.png" alt="" draggable="false">
            <svg class="salon-nail-layer" viewBox="0 0 680 984">
              <g data-nail-layer></g>
            </svg>
          </div>
        </div>
      </section>

      <section class="salon-controls" aria-label="Nail decorations">
        <div class="salon-tabs" data-tabs></div>
        <div class="salon-options" data-options aria-live="polite"></div>
        <button class="salon-reset" type="button" data-reset aria-label="Start over"><span aria-hidden="true">↻</span><small>Reset</small></button>
      </section>
    </main>`;

  const handLayer = root.querySelector("[data-nail-layer]");
  const instruction = root.querySelector("[data-instruction]");

  function currentNail() {
    return selectedNail ? nails[selectedNail] : null;
  }

  function renderHand() {
    root.querySelector("[data-hand]").classList.toggle("is-waiting", !selectedNail);
    handLayer.innerHTML = nailDefinitions.map((definition) => nailMarkup(definition, nails[definition.id], definition.id === selectedNail, showHighlight && definition.id === selectedNail)).join("");
    handLayer.querySelectorAll("[data-nail]").forEach((button) => {
      const select = () => {
        selectedNail = button.dataset.nail;
        showHighlight = true;
        const selectedDefinition = nailDefinitions.find(({ id }) => id === selectedNail);
        instruction.textContent = `${selectedDefinition.label} nail selected`;
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
      { id: "designs", label: "Art", icon: "✨" },
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
        ${activePalette === "colors" ? '<i aria-hidden="true"></i>' : option.image ? `<img src="${option.image}" alt="" draggable="false">` : `<span aria-hidden="true">${option.icon}</span>`}
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
      showHighlight = false;
      renderHand();
      renderOptions();
      root.querySelector(`[data-nail="${selectedNail}"]`)?.classList.add("just-painted");
    }));
  }

  root.querySelector("[data-reset]").addEventListener("click", () => {
    nailDefinitions.forEach(({ id }) => { nails[id] = blankNail(); });
    selectedNail = null;
    showHighlight = false;
    instruction.textContent = "Choose a nail";
    renderHand();
    renderOptions();
  });

  renderHand();
  renderTabs();
  renderOptions();
}
