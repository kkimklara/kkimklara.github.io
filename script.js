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