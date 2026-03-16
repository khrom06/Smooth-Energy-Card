# Smooth Energy Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![Version](https://img.shields.io/badge/version-1.9.0-blue.svg)](https://github.com/khrom06/Smooth-Energy-Card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A beautiful, animated Home Assistant Lovelace card for visualizing your home energy in real-time.

## Features

- **Animated energy flow** — Real-time SVG with flowing particles showing solar → house → grid direction
- **Solar production** — Current power, today's yield, and solar forecast
- **Grid monitoring** — Bidirectional: tracks import and export (selling back to grid)
- **EV Charger (V2C)** — Live charging power display
- **Electric vehicles** — Battery % ring gauge + range for two EVs (Cupra Tavascan & Fiat 500e by default)
- **Smart plug devices** — Individual device consumption tiles
- **Electricity cost** — Live cost estimate per hour using your current tariff sensor
- **Solar surplus** — Highlights available surplus power
- **Solar forecast** — Shows predicted production for today & tomorrow
- **EDF Tempo banner** — Color-coded daily tariff indicator (BLEU/BLANC/ROUGE)
- **Daily cost/savings summary** — Today's grid cost, solar savings, and export revenue
- **Price alerts** — Price pill blinks red above a high threshold, turns green below a low threshold
- **Light theme** — Clean light mode via `theme: light` config option
- **Sparkline charts** — Mini 6-hour history charts in Solar Today and Grid stat tiles
- **Tap to more-info** — Tap any EV card, charger, or device tile to open the HA entity popup
- **Home battery node** — Battery/ESS shown in energy flow with charge/discharge direction and SoC%
- **Device alerts & ranking** — Per-device alert threshold (border pulses red), optional sort by consumption
- **Copy to clipboard** — One-click copy of current energy state as formatted text (EV status, costs, solar, etc.)
- **3D orb nodes** — Energy flow nodes rendered as glowing 3D spheres with specular highlights
- **Glassmorphism UI** — Frosted glass blur effect on all stat and EV tiles
- **HUD texture** — Animated grid background gives the card a real control-panel feel
- **Self-sufficiency gauge** — Circular arc gauge showing % of consumption covered by solar
- **Smart charging recommendation** — Contextual advice based on Tempo color, solar surplus, and pricing
- **Sun arc** — Animated sun position arc in the energy flow diagram, tracks daylight hours
- **V2G support** — Detects negative charger power and shows reverse energy flow (EV→home)
- **Multilingual** — Full UI in English, French, Spanish, Chinese (Simplified) and Japanese. Auto-detects HA language, or set manually via `language` config key

## Preview

<p align="center">
  <img src="docs/preview.png" alt="Smooth Energy Card live preview" width="375">
</p>

> Live card — solar production, animated energy flow, EV battery gauges, self-sufficiency arc, daily cost summary and smart charging recommendations.

## Installation

### Via HACS (Recommended)

1. Open **HACS** → **Frontend**
2. Click the **⋮ menu** → **Custom repositories**
3. Add `https://github.com/khrom06/Smooth-Energy-Card` as a **Lovelace** repository
4. Find **Smooth Energy Card** in the list and click **Download**
5. Reload your browser

### Manual installation

