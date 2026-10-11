const VENUE = {
  name: "Grand Theatre",
  sections: [
    { id: "left",   label: "LEFT",   rows: 6, seatsPerRow: 6, price: 10 },
    { id: "center", label: "CENTER", rows: 6, seatsPerRow: 6, price: 30 },
    { id: "right",  label: "RIGHT",  rows: 6, seatsPerRow: 6, price: 10 },
  ],
};

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

    for (let r = 0; r < section.rows; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";

      for (let s = 0; s < section.seatsPerRow; s++) {
        const seat = document.createElement("button");
        seat.className = "seat";
        seat.textContent = `${section.id[0].toUpperCase()}${r + 1}-${s + 1}`;
        seat.dataset.section = section.id;
        seat.dataset.row = r + 1;
        seat.dataset.col = s + 1;
        seat.dataset.price = section.price;
        rowEl.appendChild(seat);
      }

      sectionEl.appendChild(rowEl);
    }

    venueEl.appendChild(sectionEl);
  });
}

renderVenue();