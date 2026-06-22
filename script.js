// ---------- Footer year ----------
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Mode toggle ----------
const modeBtns   = document.querySelectorAll(".mode-btn");
const sidebarRole = document.querySelector("#sidebarRole");
const qaTagline   = document.querySelector("#qaTagline");
let currentMode  = "researcher";

function setMode(mode) {
  currentMode = mode;
  document.documentElement.setAttribute("data-mode", mode);
  modeBtns.forEach(b => b.classList.toggle("is-active", b.dataset.mode === mode));
  if (sidebarRole) sidebarRole.textContent = mode === "researcher" ? "Security Researcher" : "Compliance Consultant";
  if (qaTagline)   qaTagline.textContent   = mode === "researcher"
    ? "Cyber Risk & Compliance · Robot/IoT/CPS Security"
    : "Cyber Security Consultant · IT Audit · ISMS · SOC 2 · HIPAA";
  // Update nav label text
  document.querySelectorAll(".nav-label").forEach(el => {
    el.textContent = mode === "researcher" ? el.dataset.r : el.dataset.a;
  });
  // Update section labels
  document.querySelectorAll(".section-label[data-r]").forEach(el => {
    el.textContent = mode === "researcher" ? el.dataset.r : el.dataset.a;
  });
}

// Init labels on load
setMode("researcher");

modeBtns.forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));

// ---------- Panel switching ----------
const navItems    = document.querySelectorAll(".nav-item");
const panels      = document.querySelectorAll(".panel");
const topbarPath  = document.querySelector("#topbarPath");
const sidebar     = document.querySelector("#appSidebar");
const sidebarToggle = document.querySelector("#sidebarToggle");

function showPanel(name) {
  panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === name));
  navItems.forEach(n => n.classList.toggle("is-active", n.dataset.panel === name));
  if (topbarPath) topbarPath.textContent = `~/${name}`;
  const active = document.querySelector(`.panel[data-panel="${name}"]`);
  if (active) active.scrollTop = 0;
  if (sidebar?.classList.contains("is-open")) {
    sidebar.classList.remove("is-open");
    sidebarToggle?.setAttribute("aria-expanded", "false");
  }
}

navItems.forEach(item => item.addEventListener("click", () => showPanel(item.dataset.panel)));

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(open));
    sidebarToggle.textContent = open ? "close" : "menu";
  });
}

// ---------- Project filter ----------
const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll("#projectGrid .project");

filterChips.forEach(chip => {
  chip.addEventListener("click", () => {
    filterChips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const f = chip.dataset.filter;
    projectCards.forEach(card => {
      const tags = (card.dataset.tags || "").split(" ");
      card.classList.toggle("is-hidden", !(f === "all" || tags.includes(f)));
    });
  });
});

