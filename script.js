/* =========================
   FLOOR PLAN CONFIGURATION
   Change dimensions and positions here for future revisions.
   Units are metres; SVG output uses 100 units per metre.
========================= */
const SCALE = 100;
const room = { width: 10, height: 7 };

const objects = [
  { type: "workstation", x: 1.0, y: 1.0, width: 1.45, height: 0.72, label: "Workstation 1" },
  { type: "workstation", x: 2.8, y: 1.0, width: 1.45, height: 0.72, label: "Workstation 2" },
  { type: "workstation", x: 1.0, y: 2.3, width: 1.45, height: 0.72, label: "Workstation 3" },
  { type: "workstation", x: 2.8, y: 2.3, width: 1.45, height: 0.72, label: "Workstation 4" },
  { type: "workstation", x: 1.0, y: 3.6, width: 1.45, height: 0.72, label: "Workstation 5" },
  { type: "workstation", x: 2.8, y: 3.6, width: 1.45, height: 0.72, label: "Workstation 6" },
  { type: "workstation", x: 1.0, y: 4.9, width: 1.45, height: 0.72, label: "Workstation 7" },
  { type: "workstation", x: 2.8, y: 4.9, width: 1.45, height: 0.72, label: "Workstation 8" },
  { type: "table", x: 4.1, y: 2.25, width: 2.55, height: 1.35, label: "DISCUSSION / BRAINSTORMING" },
  { type: "display", x: 4.55, y: 0.48, width: 1.65, height: 0.22, label: "PRESENTATION DISPLAY" },
  { type: "desk", x: 7.1, y: 1.0, width: 1.75, height: 0.78, label: "FACULTY / PI DESK" },
  { type: "gpu", x: 7.15, y: 2.35, width: 1.65, height: 0.9, label: "GPU WORKSTATION" },
  { type: "bench", x: 6.95, y: 4.15, width: 2.05, height: 0.82, label: "EQUIPMENT / WORKBENCH" },
  { type: "cabinet", x: 4.2, y: 5.55, width: 1.15, height: 0.55, label: "STORAGE" },
  { type: "cabinet", x: 5.55, y: 5.55, width: 1.15, height: 0.55, label: "STORAGE" },
  { type: "cabinet", x: 6.9, y: 5.55, width: 1.15, height: 0.55, label: "STORAGE" },
  { type: "electrical", x: 0.42, y: 1.35, label: "E" }, { type: "electrical", x: 0.42, y: 3.1, label: "E" },
  { type: "electrical", x: 0.42, y: 5.3, label: "E" }, { type: "electrical", x: 9.58, y: 1.45, label: "E" },
  { type: "electrical", x: 9.58, y: 4.55, label: "E" }, { type: "lan", x: 4.0, y: 1.72, label: "LAN" },
  { type: "lan", x: 6.55, y: 1.72, label: "LAN" }, { type: "lan", x: 6.55, y: 3.85, label: "LAN" }
];

const SVG_NS = "http://www.w3.org/2000/svg";
const pad = { left: 110, top: 85, right: 110, bottom: 90 };
const W = room.width * SCALE + pad.left + pad.right;
const H = room.height * SCALE + pad.top + pad.bottom;
const plan = document.getElementById("floor-plan");

function el(tag, attrs = {}, text = "") {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (text) node.textContent = text;
  return node;
}
function px(m) { return m * SCALE; }
function X(m) { return pad.left + px(m); }
function Y(m) { return pad.top + px(m); }
function addText(parent, x, y, text, cls = "label", anchor = "start") {
  parent.appendChild(el("text", { x, y, class: cls, "text-anchor": anchor }, text));
}
function line(parent, x1, y1, x2, y2, cls = "thin") { parent.appendChild(el("line", { x1, y1, x2, y2, class: cls })); }

function drawGrid(svg) {
  const grid = el("g", { class: "grid" });
  for (let x = 0; x <= room.width; x += 0.5) line(grid, X(x), Y(0), X(x), Y(room.height), x % 1 === 0 ? "grid-major" : "grid-minor");
  for (let y = 0; y <= room.height; y += 0.5) line(grid, X(0), Y(y), X(room.width), Y(y), y % 1 === 0 ? "grid-major" : "grid-minor");
  svg.appendChild(grid);
}

