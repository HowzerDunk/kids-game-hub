import "./nail-salon.css";

const assetBase = import.meta.env.BASE_URL;

const solids = [
  ["Bubblegum", "#ff63b8"],
  ["Purple", "#9b6cff"],
  ["Ocean", "#4aa8ff"],
  ["Cherry", "#ff4f63"],
  ["Sunny", "#ffd84a"],
  ["Mint", "#54d9a0"],
  ["Orange", "#ff9850"],
  ["White", "#fffdf8"],
  ["Black", "#292735"],
  ["Peach", "#ffad8c"],
];

const designs = [
  ["Rainbow", "rainbow", "🌈"],
  ["Pink Glitter", "pink-glitter", "✨"],
  ["Purple Glitter", "purple-glitter", "✨"],
  ["Hearts", "hearts", "♥"],
  ["Stars", "stars", "★"],
  ["Flowers", "flowers", "✿"],
  ["Dots", "dots", "●"],
  ["Stripes", "stripes", "▤"],
  ["Checker", "checker", "▦"],
  ["Swirl", "swirl", "🌀"],
];

const characters = [
  ["Moana", "moana"],
  ["Shrek", "shrek"],
  ["Zootopia", "zootopia"],
  ["Sing", "sing"],
  ["Coco", "coco"],
  ["Ms. Rachel", "ms-rachel"],
  ["Blippi", "blippi"],
  ["Batman", "batman"],
  ["K-Pop", "kpop"],
  ["Thelma", "thelma"],
  ["Dragon", "dragon"],
  ["Pets", "pets"],
];

const nailNames = ["thumb", "pointer", "middle", "ring", "pinky"];

const emptyNail = () => ({ kind: "clear", value: null, label: "Clear" });

