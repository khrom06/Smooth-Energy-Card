/**
 * Smooth Energy Card v1.0.0
 * A beautiful animated energy monitoring card for Home Assistant.
 * Displays solar production, grid import/export, EV charging, and device consumption.
 *
 * @license MIT
 * @version 1.0.0
 */

const VERSION = '1.0.0';

// ─── Utilities ────────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const round1 = v => Math.round(v * 10) / 10;

function fmtW(w) {
  if (w == null || isNaN(w)) return '—';
  const abs = Math.abs(w);
  if (abs >= 1000) return (w / 1000).toFixed(2) + ' kW';
  return Math.round(w) + ' W';
}
function fmtKwh(v) {
  if (v == null || isNaN(v) || v === 0) return '—';
  return round1(v) + ' kWh';
}
function fmtEur(v) {
  if (v == null || isNaN(v)) return '—';
  const abs = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  return sign + abs.toFixed(2) + ' €';
}

function haState(hass, entity) {
  return hass && entity ? hass.states[entity] || null : null;
}
function numState(hass, entity, fallback) {
  const s = haState(hass, entity);
  if (!s || s.state === 'unavailable' || s.state === 'unknown') return fallback !== undefined ? fallback : 0;
  const v = parseFloat(s.state);
  return isNaN(v) ? (fallback !== undefined ? fallback : 0) : v;
}
function unitOf(hass, entity) {
  const s = haState(hass, entity);
  return s ? (s.attributes.unit_of_measurement || '') : '';
}
function toWatts(hass, entity) {
  const v = numState(hass, entity);
  const u = unitOf(hass, entity);
  if (u === 'kW') return v * 1000;
  return v;
}
function strState(hass, entity) {
  const s = haState(hass, entity);
  return s ? s.state : 'unknown';
}

