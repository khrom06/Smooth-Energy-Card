# Smooth Energy Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](https://github.com/khrom06/Smooth-Energy-Card/releases)
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

## Screenshots

> Coming soon

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
solar_power: sensor.shelly_channel_2_power        # Solar production (W or kW)
grid_power: sensor.shelly_channel_1_power          # Grid (negative = exporting)
house_power: sensor.consommation_maison_live       # Total house consumption
v2c_power: sensor.evse_192_168_1_67_puissance_de_charge  # EV charger power

# ─── Electricity price ───────────────────────────────────────
kwh_price: sensor.prix_du_kwh_en_cours             # €/kWh current tariff

# ─── Solar energy stats ──────────────────────────────────────
solar_today: sensor.hoymiles_gateway_solarh_6402640_today_eq  # kWh produced today
solar_forecast_today: sensor.energy_production_today          # kWh forecast today
solar_forecast_tomorrow: sensor.energy_production_tomorrow    # kWh forecast tomorrow

# ─── V2C charger ─────────────────────────────────────────────
v2c_image: /local/images/v2ctrydan-1.png
v2c_session_energy: sensor.energie_v2c_session     # kWh charged this session

# ─── EDF Tempo / tariff alerts (optional) ────────────────────
tempo_color_today: sensor.rte_tempo_couleur_du_jour        # state: "BLEU", "BLANC", "ROUGE"
tempo_color_tomorrow: sensor.rte_tempo_couleur_du_lendemain
price_alert_high: 0.20         # price pill blinks red above this €/kWh
price_alert_low: 0.05          # price pill turns green below this €/kWh

# ─── Daily cost summary (optional) ───────────────────────────
grid_energy_import: sensor.shelly_channel_1_energy          # kWh imported today
grid_energy_export: sensor.shelly_channel_1_energy_returned # kWh exported today
feed_in_rate: 0.1              # export revenue = export_kwh × price × 0.1

# ─── Theme ───────────────────────────────────────────────────
theme: dark                    # "dark" (default) or "light"

# ─── Home Battery / ESS (optional) ───────────────────────────
battery_power: sensor.battery_power   # W or kW — positive = charging, negative = discharging
battery_soc: sensor.battery_soc       # % — battery state of charge (optional)

# ─── Electric vehicles (unlimited) ───────────────────────────
evs:
  - name: Cupra Tavascan
    battery: sensor.cupra_tavascan_battery_level
    range: sensor.cupra_tavascan_electric_range
    image: /local/pycupra/image_VSSZZZKR3RA007706_front_cropped.png
    charging: binary_sensor.cupra_tavascan_charging_state   # optional
    charging_power: sensor.cupra_tavascan_charging_power    # kW — for ETA calc
    target_soc: sensor.cupra_tavascan_target_state_of_charge  # % — optional
    battery_capacity: 77                                    # kWh — for ETA calc

  - name: Fiat 500e
    battery: sensor.fiat_500e_berline_my24_hvbattery_charge
    range: sensor.fiat_500e_berline_my24_driving_range
    image: /local/images/Home/fiat500.jpg
    charging: ''                                            # optional
    charging_rate: sensor.fiat_500e_berline_my24_charging_rate  # %/h — alternative to charging_power
    target_soc: ''                                          # optional
    battery_capacity: 37.3                                  # kWh

# ─── Individual device monitoring ────────────────────────────
devices:
  - name: Climatisation
    entity: sensor.shelly2_channel_1_power
    icon: ac
  - name: Ballon ECS
    entity: sensor.shelly2_channel_2_power
    icon: water
  - name: TV Box
    entity: sensor.salon_tvbox_power
    icon: tv
  - name: Lave-linge
    entity: sensor.machinealaver_power
    icon: washer
  - name: Informatique
    entity: sensor.smart_switch_24022179241609510d0148e1e9ed2d80_power
    icon: computer
  - name: RaspPi
    entity: sensor.tplink_ha_rpi_consommation_actuelle
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

### Device configuration

```yaml
devices:
  - name: My Device       # Display name
    entity: sensor.xxx    # Power sensor (W or kW)
    icon: plug            # Icon name (see below)
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