export function mountNailSalon(root) {
  root.className = "nail-salon";
  const page = root.closest(".game-page");
  page?.classList.add("nail-salon-page");

  let category = "colors";
  let selected = { kind: "solid", value: solids[0][1], label: solids[0][0] };
  let nails = nailNames.map(emptyNail);
  let lastPainted = -1;
  let audioContext = null;

  root.innerHTML = `
    <main class="nail-salon-shell">
      <section class="nail-stage" aria-label="Hand to decorate">
        <div class="salon-title" aria-hidden="true"><span>✨</span><strong>Pretty Nails</strong><span>✨</span></div>
        <div class="hand-wrap">
          <div class="hand" aria-label="Five fingernails">
            <div class="palm"></div>
            ${nailNames.map((name, index) => `
              <div class="finger finger-${name}" aria-hidden="true"></div>
              <button class="nail nail-${name}" data-nail="${index}" aria-label="Paint ${name} nail">
                <span class="nail-art"></span><span class="nail-shine"></span>
              </button>`).join("")}
          </div>
          <div class="sparkles" aria-hidden="true">✦ ✧ ✦</div>
        </div>
        <div class="salon-actions">
          <button class="salon-action random" data-random aria-label="Surprise me with random nails"><span>🎲</span><small>Surprise</small></button>
          <button class="salon-action clear-one" data-remover aria-label="Choose nail polish remover"><span>🧴</span><small>Remove</small></button>
          <button class="salon-action reset" data-reset aria-label="Start over"><span>↻</span><small>Reset</small></button>
          <button class="salon-action tada" data-tada aria-label="Show finished nails"><span>✨</span><small>Ta-da!</small></button>
        </div>
      </section>

      <section class="polish-tray" aria-label="Nail polish choices">
        <nav class="salon-tabs" aria-label="Nail art categories">
          <button class="active" data-category="colors"><span>🎨</span><b>Colors</b></button>
          <button data-category="designs"><span>✨</span><b>Designs</b></button>
          <button data-category="characters"><span>🎬</span><b>Characters</b></button>
        </nav>
        <div class="choice-strip" data-choices></div>
        <p class="tap-hint" data-hint>Pick one, then tap a nail!</p>
      </section>
    </main>
    <div class="tada-screen" data-tada-screen hidden>
      <button data-close-tada aria-label="Go back to decorating">×</button>
      <div class="tada-stars" aria-hidden="true">✨ ⭐ ✨ ⭐ ✨</div>
      <strong>So pretty!</strong>
      <div class="tada-hand-slot" data-tada-slot></div>
      <div class="tada-stars bottom" aria-hidden="true">✦ 💖 ✦ 💖 ✦</div>
    </div>`;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];

  function ensureAudio() {
    if (!audioContext) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (Audio) audioContext = new Audio();
    }
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function ping(kind = "paint") {
    ensureAudio();
    if (!audioContext) return;
    const notes = kind === "tada" ? [523, 659, 784] : kind === "random" ? [392, 523] : [659];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const start = audioContext.currentTime + index * 0.07;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.13);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.14);
    });
  }

  function characterUrl(slug) {
    return `${assetBase}games/memory-game/characters/${slug}.webp`;
  }

  function choiceItems() {
    if (category === "colors") {
      return solids.map(([label, value], index) => ({ kind: "solid", label, value, preview: `<span class="color-dot" style="--swatch:${value}"></span>`, index }));
    }
    if (category === "designs") {
      return designs.map(([label, value, icon], index) => ({ kind: "design", label, value, preview: `<span class="design-dot design-${value}"><b>${icon}</b></span>`, index }));
    }
    return characters.map(([label, value], index) => ({ kind: "character", label, value, preview: `<span class="character-dot" style="background-image:url('${characterUrl(value)}')"></span>`, index }));
  }

  function renderChoices() {
    const items = choiceItems();
    $("[data-choices]").innerHTML = items.map((item) => {
      const active = selected.kind === item.kind && selected.value === item.value;
      return `<button class="nail-choice ${active ? "selected" : ""}" data-choice="${item.index}" aria-label="${item.label}">${item.preview}<small>${item.label}</small></button>`;
    }).join("");
    $$("[data-choice]").forEach((button) => {
      button.onclick = () => {
        const item = items[Number(button.dataset.choice)];
        selected = { kind: item.kind, value: item.value, label: item.label };
        renderChoices();
        $("[data-hint]").textContent = `${item.label} — tap a nail!`;
        ping();
      };
    });
  }

  function renderNails() {
    $$("[data-nail]").forEach((button, index) => {
      const art = button.querySelector(".nail-art");
      const nail = nails[index];
      button.classList.toggle("just-painted", index === lastPainted);
      art.className = "nail-art";
      art.style.background = "";
      art.style.backgroundImage = "";
      art.style.backgroundColor = "";
      art.textContent = "";

      if (nail.kind === "clear") {
        art.classList.add("nail-clear");
      } else if (nail.kind === "solid") {
        art.style.backgroundColor = nail.value;
      } else if (nail.kind === "design") {
        art.classList.add(`design-${nail.value}`);
        const design = designs.find(([, value]) => value === nail.value);
        if (design && ["hearts", "stars", "flowers"].includes(nail.value)) art.textContent = design[2];
      } else if (nail.kind === "character") {
        art.classList.add("character-nail");
        art.style.backgroundImage = `url('${characterUrl(nail.value)}')`;
      }
    });
    if (lastPainted >= 0) window.setTimeout(() => {
      lastPainted = -1;
      $$("[data-nail]").forEach((button) => button.classList.remove("just-painted"));
    }, 350);
  }

  function applyToNail(index) {
    nails[index] = { ...selected };
    lastPainted = index;
    renderNails();
    $("[data-hint]").textContent = `${selected.label}! Pick another nail ✨`;
    ping();
  }

  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function randomize() {
    const pool = [
      ...solids.map(([label, value]) => ({ kind: "solid", label, value })),
      ...designs.map(([label, value]) => ({ kind: "design", label, value })),
      ...characters.map(([label, value]) => ({ kind: "character", label, value })),
    ];
    nails = nailNames.map(() => ({ ...randomChoice(pool) }));
    lastPainted = -1;
    renderNails();
    $("[data-hint]").textContent = "Surprise manicure! ✨";
    ping("random");
  }

  function reset() {
    nails = nailNames.map(emptyNail);
    lastPainted = -1;
    selected = { kind: "solid", value: solids[0][1], label: solids[0][0] };
    category = "colors";
    $$("[data-category]").forEach((button) => button.classList.toggle("active", button.dataset.category === category));
    renderChoices();
    renderNails();
    $("[data-hint]").textContent = "Pick one, then tap a nail!";
  }

  function makeRemoverActive() {
    selected = emptyNail();
    renderChoices();
    $("[data-hint]").textContent = "Tap a nail to remove the polish!";
    ping();
  }

  function showTada() {
    const screen = $("[data-tada-screen]");
    const slot = $("[data-tada-slot]");
    const hand = root.querySelector(".hand").cloneNode(true);
    hand.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
      button.removeAttribute("data-nail");
    });
    slot.innerHTML = "";
    slot.appendChild(hand);
    screen.hidden = false;
    ping("tada");
  }

  $$("[data-category]").forEach((button) => {
    button.onclick = () => {
      category = button.dataset.category;
      $$("[data-category]").forEach((tab) => tab.classList.toggle("active", tab === button));
      const first = choiceItems()[0];
      selected = { kind: first.kind, value: first.value, label: first.label };
      renderChoices();
      $("[data-hint]").textContent = "Pick one, then tap a nail!";
      ping();
    };
  });

  $$("[data-nail]").forEach((button) => {
    button.onclick = () => applyToNail(Number(button.dataset.nail));
  });
  $("[data-random]").onclick = randomize;
  $("[data-remover]").onclick = makeRemoverActive;
  $("[data-reset]").onclick = reset;
  $("[data-tada]").onclick = showTada;
  $("[data-close-tada]").onclick = () => { $("[data-tada-screen]").hidden = true; };

  renderChoices();
  renderNails();

  return () => {
    page?.classList.remove("nail-salon-page");
    if (audioContext && audioContext.state !== "closed") audioContext.close();
  };
}