// ─── SVG Icon library ─────────────────────────────────────────────────────────
const SVG_ICONS = {
  sun: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zM3 11h2a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm16 0h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2zM12 19a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4.22 4.22a1 1 0 0 1 1.42 0l1.42 1.42a1 1 0 0 1-1.42 1.42L4.22 5.64a1 1 0 0 1 0-1.42zm12.72 12.72a1 1 0 0 1 1.42 0l1.42 1.42a1 1 0 0 1-1.42 1.42l-1.42-1.42a1 1 0 0 1 0-1.42zM4.22 19.78a1 1 0 0 1 0-1.42l1.42-1.42a1 1 0 0 1 1.42 1.42l-1.42 1.42a1 1 0 0 1-1.42 0zM16.94 7.06a1 1 0 0 1 0-1.42l1.42-1.42a1 1 0 0 1 1.42 1.42l-1.42 1.42a1 1 0 0 1-1.42 0z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 8v2H5v-2h6zm8 0v2h-6v-2h6z"/></svg>`,
  plug: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M16 7V3h-2v4H10V3H8v4h-1a1 1 0 0 0-1 1v4a5 5 0 0 0 4 4.9V21h4v-4.1A5 5 0 0 0 18 12V8a1 1 0 0 0-1-1z"/></svg>`,
  ac: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`,
  water: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`,
  washer: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6V9h12v11zM8 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0h5v2h-5V4zm1 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
  server: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 3H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 4H5V5h14v2zm1 2H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zm-1 4H5v-2h14v2zm1 2H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zm-1 4H5v-2h14v2z"/></svg>`,
  computer: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
  charge: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/></svg>`,
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  :host { display: block; font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif); }
  *, *::before, *::after { box-sizing: border-box; }

  .card {
    background: linear-gradient(160deg, #14192e 0%, #0c1020 60%, #111827 100%);
    border-radius: 20px;
    padding: 18px 18px 14px;
    color: #dce8ff;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(96,165,250,0.12);
    box-shadow:
      0 8px 40px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.04),
      0 0 0 1px rgba(255,255,255,0.02);
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .title-block .title {
    font-size: 1.25em;
    font-weight: 800;
    background: linear-gradient(120deg, #7dd3fc, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.5px;
  }
  .title-block .subtitle {
    font-size: 0.68em;
    color: #3d5280;
    margin-top: 1px;
    letter-spacing: 0.3px;
  }
  .price-pill {
    background: rgba(96,165,250,0.1);
    border: 1px solid rgba(96,165,250,0.25);
    border-radius: 20px;
    padding: 5px 14px;
    text-align: center;
    min-width: 80px;
  }
  .price-pill .val { font-size: 1em; font-weight: 700; color: #60a5fa; line-height: 1; }
  .price-pill .lbl { font-size: 0.6em; color: #3d5280; margin-top: 2px; letter-spacing: 0.5px; }

  /* ── ENERGY FLOW SVG ── */
  .flow-wrap {
    position: relative;
    width: 100%;
    margin-bottom: 14px;
    user-select: none;
  }
  .flow-svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }
  /* node circles */
  .n-ring { fill: #0c1020; stroke-width: 2.5; }
  .n-solar { stroke: #fbbf24; }
  .n-house { stroke: #60a5fa; }
  .n-grid  { stroke: #6b7db8; }
  .n-v2c   { stroke: #a78bfa; }
  /* labels */
  .n-name { font-size: 9.5px; font-weight: 700; fill: #4a5f8a; text-anchor: middle; letter-spacing: 0.8px; dominant-baseline: auto; }
  .n-power { font-size: 12.5px; font-weight: 800; text-anchor: middle; dominant-baseline: auto; }
  .c-solar { fill: #fbbf24; }
  .c-house { fill: #60a5fa; }
  .c-grid-imp { fill: #f87171; }
  .c-grid-exp { fill: #34d399; }
  .c-v2c   { fill: #c084fc; }
  .c-idle  { fill: #2a3558; }
  /* path tracks */
  .track { fill: none; stroke-width: 2.5; stroke-linecap: round; opacity: 0.25; }
  .t-solar { stroke: #fbbf24; }
  .t-imp   { stroke: #f87171; }
  .t-exp   { stroke: #34d399; }
  .t-v2c   { stroke: #c084fc; }
  /* direction arrows on paths */
  .arrow { fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* ── SURPLUS BANNER ── */
  .surplus {
    background: linear-gradient(90deg, rgba(52,211,153,0.08), rgba(16,185,129,0.04));
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: 10px;
    padding: 7px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 0.78em;
  }
  .surplus .s-lbl { color: #34d399; font-weight: 600; }
  .surplus .s-val { color: #34d399; font-weight: 700; font-size: 1.05em; }

  /* ── STATS ROW ── */
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin-bottom: 14px;
  }
  .stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 9px 5px;
    text-align: center;
  }
  .stat .sv { font-size: 0.9em; font-weight: 700; line-height: 1; margin-bottom: 3px; }
  .stat .sl { font-size: 0.58em; font-weight: 600; color: #3d5280; text-transform: uppercase; letter-spacing: 0.5px; }
  .st-sol .sv { color: #fbbf24; }
  .st-exp .sv { color: #34d399; }
  .st-imp .sv { color: #f87171; }
  .st-earn .sv { color: #34d399; }
  .st-cost .sv { color: #f87171; }

  /* ── EV SECTION ── */
  .ev-section { margin-bottom: 14px; }
  .section-title {
    font-size: 0.62em;
    font-weight: 700;
    letter-spacing: 1.8px;
    color: #2a3558;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .ev-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }
  .ev-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 10px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.4s, box-shadow 0.4s;
  }
  .ev-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 14px 14px 0 0;
    transition: opacity 0.4s;
  }
  .ev-charger { border-color: rgba(167,139,250,0.2); }
  .ev-charger::before { background: linear-gradient(90deg, #7c3aed, #c084fc, #7c3aed); opacity: 0.8; }
  .ev-charger.active { border-color: rgba(192,132,252,0.5); box-shadow: 0 0 20px rgba(167,139,250,0.1); }
  .ev-cupra::before { background: linear-gradient(90deg, #f59e0b, #ef4444); }
  .ev-fiat::before  { background: linear-gradient(90deg, #3b82f6, #10b981); }

  .ev-name { font-size: 0.65em; font-weight: 700; color: #6b7db8; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }

  /* car image */
  .car-img-wrap {
    width: 80px;
    height: 44px;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    background: rgba(255,255,255,0.02);
  }
  .car-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.85;
    transition: opacity 0.3s;
  }
  .car-img-wrap img:hover { opacity: 1; }

  /* battery ring */
  .bat-ring { position: relative; width: 56px; height: 56px; flex-shrink: 0; }
  .bat-ring svg { width: 56px; height: 56px; transform: rotate(-90deg); }
  .bat-bg { fill: none; stroke: rgba(255,255,255,0.07); stroke-width: 6; }
  .bat-fill { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1); }
  .bat-text {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.95em; font-weight: 800; color: #dce8ff;
    text-align: center; line-height: 1; white-space: nowrap;
  }
  .bat-text sub { font-size: 0.55em; color: #3d5280; font-weight: 500; display: block; }

  .ev-range { font-size: 0.8em; font-weight: 700; color: #8899cc; }
  .ev-range em { font-style: normal; font-size: 0.8em; color: #3d5280; }

  /* charger card */
  .charger-icon { width: 32px; height: 32px; margin: 2px 0; }
  .charger-power { font-size: 1.2em; font-weight: 800; color: #c084fc; }
  .charger-sub { font-size: 0.65em; color: #4a3a7a; text-align: center; }
  .charger-idle { font-size: 0.68em; color: #2a2050; text-align: center; margin-top: 2px; }

  /* V2C image */
  .v2c-img { width: 56px; height: 40px; object-fit: contain; opacity: 0.7; }

  /* ── DEVICES ── */
  .devices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
    gap: 7px;
    margin-bottom: 12px;
  }
  .device {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 11px;
    padding: 8px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: border-color 0.3s, background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .device.on {
    border-color: rgba(251,191,36,0.25);
    background: rgba(251,191,36,0.04);
  }
  .device.on::after {
    content: '';
    position: absolute;
    bottom: 0; left: 15%; right: 15%;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent);
  }
  .dev-icon { width: 20px; height: 20px; flex-shrink: 0; transition: color 0.3s; }
  .dev-icon.off { color: #1e2a4a; }
  .dev-icon.on  { color: #fbbf24; }
  .dev-name { font-size: 0.58em; font-weight: 600; color: #3d5280; text-align: center; line-height: 1.2; }
  .dev-power { font-size: 0.78em; font-weight: 700; color: #6b7db8; transition: color 0.3s; }
  .device.on .dev-power { color: #fbbf24; }

  /* ── FORECAST ── */
  .forecast-row {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    font-size: 0.67em;
    color: #2a3558;
    align-items: center;
    flex-wrap: wrap;
  }
  .fc-item { display: flex; align-items: center; gap: 4px; }
  .fc-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* ── RESPONSIVENESS ── */
  @media (max-width: 380px) {
    .ev-grid { grid-template-columns: 1fr 1fr; }
    .stats { grid-template-columns: repeat(2, 1fr); }
    .car-img-wrap { width: 60px; height: 34px; }
  }
`;

// ─── Global animation styles (injected once) ──────────────────────────────────
if (!document.getElementById('sec-anim-styles')) {
  const s = document.createElement('style');
  s.id = 'sec-anim-styles';
  s.textContent = `
    @keyframes sec-pulse-ring {
      0%,100% { opacity:1; } 50% { opacity:0.6; }
    }
    @keyframes sec-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(s);
}

// ─── SmoothEnergyCard ─────────────────────────────────────────────────────────
class SmoothEnergyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._hass = null;
    this._particleTimers = [];
    this._animFrames = [];
  }

  /* ── Public API ── */
  static getConfigElement() {
    return document.createElement('smooth-energy-card-editor');
  }

  static getStubConfig(hass) {
    return SmoothEnergyCard._defaultConfig();
  }

  static _defaultConfig() {
    return {
      title: 'Energy Dashboard',
      solar_power: 'sensor.shelly_channel_2_power',
      grid_power: 'sensor.shelly_channel_1_power',
      house_power: 'sensor.consommation_maison_live',
      v2c_power: 'sensor.evse_192_168_1_67_puissance_de_charge',
      kwh_price: 'sensor.prix_du_kwh_en_cours',
      solar_today: 'sensor.hoymiles_gateway_solarh_6402640_today_eq',
      solar_forecast_today: 'sensor.energy_production_today',
      solar_forecast_tomorrow: 'sensor.energy_production_tomorrow',
      ev1_name: 'Cupra Tavascan',
      ev1_battery: 'sensor.cupra_tavascan_battery_level',
      ev1_range: 'sensor.cupra_tavascan_electric_range',
      ev1_image: '/local/pycupra/image_VSSZZZKR3RA007706_front_cropped.png',
      ev2_name: 'Fiat 500e',
      ev2_battery: 'sensor.fiat_500e_berline_my24_hvbattery_charge',
      ev2_range: 'sensor.fiat_500e_berline_my24_driving_range',
      ev2_image: '/local/images/Home/fiat500.jpg',
      v2c_image: '/local/images/v2ctrydan-1.png',
      devices: [
        { name: 'Climatisation', entity: 'sensor.shelly2_channel_1_power', icon: 'ac' },
        { name: 'Ballon ECS', entity: 'sensor.shelly2_channel_2_power', icon: 'water' },
        { name: 'TV Box', entity: 'sensor.salon_tvbox_power', icon: 'tv' },
        { name: 'Lave-linge', entity: 'sensor.machinealaver_power', icon: 'washer' },
        { name: 'Informatique', entity: 'sensor.smart_switch_24022179241609510d0148e1e9ed2d80_power', icon: 'computer' },
        { name: 'RaspPi', entity: 'sensor.tplink_ha_rpi_consommation_actuelle', icon: 'server' },
      ],
    };
  }

  setConfig(config) {
    if (!config) throw new Error('smooth-energy-card: missing config');
    const def = SmoothEnergyCard._defaultConfig();
    this._config = { ...def, ...config };
    if (config.devices) this._config.devices = config.devices;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() { return 8; }

  disconnectedCallback() {
    this._clearParticles();
  }

  /* ── Data aggregation ── */
  _data() {
    const h = this._hass;
    const c = this._config;
    if (!h || !c) return null;

    const solarW  = toWatts(h, c.solar_power);
    const rawGrid = toWatts(h, c.grid_power);
    const houseW  = toWatts(h, c.house_power);
    const v2cW    = toWatts(h, c.v2c_power);
    const price   = numState(h, c.kwh_price, null);

    // EDF Shelly reports kW; toWatts handles conversion but let's be explicit
    // if rawGrid is e.g. -1.67 kW, toWatts returns -1670 W
    const gridW   = rawGrid; // W, negative = exporting
    const isExp   = gridW < 0;
    const gridImpW= isExp ? 0 : gridW;
    const gridExpW= isExp ? Math.abs(gridW) : 0;

    const solarToday    = numState(h, c.solar_today, null);
    const fcToday       = numState(h, c.solar_forecast_today, null);
    const fcTomorrow    = numState(h, c.solar_forecast_tomorrow, null);

    const ev1Bat  = clamp(numState(h, c.ev1_battery, 0), 0, 100);
    const ev1Rng  = numState(h, c.ev1_range, 0);
    const ev2Bat  = clamp(numState(h, c.ev2_battery, 0), 0, 100);
    const ev2Rng  = numState(h, c.ev2_range, 0);

    // Hourly cost estimate
    let costH = null;
    if (price != null) {
      const impCost  = (gridImpW / 1000) * price;      // €/h consumed
      const expEarn  = (gridExpW / 1000) * price * 0.11; // approx feed-in 11ct (revente FR)
      costH = impCost - expEarn;
    }

    const devices = (c.devices || []).map(d => ({
      name: d.name,
      icon: d.icon || 'plug',
      w: toWatts(h, d.entity),
    }));

    return {
      solarW, gridW, gridImpW, gridExpW,
      houseW, v2cW, isExp, price, costH,
      solarToday, fcToday, fcTomorrow,
      ev1Bat, ev1Rng, ev2Bat, ev2Rng,
      devices,
      surplusW: Math.max(0, solarW - houseW - v2cW),
    };
  }

  /* ── Rendering ── */
  _render() {
    const shadow = this.shadowRoot;
    const d = this._data();

    // Build fresh DOM
    shadow.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = CSS;
    shadow.appendChild(style);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = d ? this._buildCard(d) : `<div style="padding:30px;text-align:center;color:#3d5280;font-size:0.85em">Connecting to Home Assistant…</div>`;
    shadow.appendChild(card);

    if (d) {
      this._clearParticles();
      this._startParticles(shadow, d);
    }
  }

  /* ── HTML builder ── */
  _buildCard(d) {
    const c = this._config;
    const priceStr = d.price != null ? d.price.toFixed(3) + ' €' : '—';

    const hasSurplus = d.surplusW > 50;

    let costClass = 'st-cost', costStr = '—';
    if (d.costH != null) {
      costStr = fmtEur(Math.abs(d.costH)) + '/h';
      costClass = d.costH < 0 ? 'st-earn' : 'st-cost';
    }

    return /* html */`
      <!-- HEADER -->
      <div class="header">
        <div class="title-block">
          <div class="title">${c.title || 'Energy'}</div>
          <div class="subtitle">⚡ Live energy monitor &nbsp;·&nbsp; v${VERSION}</div>
        </div>
        <div class="price-pill">
          <div class="val">${priceStr}</div>
          <div class="lbl">€/kWh</div>
        </div>
      </div>

      <!-- ENERGY FLOW -->
      <div class="flow-wrap">
        ${this._buildFlowSVG(d)}
      </div>

      <!-- SURPLUS -->
      ${hasSurplus ? `
      <div class="surplus">
        <span class="s-lbl">☀️ Solar surplus available</span>
        <span class="s-val">${fmtW(d.surplusW)}</span>
      </div>` : ''}

      <!-- STATS -->
      <div class="stats">
        <div class="stat st-sol">
          <div class="sv">${fmtKwh(d.solarToday)}</div>
          <div class="sl">Solar Today</div>
        </div>
        <div class="stat st-sol">
          <div class="sv">${fmtKwh(d.fcToday)}</div>
          <div class="sl">Forecast ☀️</div>
        </div>
        <div class="stat ${d.isExp ? 'st-exp' : 'st-imp'}">
          <div class="sv">${d.isExp ? '↑ ' + fmtW(d.gridExpW) : '↓ ' + fmtW(d.gridImpW)}</div>
          <div class="sl">${d.isExp ? 'Exporting' : 'Importing'}</div>
        </div>
        <div class="stat ${costClass}">
          <div class="sv">${d.costH != null && d.costH < 0 ? '🌿 Earning' : costStr}</div>
          <div class="sl">Est. Cost</div>
        </div>
      </div>

      <!-- EV SECTION -->
      <div class="ev-section">
        <div class="section-title">Electric Vehicles &amp; Charger</div>
        <div class="ev-grid">
          ${this._buildCharger(d)}
          ${this._buildEV('ev-cupra', c.ev1_name, d.ev1Bat, d.ev1Rng, c.ev1_image)}
          ${this._buildEV('ev-fiat', c.ev2_name, d.ev2Bat, d.ev2Rng, c.ev2_image)}
        </div>
      </div>

      <!-- DEVICES -->
      <div class="section-title">Device Consumption</div>
      <div class="devices-grid">
        ${d.devices.map(dev => this._buildDevice(dev)).join('')}
      </div>

      <!-- FORECAST ROW -->
      <div class="forecast-row">
        <div class="fc-item"><div class="fc-dot" style="background:#fbbf24"></div><span>Today: ${fmtKwh(d.fcToday)}</span></div>
        <div class="fc-item"><div class="fc-dot" style="background:#4a5f8a"></div><span>Tomorrow: ${fmtKwh(d.fcTomorrow)}</span></div>
      </div>
    `;
  }

  _buildFlowSVG(d) {
    // Layout: W=360 H=210
    // Solar (top-left), House (center), Grid (top-right), V2C (bottom-center)
    const W = 360, H = 210;
    const sP = { x: 58, y: 62 };   // solar node center
    const hP = { x: 180, y: 105 }; // house node center
    const gP = { x: 302, y: 62 };  // grid node center
    const vP = { x: 180, y: 185 }; // v2c node center
    const R = 44;  // main node radius
    const Rv = 28; // v2c radius

    const sOn = d.solarW > 20;
    const iOn = d.gridImpW > 20;
    const eOn = d.gridExpW > 20;
    const vOn = d.v2cW > 10;

    // Bezier paths
    const sPth = `M${sP.x},${sP.y} C${(sP.x+hP.x)/2-10},${sP.y} ${(sP.x+hP.x)/2+10},${hP.y} ${hP.x},${hP.y}`;
    const iPth = `M${gP.x},${gP.y} C${(gP.x+hP.x)/2+10},${gP.y} ${(gP.x+hP.x)/2-10},${hP.y} ${hP.x},${hP.y}`;
    const ePth = `M${hP.x},${hP.y} C${(hP.x+gP.x)/2-10},${hP.y} ${(hP.x+gP.x)/2+10},${gP.y} ${gP.x},${gP.y}`;
    const vPth = `M${hP.x},${hP.y} L${vP.x},${vP.y}`;

    const gLabel = d.isExp ? 'EXPORT' : 'IMPORT';
    const gClass = d.isExp ? 'c-grid-exp' : 'c-grid-imp';
    const gVal   = fmtW(Math.abs(d.gridW));
    const gArrow = d.isExp ? '↑' : '↓';

    return /* html */`
    <svg class="flow-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow-s" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glow-h" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glow-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${d.isExp ? '#34d399' : '#f87171'}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${d.isExp ? '#34d399' : '#f87171'}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Glow halos -->
      ${sOn ? `<circle cx="${sP.x}" cy="${sP.y}" r="${R+18}" fill="url(#glow-s)"/>` : ''}
      <circle cx="${hP.x}" cy="${hP.y}" r="${R+22}" fill="url(#glow-h)"/>
      <circle cx="${gP.x}" cy="${gP.y}" r="${R+14}" fill="url(#glow-g)"/>

      <!-- Flow tracks -->
      ${sOn ? `<path id="pSolar" class="track t-solar" d="${sPth}"/>` : ''}
      ${iOn ? `<path id="pImp"   class="track t-imp"   d="${iPth}"/>` : ''}
      ${eOn ? `<path id="pExp"   class="track t-exp"   d="${ePth}"/>` : ''}
      ${vOn ? `<path id="pV2c"   class="track t-v2c"   d="${vPth}"/>` : ''}

      <!-- Particles anchor -->
      <g id="particles"></g>

      <!-- ── SOLAR NODE ── -->
      <circle class="n-ring n-solar" cx="${sP.x}" cy="${sP.y}" r="${R}"/>
      <text x="${sP.x}" y="${sP.y-14}" font-size="20" text-anchor="middle" dominant-baseline="middle"
            fill="${sOn ? '#fbbf24' : '#2a3558'}">☀️</text>
      <text x="${sP.x}" y="${sP.y+7}" class="n-power ${sOn ? 'c-solar' : 'c-idle'}">${sOn ? fmtW(d.solarW) : '—'}</text>
      <text x="${sP.x}" y="${sP.y+22}" class="n-name">SOLAR</text>

      <!-- ── HOUSE NODE ── -->
      <circle class="n-ring n-house" cx="${hP.x}" cy="${hP.y}" r="${R}"/>
      <text x="${hP.x}" y="${hP.y-14}" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#60a5fa">🏠</text>
      <text x="${hP.x}" y="${hP.y+7}" class="n-power c-house">${fmtW(d.houseW)}</text>
      <text x="${hP.x}" y="${hP.y+22}" class="n-name">HOUSE</text>

      <!-- ── GRID NODE ── -->
      <circle class="n-ring n-grid" cx="${gP.x}" cy="${gP.y}" r="${R}"/>
      <text x="${gP.x}" y="${gP.y-14}" font-size="18" text-anchor="middle" dominant-baseline="middle"
            fill="${d.isExp ? '#34d399' : '#f87171'}">${gArrow}🔌</text>
      <text x="${gP.x}" y="${gP.y+7}" class="n-power ${gClass}">${gVal}</text>
      <text x="${gP.x}" y="${gP.y+22}" class="n-name">${gLabel}</text>

      <!-- ── V2C NODE ── -->
      <circle class="n-ring n-v2c" cx="${vP.x}" cy="${vP.y}" r="${Rv}"/>
      <text x="${vP.x}" y="${vP.y-2}" font-size="14" text-anchor="middle" dominant-baseline="middle"
            fill="${vOn ? '#c084fc' : '#2a2050'}">⚡</text>
      <text x="${vP.x}" y="${vP.y+14}" class="n-name" style="fill:#2a2050;font-size:8px">V2C${vOn ? ' ' + fmtW(d.v2cW) : ''}</text>
    </svg>`;
  }

  _buildCharger(d) {
    const c = this._config;
    const active = d.v2cW > 10;
    const img = c.v2c_image ? `<img src="${c.v2c_image}" class="v2c-img" alt="V2C" onerror="this.style.display='none'">` : `<div class="charger-icon" style="color:${active?'#c084fc':'#2a1a5a'}">${SVG_ICONS.charge}</div>`;
    return /* html */`
      <div class="ev-card ev-charger${active ? ' active' : ''}">
        <div class="ev-name">V2C Charger</div>
        ${img}
        ${active
          ? `<div class="charger-power">${fmtW(d.v2cW)}</div><div class="charger-sub">Charging…</div>`
          : `<div class="charger-idle">Idle</div>`}
      </div>`;
  }

  _buildEV(cls, name, bat, range, img) {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const fill = bat / 100;
    const offset = circ * (1 - fill);
    const col = bat > 50 ? '#34d399' : bat > 20 ? '#fbbf24' : '#f87171';
    const imgEl = img
      ? `<div class="car-img-wrap"><img src="${img}" alt="${name}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`
      : '';
    return /* html */`
      <div class="ev-card ${cls}">
        <div class="ev-name">${name}</div>
        ${imgEl}
        <div class="bat-ring">
          <svg viewBox="0 0 56 56">
            <circle class="bat-bg" cx="28" cy="28" r="${r}"/>
            <circle class="bat-fill" cx="28" cy="28" r="${r}"
              stroke="${col}"
              stroke-dasharray="${circ.toFixed(2)}"
              stroke-dashoffset="${offset.toFixed(2)}"/>
          </svg>
          <div class="bat-text">${bat}<sub>%</sub></div>
        </div>
        <div class="ev-range">${range} <em>km</em></div>
      </div>`;
  }

  _buildDevice(dev) {
    const on = dev.w > 5;
    const icon = SVG_ICONS[dev.icon] || SVG_ICONS.plug;
    return /* html */`
      <div class="device${on ? ' on' : ''}">
        <div class="dev-icon ${on ? 'on' : 'off'}">${icon}</div>
        <div class="dev-name">${dev.name}</div>
        <div class="dev-power">${fmtW(dev.w)}</div>
      </div>`;
  }

  /* ── Particle animation ── */
  _clearParticles() {
    this._particleTimers.forEach(t => clearInterval(t));
    this._particleTimers = [];
    this._animFrames.forEach(af => cancelAnimationFrame(af));
    this._animFrames = [];
  }

  _startParticles(shadow, d) {
    const flows = [
      { id: 'pSolar', cls: 'c-solar',    col: '#fbbf24', w: d.solarW,    active: d.solarW > 20 },
      { id: 'pImp',   cls: 'c-grid-imp', col: '#f87171', w: d.gridImpW,  active: d.gridImpW > 20 },
      { id: 'pExp',   cls: 'c-grid-exp', col: '#34d399', w: d.gridExpW,  active: d.gridExpW > 20 },
      { id: 'pV2c',   cls: 'c-v2c',      col: '#c084fc', w: d.v2cW,      active: d.v2cW > 10 },
    ];

    flows.filter(f => f.active).forEach(flow => {
      const intervalMs = Math.max(300, Math.round(1200 / clamp(flow.w / 1000, 0.2, 4)));
      const t = setInterval(() => {
        const path = shadow.getElementById(flow.id);
        const container = shadow.getElementById('particles');
        if (!path || !container) return;
        this._spawnDot(path, container, flow.col);
      }, intervalMs);
      this._particleTimers.push(t);
    });
  }

  _spawnDot(pathEl, container, color) {
    const len = pathEl.getTotalLength();
    if (!len) return;

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '3.5');
    dot.setAttribute('fill', color);
    dot.setAttribute('filter', `drop-shadow(0 0 3px ${color})`);
    container.appendChild(dot);

    const dur = 1000 + Math.random() * 700;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const pt = pathEl.getPointAtLength(p * len);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      const op = p < 0.12 ? p / 0.12 : p > 0.88 ? (1 - p) / 0.12 : 1;
      dot.setAttribute('opacity', (op * 0.92).toFixed(3));
      if (p < 1) {
        const af = requestAnimationFrame(step);
        this._animFrames.push(af);
      } else {
        dot.remove();
      }
    };
    const af = requestAnimationFrame(step);
    this._animFrames.push(af);
  }
}

