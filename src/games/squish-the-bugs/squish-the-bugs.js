import "./squish-the-bugs.css";

const STARTING_HEALTH = 5;
const BETWEEN_WAVES_MS = 1500;
const ANT_LANES = [49, 59, 69, 79];

function waveSettings(wave) {
  return {
    bugs: 3 + wave - 1,
    spawnDelay: Math.max(420, 1250 - (wave - 1) * 85),
    speed: Math.min(11, 9 + (wave - 1) * 0.18),
  };
}

export function mountSquishTheBugs(root) {
  root.className = "squish-the-bugs";
  root.innerHTML = `
    <main class="bugs-shell">
      <div class="rotate-prompt" aria-label="Turn your phone sideways">
        <span aria-hidden="true">📱</span><i aria-hidden="true">↻</i>
      </div>
      <section class="bugs-intro">
        <p>KEEP THE PICNIC YUMMY!</p>
        <h1>Squish the bugs!</h1>
      </section>
      <section class="bugs-game" aria-label="Squish the bugs game">
        <div class="picnic" data-picnic>
          <div class="wave-display"><span aria-hidden="true">🌼</span><strong data-wave>1</strong></div>
          <div class="picnic-blanket" aria-hidden="true"></div>
          <div class="sandwich" data-sandwich aria-label="The picnic sandwich, five bites left">
            <svg viewBox="0 0 220 160" role="img" aria-hidden="true">
              <defs><mask id="sandwich-bites"><rect width="220" height="160" fill="white"/><circle data-bite cx="202" cy="30" r="24" fill="white"/><circle data-bite cx="205" cy="79" r="23" fill="white"/><circle data-bite cx="192" cy="132" r="26" fill="white"/><circle data-bite cx="136" cy="151" r="23" fill="white"/><circle data-bite cx="77" cy="150" r="22" fill="white"/></mask></defs>
              <g mask="url(#sandwich-bites)">
                <path d="M22 60L111 20L200 60L190 137L111 154L31 137Z" fill="#d98525"/>
                <path d="M27 94L111 61L195 94L185 119L111 143L36 119Z" fill="#75ad3e"/>
                <path d="M31 87L111 54L191 87L182 105L111 130L40 105Z" fill="#efcb38"/>
                <path d="M35 78L111 47L187 78L179 94L111 118L43 94Z" fill="#e64f4f"/>
                <path d="M20 57Q18 42 35 34L96 8Q111 2 126 8L187 34Q204 42 201 57L193 75Q188 83 177 79L111 55L44 79Q32 83 27 74Z" fill="#f3c873" stroke="#d98525" stroke-width="6"/>
                <path d="M38 43L105 17Q112 14 120 17L183 43" fill="none" stroke="#ffe4a9" stroke-width="7" stroke-linecap="round" opacity=".75"/>
              </g>
            </svg>
          </div>
          <div class="wave-announcement" data-announcement aria-live="polite"></div>
        </div>
      </section>
      <div class="bugs-game-over" data-game-over hidden role="dialog" aria-modal="true" aria-labelledby="game-over-title">
        <div class="game-over-card"><span aria-hidden="true">🥪</span><p>OH NO!</p><h2 id="game-over-title">The bugs ate the picnic!</h2><button data-replay>Play again! ✨</button></div>
      </div>
    </main>`;

  const $ = (selector) => root.querySelector(selector);
  const picnic = $("[data-picnic]");
  const waveEl = $("[data-wave]");
  const announcementEl = $("[data-announcement]");
  const portraitPhone = window.matchMedia("(orientation: portrait) and (max-width: 700px)");
  let wave = 0;
  let health = STARTING_HEALTH;
  let bugs = [];
  let spawned = 0;
  let running = false;
  let animationFrame;
  let spawnTimer;
  let waveTimer;
  let lastTime = 0;
  let audioContext;

  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && AudioContext) audioContext = new AudioContext();
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function playSound(type) {
    if (!audioContext) return;
    const sounds = {
      squish: [[210, 0, 0.06], [125, 0.045, 0.1]],
      chomp: [[145, 0, 0.08], [95, 0.07, 0.12]],
      wave: [[392, 0, 0.1], [523, 0.1, 0.12]],
      cheer: [[440, 0, 0.09], [554, 0.08, 0.09], [659, 0.16, 0.14]],
      gameOver: [[294, 0, 0.13], [220, 0.12, 0.2]],
    };
    sounds[type].forEach(([frequency, delay, duration]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type === "chomp" || type === "squish" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
      gain.gain.setValueAtTime(0.001, audioContext.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.11, audioContext.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration + 0.02);
    });
  }

  function renderSandwich() {
    const bitesTaken = STARTING_HEALTH - health;
    root.querySelectorAll("[data-bite]").forEach((bite, index) => bite.setAttribute("fill", index < bitesTaken ? "black" : "white"));
    $("[data-sandwich]").setAttribute("aria-label", `The picnic sandwich, ${health} bites left`);
  }

  function announce(text) {
    announcementEl.textContent = text;
    announcementEl.classList.remove("is-visible");
    requestAnimationFrame(() => announcementEl.classList.add("is-visible"));
  }

  function removeBug(bug, squished) {
    bugs = bugs.filter((item) => item !== bug);
    bug.element.classList.add(squished ? "is-squished" : "is-escaped");
    if (squished) {
      playSound("squish");
      bug.element.insertAdjacentHTML("beforeend", '<span class="squish-poof" aria-hidden="true">✦</span>');
    }
    window.setTimeout(() => bug.element.remove(), squished ? 330 : 260);
  }

  function damageSandwich() {
    health -= 1;
    renderSandwich();
    playSound("chomp");
    $("[data-sandwich]").classList.remove("is-hit");
    requestAnimationFrame(() => $("[data-sandwich]").classList.add("is-hit"));
    if (health <= 0) endGame();
  }

  function createBug() {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "bug";
    element.setAttribute("aria-label", "Squish bug");
    element.innerHTML = `<svg class="ant-art" viewBox="0 0 90 58" aria-hidden="true"><g class="ant-legs" fill="none" stroke="#503221" stroke-width="5" stroke-linecap="round"><path d="M38 24L25 10M40 34L24 47M58 22L70 8M59 35L73 49"/><path d="M48 21L47 7M49 38L48 53"/></g><ellipse cx="67" cy="29" rx="18" ry="15" fill="#75462c"/><circle cx="44" cy="29" r="12" fill="#8e5837"/><circle cx="22" cy="29" r="13" fill="#704128"/><path d="M14 20Q7 8 2 12M23 16Q25 5 32 5" fill="none" stroke="#503221" stroke-width="4" stroke-linecap="round"/><circle cx="17" cy="26" r="2.5" fill="#fff3c7"/></svg>`;
    const laneIndex = (spawned + wave - 1) % ANT_LANES.length;
    const bug = {
      element,
      x: 103,
      y: ANT_LANES[laneIndex],
      phase: Math.random() * Math.PI * 2,
      speed: waveSettings(wave).speed * (0.9 + Math.random() * 0.2),
    };
    element.style.top = `${bug.y}%`;
    element.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (!running || !bugs.includes(bug)) return;
      ensureAudio();
      removeBug(bug, true);
      if (spawned === waveSettings(wave).bugs && bugs.length === 0) finishWave();
    });
    picnic.append(element);
    bugs.push(bug);
  }

  function spawnNext() {
    if (!running) return;
    if (portraitPhone.matches) {
      spawnTimer = window.setTimeout(spawnNext, 250);
      return;
    }
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
    waveEl.textContent = wave;
    announce(`Wave ${wave}!`);
    playSound("wave");
    spawnTimer = window.setTimeout(spawnNext, 650);
  }

  function finishWave() {
    if (!running) return;
    running = false;
    announce("✨ Great! ✨");
    playSound("cheer");
    waveTimer = window.setTimeout(() => { running = true; startWave(); }, BETWEEN_WAVES_MS);
  }

  function endGame() {
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(waveTimer);
    playSound("gameOver");
    $("[data-game-over]").hidden = false;
  }

  function tick(time) {
    const elapsed = Math.min(50, time - lastTime || 0);
    lastTime = time;
    if (running && !portraitPhone.matches) {
      bugs.slice().forEach((bug) => {
        bug.x -= bug.speed * elapsed / 1000;
        bug.element.style.left = `${bug.x}%`;
        bug.element.style.top = `${bug.y + Math.sin(time / 125 + bug.phase) * 1.4}%`;
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
    renderSandwich();
    $("[data-game-over]").hidden = true;
    running = true;
    startWave();
  }

  $("[data-replay]").addEventListener("click", () => { ensureAudio(); reset(); });
  reset();
  animationFrame = requestAnimationFrame(tick);
  return () => { clearTimeout(spawnTimer); clearTimeout(waveTimer); cancelAnimationFrame(animationFrame); audioContext?.close(); };
}
