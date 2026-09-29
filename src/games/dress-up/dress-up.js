import "./dress-up.css";
import { moanaCharacter } from "./characters/moana.js";

const characters = [moanaCharacter];

export function mountDressUp(root) {
  const character = characters[0];
  const selections = Object.fromEntries(character.categories.map(({ id }) => [id, null]));
  let activeCategory = character.categories[0].id;
  let audioContext;
  let sparkleTimer;

  root.className = "dress-up-game";
  root.innerHTML = `
    <main class="dress-up-shell">
      <section class="dress-up-stage" aria-label="Dress up ${character.name}">
        <div class="dress-up-sun" aria-hidden="true">☀️</div>
        <div class="dress-up-cloud one" aria-hidden="true"></div>
        <div class="dress-up-cloud two" aria-hidden="true"></div>
        <div class="dress-up-actions">
          <button type="button" data-random aria-label="Choose a random outfit"><span aria-hidden="true">🎲</span><small>Surprise!</small></button>
          <button type="button" data-reset aria-label="Reset outfit"><span aria-hidden="true">↻</span><small>Reset</small></button>
        </div>
        <div class="character-frame" data-character>
          <img src="${character.baseImage}" alt="${character.name}, ready to dress up" draggable="false" />
          <svg class="outfit-layers" viewBox="${character.viewBox}" aria-hidden="true" data-layers></svg>
          <div class="dress-up-sparkles" aria-hidden="true"><i>✦</i><i>★</i><i>✦</i><i>★</i></div>
        </div>
      </section>
      <section class="wardrobe" aria-label="Wardrobe">
        <div class="category-tabs" data-categories></div>
        <div class="wardrobe-items" data-items aria-live="polite"></div>
      </section>
    </main>`;

  const $ = (selector) => root.querySelector(selector);
  const characterFrame = $("[data-character]");
  const layerCanvas = $("[data-layers]");

  function categoryById(id) {
    return character.categories.find((category) => category.id === id);
  }

  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && AudioContext) audioContext = new AudioContext();
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function playPop(celebrate = false) {
    ensureAudio();
    if (!audioContext) return;
    const notes = celebrate ? [523, 659, 784] : [520];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + index * 0.07;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.07, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.14);
    });
  }

  function celebrate() {
    clearTimeout(sparkleTimer);
    characterFrame.classList.remove("is-changing");
    requestAnimationFrame(() => characterFrame.classList.add("is-changing"));
    sparkleTimer = window.setTimeout(() => characterFrame.classList.remove("is-changing"), 520);
  }

  function renderCategories() {
    $("[data-categories]").innerHTML = character.categories.map((category) => `
      <button type="button" data-category="${category.id}" aria-label="${category.label}" aria-pressed="${category.id === activeCategory}" class="${category.id === activeCategory ? "is-selected" : ""}">
        <span aria-hidden="true">${category.icon}</span><small>${category.label}</small>
      </button>`).join("");
    root.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderCategories();
        renderItems();
      });
    });
  }

  function renderItems() {
    const category = categoryById(activeCategory);
    $("[data-items]").innerHTML = category.items.map((wardrobeItem) => `
      <button type="button" data-item="${wardrobeItem.id}" aria-label="${wardrobeItem.name}" aria-pressed="${selections[activeCategory] === wardrobeItem.id}" class="${selections[activeCategory] === wardrobeItem.id ? "is-selected" : ""}" style="--item-color:${wardrobeItem.color}">
        <span aria-hidden="true">${wardrobeItem.preview}</span><small>${wardrobeItem.name}</small>
      </button>`).join("");
    root.querySelectorAll("[data-item]").forEach((button) => {
      button.addEventListener("click", () => equip(activeCategory, button.dataset.item));
    });
  }

  function renderOutfit() {
    layerCanvas.innerHTML = character.layerOrder.map((categoryId) => {
      const selectedId = selections[categoryId];
      const selectedItem = categoryById(categoryId).items.find(({ id }) => id === selectedId);
      return selectedItem?.svg || "";
    }).join("");
  }

  function equip(categoryId, itemId) {
    selections[categoryId] = itemId;
    if (categoryId === "dresses") {
      selections.tops = null;
      selections.bottoms = null;
    } else if (categoryId === "tops" || categoryId === "bottoms") {
      selections.dresses = null;
    }
    playPop();
    renderOutfit();
    renderItems();
    celebrate();
  }

  function randomItem(categoryId) {
    const items = categoryById(categoryId).items;
    return items[Math.floor(Math.random() * items.length)].id;
  }

  function randomize() {
    Object.keys(selections).forEach((key) => { selections[key] = null; });
    if (Math.random() < 0.45) selections.dresses = randomItem("dresses");
    else {
      selections.tops = randomItem("tops");
      selections.bottoms = randomItem("bottoms");
    }
    selections.shoes = randomItem("shoes");
    selections.hats = randomItem("hats");
    selections.accessories = randomItem("accessories");
    playPop(true);
    renderOutfit();
    renderItems();
    celebrate();
  }

  function reset() {
    Object.keys(selections).forEach((key) => { selections[key] = null; });
    playPop();
    renderOutfit();
    renderItems();
    celebrate();
  }

  $("[data-random]").addEventListener("click", randomize);
  $("[data-reset]").addEventListener("click", reset);
  renderCategories();
  renderItems();
  renderOutfit();

  return () => {
    clearTimeout(sparkleTimer);
    audioContext?.close();
  };
}