// ─── Simple Editor ────────────────────────────────────────────────────────────
class SmoothEnergyCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  setConfig(config) {
    this._config = config;
    this._render();
  }
  set hass(h) {}

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        .editor { padding: 12px; font-family: Roboto, sans-serif; color: #333; }
        p { font-size: 0.82em; color: #666; margin: 0 0 10px; }
        ha-textfield { display: block; width: 100%; margin-bottom: 8px; }
      </style>
      <div class="editor">
        <p>⚙️ Configure via YAML for full control. See the README for all available options.</p>
      </div>`;
  }
}

// ─── Registration ─────────────────────────────────────────────────────────────
customElements.define('smooth-energy-card', SmoothEnergyCard);
customElements.define('smooth-energy-card-editor', SmoothEnergyCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.find(c => c.type === 'smooth-energy-card')) {
  window.customCards.push({
    type: 'smooth-energy-card',
    name: 'Smooth Energy Card',
    description: 'Animated energy monitoring — solar · grid · EVs · devices',
    preview: true,
    documentationURL: 'https://github.com/roualin/Smooth-Energy-Card',
  });
}

console.info(
  `%c SMOOTH-ENERGY-CARD %c v${VERSION} `,
  'color:#fff;background:linear-gradient(90deg,#3b82f6,#8b5cf6);padding:3px 8px;border-radius:4px 0 0 4px;font-weight:700',
  'color:#60a5fa;background:#0f1428;padding:3px 8px;border-radius:0 4px 4px 0',
);
