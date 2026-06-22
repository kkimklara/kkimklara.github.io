// ---------- Footer year ----------
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Panel switching ----------
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");
const topbarPath = document.querySelector("#topbarPath");
const sidebar = document.querySelector("#appSidebar");
const sidebarToggle = document.querySelector("#sidebarToggle");
const sidebarToggleLabel = document.querySelector("#sidebarToggleLabel");

function showPanel(name) {
  panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === name));
  navItems.forEach((n) => n.classList.toggle("is-active", n.dataset.panel === name));
  if (topbarPath) topbarPath.textContent = `~/${name}`;

  const activePanel = document.querySelector(`.panel[data-panel="${name}"]`);
  if (activePanel) activePanel.scrollTop = 0;

  if (sidebar && sidebar.classList.contains("is-open")) {
    sidebar.classList.remove("is-open");
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "false");
  }
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showPanel(item.dataset.panel));
});

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    if (sidebarToggleLabel) sidebarToggleLabel.textContent = isOpen ? "close" : "menu";
  });
}

// ---------- Project filter ----------
const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll("#projectGrid .project");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const filter = chip.dataset.filter;
    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      card.classList.toggle("is-hidden", !(filter === "all" || tags.includes(filter)));
    });
  });
});

// ---------- Terminal overlay ----------
const terminalOverlay = document.querySelector("#terminalOverlay");
const terminalOpenBtn = document.querySelector("#terminalOpenBtn");
const heroTerminalBtn = document.querySelector("#heroTerminalBtn");
const terminalCloseBtn = document.querySelector("#terminalCloseBtn");
const terminalInput = document.querySelector("#terminalInput");
const terminalBody = document.querySelector("#terminalBody");

function openTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.hidden = false;
  if (terminalInput) terminalInput.focus();
}

function closeTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.hidden = true;
}

[terminalOpenBtn, heroTerminalBtn].forEach((btn) => {
  if (btn) btn.addEventListener("click", openTerminal);
});

if (terminalCloseBtn) terminalCloseBtn.addEventListener("click", closeTerminal);

if (terminalOverlay) {
  terminalOverlay.addEventListener("click", (e) => {
    if (e.target === terminalOverlay) closeTerminal();
  });
}

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement ? document.activeElement.tagName : "";
  const typing = tag === "INPUT" || tag === "TEXTAREA";

  if (e.key === "`" && !typing) {
    e.preventDefault();
    if (terminalOverlay && terminalOverlay.hidden) openTerminal();
    else closeTerminal();
  }

  if (e.key === "Escape" && terminalOverlay && !terminalOverlay.hidden) {
    closeTerminal();
  }
});

// ---------- Terminal commands ----------
function printLine(text, className) {
  const p = document.createElement("p");
  p.className = `t-line ${className || ""}`.trim();
  p.textContent = text;
  terminalBody.appendChild(p);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function printCommandEcho(cmd) {
  const p = document.createElement("p");
  p.className = "t-line";
  const prompt = document.createElement("span");
  prompt.className = "t-prompt";
  prompt.textContent = "klara@security:~$";
  p.appendChild(prompt);
  p.append(" " + cmd);
  terminalBody.appendChild(p);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

const NAV_TARGETS = ["home", "about", "education", "experience", "projects", "publications", "talks", "contact"];

const COMMANDS = {
  help() {
    printLine("available commands:", "t-output");
    printLine("  help                 show this list", "t-output");
    printLine("  whoami               who is klara.kim", "t-output");
    printLine("  about / education / experience / projects / publications / talks / contact", "t-output");
    printLine("                       jump to that panel", "t-output");
    printLine("  ls                   list site sections", "t-output");
    printLine("  neofetch             system info, security-consultant edition", "t-output");
    printLine("  cat resume.txt       quick summary", "t-output");
    printLine("  clear                clear the terminal", "t-output");
  },
  whoami() {
    printLine(
      'ChaeYoung "Klara" Kim — Cyber Risk & Compliance Consultant / Robot·IoT·CPS Security Researcher',
      "t-output"
    );
  },
  ls() {
    printLine(NAV_TARGETS.join("  "), "t-output");
  },
  neofetch() {
    printLine("klara@security", "t-output");
    printLine("---------------", "t-output");
    printLine("Role:    Cyber Risk & Compliance Consultant", "t-output");
    printLine("Focus:   ISMS-P · SOC 2 · HIPAA · Robot/IoT/CPS Security", "t-output");
    printLine("Tools:   STRIDE, LINDDUN, Python, comply2pwn", "t-output");
    printLine("Origin:  SWLUG 25th -> BoB 13th -> Deloitte", "t-output");
    printLine("Uptime:  Dec 2025 - present", "t-output");
  },
  resume() {
    printLine(
      "Compliance auditor by day, robot/IoT security researcher on the side. Type 'experience' or 'projects' for details.",
      "t-output"
    );
  },
  sudo() {
    printLine("permission denied: nice try.", "t-error");
  },
  clear() {
    terminalBody.innerHTML = "";
  },
};

function handleCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  printCommandEcho(cmd);

  const lower = cmd.toLowerCase();
  const firstWord = lower.split(" ")[0];

  if (lower === "cat resume.txt" || lower === "cat resume") {
    COMMANDS.resume();
    return;
  }

  if (NAV_TARGETS.includes(lower)) {
    printLine(`opening ~/${lower} ...`, "t-output");
    showPanel(lower);
    setTimeout(closeTerminal, 350);
    return;
  }

  if (COMMANDS[firstWord]) {
    COMMANDS[firstWord]();
    return;
  }

  printLine(`command not found: ${cmd} — type 'help'`, "t-error");
}

if (terminalInput) {
  terminalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleCommand(terminalInput.value);
      terminalInput.value = "";
    }
  });
}