function drawDimensions(svg) {
  const dims = el("g", { class: "dimensions" });
  line(dims, X(0), 37, X(room.width), 37, "dimension-line"); line(dims, X(0), 30, X(0), 49, "dimension-tick"); line(dims, X(room.width), 30, X(room.width), 49, "dimension-tick");
  addText(dims, X(room.width / 2), 27, `${room.width.toFixed(2)} m`, "dimension-text", "middle");
  line(dims, 42, Y(0), 42, Y(room.height), "dimension-line"); line(dims, 34, Y(0), 51, Y(0), "dimension-tick"); line(dims, 34, Y(room.height), 51, Y(room.height), "dimension-tick");
  const side = el("text", { x: 24, y: Y(room.height / 2), class: "dimension-text", transform: `rotate(-90 24 ${Y(room.height / 2)})`, "text-anchor": "middle" }, `${room.height.toFixed(2)} m`); dims.appendChild(side);
  svg.appendChild(dims);
}

function drawWalls(svg) {
  const walls = el("g", { class: "walls" });
  walls.appendChild(el("rect", { x: X(0), y: Y(0), width: px(room.width), height: px(room.height), class: "room-fill" }));
  walls.appendChild(el("rect", { x: X(0), y: Y(0), width: px(room.width), height: px(room.height), class: "outer-wall" }));
  // Entrance opening on the south wall: a visible break with door leaf and swing arc.
  const doorX = X(8.55), doorY = Y(room.height);
  line(walls, doorX, doorY, doorX + px(1.0), doorY, "door-gap");
  line(walls, doorX, doorY, doorX, doorY - px(1.0), "door-leaf");
  walls.appendChild(el("path", { d: `M ${doorX + px(1)} ${doorY} A ${px(1)} ${px(1)} 0 0 0 ${doorX} ${doorY - px(1)}`, class: "door-arc" }));
  addText(walls, doorX + px(.5), doorY + 28, "ENTRANCE", "small-label", "middle");
  // Windows as double-line glazed openings.
  [[1.0, 0], [3.0, 0], [7.0, 0], [2.0, room.height], [4.0, room.height]].forEach(([wx, wy]) => {
    const horizontal = wy === 0 || wy === room.height;
    const xx = X(wx), yy = Y(wy);
    if (horizontal) { line(walls, xx, yy - 8, xx + px(1.2), yy - 8, "window"); line(walls, xx, yy + 8, xx + px(1.2), yy + 8, "window"); }
  });
  svg.appendChild(walls);
}

function drawObject(svg, obj) {
  const g = el("g", { class: `object object-${obj.type}` });
  const x = X(obj.x), y = Y(obj.y), w = px(obj.width || 0), h = px(obj.height || 0);
  if (["workstation", "desk", "gpu", "bench", "cabinet"].includes(obj.type)) {
    g.appendChild(el("rect", { x, y, width: w, height: h, rx: obj.type === "cabinet" ? 2 : 4, class: "furniture" }));
    if (obj.type === "workstation") {
      g.appendChild(el("rect", { x: x + w * .37, y: y + 7, width: w * .26, height: h * .3, class: "monitor" }));
      g.appendChild(el("circle", { cx: x + w / 2, cy: y + h + 19, r: 19, class: "chair" }));
    } else if (obj.type === "gpu") {
      g.appendChild(el("rect", { x: x + 14, y: y + 14, width: 24, height: h - 28, class: "equipment" }));
      g.appendChild(el("circle", { cx: x + w - 30, cy: y + h / 2, r: 8, class: "equipment-dot" }));
    } else if (obj.type === "bench") {
      for (let i = 1; i < 4; i++) line(g, x + w * i / 4, y + 8, x + w * i / 4, y + h - 8, "bench-mark");
    }
  } else if (obj.type === "table") {
    g.appendChild(el("rect", { x, y, width: w, height: h, rx: 12, class: "table" }));
    [[.18, -.22], [.5, -.22], [.82, -.22], [.18, 1.22], [.5, 1.22], [.82, 1.22]].forEach(([cx, cy]) => g.appendChild(el("circle", { cx: x + w * cx, cy: y + h * cy, r: 14, class: "chair" })));
  } else if (obj.type === "display") {
    g.appendChild(el("rect", { x, y, width: w, height: h, class: "display" }));
    line(g, x + w / 2, y + h, x + w / 2, y + h + 18, "display-stand");
  } else if (obj.type === "electrical" || obj.type === "lan") {
    g.appendChild(el("circle", { cx: x, cy: y, r: obj.type === "lan" ? 9 : 8, class: obj.type }));
    addText(g, x, y + 4, obj.label, "service-label", "middle");
  }
  if (obj.label && !["electrical", "lan", "workstation"].includes(obj.type)) addText(g, x + w / 2, y + h / 2 + 4, obj.label, obj.type === "table" ? "zone-label" : "object-label", "middle");
  if (obj.type === "workstation") addText(g, x + w / 2, y + h / 2 - 2, obj.label.replace("Workstation ", "WS "), "object-label", "middle");
  svg.appendChild(g);
}

