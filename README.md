# Smooth Energy Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/roualin/Smooth-Energy-Card/releases)
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

## Screenshots

> Coming soon

## Installation

### Via HACS (Recommended)

1. Open **HACS** → **Frontend**
2. Click the **⋮ menu** → **Custom repositories**
3. Add `https://github.com/roualin/Smooth-Energy-Card` as a **Lovelace** repository
4. Find **Smooth Energy Card** in the list and click **Download**
5. Reload your browser

### Manual installation

1. Download `smooth-energy-card.js` from the [latest release](https://github.com/roualin/Smooth-Energy-Card/releases/latest)
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

# ─── Electric Vehicle 1 (Cupra Tavascan) ────────────────────
ev1_name: Cupra Tavascan
ev1_battery: sensor.cupra_tavascan_battery_level
ev1_range: sensor.cupra_tavascan_electric_range
ev1_image: /local/pycupra/image_VSSZZZKR3RA007706_front_cropped.png

# ─── Electric Vehicle 2 (Fiat 500e) ─────────────────────────
ev2_name: Fiat 500e
ev2_battery: sensor.fiat_500e_berline_my24_hvbattery_charge
ev2_range: sensor.fiat_500e_berline_my24_driving_range
ev2_image: /local/images/Home/fiat500.jpg

# ─── V2C charger image ───────────────────────────────────────
v2c_image: /local/images/v2ctrydan-1.png

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

## Configuration options

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
| `ev1_name` | string | Name of first EV |
| `ev1_battery` | entity | Battery % of first EV |
| `ev1_range` | entity | Estimated range of first EV (km) |
| `ev1_image` | string | Image URL for first EV (optional) |
| `ev2_name` | string | Name of second EV |
| `ev2_battery` | entity | Battery % of second EV |
| `ev2_range` | entity | Estimated range of second EV (km) |
| `ev2_image` | string | Image URL for second EV (optional) |
| `v2c_image` | string | Image URL for EV charger (optional) |
| `devices` | list | List of device monitors (see below) |

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