1. Download `smooth-energy-card.js` from the [latest release](https://github.com/khrom06/Smooth-Energy-Card/releases/latest)
2. Copy it to `config/www/community/smooth-energy-card/smooth-energy-card.js`
3. In Home Assistant: **Settings → Dashboards → Resources** → Add resource:
   - URL: `/local/community/smooth-energy-card/smooth-energy-card.js`
   - Type: **JavaScript Module**
4. Reload your browser

## Configuration

Add this to your Lovelace dashboard (YAML mode):

```yaml
type: custom:smooth-energy-card
title: Energy Dashboard

# ─── Power sensors ───────────────────────────────────────────
solar_power: sensor.your_solar_power          # Solar production (W or kW)
grid_power: sensor.your_grid_power            # Grid (negative = exporting)
house_power: sensor.your_house_power          # Total house consumption

# ─── Electricity price ───────────────────────────────────────
kwh_price: sensor.your_kwh_price              # €/kWh current tariff

# ─── Solar energy stats ──────────────────────────────────────
solar_today: sensor.your_solar_today          # kWh produced today
solar_forecast_today: sensor.your_forecast_today       # kWh forecast today
solar_forecast_tomorrow: sensor.your_forecast_tomorrow # kWh forecast tomorrow

# ─── EDF Tempo / tariff alerts (optional) ────────────────────
tempo_color_today: sensor.your_tempo_today    # state: "BLEU", "BLANC", "ROUGE"
tempo_color_tomorrow: sensor.your_tempo_tomorrow
price_alert_high: 0.20         # price pill blinks red above this €/kWh
price_alert_low: 0.05          # price pill turns green below this €/kWh

# ─── Daily cost summary (optional) ───────────────────────────
grid_energy_import: sensor.your_grid_import   # kWh imported today (daily reset)
grid_energy_export: sensor.your_grid_export   # kWh exported today (daily reset)
feed_in_rate: 0.1              # export revenue = export_kwh × price × feed_in_rate
monthly_budget: 150            # € — shows monthly burn-rate bar with projected cost

# ─── Grid connectivity (optional, for islanding detection) ────
grid_connected: binary_sensor.your_grid_status  # off = grid offline → islanding banner

# ─── Theme ───────────────────────────────────────────────────
theme: dark                    # "dark" (default) or "light"

# ─── Home Battery / ESS (optional) ───────────────────────────
battery_power: sensor.your_battery_power      # W or kW — positive = charging, negative = discharging
battery_soc: sensor.your_battery_soc          # % — battery state of charge

# ─── Electric vehicles (unlimited) ───────────────────────────
evs:
  - name: My EV
    battery: sensor.your_ev_battery           # %
    range: sensor.your_ev_range               # km
    image: /local/images/my_ev.png            # optional
    charging: binary_sensor.your_ev_charging  # optional
    charging_power: sensor.your_ev_charging_power  # kW — for ETA calc
    target_soc: sensor.your_ev_target_soc     # % — optional
    battery_capacity: 77                      # kWh — for ETA calc

  - name: My Second EV
    battery: sensor.your_ev2_battery          # %
    range: sensor.your_ev2_range              # km
    image: /local/images/my_ev2.png           # optional
    charging_rate: sensor.your_ev2_charging_rate  # %/h — alternative to charging_power
    battery_capacity: 40                      # kWh

# ─── Individual device monitoring ────────────────────────────
devices:
  - name: Air Conditioning
    entity: sensor.your_ac_power
    icon: ac
  - name: Water Heater
    entity: sensor.your_water_heater_power
    icon: water
  - name: TV
    entity: sensor.your_tv_power
    icon: tv
  - name: Washing Machine
    entity: sensor.your_washer_power
    icon: washer
  - name: Computer
    entity: sensor.your_computer_power
    icon: computer
  - name: Server
    entity: sensor.your_server_power
    icon: server
```

> **Note:** The old flat `ev1_*` / `ev2_*` keys are still accepted and auto-migrated to the `evs[]` format on load.

## Configuration options

### Top-level keys

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Card title (default: `Energy Dashboard`) |
| `solar_power` | entity | Solar production sensor (W or kW) |
| `grid_power` | entity | Grid power sensor — **negative value = exporting** |
| `house_power` | entity | Total house consumption (W or kW) |
| `v2c_power` | entity | EV charger power (W or kW) |
| `kwh_price` | entity | Current electricity price (€/kWh) |
| `solar_today` | entity | Energy produced today (kWh) |
| `solar_forecast_today` | entity | Predicted production today (kWh) |
| `solar_forecast_tomorrow` | entity | Predicted production tomorrow (kWh) |
| `v2c_image` | string | Image URL for EV charger (optional) |
| `v2c_session_energy` | entity | Energy charged this session (kWh, optional) |
| `tempo_color_today` | entity | EDF Tempo color today — state: `BLUE`/`WHITE`/`RED` or French equivalents (optional) |
| `tempo_color_tomorrow` | entity | EDF Tempo color tomorrow (optional) |
| `grid_energy_import` | entity | Grid energy imported today (kWh) — for daily cost summary |
| `grid_energy_export` | entity | Grid energy exported today (kWh) — for daily summary |
| `feed_in_rate` | number | Feed-in rate as fraction of import price (e.g. `0.1` = 10%). Set `0` to hide revenue tile. |
| `price_alert_high` | number | Price pill blinks red when price ≥ this value (€/kWh, optional) |
| `price_alert_low` | number | Price pill turns green when price ≤ this value (€/kWh, optional) |
| `theme` | string | `dark` (default) or `light` |
| `battery_power` | entity | Battery/ESS power sensor (W or kW) — **positive = charging, negative = discharging** |
| `battery_soc` | entity | Battery state of charge sensor (%) — optional |
| `devices_sort` | boolean | Sort device tiles by live consumption descending (default: `false`) |
| `language` | string | `auto` (default), `en`, `fr`, `es`, `zh`, `ja` |
| `evs` | list | List of electric vehicles (see below) |
| `devices` | list | List of device monitors (see below) |

### EV entry (`evs[]`)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `battery` | entity | Battery level (%) |
| `range` | entity | Estimated range (km) |
| `image` | string | Image URL (optional) |
| `charging` | entity | Charging state sensor — `binary_sensor.*` (optional) |
| `charging_power` | entity | Charging power sensor (kW) — used for ETA calculation |
| `charging_rate` | entity | Charging rate sensor (%/h) — alternative to `charging_power` |
| `target_soc` | entity | Target state of charge sensor (%) — shows arc on gauge (optional) |
| `battery_capacity` | number | Battery capacity in kWh — required for ETA when using `charging_power` |
| `departure_time` | entity | Time/datetime sensor whose state contains `"HH:MM"` — card shows ✓ 07:30 (green) or ⚠️ 07:30 (red pulsing) depending on whether charge ETA fits before the deadline |

### Device configuration

```yaml
devices:
  - name: My Device       # Display name
    entity: sensor.xxx    # Power sensor (W or kW)
    icon: plug            # Icon name (see below)
    alert_above: 2000     # Optional — device border pulses red above this wattage
```

**Available icons:** `ac`, `water`, `tv`, `washer`, `computer`, `server`, `plug`, `bolt`, `car`

## Grid power convention

The card assumes that **negative grid power = selling to grid** (net metering convention).
This matches Shelly EM in standard configuration. If your setup uses the opposite convention, invert your sensor value in a Home Assistant template sensor.

## Supported sensor units

- Power sensors: `W` or `kW` (auto-detected)
- Energy sensors: `kWh`
- Price: `€/kWh`
- Battery: `%`
- Range: `km`

## Changelog

### v1.6.0 (2026-03-15)
- Full internationalization (i18n): English, French, Spanish, Chinese (Simplified), Japanese
- Auto-detects Home Assistant interface language (`hass.language`), or set manually via `language` config key
- Language selector dropdown added to the visual config editor (General section)
- All UI strings translated: node labels, stat tiles, EV tooltips, banners, cost display, recommendations, clipboard toasts

### v1.5.4 (2026-03-15)
- V2G bi-directional charging: detects negative charger power (v2cW < -10W) as EV→home discharge
- Reverse energy flow particles in SVG diagram when V2G is active
- Charger card and SVG node update to show "▲ V2G" label and green color during discharge
- Charging cable hidden during V2G (no cable drawn from charger to EV when discharging)

### v1.5.3 (2026-03-15)
- Animated sun position arc overlaid on the energy flow SVG
- Bezier arc from sunrise (6:00) to sunset (21:00) with dashed stroke
- Moving sun dot with golden/orange color shift and drop shadow glow — brighter at noon

### v1.5.2 (2026-03-15)
- Smart charging recommendation engine with contextual banner above EV section
- Detects: free solar charging, solar surplus, EDF Tempo ROUGE/BLEU, price alert thresholds
- Color-coded banners (green = free/good, blue = good opportunity, yellow = info, red = warning)

### v1.5.1 (2026-03-15)
- Solar self-sufficiency gauge: circular arc SVG widget showing % of consumption covered by solar
- Daily mode (when export data available): shows solar self-consumed vs total consumption
- Live mode fallback: real-time ratio of solar to total load
- Color-coded: green ≥70%, yellow ≥30%, red <30%

### v1.5.0 (2026-03-15)
- 3D orb nodes in energy flow SVG: each node uses a radialGradient for depth, with specular highlight dot
- Glassmorphism tiles: `backdrop-filter: blur()` on all stat, EV, device, and daily-summary tiles
- HUD background texture: animated repeating grid lines + radial ambient glows on card background

### v1.4.2 (2026-03-15)
- 📋 Share button in card header — copies formatted energy state snapshot to clipboard
- Snapshot includes: solar, house, grid, battery, V2C, all EV states, costs, solar today, surplus
- Toast notification confirms copy or warns if clipboard API is unavailable (non-HTTPS)

### v1.4.1 (2026-03-15)
- Per-device `alert_above` threshold (W): device tile border pulses red when power exceeds the threshold
- New `devices_sort: true` config option to rank devices by live consumption (highest first)
- Rank badge (#1, #2…) shown on device tiles when sorting is active
- Device tooltips include alert warning text when threshold is exceeded

### v1.4.0 (2026-03-15)
- Home battery / ESS node in the SVG energy flow diagram (bottom-left position)
- Shows battery SoC%, charge direction (+W charging / W discharging) and animated particles
- New config keys: `battery_power` (positive = charging, negative = discharging) and `battery_soc`
- Editor section: 🔋 Home Battery / ESS

### v1.3.0 (2026-03-15)
- EDF Tempo banner: color-coded daily tariff indicator (BLEU / BLANC / ROUGE) with pulsing red animation
- Daily cost/savings summary: 3-tile grid showing today's grid cost, solar savings, and export revenue
- Price alert thresholds: price pill blinks red above `price_alert_high`, turns green below `price_alert_low`
- Light theme: full light mode palette via `theme: light` config key
- Sparkline mini charts: 6-hour history area+line charts in Solar Today and Grid stat tiles
- Tap-to-more-info: clicking EV cards, charger, or device tiles opens the HA entity detail popup
- New config editor sections for EDF Tempo, daily summary, alerts, and theme

### v1.2.1 (2026-03-15)
- Animated bezier charging cable between V2C charger and charging EV
- Prominent cost display on charger card: FREE ☀️ / mixed / grid-only
- CSS hover tooltips on all key values (stats, battery rings, ETA pills)
- Config backward-compatible: auto-migrates legacy `ev1_*`/`ev2_*` keys to `evs[]` array

### v1.2.0 (2026-03-15)
- Full visual config editor with `ha-entity-picker` (entity autocomplete)
- EV config migrated to `evs[]` array — supports unlimited EVs
- Dynamic add/remove EVs and smart plug devices from the editor

### v1.1.0 (2026-03-15)
- V2C charger animations: pulsing border, animated gradient bar, SVG ring pulse
- EV charging animations: green pulsing border, CHG badge, green battery ring
- ETA to charge goal pill (supports kW and %/h charging rate sensors)
- Charging cost breakdown in charger card (solar vs grid contribution)
- Target SoC arc on battery ring gauge

### v1.0.0 (2026-03-15)
- Initial release
- Animated SVG energy flow with particle effects
- Solar, grid, house, and V2C tracking
- Dual EV battery ring gauges with car images
- Smart plug device grid
- Electricity cost estimation
- Solar production forecast

## Contributing

Pull requests welcome! Please open an issue first to discuss major changes.

## License

MIT © 2026

---

*Built with ❤️ for Home Assistant*
