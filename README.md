# Interactive Venue Ticketing System

A front-end ticket-selection app for a theatre venue. Built with HTML, CSS, and JavaScript.

## Features

- Theatre venue with three sections (Left, Center, Right) and 108 dynamically generated seats
- Two price categories: $10 (Left, Right) and $30 (Center)
- Seat inspection before adding to cart - clicking a seat shows its details and price
- Four seat states: available, inspected, in-cart, unavailable
- Cart with add, remove, per-seat pricing, and live total
- Duplicate prevention - a seat cannot be added twice
- Map and cart stay in sync (removing a ticket updates the seat on the map)
- Zoom in / out, four-direction panning, and reset controls
- Bonus: mouse-wheel zoom and click-and-drag panning
- Cart and seat states persisted in `localStorage` and restored on refresh
- Responsive layout for narrow screens

## How to Run

No build step or dependencies. Just open `index.html` in a browser, or use VS Code's Live Server extension.

## Project Structure

- `index.html` - page structure (venue container, inspection panel, cart, nav controls)
- `style.css` - layout, seat states, responsive rules
- `script.js` - venue data model, seat generation, inspection, cart, persistence, navigation

## Seat ID Format

Each seat has an ID like `left-3-2` = section `left`, row `3`, column `2`. Used throughout the code for lookups, cart entries, and `localStorage`.

## Notes

- Some seats are pre-marked as unavailable (simulating sold seats).
- No backend, database, or payment processing - everything runs client-side.

## Author

Masud Eyubov