// ---------- Q&A ----------
const QA = {
  who: {
    researcher: "ChaeYoung \"Klara\" Kim — compliance auditor by day, robot/IoT security researcher on the side. BoB 13th cohort. Currently at Deloitte Anjin. I made a tool that turns audit evidence into attack paths. Happy to dig into any of it.",
    auditor:    "I'm ChaeYoung Kim, a Cyber Risk & Compliance Consultant at Deloitte Anjin LLC. I support ISMS-P certification, SOC 2 and HIPAA-related IT audit, and third-party security assessments for global clients. I hold a background in both enterprise audit and applied security research."
  },
  deloitte: {
    researcher: "T&T Cyber Risk & Compliance at Deloitte Anjin. Day-to-day: ISMS-P gap analysis, audit evidence review, SOC 2 control testing, and third-party assessments. The interesting bit is cross-referencing what passes an audit with what would actually stop an attacker.",
    auditor:    "I'm on the T&T Cyber Risk & Compliance team. My work covers ISMS initial and re-certification consulting, SOC 2 and HIPAA-related IT audit for a Korean-listed company's U.S. subsidiary, and third-party security assessments. I focus on evidence-based control review and audit documentation."
  },
  comply: {
    researcher: "Comply-to-Pwn is my research project: a Python CLI (comply2pwn) that takes compliance audit artifacts — control evidence, gap findings, UAR results — and maps them to ATT&CK techniques, scores blast radius, then renders an attack graph. The core idea: the paper trail IS the attack surface. If you know what passed as 'compliant', you know where the real gaps are.",
    auditor:    "Comply-to-Pwn is a research framework I developed that examines the relationship between compliance audit findings and real-world attack vectors. It demonstrates why evidence-based control review matters — audit gaps that look minor on paper can correspond to significant attack surface when viewed through the lens of threat intelligence frameworks like ATT&CK."
  },
  robot: {
    researcher: "Started with LG Electronics — vulnerability assessment and threat modeling (STRIDE) for autonomous service robots. Published papers on LINDDUN privacy threat modeling for robot LTE transmission and STRIDE-based security requirements derivation. Now working on R-SPS: a 6-phase security, privacy, and safety assessment framework for service robots, targeting ETRI Journal. Also doing CubeSat research with Kinryu Labs (kinryu.sh).",
    auditor:    "I conduct security risk assessments for autonomous service robots and IoT-connected systems. This includes threat modeling using STRIDE and LINDDUN frameworks, security requirements derivation, and collaboration with KIRIA and KISA on national robot security standards. My research has been presented at NDSS SDIoTSec and published in IEICE and KIISC."
  },
  bob: {
    researcher: "Best of the Best — KITRI's national program, ~30 people selected per year. I was 13th cohort. Separately, I ran the BoB Newsletter: Reporter Team Lead in the 6th newsletter cohort, then Editor-in-Chief in the 7th. That's honestly where I learned how to explain hard technical things to people who weren't in the room — which turned out to be useful in consulting.",
    auditor:    "Best of the Best (BoB) is KITRI's flagship cybersecurity talent program — one of Korea's most selective, with roughly 30 participants chosen nationally per year. I was in the 13th cohort. I also served as Reporter Team Lead and then Editor-in-Chief of the BoB Newsletter, which gave me experience in technical communication and team leadership alongside the technical training."
  },
  now: {
    researcher: "Two things: finalizing the R-SPS paper for submission to ETRI Journal — it's a 6-phase security/privacy/safety framework for service robots with a real case study. And ongoing CubeSat security research with Kinryu Labs. Also thinking about what the next version of Comply-to-Pwn looks like.",
    auditor:    "Currently finalizing the R-SPS paper — a structured assessment framework for service robot security — for submission to ETRI Journal. Alongside that, I'm continuing client work at Deloitte covering ISMS-P, SOC 2, and HIPAA audit projects, and contributing to ongoing international collaborative research through Kinryu Labs."
  }
};

const qaThread  = document.querySelector("#qaThread");
const qaChips   = document.querySelectorAll(".qa-chip");

let qaTyping = false;

function typeLine(text, onDone) {
  const p = document.createElement("div");
  p.className = "qa-bubble answer";
  p.innerHTML = '<span class="qa-cursor"></span>';
  qaThread.appendChild(p);
  qaThread.scrollTop = qaThread.scrollHeight;

  let i = 0;
  const cursor = p.querySelector(".qa-cursor");

  function tick() {
    if (i < text.length) {
      cursor.insertAdjacentText("beforebegin", text[i]);
      i++;
      qaThread.scrollTop = qaThread.scrollHeight;
      setTimeout(tick, 14 + Math.random() * 12);
    } else {
      cursor.remove();
      qaTyping = false;
      if (onDone) onDone();
    }
  }
  tick();
}

qaChips.forEach(chip => {
  chip.addEventListener("click", () => {
    if (qaTyping) return;
    const key    = chip.dataset.q;
    const answer = QA[key]?.[currentMode] || QA[key]?.researcher || "";
    if (!answer) return;

    chip.classList.add("is-used");

    // Question bubble
    const q = document.createElement("div");
    q.className = "qa-bubble question";
    q.textContent = chip.textContent;
    qaThread.appendChild(q);
    qaThread.scrollTop = qaThread.scrollHeight;

    qaTyping = true;
    setTimeout(() => typeLine(answer), 340);
  });
});

