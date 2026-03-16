# Changelog — Smooth Energy Card

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [2.4.0] — 2026-03-16

### Added
- **Live CO₂ intensity badge** — green/amber/red gCO₂/kWh badge sourced from `co2_grid_intensity` sensor (e.g. Electricity Maps integration)
- **Heat pump / solar diverter SVG node** — optional energy flow node at bottom-right (300,175) for `heat_pump_power` or `diverter_power`; animated particles when active
- **Earned revenue ticker** — pulsing live €/h ticker shown during active solar export, animated glow effect
- **Solcast hourly overlay** — reads hourly forecast attributes from `solar_forecast_today` sensor; overlays expected production curve on solar section
- **Battery State-of-Health estimator** — progress bar showing capacity fade estimation from `battery_cycles` count and `battery_purchase_date`; color-coded green/amber/red
- **Export streak counter** — consecutive days with net solar export; personal best record stored in localStorage
- **Weekly demand heatmap** — 7×24h colour tile grid showing hourly consumption patterns (7-day rolling window, in-memory, also stored in localStorage as `sec-hourly-log`)
- **Solar divert tracker** — daily kWh diverted to hot water / heat pump from `diverter_today_kwh` sensor
- **Enhanced grid outage banner** — battery runway countdown added (hours remaining at current discharge rate)
- **Enhanced monthly budget tracker** — month-end projected bill added to existing daily spend vs budget bar
- **EV grid-only charging cost** — session cost estimate now uses only grid watts (subtracts live solar contribution) — much more accurate; shows "☀️ FREE" when >95% solar powered

### Fixed
- `<details>` panels (Personal Records, Event Log, Weekly Heatmap) no longer collapse on every Home Assistant state update — `_patch()` now preserves `open` attribute before innerHTML replacement

### New config keys
- `co2_grid_intensity` — sensor entity (gCO₂/kWh)
- `heat_pump_power` — sensor entity (W or kW)
- `diverter_power` — sensor entity (W or kW)
- `diverter_today_kwh` — sensor entity (kWh)
- `battery_cycles` — sensor or static number
- `battery_purchase_date` — `YYYY-MM-DD` string

---

## [2.3.2] — 2026-03-16

### Fixed
- EV charging session cost estimate now computes total cost to reach target SoC, not just hourly rate
- Grid fraction applied to session estimate: `kWh remaining × gridFrac × price` — subtracts live solar contribution

---

## [2.3.1] — 2026-03-16

### Fixed
- `_defaultConfig()` now includes all new keys introduced in v2.3.0: `hide`, `compact`, `quick_actions`, `monthly_budget`, `grid_connected`, `sunrise_hour`, `sunset_hour`
- Added missing `total_saved` translation key to all 5 languages (en/fr/es/zh/ja)
- Editor Daily Cost section: removed duplicate Theme selector, replaced with `monthly_budget`, `grid_connected`, `grid_demand_threshold`, `tariff_forecast` fields
- Hide guard added to `_updateDailyLog()` to skip updates when `yday_chips` section is hidden

### Changed
- README completely rewritten with full config reference table (30+ keys), install guide, feature overview, and changelog from v1.0.0 through v2.3.1

---

## [2.3.0] — 2026-03-16

### Added
- **`hide` array config** — any section can be excluded by name: `hide: [devices, forecast, eco_badges, ...]`
- **`compact` mode** — single boolean to hide all secondary sections at once (devices, forecast, eco_badges, power_chart, etc.)
- **Savings counter** — running total of cumulative € saved vs full-grid scenario, with today's contribution; persisted in localStorage
- **Quick actions** — configurable pill buttons in card header for one-tap HA service calls (`quick_actions: [{label, service, entity, data}]`)
- **Yesterday comparison chips** — ↑/↓ chips comparing today's solar and grid vs same time yesterday; stored in daily log
- **Personal records hall of fame** — tracks best solar day, best export day, longest streak, lowest cost day; collapsible `<details>` panel
- **Event log** — timestamped log of significant energy events (solar peak, export record, EV started charging, etc.); collapsible `<details>` panel; capped at 50 entries in localStorage
- **CO₂ banner** — estimated CO₂ avoided today based on solar self-consumption and configurable grid intensity
- **Cheapest price window chip** — shows the cheapest upcoming hour band when `kwh_price` sensor has upcoming attribute data

### Fixed
- `getSunArc()` now accepts `(hass, config)` and reads `sun.sun` entity attributes for accurate local sunrise/sunset times; falls back to `sunrise_hour`/`sunset_hour` config, then hardcoded 6–21

---

## [2.2.0] — 2026-03-16

