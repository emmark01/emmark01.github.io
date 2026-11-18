const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const page = document.querySelector("main");
const footer = document.querySelector(".site-footer");
const mq = window.matchMedia("(max-width: 760px)");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
  const lockPage = open && mq.matches;
  page.inert = lockPage;
  footer.inert = lockPage;
  syncInert();
}

function syncInert() {
  if (!mq.matches) {
    nav.inert = false;
    return;
  }
  nav.inert = !nav.classList.contains("is-open");
}

toggle.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (mq.matches) setMenu(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});

mq.addEventListener("change", () => {
  if (!mq.matches) setMenu(false);
  syncInert();
});

syncInert();

const links = [...nav.querySelectorAll("a[href^='#']")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveSection() {
  const marker = window.scrollY + header.getBoundingClientRect().height + 48;
  let current = null;
  sections.forEach((section, index) => {
    if (section.offsetTop <= marker) current = links[index];
  });
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) current = links[links.length - 1];
  links.forEach((link) => link.classList.toggle("is-active", link === current));
}

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
  setActiveSection();
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
