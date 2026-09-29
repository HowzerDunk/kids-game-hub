import "./nail-salon.css";

const nailDefinitions = [
  { id: "thumb", label: "Thumb", x: 578, y: 440, width: 44, height: 78, rotate: 34 },
  { id: "pointer", label: "Pointer", x: 419, y: 125, width: 44, height: 76, rotate: 2 },
  { id: "middle", label: "Middle", x: 310, y: 63, width: 46, height: 84, rotate: 0 },
  { id: "ring", label: "Ring", x: 199, y: 121, width: 44, height: 77, rotate: 0 },
  { id: "pinky", label: "Pinky", x: 76, y: 236, width: 38, height: 66, rotate: -7 },
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

const blankNail = () => ({ color: "transparent", design: "none", character: "none" });

function designMarkup(nail, width, height) {
  if (nail.character !== "none") {
    const character = palettes.characters.find(({ id }) => id === nail.character);
    return `<text class="nail-character" x="0" y="${height * 0.13}" aria-hidden="true">${character.icon}</text>`;
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

function nailMarkup(definition, nail, selected) {
  const { x, y, width, height, rotate = 0 } = definition;
  const nailPath = `M 0 -${height / 2}C ${width * 0.3} -${height / 2} ${width * 0.46} -${height * 0.34} ${width * 0.46} -${height * 0.12}L ${width * 0.42} ${height * 0.27}C ${width * 0.3} ${height * 0.45} 0 ${height * 0.5} -${width * 0.3} ${height * 0.45}C -${width * 0.42} ${height * 0.32} -${width * 0.46} ${height * 0.12} -${width * 0.46} -${height * 0.12}C -${width * 0.46} -${height * 0.34} -${width * 0.3} -${height / 2} 0 -${height / 2}Z`;
  return `
    <g class="salon-nail${selected ? " is-selected" : ""}${nail.color === "transparent" ? " is-clear" : ""}" data-nail="${definition.id}" role="button" tabindex="0" aria-label="${definition.label}${selected ? ", selected" : ""}" aria-pressed="${selected}" transform="translate(${x} ${y}) rotate(${rotate})">
      <ellipse class="nail-hit" rx="${Math.max(34, width * 0.9)}" ry="${Math.max(42, height * 0.72)}"/>
      <path class="nail-selection" d="${nailPath}"/>
      <path class="nail-polish" d="${nailPath}" fill="${nail.color}"/>
      <path class="nail-shine" d="M-${width * 0.2} -${height * 0.24}Q-${width * 0.05} -${height * 0.36} ${width * 0.1} -${height * 0.29}"/>
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
    handLayer.innerHTML = nailDefinitions.map((definition) => nailMarkup(definition, nails[definition.id], definition.id === selectedNail)).join("");
    handLayer.querySelectorAll("[data-nail]").forEach((button) => {
      const select = () => {
        selectedNail = button.dataset.nail;
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
    instruction.textContent = "Choose a nail";
    renderHand();
    renderOptions();
  });

  renderHand();
  renderTabs();
  renderOptions();
}
