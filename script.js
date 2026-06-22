// ---------- Footer year ----------
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Language mode ----------
const modeBtns    = document.querySelectorAll(".mode-btn");
const sidebarRole = document.querySelector("#sidebarRole");
const qaTagline   = document.querySelector("#qaTagline");
const qaHint      = document.querySelector("#qaHint");
let currentMode   = "en";

function setMode(mode) {
  currentMode = mode;
  document.documentElement.setAttribute("data-mode", mode);
  document.documentElement.setAttribute("lang", mode === "kr" ? "ko" : "en");
  modeBtns.forEach(b => b.classList.toggle("is-active", b.dataset.mode === mode));

  // Sidebar role
  if (sidebarRole) sidebarRole.textContent = mode === "en" ? "Security Researcher" : "보안 연구자";

  // Q&A tagline + hint
  if (qaTagline) qaTagline.textContent = mode === "en"
    ? "Cyber Risk & Compliance · Robot/IoT/CPS Security"
    : "사이버 리스크 & 컴플라이언스 · 로봇/IoT/CPS 보안";
  if (qaHint) qaHint.textContent = mode === "en" ? "Ask me anything below ↓" : "아래에서 질문해보세요 ↓";

  // Nav labels
  document.querySelectorAll(".nav-label[data-en]").forEach(el => {
    el.textContent = el.dataset[mode] || el.dataset.en;
  });

  // Section labels
  document.querySelectorAll(".section-label[data-en]").forEach(el => {
    el.textContent = el.dataset[mode] || el.dataset.en;
  });

  // h2 headings
  document.querySelectorAll(".t-h2[data-en]").forEach(el => {
    el.textContent = el.dataset[mode] || el.dataset.en;
  });

  // edu-group-labels
  document.querySelectorAll(".edu-group-label[data-en]").forEach(el => {
    el.innerHTML = el.dataset[mode] || el.dataset.en;
  });

  // filter chips & map hint
  document.querySelectorAll("[data-en][data-kr]:not(.nav-label):not(.section-label):not(.t-h2):not(.edu-group-label):not(.qa-chip)").forEach(el => {
    el.textContent = el.dataset[mode] || el.dataset.en;
  });

  // Q&A chips
  document.querySelectorAll(".qa-chip[data-en]").forEach(el => {
    el.textContent = el.dataset[mode] || el.dataset.en;
  });

  // Reset Q&A thread when switching language
  const thread = document.querySelector("#qaThread");
  if (thread) thread.innerHTML = "";
  document.querySelectorAll(".qa-chip").forEach(c => c.classList.remove("is-used"));
  qaTyping = false;
}

modeBtns.forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));