// ---------- Map pins ----------
const mapPins  = document.querySelectorAll(".map-pin");
const pinCards = document.querySelectorAll(".pin-card");

function closeAllCards() {
  pinCards.forEach(c => { c.style.display = "none"; c.classList.remove("is-open"); });
}

mapPins.forEach(pin => {
  pin.addEventListener("click", e => {
    e.stopPropagation();
    const id   = pin.dataset.pin;
    const card = document.getElementById(`card-${id}`);
    if (!card) return;
    const isOpen = card.classList.contains("is-open");
    closeAllCards();
    if (!isOpen) {
      card.style.display = "block";
      card.classList.add("is-open");
    }
  });
});

pinCards.forEach(card => {
  card.addEventListener("click", e => e.stopPropagation());
  const closeBtn = card.querySelector(".pin-card-close");
  if (closeBtn) closeBtn.addEventListener("click", () => {
    card.style.display = "none";
    card.classList.remove("is-open");
  });
});

document.addEventListener("click", closeAllCards);

// ---------- Terminal overlay ----------
const terminalOverlay  = document.querySelector("#terminalOverlay");
const terminalOpenBtn  = document.querySelector("#terminalOpenBtn");
const terminalCloseBtn = document.querySelector("#terminalCloseBtn");
const terminalInput    = document.querySelector("#terminalInput");
const terminalBody     = document.querySelector("#terminalBody");

function openTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.hidden = false;
  terminalInput?.focus();
}
function closeTerminal() {
  if (terminalOverlay) terminalOverlay.hidden = true;
}

terminalOpenBtn?.addEventListener("click", openTerminal);
terminalCloseBtn?.addEventListener("click", closeTerminal);
terminalOverlay?.addEventListener("click", e => { if (e.target === terminalOverlay) closeTerminal(); });

document.addEventListener("keydown", e => {
  const typing = ["INPUT","TEXTAREA"].includes(document.activeElement?.tagName);
  if (e.key === "`" && !typing) { e.preventDefault(); terminalOverlay?.hidden ? openTerminal() : closeTerminal(); }
  if (e.key === "Escape" && !terminalOverlay?.hidden) closeTerminal();
});

function tPrint(text, cls) {
  const p = document.createElement("p");
  p.className = `t-line ${cls||""}`.trim();
  p.textContent = text;
  terminalBody.appendChild(p);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}