### Added
- ⛈️ **Thunderstorm effect** — SVG storm cloud + animated rain streaks + flickering lightning bolt when grid import > 3000W or price ≥ `price_alert_high`
- 🌊 **Battery water fill** — animated sinusoidal wave inside battery orb; height = SoC%, color red→amber→green
- 🕸️ **Node gossip lines** — faint dashed animated lines connecting all nodes when everything is idle (<50W on all flows)
- 🚀 **EV warp speed** — translucent scrolling vertical lines behind charging EV cards
- 🌅 **Sky gradient background** — card background shifts through real sky colors keyed to time of day
- 🎆 **Export fireworks** — when daily export sets a new all-time record: 3 SVG burst rings + 22 CSS particles from grid orb (once per record, localStorage-backed)
- **Grid outage / islanding banner** — amber pulsing banner when `grid_connected` binary_sensor = `off`
- **Monthly budget tracker** — `monthly_budget` config key; shows spent/budget bar with projected month-end cost
- **Device anomaly detection** — Welford's online algorithm per-device per-hour in localStorage; red dot badge when consumption > mean + 2σ
- **Stacked area power chart** — rolling 180-sample in-memory SVG chart (solar, import, export, house)

### New config keys
- `grid_connected` — binary_sensor entity
- `monthly_budget` — number (€/month)

---

## [2.1.0] — 2026-03-16

### Added
- 🌈 **Aurora glow** — cycling colour-wave box-shadow when solar self-sufficiency ≥ 80%
- ⚡ **Grid shockwave** — 3 expanding SVG rings from grid orb on import→export transition
- 🚗 **Departure ETA pill** — per-EV `departure_time` entity; shows ✓ HH:MM (green) or ⚠️ HH:MM (red pulsing) depending on charge readiness

### Fixed
- Charging cost correctly computed from `v2cW` when `chargerActive` fallback fires (no `charging:` sensor)

---

## [2.0.1] — 2026-03-16

### Fixed
- Device SVG node no longer overlaps V2C charger orb — x-position nudged ±42px when within 34px of V2C column

---

## [2.0.0] — 2026-03-16

### Added
- 🫀 **House breathing pulse** — orb ring expands and fades; speed and colour scale with live consumption (blue 3.2s at standby → red 0.65s at 4 kW+)
- ⚡ **EV charging lightning storm** — plasma cable (blurred glow) + procedural SVG lightning bolts alongside cable while charging
- 🔌 **Charger SVG node from `chargers[]`** — V2C orb visible when using the new `chargers` array config (not only legacy `v2c_power`)

---

## [1.9.4] — 2026-03-16

### Added
- Tap any energy orb (Solar / House / Grid) → inline detail panel: current W, 6h trend arrow, sparkline, min/max/avg
- ⛶ Fullscreen button in card header: card expands to viewport via `position:fixed` on `:host`

---

## [1.9.3] — 2026-03-16

### Added
- History sparklines drawn inside Solar, House and Grid SVG orbs (clipped to circle); reuses existing sparkline fetch data

---

## [1.9.2] — 2026-03-16

### Added
- Gradient flow tracks: all energy paths use `linearGradient` (yellow→blue solar, red→blue import, etc.)
- Day progress arc: golden arc around Solar orb = solarToday / forecastToday %
- Glassmorphism orb rims: frosted glass white rim on all main orbs
- ETA spin ring: spinning teal segment on battery gauge ring while EV charging
- Grid stress indicator: pulsing red ring on Grid orb when import > 2000W (amber > 1000W)

---

## [1.9.1] — 2026-03-16

### Fixed
- Cable animation includes `chargers[]` entries (not only legacy `v2c_power`)
- ⚡ charging badge shows even when EV has no image (`charging-badge-solo` pill)

### Added
- Live charging cost on EV card: `~X.XXX €/h` from `charging_power × kwh_price`

---

## [1.9.0] — 2026-03-16

### Added
- Particle pulse intensity: speed + density scales with wattage; dual spawn above 2000W
- Battery shimmer: green glow + pulse when charging, amber pulse when discharging
- Solar burst: radial SVG rings burst when solar crosses a new daily peak
- Night mode: Solar orb turns indigo/purple + 🌙 icon + moon-pulse animation after sunset

---

## [1.8.0–1.8.6] — 2026-03-15/16

### Added
- v1.8.0: WOW effects — export streak, peak flash, ambient glow, eclipse shadow, laser blend
- v1.8.0: Weather-reactive background using weather entity cloud cover
- v1.8.1: WebSocket subscription for weather forecast (HA 2023.9+)

### Fixed
- v1.8.2: Entity picker values corrected; split weather config fields
- v1.8.3: Editor entity pickers switched to `ha-selector` for correct autocomplete
- v1.8.4: Removed hardcoded personal sensor defaults from `_defaultConfig()`
- v1.8.5: V2C node hidden when not configured; dedicated Weather editor section
- v1.8.6: Legacy V2C Charger editor section removed; renamed to Chargers

---

## [1.6.0] — 2026-03-15