function renderPlan() {
  const svg = el("svg", { xmlns: SVG_NS, viewBox: `0 0 ${W} ${H}`, role: "img", "aria-labelledby": "svg-title svg-desc" });
  svg.appendChild(el("title", { id: "svg-title" }, "10 by 7 metre research and AI laboratory floor plan"));
  svg.appendChild(el("desc", { id: "svg-desc" }, "Architectural-style plan showing eight workstations, a central discussion table, presentation display, faculty desk, GPU workstation, equipment bench, storage, doors, windows and services."));
  const defs = el("defs");
  defs.appendChild(el("style", {}, `
    .grid-minor{stroke:#214356;stroke-width:1;opacity:.34}.grid-major{stroke:#315b6b;stroke-width:1.5;opacity:.55}.room-fill{fill:#eef4ef}.outer-wall{fill:none;stroke:#f3f8ef;stroke-width:14}.furniture{fill:#dce9e3;stroke:#18364a;stroke-width:3}.monitor{fill:#173b50;stroke:#0c9da4;stroke-width:2}.chair{fill:none;stroke:#87a49d;stroke-width:3}.table{fill:#d5e2dc;stroke:#17364a;stroke-width:4}.display{fill:#17364d;stroke:#7ce5e8;stroke-width:4}.display-stand,.bench-mark{stroke:#587d82;stroke-width:2}.equipment{fill:#16354a;stroke:#d59b42;stroke-width:2}.equipment-dot{fill:#d59b42}.window{stroke:#7ce5e8;stroke-width:6}.door-gap{stroke:#0b1624;stroke-width:18}.door-leaf,.door-arc{fill:none;stroke:#d59b42;stroke-width:3}.electrical,.lan{fill:#0b1624;stroke:#d59b42;stroke-width:3}.lan{stroke:#7ce5e8}.label,.small-label,.dimension-text,.object-label,.zone-label,.service-label{font-family:Arial,sans-serif;fill:#17364a}.object-label{font-size:12px;font-weight:700;letter-spacing:.4px}.zone-label{font-size:11px;font-weight:800;letter-spacing:1px}.small-label{font-size:10px;letter-spacing:1.5px;fill:#c5e4e3}.service-label{font-size:10px;font-weight:800;fill:#eef9f5}.dimension-line,.dimension-tick{stroke:#7ce5e8;stroke-width:2}.dimension-text{font-size:17px;font-weight:800;fill:#7ce5e8}.label{font-size:12px}.`));
  svg.appendChild(defs); drawGrid(svg); drawDimensions(svg); drawWalls(svg); objects.forEach(obj => drawObject(svg, obj));
  plan.replaceChildren(svg);
}

function serializeSvg() { return new XMLSerializer().serializeToString(plan.querySelector("svg")); }
function download(blob, filename) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
function exportPng() {
  const svgString = serializeSvg(); const image = new Image(); const blob = new Blob([svgString], { type: "image/svg+xml" });
  image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = W * 2; canvas.height = H * 2; const ctx = canvas.getContext("2d"); ctx.fillStyle = "#0b1624"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height); canvas.toBlob(file => download(file, "laboratory-floor-plan.png"), "image/png"); URL.revokeObjectURL(image.src); };
  image.src = URL.createObjectURL(blob);
}

renderPlan();
document.getElementById("room-size").textContent = `${room.width} m × ${room.height} m`;
document.getElementById("workstation-count").textContent = objects.filter(o => o.type === "workstation").length;
document.querySelectorAll("button[data-export]").forEach(button => button.addEventListener("click", () => {
  if (button.dataset.export === "svg") download(new Blob([serializeSvg()], { type: "image/svg+xml" }), "laboratory-floor-plan.svg");
  if (button.dataset.export === "png") exportPng();
  if (button.dataset.export === "print") window.print();
}));
