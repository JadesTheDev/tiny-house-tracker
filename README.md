# Hearth & Haul — Tiny House Tracker

A materials-first, reclaimed-first tiny house planning dashboard.

## Frontend preview

The responsive prototype lives in [docs/index.html](docs/index.html). It includes:

- 12 house-element cards with individual materials checklists
- Collection progress and spending summaries
- Custom materials with quantities and estimated/actual costs
- Saved secondhand listing links
- Project notes and JSON backup export
- Starter notes reflecting the tiny house design plan

**Important:** The starter materials are planning suggestions, not purchases or confirmed inventory. User changes are stored in that browser's `localStorage` only; they do not sync between devices. Use the JSON export to back up your entries.

## Preview locally

Open `docs/index.html` in a modern browser. No build system or dependencies are required.

## GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/docs**, and save. The published URL should then be:

https://jadesthedev.github.io/tiny-house-tracker/

## Roadmap

1. Review and refine the frontend layout and tracker categories.
2. Improve editing and accessibility, and add import support.
3. Design a database and authentication only after the frontend is approved.
4. Integrate permitted secondhand-marketplace sources and materials search.

Trailer Hunt is a separate repository and has not been modified for this project.
