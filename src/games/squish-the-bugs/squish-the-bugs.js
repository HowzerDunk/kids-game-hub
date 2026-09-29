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
          <svg class="picnic-scenery" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path class="distant-hill" d="M0 320Q150 250 305 315T610 300T920 318T1200 275V600H0Z"/>
            <g class="scene-cloud" transform="translate(170 105)"><ellipse cx="55" cy="34" rx="55" ry="24"/><circle cx="42" cy="18" r="31"/><circle cx="76" cy="13" r="38"/></g>
            <g class="scene-cloud small" transform="translate(630 145)"><ellipse cx="55" cy="34" rx="55" ry="24"/><circle cx="42" cy="18" r="31"/><circle cx="76" cy="13" r="38"/></g>
            <g class="scene-flowers" transform="translate(530 480)"><path d="M10 36V7M50 36V1M89 36V10" /><g transform="translate(10 7)"><circle r="12"/><circle class="flower-center" r="5"/></g><g transform="translate(50 1)"><circle r="14"/><circle class="flower-center" r="5"/></g><g transform="translate(89 10)"><circle r="11"/><circle class="flower-center" r="4"/></g></g>
            <g class="scene-basket" transform="translate(420 440)"><path d="M15 24Q20 -8 50 -8T85 24" fill="none"/><path d="M4 22H96L87 74Q85 83 74 84H25Q14 83 12 74Z"/><path class="basket-weave" d="M13 41H89M16 61H86M31 24V80M51 24V82M71 24V80"/></g>
            <g class="scene-trails"><path d="M1080 535C940 430 730 330 330 340"/><path d="M1080 535C920 480 710 395 330 400"/><path d="M1080 535C920 515 700 455 330 460"/><path d="M1080 535C930 545 705 515 330 520"/></g>
            <g class="scene-bush" transform="translate(1060 285)"><circle cx="68" cy="80" r="69"/><circle cx="8" cy="96" r="55"/><circle cx="119" cy="109" r="48"/><circle class="bush-highlight" cx="45" cy="51" r="27"/></g>
            <g class="scene-anthill" transform="translate(940 360)"><path d="M0 240Q25 62 137 14Q252 58 280 240Z"/><path class="hill-highlight" d="M35 180Q67 76 148 45"/><path class="hill-ridge" d="M45 198Q139 156 236 199M63 132Q138 97 215 137M94 77Q139 58 183 80"/><g class="hill-pebbles"><circle cx="46" cy="211" r="8"/><circle cx="217" cy="171" r="7"/><circle cx="72" cy="153" r="5"/><circle cx="196" cy="103" r="6"/></g><path class="hill-door" d="M88 240Q91 141 139 137Q190 142 192 240Z"/></g>
          </svg>
          <div class="anthill-mouth" aria-hidden="true"></div>
          <div class="wave-display"><span aria-hidden="true">🌼</span><strong data-wave>1</strong></div>
          <div class="picnic-blanket" aria-hidden="true"></div>
          <div class="sandwich" data-sandwich aria-label="The picnic sandwich, five bites left">
            <svg viewBox="0 0 240 180" role="img" aria-hidden="true">
              <defs><mask id="sandwich-bites"><rect width="240" height="180" fill="white"/><circle data-bite cx="229" cy="44" r="28" fill="white"/><circle data-bite cx="230" cy="94" r="27" fill="white"/><circle data-bite cx="219" cy="148" r="29" fill="white"/><circle data-bite cx="164" cy="170" r="27" fill="white"/><circle data-bite cx="105" cy="171" r="27" fill="white"/></mask></defs>
              <g mask="url(#sandwich-bites)">
                <path d="M24 128Q22 117 36 112H207Q220 116 218 128L213 151Q211 163 197 164H40Q27 162 27 151Z" fill="#d98025"/>
                <path d="M31 126Q30 119 41 117H202Q211 119 210 127L206 147Q205 155 195 156H43Q34 155 34 147Z" fill="#f5c86f"/>
                <path d="M27 112Q42 100 58 111T89 109T121 111T153 108T187 111T217 107L211 128H32Z" fill="#73b847"/>
                <path d="M35 100Q54 91 73 101T111 99T150 101T190 98T216 103L209 119H31Z" fill="#ef9bae"/>
                <circle cx="68" cy="99" r="13" fill="#e84c45"/><circle cx="119" cy="99" r="13" fill="#e84c45"/><circle cx="173" cy="99" r="13" fill="#e84c45"/>
                <path d="M29 84H215L207 105H151L140 119L127 105H38Z" fill="#f6d04b"/>
                <path d="M22 72Q20 53 37 40L62 21Q70 15 82 15H178Q193 15 201 27L217 51Q223 61 216 73L207 87H33Q24 84 22 72Z" fill="#d98025"/>
                <path d="M29 68Q28 55 41 45L66 27Q73 22 83 22H175Q186 22 192 31L209 55Q213 61 208 70L202 78H38Q30 76 29 68Z" fill="#f6cf7b"/>
                <path d="M45 52Q82 29 119 30T194 50" fill="none" stroke="#ffe7ad" stroke-width="8" stroke-linecap="round" opacity=".8"/>
                <g fill="#c88a38" opacity=".65"><ellipse cx="83" cy="38" rx="3" ry="6" transform="rotate(-26 83 38)"/><ellipse cx="123" cy="31" rx="3" ry="6" transform="rotate(20 123 31)"/><ellipse cx="163" cy="38" rx="3" ry="6" transform="rotate(-18 163 38)"/></g>
              </g>
            </svg>
            <div class="crumbs" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="chomp-burst" aria-hidden="true">CHOMP!</div><div class="sandwich-celebration" aria-hidden="true">✦ ✨ ✦</div>
          </div>
          <div class="wave-announcement" data-announcement aria-live="polite"></div>
          <button class="start-picnic" data-start aria-label="Start Squish the Bugs"><span aria-hidden="true">▶</span></button>
        </div>
      </section>
      <div class="bugs-game-over" data-game-over hidden role="dialog" aria-modal="true" aria-labelledby="game-over-title">
        <div class="game-over-card"><span aria-hidden="true">🥪</span><p>OH NO!</p><h2 id="game-over-title">The bugs ate the picnic!</h2><button data-replay aria-label="Play again"><span aria-hidden="true">↻</span><small>Play again!</small></button></div>
      </div>
    </main>`;

  const $ = (selector) => root.querySelector(selector);
  const picnic = $("[data-picnic]");
  const waveEl = $("[data-wave]");
  const announcementEl = $("[data-announcement]");
  const sandwich = $("[data-sandwich]");
  const startButton = $("[data-start]");
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
    sandwich.classList.remove("is-hit");
    requestAnimationFrame(() => sandwich.classList.add("is-hit"));
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
      x: 87.2,
      y: 82,
      laneY: ANT_LANES[laneIndex],
      entryTime: 0,
      entering: true,
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
    sandwich.classList.remove("is-happy");
    requestAnimationFrame(() => sandwich.classList.add("is-happy"));
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
        if (bug.entering) {
          bug.entryTime += elapsed;
          const progress = Math.min(1, bug.entryTime / 1000);
          const eased = progress * progress * (3 - 2 * progress);
          bug.x = 87.2 - eased * 8;
          bug.y = 82 + (bug.laneY - 82) * eased;
          if (progress === 1) bug.entering = false;
        } else {
          bug.x -= bug.speed * elapsed / 1000;
        }
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

  function begin() {
    ensureAudio();
    startButton.hidden = true;
    running = true;
    startWave();
  }

  function reset(playNow = true) {
    clearTimeout(spawnTimer);
    clearTimeout(waveTimer);
    bugs.forEach((bug) => bug.element.remove());
    bugs = [];
    wave = 0;
    health = STARTING_HEALTH;
    renderSandwich();
    $("[data-game-over]").hidden = true;
    sandwich.classList.remove("is-hit", "is-happy");
    running = false;
    startButton.hidden = playNow;
    if (playNow) begin();
  }

  $("[data-replay]").addEventListener("click", () => { ensureAudio(); reset(); });
  startButton.addEventListener("click", () => begin());
  reset(false);
  animationFrame = requestAnimationFrame(tick);
  return () => { clearTimeout(spawnTimer); clearTimeout(waveTimer); cancelAnimationFrame(animationFrame); audioContext?.close(); };
}
