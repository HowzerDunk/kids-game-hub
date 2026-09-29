import "./squish-the-bugs.css";

const STARTING_HEALTH = 5;
const BETWEEN_WAVES_MS = 1500;

function waveSettings(wave) {
  return {
    bugs: 3 + wave - 1,
    spawnDelay: Math.max(480, 1150 - (wave - 1) * 55),
    speed: Math.min(11.5, 4.8 + (wave - 1) * 0.55),
  };
}

export function mountSquishTheBugs(root) {
  root.className = "squish-the-bugs";
  root.innerHTML = `
    <main class="bugs-shell">
      <section class="bugs-intro">
        <p>KEEP THE PICNIC YUMMY!</p>
        <h1>Squish the bugs!</h1>
      </section>
      <section class="bugs-game" aria-label="Squish the bugs game">
        <div class="bugs-status">
          <div class="wave-display"><span aria-hidden="true">🌼</span><strong data-wave>Wave 1</strong></div>
          <div class="sandwich-health" aria-label="Sandwich health" data-health></div>
        </div>
        <div class="picnic" data-picnic>
          <div class="sky-sparkle sparkle-one" aria-hidden="true">✦</div>
          <div class="sky-sparkle sparkle-two" aria-hidden="true">✦</div>
          <div class="sandwich" data-sandwich aria-label="The picnic sandwich"><span>🥪</span><small>Yummy!</small></div>
          <p class="tap-hint" data-hint>Tap the bugs!</p>
          <div class="wave-announcement" data-announcement aria-live="polite"></div>
        </div>
      </section>
      <div class="bugs-game-over" data-game-over hidden role="dialog" aria-modal="true" aria-labelledby="game-over-title">
        <div class="game-over-card"><span aria-hidden="true">🥪</span><p>OH NO!</p><h2 id="game-over-title">The bugs ate the picnic!</h2><button data-replay>Play again! ✨</button></div>
      </div>
    </main>`;

  const $ = (selector) => root.querySelector(selector);
  const picnic = $("[data-picnic]");
  const healthEl = $("[data-health]");
  const waveEl = $("[data-wave]");
  const announcementEl = $("[data-announcement]");
  let wave = 0;
  let health = STARTING_HEALTH;
  let bugs = [];
  let spawned = 0;
  let running = false;
  let animationFrame;
  let spawnTimer;
  let waveTimer;
  let lastTime = 0;

  function renderHealth() {
    healthEl.innerHTML = Array.from({ length: STARTING_HEALTH }, (_, index) => `<span class="${index < health ? "is-full" : ""}" aria-hidden="true">❤</span>`).join("");
  }

  function announce(text) {
    announcementEl.textContent = text;
    announcementEl.classList.remove("is-visible");
    requestAnimationFrame(() => announcementEl.classList.add("is-visible"));
  }

  function removeBug(bug, squished) {
    bugs = bugs.filter((item) => item !== bug);
    bug.element.classList.add(squished ? "is-squished" : "is-escaped");
    window.setTimeout(() => bug.element.remove(), 260);
  }

  function damageSandwich() {
    health -= 1;
    renderHealth();
    $("[data-sandwich]").classList.remove("is-hit");
    requestAnimationFrame(() => $("[data-sandwich]").classList.add("is-hit"));
    if (health <= 0) endGame();
  }

  function createBug() {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "bug";
    element.setAttribute("aria-label", "Squish bug");
    element.innerHTML = '<span aria-hidden="true">🐞</span>';
    const bug = { element, x: 108, speed: waveSettings(wave).speed * (0.9 + Math.random() * 0.2) };
    element.style.top = `${22 + Math.random() * 58}%`;
    element.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (!running || !bugs.includes(bug)) return;
      removeBug(bug, true);
      if (spawned === waveSettings(wave).bugs && bugs.length === 0) finishWave();
    });
    picnic.append(element);
    bugs.push(bug);
  }

  function spawnNext() {
    if (!running) return;
    const settings = waveSettings(wave);
    if (spawned >= settings.bugs) return;
    createBug();
    spawned += 1;
    if (spawned < settings.bugs) spawnTimer = window.setTimeout(spawnNext, settings.spawnDelay);
  }

  function startWave() {
    if (!running) return;
    wave += 1;
    spawned = 0;
    waveEl.textContent = `Wave ${wave}`;
    announce(`Wave ${wave}!`);
    spawnTimer = window.setTimeout(spawnNext, 650);
  }

  function finishWave() {
    if (!running) return;
    running = false;
    announce("Great squishing!");
    waveTimer = window.setTimeout(() => { running = true; startWave(); }, BETWEEN_WAVES_MS);
  }

  function endGame() {
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(waveTimer);
    $("[data-game-over]").hidden = false;
  }

  function tick(time) {
    const elapsed = Math.min(50, time - lastTime || 0);
    lastTime = time;
    if (running) {
      bugs.slice().forEach((bug) => {
        bug.x -= bug.speed * elapsed / 1000;
        bug.element.style.left = `${bug.x}%`;
        if (bug.x <= 16) {
          removeBug(bug, false);
          damageSandwich();
          if (running && spawned === waveSettings(wave).bugs && bugs.length === 0) finishWave();
        }
      });
    }
    animationFrame = requestAnimationFrame(tick);
  }

  function reset() {
    clearTimeout(spawnTimer);
    clearTimeout(waveTimer);
    bugs.forEach((bug) => bug.element.remove());
    bugs = [];
    wave = 0;
    health = STARTING_HEALTH;
    renderHealth();
    $("[data-game-over]").hidden = true;
    running = true;
    startWave();
  }

  $("[data-replay]").addEventListener("click", reset);
  reset();
  animationFrame = requestAnimationFrame(tick);
  return () => { clearTimeout(spawnTimer); clearTimeout(waveTimer); cancelAnimationFrame(animationFrame); };
}