// ---------- Panel switching ----------
const navItems      = document.querySelectorAll(".nav-item");
const panels        = document.querySelectorAll(".panel");
const topbarPath    = document.querySelector("#topbarPath");
const sidebar       = document.querySelector("#appSidebar");
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
const filterChips  = document.querySelectorAll(".filter-chip");
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
    en: "ChaeYoung \"Klara\" Kim — compliance auditor by day, robot/IoT security researcher on the side. BoB 13th cohort. Currently at Deloitte Anjin. I built a tool that turns audit findings into attack paths. Ask me anything.",
    kr: "안녕하세요, 김채영(Klara)입니다. 딜로이트 안진에서 사이버 리스크 & 컴플라이언스 컨설턴트로 일하면서 서비스 로봇·IoT·CPS 보안을 연구합니다. BoB 13기 출신이고, 컴플라이언스 감사 결과를 공격 경로로 변환하는 도구도 만들었어요."
  },
  deloitte: {
    en: "T&T Cyber Risk & Compliance at Deloitte Anjin. Day-to-day: ISMS-P gap analysis, audit evidence review, SOC 2 control testing, and third-party assessments. The interesting part — cross-referencing what passes an audit with what would actually stop an attacker.",
    kr: "딜로이트 안진 T&T 사이버 리스크 & 컴플라이언스 팀이에요. 주요 업무는 ISMS-P 갭 분석, 감사 증거 검토, SOC 2 통제 테스트, 제3자 보안 평가입니다. 흥미로운 부분은 '감사를 통과한 것'과 '실제 공격을 막을 수 있는 것' 사이의 간극을 찾아내는 거예요."
  },
  comply: {
    en: "Comply-to-Pwn is my research project — a Python CLI (comply2pwn) that takes audit artifacts and maps them to ATT&CK techniques, scores blast radius, then renders an attack graph. Core idea: the paper trail IS the attack surface. If you know what's compliant, you know where the gaps are.",
    kr: "컴플라이언스 감사 산출물(통제 증거, 갭 파인딩, UAR 결과 등)을 ATT&CK 기법에 매핑하고, 블래스트 레디우스 점수화 후 공격 그래프로 시각화하는 Python CLI예요. 핵심 아이디어: '페이퍼트레일 자체가 공격 표면'이에요. 무엇이 통과했는지 알면, 실제 갭도 보입니다."
  },
  robot: {
    en: "Started with LG Electronics — STRIDE-based threat modeling and security requirements derivation for autonomous service robots. Published papers on LINDDUN-based privacy modeling for robot LTE transmission and STRIDE-based security requirements. Now writing R-SPS, a 6-phase framework for service robot security, targeting ETRI Journal. Also doing CubeSat research with Kinryu Labs.",
    kr: "LG전자 서비스 로봇을 시작으로 STRIDE 기반 위협 모델링과 보안 요구사항 도출 연구를 해왔어요. 로봇 LTE 전송 LINDDUN 프라이버시 위협 모델링, STRIDE 기반 보안 요구사항 논문을 발표했고요. 현재는 ETRI Journal 투고를 목표로 R-SPS(서비스 로봇 6단계 보안 평가 프레임워크)를 마무리 중이에요. Kinryu Labs에서 큐브샛 보안 연구도 함께 진행하고 있어요."
  },
  bob: {
    en: "Best of the Best — KITRI's national program, ~30 people selected per year. 13th cohort. I also ran the BoB Newsletter: Reporter Team Lead in the 6th newsletter cohort, then Editor-in-Chief in the 7th. That's where I learned to explain hard technical things to people who weren't in the room — turns out that's 90% of consulting.",
    kr: "Best of the Best — KITRI의 국가 사이버보안 인재 프로그램으로 매년 전국에서 약 30명이 선발돼요. 저는 13기예요. BoB 뉴스레터 6기 기자팀장, 7기 편집장도 맡았어요. 현장에 없는 사람에게 어려운 기술 내용을 설명하는 법을 거기서 배웠는데, 컨설팅의 90%가 그 일이더라고요."
  },
  now: {
    en: "Two things running in parallel — finalizing R-SPS for submission to ETRI Journal (a 6-phase security/privacy/safety framework for service robots), and ongoing CubeSat security research with Kinryu Labs. Also thinking about the next version of Comply-to-Pwn.",
    kr: "두 가지를 동시에 진행 중이에요. ETRI Journal에 R-SPS 논문 투고 마무리 작업 — 서비스 로봇을 위한 6단계 보안/프라이버시/안전성 평가 프레임워크예요. 그리고 Kinryu Labs에서 큐브샛 보안 연구를 계속하고 있어요. Comply-to-Pwn 다음 버전도 구상 중이고요."
  }
};

const qaThread = document.querySelector("#qaThread");
const qaChips  = document.querySelectorAll(".qa-chip");
let qaTyping   = false;

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
      cursor.insertAdjacentText("beforebegin", text[i++]);
      qaThread.scrollTop = qaThread.scrollHeight;
      setTimeout(tick, 13 + Math.random() * 11);
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
    const answer = QA[key]?.[currentMode] || "";
    if (!answer) return;
    chip.classList.add("is-used");
    const q = document.createElement("div");
    q.className = "qa-bubble question";
    q.textContent = chip.textContent;
    qaThread.appendChild(q);
    qaThread.scrollTop = qaThread.scrollHeight;
    qaTyping = true;
    setTimeout(() => typeLine(answer), 320);
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
    const card = document.getElementById(`card-${pin.dataset.pin}`);
    if (!card) return;
    const isOpen = card.classList.contains("is-open");
    closeAllCards();
    if (!isOpen) { card.style.display = "block"; card.classList.add("is-open"); }
  });
});

pinCards.forEach(card => {
  card.addEventListener("click", e => e.stopPropagation());
  card.querySelector(".pin-card-close")?.addEventListener("click", () => {
    card.style.display = "none"; card.classList.remove("is-open");
  });
});

document.addEventListener("click", closeAllCards);

