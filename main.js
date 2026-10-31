/* ============================================================
   EDIT THIS BLOCK — your six projects.
   Leave `image: ""` to keep the generated placeholder.
   When you have a render, drop it in assets/img/ and set:
     image: "assets/img/kettle.jpg"
   `size` must be "wide", "half", or "full".
   ============================================================ */
const PROJECTS = [
  {
    title: "Kettle Study",
    category: "Product",
    year: "2026",
    tags: ["Hard-surface", "Cycles", "PBR"],
    size: "wide",
    image: "",
    tone: ["#2b303c", "#5c4033"],
  },
  {
    title: "Low-Poly Ranger",
    category: "Character",
    year: "2025",
    tags: ["Stylised", "Rigged", "EEVEE"],
    size: "half",
    image: "",
    tone: ["#3b2a2a", "#6b4a2d"],
  },
  {
    title: "Atrium",
    category: "Environment",
    year: "2026",
    tags: ["Archviz", "Lighting", "Cycles"],
    size: "half",
    image: "",
    tone: ["#243036", "#2f4a44"],
  },
  {
    title: "Component Breakdown",
    category: "Product",
    year: "2025",
    tags: ["CAD", "Exploded view", "Studio"],
    size: "wide",
    image: "",
    tone: ["#2a2a33", "#4a3a52"],
  },
  {
    title: "Desk Still Life",
    category: "Product",
    year: "2025",
    tags: ["Set dressing", "Materials"],
    size: "wide",
    image: "",
    tone: ["#2f2b25", "#5a4632"],
  },
  {
    title: "Loop Test",
    category: "Motion",
    year: "2026",
    tags: ["Turntable", "Animation", "Edit"],
    size: "half",
    image: "",
    tone: ["#252c33", "#3d4a5c"],
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
        <span class="card__tags">${project.category} · ${project.year}</span>
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
  lbTags.textContent = `${project.category} · ${project.year} · ${project.tags.join(" · ")}`;
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
