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
        if (seatData.status === "unavailable") seatBtn.classList.add("unavailable");
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

buildSeats();
markUnavailable([
  "center-1-1", "center-1-2", "center-1-3",
  "left-3-2", "left-3-3",
  "right-5-4",
]);
renderVenue();

const panelInfo = document.getElementById("panel-info");
const addBtn = document.getElementById("add-btn");

function inspectSeat(id) {
  if (inspectedId && seats[inspectedId].status === "inspected") {
    seats[inspectedId].status = "available";
  }

  inspectedId = id;
  const s = seats[id];
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