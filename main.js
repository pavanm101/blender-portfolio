/* ============================================================
   EDIT THIS BLOCK — your projects.
   Images live in assets/img/. `size` is "half" or "full".
   ============================================================ */
const PROJECTS = [
  {
    title: "Zero-G Drift",
    category: "Character",
    medium: "Cycles",
    tags: ["Character", "Environment", "Compositing"],
    size: "half",
    image: "assets/img/zero-g.jpg",
    tone: ["#2a2350", "#7a2f4a"],
    note: "Character in zero gravity, lit against a nebula backdrop.",
  },
  {
    title: "Red Room",
    category: "Motion",
    medium: "Simulation",
    tags: ["Motion", "Simulation", "Grade"],
    size: "half",
    image: "assets/img/red-room.jpg",
    tone: ["#2a1010", "#8c1c14"],
    note: "A red form pushing through a doorway — high-contrast motion test.",
  },
  {
    title: "Cell X",
    category: "Product",
    medium: "EEVEE",
    tags: ["Product", "Emissive", "Lighting"],
    size: "half",
    image: "assets/img/cell-x.jpg",
    tone: ["#2c1030", "#6a1f5a"],
    note: "Emissive cube on a stepped plinth, lit with a hard magenta key.",
  },
  {
    title: "Framed",
    category: "Character",
    medium: "4K",
    tags: ["Character", "Portrait", "Lighting"],
    size: "half",
    image: "assets/img/framed.jpg",
    tone: ["#1d2b3a", "#2f6a63"],
    note: "Portrait showcase inside a portal frame, rendered at 4K.",
  },
  {
    title: "Signal",
    category: "Motion",
    medium: "Experimental",
    tags: ["Motion", "Volumetrics", "Experimental"],
    size: "half",
    image: "assets/img/signal.jpg",
    tone: ["#3a2a30", "#8a5560"],
    note: "Figure study — blown-out silhouette against a particle ring.",
  },
  {
    title: "Globe Study",
    category: "Product",
    medium: "Stills",
    tags: ["Product", "Materials", "Depth of field"],
    size: "half",
    image: "assets/img/desk-globe.jpg",
    tone: ["#3a2f24", "#2f6b6b"],
    note: "Desk globe, shallow depth of field, warm interior bokeh.",
  },
  {
    title: "Porch Light",
    category: "Environment",
    medium: "Archviz",
    tags: ["Environment", "Archviz", "Lighting"],
    size: "full",
    image: "assets/img/porch-light.jpg",
    tone: ["#3b3f36", "#7d7a55"],
    note: "Exterior study — porch, garden, late-afternoon haze.",
  },
];

/* ============================================================
   Nothing below needs editing.
   ============================================================ */

const grid = document.querySelector("[data-grid]");
const countEl = document.querySelector("[data-count]");
const filterBtns = [...document.querySelectorAll("[data-filter]")];
const header = document.querySelector("[data-header]");

const lightbox = document.querySelector("[data-lightbox]");
const stage = document.querySelector("[data-stage]");
const lbTitle = document.querySelector("[data-lb-title]");
const lbTags = document.querySelector("[data-lb-tags]");
const lbNote = document.querySelector("[data-lb-note]");

const pad = (n) => String(n).padStart(2, "0");
let activeFilter = "all";
let visible = [];
let current = 0;

function cardMarkup(project, indexInFilter) {
  const i = PROJECTS.indexOf(project);
  const toneStyle = `--tone-a:${project.tone?.[0] || "#23242b"};--tone-b:${project.tone?.[1] || "#3a2c26"}`;
  const badge = project.image
    ? `<span class="card__badge">${project.category}</span>`
    : `<span class="card__badge">Placeholder</span>`;
  const media = project.image
    ? `<img src="${project.image}" alt="${project.title} — ${project.category} render" loading="lazy" />`
    : `<span class="card__grid" aria-hidden="true"></span>`;

  return `
    <article class="card" data-size="${project.size}" data-index="${i}"
             style="animation-delay:${Math.min(indexInFilter, 8) * 55}ms">
      <button class="card__open" type="button" aria-label="Open ${project.title}">
        <span class="card__media" style="${toneStyle}">
          ${media}
          ${badge}
          <span class="card__view">View project</span>
        </span>
      </button>
      <div class="card__meta">
        <span class="card__index">${pad(i + 1)}</span>
        <h3 class="card__title">${project.title}</h3>
        <span class="card__tags">${project.category} · ${project.medium}</span>
      </div>
    </article>`;
}

function render(filter = "all") {
  visible = PROJECTS.filter((p) => filter === "all" || p.category === filter);
  grid.innerHTML = visible.map(cardMarkup).join("");
  countEl.textContent = `${pad(visible.length)} / ${pad(PROJECTS.length)}`;
}

function applyFilter(filter) {
  activeFilter = filter;
  filterBtns.forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  render(filter);
}

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter))
);

/* ── Lightbox ───────────────────────────────────────────── */
function paintStage(project) {
  if (project.image) {
    stage.innerHTML = `<img src="${project.image}" alt="${project.title}" />`;
  } else {
    const a = project.tone?.[0] || "#23242b";
    const b = project.tone?.[1] || "#3a2c26";
    stage.innerHTML = `
      <div class="card__media" style="--tone-a:${a};--tone-b:${b};aspect-ratio:auto;height:100%;border-radius:0">
        <span class="card__grid" aria-hidden="true"></span>
      </div>`;
  }
  lbTitle.textContent = project.title;
  lbTags.textContent = `${project.category} · ${project.medium} · ${project.tags.join(" · ")}`;
  lbNote.textContent = project.note || "";
}

function openAt(n) {
  if (!visible.length) return;
  current = (n + visible.length) % visible.length;
  paintStage(visible[current]);
  if (!lightbox.open) lightbox.showModal();
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const globalIndex = Number(card.dataset.index);
  openAt(visible.findIndex((p) => PROJECTS.indexOf(p) === globalIndex));
});

document.querySelector("[data-close]").addEventListener("click", () => lightbox.close());
document.querySelector("[data-prev]").addEventListener("click", () => openAt(current - 1));
document.querySelector("[data-next]").addEventListener("click", () => openAt(current + 1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.open) return;
  if (e.key === "ArrowRight") openAt(current + 1);
  if (e.key === "ArrowLeft") openAt(current - 1);
});

/* ── Chrome: sticky header + reveals ────────────────────── */
const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

document.querySelector("[data-year]").textContent = new Date().getFullYear();
render(activeFilter);
