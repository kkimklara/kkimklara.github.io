// ---------- Footer year ----------
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector("#navToggle");
const navToggleLabel = document.querySelector("#navToggleLabel");
const siteNav = document.querySelector("#siteNav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    if (navToggleLabel) navToggleLabel.textContent = isOpen ? "close" : "menu";
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      if (navToggleLabel) navToggleLabel.textContent = "menu";
    });
  });
}

// ---------- Scrollspy + path indicator ----------
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".site-nav a");
const pathValue = document.querySelector("#pathValue");

if (sections.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.section === id);
          });

          if (pathValue) {
            pathValue.textContent = `~/${id}`;
          }
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
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
      const show = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !show);
    });
  });
});

// ---------- Interactive terminal ----------
const terminalBody = document.querySelector("#terminalBody");
const terminalInput = document.querySelector("#terminalInput");

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

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  }
}

const NAV_TARGETS = {
  about: "about",
  education: "education",
  experience: "experience",
  projects: "projects",
  publications: "publications",
  talks: "talks",
  contact: "contact",
};

const COMMANDS = {
  help() {
    printLine("available commands:", "t-output");
    printLine("  help                 show this list", "t-output");
    printLine("  whoami               who is klara.kim", "t-output");
    printLine("  about / education / experience / projects / publications / talks / contact", "t-output");
    printLine("                       scroll to that section", "t-output");
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
    printLine(Object.keys(NAV_TARGETS).join("  "), "t-output");
  },
  neofetch() {
    printLine("klara@security", "t-output");
    printLine("---------------", "t-output");
    printLine("Role:    Cyber Risk & Compliance Consultant", "t-output");
    printLine("Focus:   ISMS-P · SOC 2 · HIPAA · Robot/IoT/CPS Security", "t-output");
    printLine("Tools:   STRIDE, LINDDUN, Python, comply2pwn", "t-output");
    printLine("Origin:  SWLUG 25th → BoB 13th → Deloitte", "t-output");
    printLine("Uptime:  Dec 2025 – present", "t-output");
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

  if (NAV_TARGETS[lower]) {
    printLine(`opening ~/${lower} ...`, "t-output");
    scrollToSection(NAV_TARGETS[lower]);
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