// ===== Robot mascot =====
(function () {
  const mascot    = document.getElementById('mascot');
  const mascotSvg = document.getElementById('mascot-svg');
  const bubble    = document.getElementById('mascot-bubble');
  if (!mascot || !mascotSvg || !bubble) return;

  // Position: mascot starts bottom-right (fixed via CSS).
  // We'll lerp toward the mouse when it moves.
  let targetX = window.innerWidth  - 80;
  let targetY = window.innerHeight - 90;
  let currentX = targetX;
  let currentY = targetY;
  let lastX = targetX;
  let facingRight = false;
  let isFollowing = false;
  let idleTimer = null;
  let bubbleTimer = null;

  const LERP_SPEED = 0.08;

  const QUIPS = [
    'rm -rf / ? no thanks.',
    'sudo make me a sandwich',
    '404: sleep not found',
    '// TODO: world domination',
    'segfault? not today.',
    'nmap -A everywhere',
    'cat /etc/feelings.txt',
    'if (compliant) pwn()',
    'BoB 13th 💪',
    'ISMS ✓  robots? 🤔',
    'chmod 777 my heart',
    'git commit -m "vibes"',
    'threat model everything',
    'TLP:CUTE',
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Eyes blink
  let blinkTimeout;
  function scheduleBlink() {
    const delay = 2000 + Math.random() * 3000;
    blinkTimeout = setTimeout(() => {
      mascotSvg.classList.add('mascot-blink');
      setTimeout(() => {
        mascotSvg.classList.remove('mascot-blink');
        scheduleBlink();
      }, 120);
    }, delay);
  }
  scheduleBlink();

  // Show a speech bubble
  function showBubble(text) {
    clearTimeout(bubbleTimer);
    bubble.textContent = text;
    bubble.classList.add('is-visible');
    mascot.classList.add('is-excited');
    bubbleTimer = setTimeout(() => {
      bubble.classList.remove('is-visible');
      mascot.classList.remove('is-excited');
    }, 2800);
  }

  // Click → quip
  mascot.style.pointerEvents = 'auto';
  mascot.style.cursor = 'pointer';
  mascot.addEventListener('click', () => {
    const q = QUIPS[Math.floor(Math.random() * QUIPS.length)];
    showBubble(q);
    // tiny bounce
    mascotSvg.style.transition = 'transform 120ms ease';
    mascotSvg.style.transform = 'translateY(-10px) scale(1.08)';
    setTimeout(() => { mascotSvg.style.transform = ''; }, 200);
  });

  // Mouse move → set target
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX - 28;
    targetY = e.clientY - 70;
    isFollowing = true;

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { isFollowing = false; }, 2000);
  });

  // Occasional idle quip every ~18s
  setInterval(() => {
    if (!bubble.classList.contains('is-visible')) {
      const idleQuips = ['...', 'still here 👀', 'click me!', '*beep boop*', 'scanning…'];
      showBubble(idleQuips[Math.floor(Math.random() * idleQuips.length)]);
    }
  }, 18000);

  // RAF loop
  function tick() {
    if (isFollowing) {
      currentX = lerp(currentX, targetX, LERP_SPEED);
      currentY = lerp(currentY, targetY, LERP_SPEED);
      mascot.style.left   = currentX + 'px';
      mascot.style.top    = currentY + 'px';
      mascot.style.bottom = 'auto';
      mascot.style.right  = 'auto';
      mascot.style.position = 'fixed';

      // Flip to face movement direction
      const dx = currentX - lastX;
      if (Math.abs(dx) > 0.3) {
        const shouldFaceRight = dx > 0;
        if (shouldFaceRight !== facingRight) {
          facingRight = shouldFaceRight;
          mascotSvg.style.transform = `scaleX(${facingRight ? -1 : 1})`;
        }
      }
      lastX = currentX;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();