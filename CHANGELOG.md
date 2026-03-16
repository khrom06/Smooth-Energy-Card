# Changelog — Smooth Energy Card

All notable changes to this project are documented here.

---

## [v2.5.0] — 2026-03-16

### ✨ New Features
- **EV Solar Charge Planner** (`ev_optimizer` section): replaces the simple charging recommendation with a full planner that reads your `solar_forecast_today` sensor's hourly attributes, computes the best free-solar charging window, and shows per-EV breakdown (kWh needed · free vs. grid cost). Falls back to live surplus/price logic when no forecast data is available.
- **`<details>` collapse fix**: Personal Records and Event Log panels no longer collapse on every HA state update; open/closed state is now preserved across `_patch()` cycles.

---

## [v2.4.0] — 2026-03-14

### ✨ New Features
- **CO₂ intensity badge** (`co2_grid_intensity`): green/amber/red badge showing live grid carbon intensity; lights up when solar keeps you off-grid.
- **Battery State-of-Health bar** (`battery_cycles`, `battery_purchase_date`): progress bar estimating battery health (SoH %) based on charge cycles or age.
- **Live revenue ticker**: pulsing €/h display when exporting to grid (requires `feed_in_rate`).
- **Solcast hourly overlay** (`solar_forecast_today` with hourly attributes): mini SVG bar chart of today's hourly solar forecast.
- **Solar diverter tracker** (`diverter_power`, `diverter_today_kwh`): shows live divert wattage, today's kWh diverted, and estimated savings.
- **Export streak** (`grid_energy_export`): counts consecutive days of net export; glows gold when beating your personal best.
- **Peak-demand heatmap**: 7×24h grid showing your average house consumption by day-of-week and hour (built from localStorage history).
- **Grid outage runway**: when grid disconnected, shows estimated battery runtime countdown.
- **Month-end bill projection**: projects current month's electricity cost based on today's daily average.
- **Heat pump / diverter SVG node**: new node in the energy flow diagram for heat pump or diverter loads.

### 🐛 Bug Fixes
- EV charging cost now shows **grid-only session total** (kWh remaining × grid fraction × price), not a solar-inclusive hourly rate.

---

## [v2.3.2] — 2026-03-13

### 🐛 Bug Fixes
- EV charging cost calculation: split solar vs grid contribution using real-time charger power vs solar production; session total cost now excludes free solar watts.

---

## [v2.3.1] — 2026-03-12

### 🐛 Bug Fixes
- Added all missing default config keys (`hide`, `compact`, `quick_actions`, `monthly_budget`, `grid_connected`, `sunrise_hour`, `sunset_hour`) to `_defaultConfig()`.
- Fixed `total_saved` translation key missing from all 5 language blocks.
- Removed duplicate Theme selector from editor Daily Cost section.
- Fixed `_updateDailyLog` running even when `yday_chips` section was hidden.
- README completely rewritten with full config reference, all features, and changelog table.

---

## [v2.3.0] — 2026-03-11

### ✨ New Features
- **Sun arc fix**: `getSunArc()` now reads `sun.sun` HA entity for accurate local sunrise/sunset times; falls back to `sunrise_hour`/`sunset_hour` config overrides.
- **`hide` array**: hide any card section by ID (e.g. `hide: [devices, forecast, gauge]`).
- **`compact` mode**: single boolean that hides non-essential sections for a minimal card.
- **Savings counter**: running total of €€ saved from solar self-consumption (persisted in localStorage).
- **Quick actions** (`quick_actions`): configurable pill buttons that fire HA services.
- **Yesterday chips**: ↑↓ comparison badges vs previous day for solar, cost, export.
- **Personal Records hall-of-fame**: collapsible `<details>` panel tracking daily bests (solar, export, savings) with localStorage persistence.
- **Event log**: auto-logs key energy events (grid outage, Tempo ROUGE, export record, etc.) with timestamps.
- **CO₂ savings banner**: shows grams/kg of CO₂ avoided from solar self-consumption.
- **Cheapest price window chip**: highlights today's upcoming cheapest tariff slot.

---

## [v2.2.0] — 2026-03-10

### ✨ New Features
- Aurora glow animation on solar node when producing > 3 kW.
- Grid shockwave pulse when importing > 5 kW.
- Smart departure ETA per EV.
- Charging cost display on EV tiles.
- Forecast tomorrow chip.
- Live self-sufficiency percentage gauge.

---

## [v2.1.0] — 2026-03-09

### ✨ New Features
- Aurora glow visual effect on high solar production.
- Grid shockwave animation on high import.
- EV departure time ETA calculation.
- Initial charging cost estimation.

---

## [v2.0.0] — 2026-03-08

### ✨ New Features
- Full visual editor (`SmoothEnergyCardEditor`) with `ha-selector` entity pickers.
- EDF Tempo banner (BLEU/BLANC/ROUGE) with tomorrow preview.
- Smart charging recommendation banner.
- Daily cost summary with import/export kWh.
- Battery/ESS node in SVG energy flow.
- Sparkline mini-charts via HA history API.
- Multiple EV support (unlimited `evs[]` array).
- Device consumption tiles (`devices[]`).
- 5-language i18n (en/fr/es/zh/ja).
- `feed_in_rate` for export revenue calculation.

---

## [v1.x] — 2026-02-xx

### Initial releases
- Single-file vanilla JS custom element for Home Assistant Lovelace.
- SVG energy flow diagram: Solar → House → Grid → V2C.
- Particle animation on energy flows.
- Basic power sensor display with W/kW auto-detection.
- Dark/light theme support.
- HACS compatible.