function tEcho(cmd) {
  const p = document.createElement("p");
  p.className = "t-line";
  const s = document.createElement("span");
  s.className = "t-prompt";
  s.textContent = "klara@security:~$";
  p.appendChild(s);
  p.append(" " + cmd);
  terminalBody.appendChild(p);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

const NAV_TARGETS = ["home","journey","about","education","experience","projects","publications","talks","contact"];

const CMDS = {
  help()    { tPrint("help  whoami  ls  neofetch  mode  cat resume.txt  clear", "t-output"); tPrint("  + panel names: " + NAV_TARGETS.join(", "), "t-output"); },
  whoami()  { tPrint('ChaeYoung "Klara" Kim — Cyber Risk & Compliance / Robot·IoT·CPS Security Researcher', "t-output"); },
  ls()      { tPrint(NAV_TARGETS.join("  "), "t-output"); },
  neofetch(){ ["klara@security","───────────────","Role:    Cyber Risk & Compliance Consultant","Focus:   ISMS-P · SOC 2 · HIPAA · Robot/IoT/CPS Security","Tools:   STRIDE, LINDDUN, Python, comply2pwn","Origin:  SWLUG 25th → BoB 13th → Deloitte","Mode:    " + currentMode].forEach(l => tPrint(l, "t-output")); },
  mode()    { tPrint("current mode: " + currentMode + " — click the toggle in the topbar to switch", "t-output"); },
  resume()  { tPrint("Compliance auditor by day, robot/IoT security researcher on the side. Ask 'projects' or 'experience'.", "t-output"); },
  sudo()    { tPrint("permission denied: nice try.", "t-error"); },
  clear()   { terminalBody.innerHTML = ""; },
};

function handleCmd(raw) {
  const cmd   = raw.trim();
  if (!cmd) return;
  tEcho(cmd);
  const lower = cmd.toLowerCase();
  if (lower === "cat resume.txt" || lower === "cat resume") { CMDS.resume(); return; }
  if (NAV_TARGETS.includes(lower)) { tPrint(`opening ~/${lower} ...`, "t-output"); showPanel(lower); setTimeout(closeTerminal, 380); return; }
  const first = lower.split(" ")[0];
  if (CMDS[first]) { CMDS[first](); return; }
  tPrint(`command not found: ${cmd} — type 'help'`, "t-error");
}

terminalInput?.addEventListener("keydown", e => {
  if (e.key === "Enter") { handleCmd(terminalInput.value); terminalInput.value = ""; }
});

// ---------- Mascot ----------
(function() {
  const mascot    = document.getElementById("mascot");
  const mascotSvg = document.getElementById("mascot-svg");
  const bubble    = document.getElementById("mascot-bubble");
  if (!mascot || !mascotSvg || !bubble) return;

  let tx = window.innerWidth - 80, ty = window.innerHeight - 90;
  let cx = tx, cy = ty, lastX = tx;
  let facingRight = false, following = false, idleTimer = null, bubbleTimer = null;

  const QUIPS = ["rm -rf / ? no thanks.","sudo make me a sandwich","404: sleep not found","// TODO: world domination","segfault? not today.","nmap -A everywhere","cat /etc/feelings.txt","if (compliant) pwn()","BoB 13th 💪","ISMS ✓  robots? 🤔","chmod 777 my heart","git commit -m 'vibes'","threat model everything","TLP:CUTE","kinryu.sh 🛰️"];

  function lerp(a,b,t){ return a+(b-a)*t; }

  let blinkTimer;
  function scheduleBlink() {
    blinkTimer = setTimeout(() => {
      mascotSvg.classList.add("mascot-blink");
      setTimeout(() => { mascotSvg.classList.remove("mascot-blink"); scheduleBlink(); }, 140);
    }, 2000 + Math.random()*3000);
  }
  scheduleBlink();

  function showBubble(text) {
    clearTimeout(bubbleTimer);
    bubble.textContent = text;
    bubble.classList.add("is-visible");
    mascot.classList.add("is-excited");
    bubbleTimer = setTimeout(() => { bubble.classList.remove("is-visible"); mascot.classList.remove("is-excited"); }, 2800);
  }

  mascot.style.pointerEvents = "auto";
  mascot.style.cursor = "pointer";
  mascot.addEventListener("click", () => {
    showBubble(QUIPS[Math.floor(Math.random()*QUIPS.length)]);
    mascotSvg.style.transition = "transform 140ms ease";
    mascotSvg.style.transform  = "translateY(-10px) scale(1.1)";
    setTimeout(() => { mascotSvg.style.transform = ""; }, 220);
  });

  document.addEventListener("mousemove", e => {
    tx = e.clientX - 28; ty = e.clientY - 70;
    following = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { following = false; }, 1800);
  });

  setInterval(() => {
    if (!bubble.classList.contains("is-visible")) {
      const idle = ["...","still here 👀","click me!","*beep boop*","scanning…"];
      showBubble(idle[Math.floor(Math.random()*idle.length)]);
    }
  }, 20000);

  function tick() {
    if (following) {
      cx = lerp(cx, tx, 0.08);
      cy = lerp(cy, ty, 0.08);
      mascot.style.left     = cx + "px";
      mascot.style.top      = cy + "px";
      mascot.style.bottom   = "auto";
      mascot.style.right    = "auto";
      mascot.style.position = "fixed";
      const dx = cx - lastX;
      if (Math.abs(dx) > 0.3) {
        const r = dx > 0;
        if (r !== facingRight) {
          facingRight = r;
          mascotSvg.style.transform = `scaleX(${r ? -1 : 1})`;
        }
      }
      lastX = cx;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();