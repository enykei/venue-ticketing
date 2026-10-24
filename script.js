const VENUE = {
  name: "Grand Theatre",
  sections: [
    { id: "left",   label: "LEFT",   rows: 6, seatsPerRow: 6, price: 10 },
    { id: "center", label: "CENTER", rows: 6, seatsPerRow: 6, price: 30 },
    { id: "right",  label: "RIGHT",  rows: 6, seatsPerRow: 6, price: 10 },
  ],
};

const seats = {};   

let inspectedId = null;   
let cart = [];

const view = { scale: 1, x: 0, y: 0 };
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const PAN_STEP = 40;
const ZOOM_STEP = 0.15;

const STORAGE_KEY = "venue-cart";

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const ids = JSON.parse(raw);
    cart = ids.filter((id) => seats[id]);  // ignore stale IDs
    cart.forEach((id) => { seats[id].status = "in-cart"; });
  } catch {
    cart = [];
  }
}

function buildSeats() {
  VENUE.sections.forEach((section) => {
    for (let r = 1; r <= section.rows; r++) {
      for (let s = 1; s <= section.seatsPerRow; s++) {
        const id = `${section.id}-${r}-${s}`;
        seats[id] = {
          id,
          section: section.id,
          row: r,
          col: s,
          price: section.price,
          status: "available",   
        };
      }
    }
  });
}

function markUnavailable(seatIds) {
  seatIds.forEach((id) => {
    if (seats[id]) seats[id].status = "unavailable";
  });
}

const venueEl = document.getElementById("venue");

function renderVenue() {
  venueEl.innerHTML = "";

  VENUE.sections.forEach((section) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "section";

    const labelEl = document.createElement("div");
    labelEl.className = "section-label";
    labelEl.textContent = `${section.label} — $${section.price}`;
    sectionEl.appendChild(labelEl);

    for (let r = 1; r <= section.rows; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";

      for (let s = 1; s <= section.seatsPerRow; s++) {
        const id = `${section.id}-${r}-${s}`;
        const seatData = seats[id];

        const seatBtn = document.createElement("button");
        seatBtn.className = "seat";
        if (seatData.status !== "available") seatBtn.classList.add(seatData.status);
        seatBtn.textContent = `${section.id[0].toUpperCase()}${r}-${s}`;
        seatBtn.dataset.id = id;
        seatBtn.disabled = seatData.status === "unavailable";

        rowEl.appendChild(seatBtn);
      }

      sectionEl.appendChild(rowEl);
    }

    venueEl.appendChild(sectionEl);
  });
}

const panelInfo = document.getElementById("panel-info");
const addBtn = document.getElementById("add-btn");

function inspectSeat(id) {
  const s = seats[id];
  if (s.status === "in-cart" || s.status === "unavailable") return;

  if (inspectedId && seats[inspectedId].status === "inspected") {
    seats[inspectedId].status = "available";
  }

  inspectedId = id;
  s.status = "inspected";

  panelInfo.innerHTML =
    `<strong>${id.toUpperCase()}</strong><br>` +
    `Section: ${s.section}<br>` +
    `Row ${s.row}, Seat ${s.col}<br>` +
    `Price: $${s.price}`;

  addBtn.disabled = false;
  renderVenue();
}

venueEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".seat");
  if (!btn || btn.disabled) return;
  inspectSeat(btn.dataset.id);
});

//  ADD TO CART 
addBtn.addEventListener("click", () => {
  if (!inspectedId) return;

  const id = inspectedId;
  const s = seats[id];

  if (cart.includes(id)) return;

  cart.push(id);
  saveCart();
  s.status = "in-cart";

  inspectedId = null;
  panelInfo.textContent = "Click a seat to inspect it.";
  addBtn.disabled = true;

  renderCart();
  renderVenue();
});

// ---------- CART UI ----------
const cartListEl = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");

function renderCart() {
  cartListEl.innerHTML = "";

  cart.forEach((id) => {
    const s = seats[id];
    const li = document.createElement("li");

    li.innerHTML =
      `<span>${id.toUpperCase()} — $${s.price}</span>` +
      `<button data-remove="${id}">Remove</button>`;

    cartListEl.appendChild(li);
  });

  const total = cart.reduce((sum, id) => sum + seats[id].price, 0);
  cartTotalEl.textContent = total;
}

cartListEl.addEventListener("click", (e) => {
  const id = e.target.dataset.remove;
  if (!id) return;
  removeFromCart(id);
});

function removeFromCart(id) {
  cart = cart.filter((x) => x !== id);
  saveCart();
  if (seats[id]) seats[id].status = "available";
  renderCart();
  renderVenue();
}

buildSeats();
markUnavailable([
  "center-1-1", "center-1-2", "center-1-3",
  "left-3-2", "left-3-3",
  "right-5-4",
]);
loadCart();
renderVenue();
renderCart();

// ---------- NAVIGATION ----------
function applyView() {
  venueEl.style.transform =
    `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}

document.querySelector(".controls").addEventListener("click", (e) => {
  const action = e.target.dataset.nav;
  if (!action) return;

  if (action === "zoom-in")  view.scale = Math.min(MAX_SCALE, view.scale + ZOOM_STEP);
  if (action === "zoom-out") view.scale = Math.max(MIN_SCALE, view.scale - ZOOM_STEP);
  if (action === "up")       view.y -= PAN_STEP;
  if (action === "down")     view.y += PAN_STEP;
  if (action === "left")     view.x -= PAN_STEP;
  if (action === "right")    view.x += PAN_STEP;
  if (action === "reset")    { view.scale = 1; view.x = 0; view.y = 0; }

  applyView();
});