### Added
- Full internationalisation (i18n) — 5 languages: English, French, Spanish, Chinese, Japanese
- `TRANSLATIONS` constant with flat string/function values per language
- `getLang(hass, config)` — resolves: config `language` key → `hass.language` prefix → fallback `en`
- `tr(hass, config, key, ...args)` — global helper; `_t(key, ...args)` — class shorthand
- All visible UI strings translated (node labels, stat tiles, banners, EV tooltips, costs, clipboard toasts)
- Language selector in editor General section (`auto` / `en` / `fr` / `es` / `zh` / `ja`)

---

## [1.5.4–1.5.6] — 2026-03-15

### Added
- v1.5.4: V2G bi-directional charging — reversed particle path (V2C → House) + "Discharging to home" label

### Fixed
- v1.5.5: Daily cost summary no longer uses cumulative lifetime sensor as daily value — defaults cleared to `''`; sanity guard rejects values > 300 kWh/day
- v1.5.6: SVG orb text always white with drop-shadow — fixes unreadable yellow-on-yellow / blue-on-blue text

---

## [1.5.3] — 2026-03-15

### Added
- Sun arc in energy flow SVG — quadratic bezier arc + moving sun dot keyed to current local time (6:00–21:00 window); suppressed at night

---

## [1.5.2] — 2026-03-15

### Added
- Smart charging recommendation engine (`getChargingReco`) — context-aware priority banner above EV section: FREE solar / surplus available / ROUGE warning / BLEU opportunity / cheap tariff / expensive tariff

---

## [1.5.1] — 2026-03-15

### Added
- Solar self-sufficiency gauge — 270° arc SVG gauge; daily mode (kWh sensors) or live fallback; green ≥70%, amber ≥30%, red <30%; animated 1.2s transition

---

## [1.5.0] — 2026-03-15

### Added
- 3D orb nodes: radialGradient (cx=34%, cy=28%) depth illusion on all SVG nodes
- Specular highlight dot on every node
- Glassmorphism: `backdrop-filter: blur` on stat, EV, device, and daily-summary tiles
- HUD background: animated grid + radial ambient glows via `.card-hud`

---

## [1.4.2] — 2026-03-14

### Added
- 📋 Share button in card header — copies formatted energy state text to clipboard; toast confirmation

---

## [1.4.1] — 2026-03-14

### Added
- Per-device `alert_above` threshold (W) — device tile pulses red when exceeded
- `devices_sort: true` — sorts devices by live consumption, highest first; rank badge (#1, #2…) shown

---

## [1.4.0] — 2026-03-14

### Added
- Battery/ESS SVG node (bottom-left, position 58,175, R=26) with animated charge/discharge particles
- New config: `battery_power` (positive = charging, negative = discharging), `battery_soc`
- Node only shown when `battery_power` or `battery_soc` is configured

---

## [1.3.0] — 2026-03-14

### Added
- EDF Tempo banner — color-coded daily tariff (BLEU/BLANC/ROUGE) with red day pulsing animation
- Daily cost/savings summary — grid cost, solar savings, export revenue tiles
- Price alert thresholds — price pill blinks red above `price_alert_high`, turns green below `price_alert_low`
- Light theme — full light mode palette via `theme: light`
- Sparkline mini charts — 6h history in Solar Today and Grid tiles (throttled 5-minute API calls)
- Tap-to-more-info — tap EV cards, charger, device tiles → HA entity popup
- New editor sections: Tempo, Daily Summary, Alerts, Theme

---

## [1.2.1] — 2026-03-13

### Added
- Animated bezier charging cable between V2C charger and charging EV
- Prominent cost display on charger card: FREE ☀️ / mixed / grid-only
- CSS hover tooltips on all key values
- Auto-migrates legacy `ev1_*`/`ev2_*` config keys to `evs[]` array

---

## [1.2.0] — 2026-03-13

### Added
- Full visual config editor with `ha-entity-picker` (entity autocomplete)
- EV config migrated to `evs[]` array — supports unlimited EVs
- Dynamic add/remove EVs and smart plug devices from the editor UI

---

## [1.1.0] — 2026-03-12

### Added
- V2C charger: pulsing border, animated gradient bar, SVG ring pulse
- EV charging: pulsing green border, green battery ring
- ETA to charge goal pill (supports kW sensor and %/h sensor)
- Charging cost breakdown in charger card (solar vs grid contribution)
- Target SoC arc on battery ring gauge

---

## [1.0.0] — 2026-03-11

### Added
- Animated SVG energy flow (Solar → House → Grid → V2C) with flowing particle dots
- EV battery ring gauges (unlimited EVs via `evs[]` array)
- V2C charger card with live power display
- Device consumption grid (smart plug tiles)
- Stats row: solar today, forecast, grid direction, hourly cost
- Solar surplus banner
- Solar forecast row (today + tomorrow)
- HACS compatibility (`hacs.json`, GitHub Actions release workflow)