// ---------- Terminal ----------
const terminalOverlay  = document.querySelector("#terminalOverlay");
const terminalOpenBtn  = document.querySelector("#terminalOpenBtn");
const terminalCloseBtn = document.querySelector("#terminalCloseBtn");
const terminalInput    = document.querySelector("#terminalInput");
const terminalBody     = document.querySelector("#terminalBody");

const openTerminal  = () => { if (terminalOverlay) { terminalOverlay.hidden = false; terminalInput?.focus(); } };
const closeTerminal = () => { if (terminalOverlay) terminalOverlay.hidden = true; };

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
  s.className = "t-prompt"; s.textContent = "klara@security:~$";
  p.appendChild(s); p.append(" " + cmd);
  terminalBody.appendChild(p); terminalBody.scrollTop = terminalBody.scrollHeight;
}

const NAV_TARGETS = ["home","journey","about","education","experience","projects","publications","talks","contact"];

const CMDS = {
  help()    { tPrint("help  whoami  ls  neofetch  lang  cat resume.txt  clear", "t-output"); tPrint("  + section names: " + NAV_TARGETS.join(", "), "t-output"); },
  whoami()  { tPrint('ChaeYoung "Klara" Kim — Cyber Risk & Compliance / Robot·IoT·CPS Security Researcher', "t-output"); },
  ls()      { tPrint(NAV_TARGETS.join("  "), "t-output"); },
  neofetch(){ ["klara@security","──────────────────","Role:    Cyber Risk & Compliance Consultant","Focus:   ISMS-P · SOC 2 · HIPAA · Robot/IoT/CPS Security","Tools:   STRIDE, LINDDUN, Python, comply2pwn","Origin:  SWLUG 25th → BoB 13th → Deloitte","Lang:    " + currentMode.toUpperCase()].forEach(l => tPrint(l, "t-output")); },
  lang()    { tPrint(`current language: ${currentMode.toUpperCase()} — click the toggle in the topbar to switch`, "t-output"); },
  resume()  { tPrint("Compliance auditor by day, robot/IoT security researcher on the side.", "t-output"); },
  sudo()    { tPrint("permission denied: nice try.", "t-error"); },
  clear()   { terminalBody.innerHTML = ""; },
};

function handleCmd(raw) {
  const cmd = raw.trim(); if (!cmd) return;
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
  let cx = tx, cy = ty, lastX = tx, facingRight = false, following = false;

  const QUIPS_EN = ["rm -rf / ? no thanks.","sudo make me a sandwich","404: sleep not found","// TODO: world domination","segfault? not today.","if (compliant) pwn()","BoB 13th 💪","TLP:CUTE","kinryu.sh 🛰️","threat model everything","chmod 777 my heart","git commit -m 'vibes'"];

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
    bubble.textContent = text;
    bubble.classList.add("is-visible");
    mascot.classList.add("is-excited");
    setTimeout(() => { bubble.classList.remove("is-visible"); mascot.classList.remove("is-excited"); }, 2800);
  }

  mascot.style.pointerEvents = "auto";
  mascot.style.cursor = "pointer";
  mascot.addEventListener("click", () => {
    const quips = QUIPS_EN;
    showBubble(quips[Math.floor(Math.random()*quips.length)]);
    mascotSvg.style.transition = "transform 140ms ease";
    mascotSvg.style.transform  = "translateY(-10px) scale(1.1)";
    setTimeout(() => { mascotSvg.style.transform = ""; }, 220);
  });

  document.addEventListener("mousemove", e => {
    tx = e.clientX - 28; ty = e.clientY - 70;
    following = true;
    clearTimeout(mascot._idleTimer);
    mascot._idleTimer = setTimeout(() => { following = false; }, 1800);
  });

  setInterval(() => {
    if (!bubble.classList.contains("is-visible")) {
      const idle = ["...", "still here 👀", "click me!", "*beep boop*", "scanning…"];
      showBubble(idle[Math.floor(Math.random()*idle.length)]);
    }
  }, 20000);

  function tick() {
    if (following) {
      cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08);
      mascot.style.left = cx + "px"; mascot.style.top = cy + "px";
      mascot.style.bottom = "auto"; mascot.style.right = "auto";
      mascot.style.position = "fixed";
      const dx = cx - lastX;
      if (Math.abs(dx) > 0.3) {
        const r = dx > 0;
        if (r !== facingRight) { facingRight = r; mascotSvg.style.transform = `scaleX(${r ? -1 : 1})`; }
      }
      lastX = cx;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ---------- Init on load ----------
setMode("en");