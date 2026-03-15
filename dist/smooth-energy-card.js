/**
 * Smooth Energy Card v1.2.0
 * A beautiful animated energy monitoring card for Home Assistant.
 *
 * @license MIT
 * @version 1.2.0
 */

const VERSION = '1.2.1';

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
  return (v < 0 ? '−' : '') + abs.toFixed(2) + ' €';
}
function fmtEta(hours) {
  if (hours == null || hours <= 0 || !isFinite(hours)) return null;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
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
function calcEta(hass, batterySoc, chargingPowerEntity, chargingRateEntity, targetSocEntity, capacityKwh) {
  if (!targetSocEntity) return null;
  const targetSoc = numState(hass, targetSocEntity, null);
  if (targetSoc == null || targetSoc <= batterySoc) return null;
  const remaining = targetSoc - batterySoc;
  if (chargingRateEntity) {
    const unit = unitOf(hass, chargingRateEntity);
    const rate = numState(hass, chargingRateEntity, 0);
    if (unit === '%/h' && rate > 0) return fmtEta(remaining / rate);
  }
  if (chargingPowerEntity && capacityKwh > 0) {
    const powerKw = toWatts(hass, chargingPowerEntity) / 1000;
    if (powerKw > 0.1) return fmtEta(remaining / ((powerKw / capacityKwh) * 100));
  }
  return null;
}

// ─── Config migration: flat ev1/ev2 → evs array ───────────────────────────────
function migrateConfig(raw) {
  if (!raw || raw.evs) return raw;
  const evs = [];
  if (raw.ev1_name || raw.ev1_battery) {
    evs.push({
      name: raw.ev1_name || 'EV 1',
      battery: raw.ev1_battery || '',
      range: raw.ev1_range || '',
      image: raw.ev1_image || '',
      charging: raw.ev1_charging || '',
      charging_power: raw.ev1_charging_power || '',
      target_soc: raw.ev1_target_soc || '',
      battery_capacity: raw.ev1_battery_capacity || 77,
    });
  }
  if (raw.ev2_name || raw.ev2_battery) {
    evs.push({
      name: raw.ev2_name || 'EV 2',
      battery: raw.ev2_battery || '',
      range: raw.ev2_range || '',
      image: raw.ev2_image || '',
      charging: raw.ev2_charging || '',
      charging_rate: raw.ev2_charging_rate || '',
      target_soc: raw.ev2_target_soc || '',
      battery_capacity: raw.ev2_battery_capacity || 37.3,
    });
  }
  const out = { ...raw, evs };
  ['ev1_name','ev1_battery','ev1_range','ev1_image','ev1_charging','ev1_charging_power','ev1_target_soc','ev1_battery_capacity',
   'ev2_name','ev2_battery','ev2_range','ev2_image','ev2_charging','ev2_charging_rate','ev2_target_soc','ev2_battery_capacity'].forEach(k => delete out[k]);
  return out;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEVICE_ICONS = [
  { value: 'plug',     label: '🔌 Plug (generic)' },
  { value: 'ac',       label: '❄️ Air conditioning' },
  { value: 'water',    label: '🚿 Water heater' },
  { value: 'tv',       label: '📺 TV / Media' },
  { value: 'washer',   label: '🫧 Washer / Dryer' },
  { value: 'computer', label: '🖥️ Computer / Office' },
  { value: 'server',   label: '🖧 Server / NAS' },
  { value: 'car',      label: '🚗 Car / EV' },
  { value: 'bolt',     label: '⚡ Lightning bolt' },
  { value: 'home',     label: '🏠 Home' },
];

// EV color themes by index (cyclic)
const EV_THEMES = [
  { bar: 'linear-gradient(90deg,#f59e0b,#ef4444)', cls: 'ev-t0' },
  { bar: 'linear-gradient(90deg,#3b82f6,#10b981)', cls: 'ev-t1' },
  { bar: 'linear-gradient(90deg,#8b5cf6,#ec4899)', cls: 'ev-t2' },
  { bar: 'linear-gradient(90deg,#f59e0b,#10b981)', cls: 'ev-t3' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SVG_ICONS = {
  sun:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zM3 11h2a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm16 0h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2zM12 19a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4.22 4.22a1 1 0 0 1 1.42 0l1.42 1.42a1 1 0 0 1-1.42 1.42L4.22 5.64a1 1 0 0 1 0-1.42zm12.72 12.72a1 1 0 0 1 1.42 0l1.42 1.42a1 1 0 0 1-1.42 1.42l-1.42-1.42a1 1 0 0 1 0-1.42zM4.22 19.78a1 1 0 0 1 0-1.42l1.42-1.42a1 1 0 0 1 1.42 1.42l-1.42 1.42a1 1 0 0 1-1.42 0zM16.94 7.06a1 1 0 0 1 0-1.42l1.42-1.42a1 1 0 0 1 1.42 1.42l-1.42 1.42a1 1 0 0 1-1.42 0z"/></svg>`,
  home:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  bolt:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`,
  plug:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M16 7V3h-2v4H10V3H8v4h-1a1 1 0 0 0-1 1v4a5 5 0 0 0 4 4.9V21h4v-4.1A5 5 0 0 0 18 12V8a1 1 0 0 0-1-1z"/></svg>`,
  ac:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`,
  water:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>`,
  tv:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`,
  washer:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6V9h12v11zM8 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 0h5v2h-5V4zm1 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
  server:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 3H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 4H5V5h14v2zm1 2H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zm-1 4H5v-2h14v2zm1 2H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zm-1 4H5v-2h14v2z"/></svg>`,
  computer:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
  car:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
  charge:`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/></svg>`,
};

// ─── Card CSS ─────────────────────────────────────────────────────────────────
const CSS = `
  :host { display: block; font-family: var(--paper-font-body1_-_font-family,'Roboto',sans-serif); }
  *, *::before, *::after { box-sizing: border-box; }
  .card {
    background: linear-gradient(160deg,#14192e 0%,#0c1020 60%,#111827 100%);
    border-radius: 20px; padding: 18px 18px 14px; color: #dce8ff;
    overflow: hidden; position: relative;
    border: 1px solid rgba(96,165,250,0.12);
    box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.02);
  }
  .header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
  .title-block .title { font-size:1.25em; font-weight:800; background:linear-gradient(120deg,#7dd3fc,#818cf8,#c084fc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:0.5px; }
  .title-block .subtitle { font-size:0.68em; color:#3d5280; margin-top:1px; letter-spacing:0.3px; }
  .price-pill { background:rgba(96,165,250,0.1); border:1px solid rgba(96,165,250,0.25); border-radius:20px; padding:5px 14px; text-align:center; min-width:80px; }
  .price-pill .val { font-size:1em; font-weight:700; color:#60a5fa; line-height:1; }
  .price-pill .lbl { font-size:0.6em; color:#3d5280; margin-top:2px; letter-spacing:0.5px; }

  .flow-wrap { position:relative; width:100%; margin-bottom:14px; user-select:none; }
  .flow-svg { width:100%; height:auto; display:block; overflow:visible; }
  .n-ring { fill:#0c1020; stroke-width:2.5; }
  .n-solar { stroke:#fbbf24; } .n-house { stroke:#60a5fa; } .n-grid { stroke:#6b7db8; } .n-v2c { stroke:#a78bfa; }
  .n-name { font-size:9.5px; font-weight:700; fill:#4a5f8a; text-anchor:middle; letter-spacing:0.8px; dominant-baseline:auto; }
  .n-power { font-size:12.5px; font-weight:800; text-anchor:middle; dominant-baseline:auto; }
  .c-solar{fill:#fbbf24;} .c-house{fill:#60a5fa;} .c-grid-imp{fill:#f87171;} .c-grid-exp{fill:#34d399;} .c-v2c{fill:#c084fc;} .c-idle{fill:#2a3558;}
  .track { fill:none; stroke-width:2.5; stroke-linecap:round; opacity:0.25; }
  .t-solar{stroke:#fbbf24;} .t-imp{stroke:#f87171;} .t-exp{stroke:#34d399;} .t-v2c{stroke:#c084fc;}
  .v2c-ring-pulse { fill:none; stroke:#c084fc; stroke-width:2; opacity:0; animation:v2c-svg-pulse 1.6s ease-in-out infinite; }
  @keyframes v2c-svg-pulse { 0%{opacity:0.6;r:28} 100%{opacity:0;r:46} }
  .v2c-bolt-active { animation:bolt-blink 0.9s ease-in-out infinite alternate; }
  @keyframes bolt-blink { from{opacity:1} to{opacity:0.35} }

  .surplus { background:linear-gradient(90deg,rgba(52,211,153,0.08),rgba(16,185,129,0.04)); border:1px solid rgba(52,211,153,0.2); border-radius:10px; padding:7px 14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.78em; }
  .surplus .s-lbl{color:#34d399;font-weight:600;} .surplus .s-val{color:#34d399;font-weight:700;font-size:1.05em;}

  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; margin-bottom:14px; }
  .stat { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:9px 5px; text-align:center; }
  .stat .sv{font-size:0.9em;font-weight:700;line-height:1;margin-bottom:3px;} .stat .sl{font-size:0.58em;font-weight:600;color:#3d5280;text-transform:uppercase;letter-spacing:0.5px;}
  .st-sol .sv{color:#fbbf24;} .st-exp .sv{color:#34d399;} .st-imp .sv{color:#f87171;} .st-earn .sv{color:#34d399;} .st-cost .sv{color:#f87171;}

  .ev-section{margin-bottom:14px;}
  .section-title { font-size:0.62em; font-weight:700; letter-spacing:1.8px; color:#2a3558; text-transform:uppercase; margin-bottom:8px; }
  .ev-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:8px; }
  .ev-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:10px 8px; display:flex; flex-direction:column; align-items:center; gap:5px; position:relative; overflow:hidden; transition:border-color 0.4s,box-shadow 0.4s; }
  .ev-card::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; border-radius:14px 14px 0 0; transition:opacity 0.4s; }
  .ev-t0::before{background:linear-gradient(90deg,#f59e0b,#ef4444);}
  .ev-t1::before{background:linear-gradient(90deg,#3b82f6,#10b981);}
  .ev-t2::before{background:linear-gradient(90deg,#8b5cf6,#ec4899);}
  .ev-t3::before{background:linear-gradient(90deg,#f59e0b,#10b981);}
  .ev-charger{border-color:rgba(167,139,250,0.2);}
  .ev-charger::before{background:linear-gradient(90deg,#7c3aed,#c084fc,#7c3aed);opacity:0.8;}
  .ev-charger.plugged { border-color:rgba(192,132,252,0.7); animation:charger-card-pulse 1.8s ease-in-out infinite; }
  @keyframes charger-card-pulse { 0%{box-shadow:0 0 0 0 rgba(192,132,252,0.5);border-color:rgba(192,132,252,0.7)} 50%{box-shadow:0 0 22px 6px rgba(192,132,252,0.2);border-color:rgba(192,132,252,1)} 100%{box-shadow:0 0 0 0 rgba(192,132,252,0);border-color:rgba(192,132,252,0.7)} }
  .ev-charger.plugged::before { background:linear-gradient(90deg,#7c3aed,#c084fc,#a855f7,#c084fc,#7c3aed); background-size:200% 100%; animation:bar-flow 1.5s linear infinite; opacity:1; }
  @keyframes bar-flow { from{background-position:0% 50%} to{background-position:100% 50%} }
  .ev-card.ev-is-charging { animation:ev-charge-pulse 2s ease-in-out infinite; }
  @keyframes ev-charge-pulse { 0%{box-shadow:0 0 0 0 rgba(52,211,153,0)} 50%{box-shadow:0 0 18px 4px rgba(52,211,153,0.2);border-color:rgba(52,211,153,0.6)} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0)} }
  .ev-card.ev-is-charging::before { background:linear-gradient(90deg,#10b981,#34d399,#6ee7b7,#34d399,#10b981); background-size:200% 100%; animation:bar-flow 1.2s linear infinite; opacity:1; }
  .ev-name{font-size:0.65em;font-weight:700;color:#6b7db8;text-transform:uppercase;letter-spacing:0.5px;text-align:center;}
  .car-img-wrap{width:80px;height:44px;position:relative;overflow:hidden;border-radius:6px;background:rgba(255,255,255,0.02);}
  .car-img-wrap img{width:100%;height:100%;object-fit:cover;object-position:center;opacity:0.85;transition:opacity 0.3s;}
  .car-img-wrap img:hover{opacity:1;}
  .charging-badge{position:absolute;top:2px;right:2px;background:rgba(52,211,153,0.9);border-radius:4px;padding:1px 3px;font-size:8px;font-weight:800;color:#052e16;animation:badge-blink 1s ease-in-out infinite alternate;}
  @keyframes badge-blink{from{opacity:1}to{opacity:0.5}}
  .bat-ring{position:relative;width:56px;height:56px;flex-shrink:0;}
  .bat-ring svg{width:56px;height:56px;transform:rotate(-90deg);}
  .bat-bg{fill:none;stroke:rgba(255,255,255,0.07);stroke-width:6;}
  .bat-fill{fill:none;stroke-width:6;stroke-linecap:round;transition:stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1);}
  .bat-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:0.95em;font-weight:800;color:#dce8ff;text-align:center;line-height:1;white-space:nowrap;}
  .bat-text sub{font-size:0.55em;color:#3d5280;font-weight:500;display:block;}
  .ev-range{font-size:0.8em;font-weight:700;color:#8899cc;}
  .ev-range em{font-style:normal;font-size:0.8em;color:#3d5280;}
  .ev-eta{font-size:0.62em;font-weight:700;color:#34d399;text-align:center;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:6px;padding:2px 6px;width:100%;animation:eta-fade 1.2s ease-in-out infinite alternate;}
  @keyframes eta-fade{from{opacity:1}to{opacity:0.65}}

  .charger-power{font-size:1.2em;font-weight:800;color:#c084fc;}
  .charger-sub{font-size:0.65em;color:#4a3a7a;text-align:center;}
  .charger-idle{font-size:0.68em;color:#2a2050;text-align:center;margin-top:2px;}
  .charge-cost-block{width:100%;background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.12);border-radius:8px;padding:5px 7px;margin-top:2px;font-size:0.6em;}
  .charge-cost-row{display:flex;justify-content:space-between;align-items:center;line-height:1.6;}
  .cc-solar{color:#fbbf24;font-weight:600;} .cc-grid{color:#f87171;font-weight:600;} .cc-free{color:#34d399;font-weight:700;} .cc-cost{color:#f87171;font-weight:700;}
  .cc-total{color:#c084fc;font-weight:800;border-top:1px solid rgba(167,139,250,0.15);padding-top:3px;margin-top:1px;}
  .v2c-img{width:56px;height:40px;object-fit:contain;opacity:0.7;}
  .v2c-img.plugged{opacity:1;filter:drop-shadow(0 0 8px rgba(192,132,252,0.6));}

  .devices-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:7px;margin-bottom:12px;}
  .device{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.05);border-radius:11px;padding:8px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;transition:border-color 0.3s,background 0.3s;position:relative;overflow:hidden;}
  .device.on{border-color:rgba(251,191,36,0.25);background:rgba(251,191,36,0.04);}
  .device.on::after{content:'';position:absolute;bottom:0;left:15%;right:15%;height:1.5px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.5),transparent);}
  .dev-icon{width:20px;height:20px;flex-shrink:0;transition:color 0.3s;}
  .dev-icon.off{color:#1e2a4a;} .dev-icon.on{color:#fbbf24;}
  .dev-name{font-size:0.58em;font-weight:600;color:#3d5280;text-align:center;line-height:1.2;}
  .dev-power{font-size:0.78em;font-weight:700;color:#6b7db8;transition:color 0.3s;}
  .device.on .dev-power{color:#fbbf24;}

  .forecast-row{display:flex;gap:10px;justify-content:flex-end;font-size:0.67em;color:#2a3558;align-items:center;flex-wrap:wrap;}
  .fc-item{display:flex;align-items:center;gap:4px;}
  .fc-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}

  /* ── CHARGING CABLE ── */
  .cable-overlay { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:visible; z-index:5; }
  .cable-track { stroke-dasharray: 8 5; animation: cable-dash 0.8s linear infinite; }
  @keyframes cable-dash { to { stroke-dashoffset: -26; } }

  /* ── TOOLTIPS ── */
  [data-tip] { position: relative; cursor: pointer; }
  [data-tip]::after {
    content: attr(data-tip);
    position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
    background: rgba(10,15,35,0.97); color: #dce8ff;
    font-size: 0.68em; line-height: 1.5; font-weight: 500; white-space: pre-line;
    padding: 7px 11px; border-radius: 9px; border: 1px solid rgba(96,165,250,0.2);
    box-shadow: 0 6px 24px rgba(0,0,0,0.5);
    pointer-events: none; opacity: 0; z-index: 100;
    transition: opacity 0.18s, transform 0.18s;
    transform: translateX(-50%) translateY(4px);
    min-width: 140px; text-align: center;
  }
  [data-tip]:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
  [data-tip]::before {
    content: ''; position: absolute; bottom: calc(100% + 2px); left: 50%;
    transform: translateX(-50%); border: 5px solid transparent;
    border-top-color: rgba(96,165,250,0.25); pointer-events: none;
    opacity: 0; transition: opacity 0.18s; z-index: 100;
  }
  [data-tip]:hover::before { opacity: 1; }

  /* ── COST HIGHLIGHT ── */
  .cost-free { font-size:1.1em; font-weight:800; color:#34d399; text-align:center; }
  .cost-paid { font-size:1.05em; font-weight:800; color:#c084fc; text-align:center; }
  .cost-mixed { font-size:0.72em; text-align:center; color:#a78bfa; line-height:1.6; }

  @media(max-width:380px){.ev-grid{grid-template-columns:1fr 1fr;}.stats{grid-template-columns:repeat(2,1fr);}.car-img-wrap{width:60px;height:34px;}}
`;

if (!document.getElementById('sec-anim-styles')) {
  const s = document.createElement('style');
  s.id = 'sec-anim-styles';
  s.textContent = `@keyframes sec-pulse-ring{0%,100%{opacity:1}50%{opacity:0.6}}@keyframes sec-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
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

  static getConfigElement() { return document.createElement('smooth-energy-card-editor'); }
  static getStubConfig() { return SmoothEnergyCard._defaultConfig(); }

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
      v2c_session_energy: 'sensor.energie_v2c_session',
      v2c_image: '/local/images/v2ctrydan-1.png',
      evs: [
        { name:'Cupra Tavascan', battery:'sensor.cupra_tavascan_battery_level', range:'sensor.cupra_tavascan_electric_range', image:'/local/pycupra/image_VSSZZZKR3RA007706_front_cropped.png', charging:'binary_sensor.cupra_tavascan_charging_state', charging_power:'sensor.cupra_tavascan_charging_power', target_soc:'sensor.cupra_tavascan_target_state_of_charge', battery_capacity:77 },
        { name:'Fiat 500e', battery:'sensor.fiat_500e_berline_my24_hvbattery_charge', range:'sensor.fiat_500e_berline_my24_driving_range', image:'/local/images/Home/fiat500.jpg', charging:'', charging_rate:'sensor.fiat_500e_berline_my24_charging_rate', target_soc:'', battery_capacity:37.3 },
      ],
      devices: [
        { name:'Climatisation', entity:'sensor.shelly2_channel_1_power', icon:'ac' },
        { name:'Ballon ECS',    entity:'sensor.shelly2_channel_2_power', icon:'water' },
        { name:'TV Box',        entity:'sensor.salon_tvbox_power',       icon:'tv' },
        { name:'Lave-linge',   entity:'sensor.machinealaver_power',      icon:'washer' },
        { name:'Informatique', entity:'sensor.smart_switch_24022179241609510d0148e1e9ed2d80_power', icon:'computer' },
        { name:'RaspPi',       entity:'sensor.tplink_ha_rpi_consommation_actuelle', icon:'server' },
      ],
    };
  }

  setConfig(config) {
    if (!config) throw new Error('smooth-energy-card: missing config');
    const migrated = migrateConfig(config);
    const def = SmoothEnergyCard._defaultConfig();
    this._config = { ...def, ...migrated };
    if (migrated.devices !== undefined) this._config.devices = migrated.devices;
    if (migrated.evs !== undefined) this._config.evs = migrated.evs;
    this._render();
  }

  set hass(hass) { this._hass = hass; this._render(); }
  getCardSize() { return 8; }
  disconnectedCallback() { this._clearParticles(); }

  _data() {
    const h = this._hass, c = this._config;
    if (!h || !c) return null;

    const solarW  = toWatts(h, c.solar_power);
    const gridW   = toWatts(h, c.grid_power);
    const houseW  = toWatts(h, c.house_power);
    const v2cW    = toWatts(h, c.v2c_power);
    const price   = numState(h, c.kwh_price, null);
    const isExp   = gridW < 0;
    const gridImpW = isExp ? 0 : gridW;
    const gridExpW = isExp ? Math.abs(gridW) : 0;

    const solarToday    = numState(h, c.solar_today, null);
    const fcToday       = numState(h, c.solar_forecast_today, null);
    const fcTomorrow    = numState(h, c.solar_forecast_tomorrow, null);
    const v2cSessionKwh = numState(h, c.v2c_session_energy, null);

    const chargerActive = v2cW > 10;

    // Process EVs
    let evData = (c.evs || []).map(ev => {
      const bat  = clamp(numState(h, ev.battery, 0), 0, 100);
      const rng  = numState(h, ev.range, 0);
      const targetSoc = ev.target_soc ? numState(h, ev.target_soc, null) : null;
      const isCharging = ev.charging ? strState(h, ev.charging) === 'on' : false;
      const eta  = isCharging ? calcEta(h, bat, ev.charging_power||null, ev.charging_rate||null, ev.target_soc||null, ev.battery_capacity||60) : null;
      return { ...ev, bat, rng, targetSoc, isCharging, eta };
    });
    // Fallback: if charger active and no EV reports charging state, mark first EV
    if (chargerActive && evData.length > 0 && !evData.some(ev => ev.isCharging) && !evData[0].charging) {
      evData[0] = { ...evData[0], isCharging: true };
    }

    let costH = null;
    if (price != null) costH = (gridImpW/1000)*price - (gridExpW/1000)*price*0.11;

    const solarFreeW  = chargerActive ? Math.min(solarW, v2cW) : 0;
    const gridChargeW = chargerActive ? Math.max(0, v2cW - solarW) : 0;
    const chargeCostH = (price != null && chargerActive) ? (gridChargeW/1000)*price : null;
    const sessionCostEst = (v2cSessionKwh > 0 && price != null && chargerActive && v2cW > 10)
      ? v2cSessionKwh * (v2cW > 0 ? gridChargeW/v2cW : 1) * price : null;

    const devices = (c.devices || []).map(d => ({ name:d.name, icon:d.icon||'plug', w:toWatts(h, d.entity) }));

    return {
      solarW, gridW, gridImpW, gridExpW, houseW, v2cW, isExp, price, costH,
      solarToday, fcToday, fcTomorrow, chargerActive,
      solarFreeW, gridChargeW, chargeCostH, sessionCostEst, v2cSessionKwh,
      evData, devices,
      surplusW: Math.max(0, solarW - houseW - v2cW),
    };
  }

  _render() {
    const shadow = this.shadowRoot;
    const d = this._data();
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
      // Draw cable after layout is painted
      requestAnimationFrame(() => requestAnimationFrame(() => this._drawChargingCable(shadow, d)));
    }
  }

  _buildCard(d) {
    const c = this._config;
    const priceStr = d.price != null ? d.price.toFixed(3) + ' €' : '—';
    const hasSurplus = d.surplusW > 50;
    let costClass = 'st-cost', costStr = '—';
    if (d.costH != null) {
      costStr = fmtEur(Math.abs(d.costH)) + '/h';
      costClass = d.costH < 0 ? 'st-earn' : 'st-cost';
    }
    return `
      <div class="header">
        <div class="title-block">
          <div class="title">${c.title || 'Energy'}</div>
          <div class="subtitle">⚡ Live energy monitor · v${VERSION}</div>
        </div>
        <div class="price-pill"><div class="val">${priceStr}</div><div class="lbl">€/kWh</div></div>
      </div>
      <div class="flow-wrap">${this._buildFlowSVG(d)}</div>
      ${hasSurplus ? `<div class="surplus"><span class="s-lbl">☀️ Solar surplus available</span><span class="s-val">${fmtW(d.surplusW)}</span></div>` : ''}
      <div class="stats">
        <div class="stat st-sol" data-tip="Solar produced today\n${fmtKwh(d.solarToday)}"><div class="sv">${fmtKwh(d.solarToday)}</div><div class="sl">Solar Today</div></div>
        <div class="stat st-sol" data-tip="Solar forecast\nToday: ${fmtKwh(d.fcToday)}\nTomorrow: ${fmtKwh(d.fcTomorrow)}"><div class="sv">${fmtKwh(d.fcToday)}</div><div class="sl">Forecast ☀️</div></div>
        <div class="stat ${d.isExp?'st-exp':'st-imp'}" data-tip="${d.isExp?'Exporting to grid\n'+fmtW(d.gridExpW):'Importing from grid\n'+fmtW(d.gridImpW)}${d.price!=null?'\n@'+d.price.toFixed(3)+' €/kWh':''}"><div class="sv">${d.isExp?'↑ '+fmtW(d.gridExpW):'↓ '+fmtW(d.gridImpW)}</div><div class="sl">${d.isExp?'Exporting':'Importing'}</div></div>
        <div class="stat ${costClass}" data-tip="Estimated cost\nGrid import: ${fmtW(d.gridImpW)}\nGrid export: ${fmtW(d.gridExpW)}\nNet: ${d.costH!=null?fmtEur(d.costH)+'/h':'—'}"><div class="sv">${d.costH!=null&&d.costH<0?'🌿 Earning':costStr}</div><div class="sl">Est. Cost</div></div>
      </div>
      <div class="ev-section">
        <div class="section-title">Electric Vehicles &amp; Charger</div>
        <div class="ev-grid">
          ${this._buildCharger(d)}
          ${d.evData.map((ev, i) => this._buildEV(ev, i)).join('')}
        </div>
      </div>
      <div class="section-title">Device Consumption</div>
      <div class="devices-grid">${d.devices.map(dev => this._buildDevice(dev)).join('')}</div>
      <div class="forecast-row">
        <div class="fc-item"><div class="fc-dot" style="background:#fbbf24"></div><span>Today: ${fmtKwh(d.fcToday)}</span></div>
        <div class="fc-item"><div class="fc-dot" style="background:#4a5f8a"></div><span>Tomorrow: ${fmtKwh(d.fcTomorrow)}</span></div>
      </div>`;
  }

  _buildFlowSVG(d) {
    const W=360, H=210;
    const sP={x:58,y:62}, hP={x:180,y:105}, gP={x:302,y:62}, vP={x:180,y:185};
    const R=44, Rv=28;
    const sOn=d.solarW>20, iOn=d.gridImpW>20, eOn=d.gridExpW>20, vOn=d.v2cW>10;
    const sPth=`M${sP.x},${sP.y} C${(sP.x+hP.x)/2-10},${sP.y} ${(sP.x+hP.x)/2+10},${hP.y} ${hP.x},${hP.y}`;
    const iPth=`M${gP.x},${gP.y} C${(gP.x+hP.x)/2+10},${gP.y} ${(gP.x+hP.x)/2-10},${hP.y} ${hP.x},${hP.y}`;
    const ePth=`M${hP.x},${hP.y} C${(hP.x+gP.x)/2-10},${hP.y} ${(hP.x+gP.x)/2+10},${gP.y} ${gP.x},${gP.y}`;
    const vPth=`M${hP.x},${hP.y} L${vP.x},${vP.y}`;
    const gClass=d.isExp?'c-grid-exp':'c-grid-imp';
    const vSolarPct=(vOn&&d.v2cW>0)?Math.round((d.solarFreeW/d.v2cW)*100):0;
    return `
    <svg class="flow-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow-s" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25"/><stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-h" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#60a5fa" stop-opacity="0.18"/><stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${d.isExp?'#34d399':'#f87171'}" stop-opacity="0.2"/><stop offset="100%" stop-color="${d.isExp?'#34d399':'#f87171'}" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-v" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.35"/><stop offset="100%" stop-color="#c084fc" stop-opacity="0"/></radialGradient>
      </defs>
      ${sOn?`<circle cx="${sP.x}" cy="${sP.y}" r="${R+18}" fill="url(#glow-s)"/>`:''}
      <circle cx="${hP.x}" cy="${hP.y}" r="${R+22}" fill="url(#glow-h)"/>
      <circle cx="${gP.x}" cy="${gP.y}" r="${R+14}" fill="url(#glow-g)"/>
      ${vOn?`<circle cx="${vP.x}" cy="${vP.y}" r="${Rv+20}" fill="url(#glow-v)"/>`:''}
      ${sOn?`<path id="pSolar" class="track t-solar" d="${sPth}"/>`:''}
      ${iOn?`<path id="pImp" class="track t-imp" d="${iPth}"/>`:''}
      ${eOn?`<path id="pExp" class="track t-exp" d="${ePth}"/>`:''}
      ${vOn?`<path id="pV2c" class="track t-v2c" d="${vPth}"/>`:''}
      <g id="particles"></g>
      <circle class="n-ring n-solar" cx="${sP.x}" cy="${sP.y}" r="${R}"/>
      <text x="${sP.x}" y="${sP.y-14}" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="${sOn?'#fbbf24':'#2a3558'}">☀️</text>
      <text x="${sP.x}" y="${sP.y+7}" class="n-power ${sOn?'c-solar':'c-idle'}">${sOn?fmtW(d.solarW):'—'}</text>
      <text x="${sP.x}" y="${sP.y+22}" class="n-name">SOLAR</text>
      <circle class="n-ring n-house" cx="${hP.x}" cy="${hP.y}" r="${R}"/>
      <text x="${hP.x}" y="${hP.y-14}" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#60a5fa">🏠</text>
      <text x="${hP.x}" y="${hP.y+7}" class="n-power c-house">${fmtW(d.houseW)}</text>
      <text x="${hP.x}" y="${hP.y+22}" class="n-name">HOUSE</text>
      <circle class="n-ring n-grid" cx="${gP.x}" cy="${gP.y}" r="${R}"/>
      <text x="${gP.x}" y="${gP.y-14}" font-size="18" text-anchor="middle" dominant-baseline="middle" fill="${d.isExp?'#34d399':'#f87171'}">${d.isExp?'↑':'↓'}🔌</text>
      <text x="${gP.x}" y="${gP.y+7}" class="n-power ${gClass}">${fmtW(Math.abs(d.gridW))}</text>
      <text x="${gP.x}" y="${gP.y+22}" class="n-name">${d.isExp?'EXPORT':'IMPORT'}</text>
      ${vOn?`<circle class="v2c-ring-pulse" cx="${vP.x}" cy="${vP.y}" r="${Rv}"/>`:''}
      <circle class="n-ring n-v2c" cx="${vP.x}" cy="${vP.y}" r="${Rv}"/>
      <text x="${vP.x}" y="${vP.y-3}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${vOn?'#c084fc':'#2a2050'}" class="${vOn?'v2c-bolt-active':''}">⚡</text>
      ${vOn
        ?`<text x="${vP.x}" y="${vP.y+12}" class="n-name" style="fill:#a78bfa;font-size:7.5px">${fmtW(d.v2cW)}</text>
          ${vSolarPct>0?`<text x="${vP.x}" y="${vP.y+21}" class="n-name" style="fill:#fbbf24;font-size:7px">☀️${vSolarPct}% free</text>`:''}`
        :`<text x="${vP.x}" y="${vP.y+14}" class="n-name" style="fill:#2a2050;font-size:8px">V2C</text>`}
    </svg>`;
  }

  _buildCharger(d) {
    const c = this._config;
    const active = d.chargerActive;
    const img = c.v2c_image
      ? `<img src="${c.v2c_image}" class="v2c-img${active?' plugged':''}" alt="V2C" onerror="this.style.display='none'">`
      : `<div style="width:32px;height:32px;color:${active?'#c084fc':'#2a1a5a'}">${SVG_ICONS.charge}</div>`;

    let costDisplay = '';
    if (active) {
      const isFree = d.gridChargeW < 10; // nearly all solar
      const isMixed = d.solarFreeW > 10 && d.gridChargeW > 10;

      const solarPct = d.v2cW > 0 ? Math.round((d.solarFreeW / d.v2cW) * 100) : 0;
      const tipLines = [
        `Power: ${fmtW(d.v2cW)}`,
        `☀️ Solar: ${fmtW(d.solarFreeW)} (free)`,
        `⚡ Grid: ${fmtW(d.gridChargeW)}`,
        d.chargeCostH != null ? `Rate: ${d.chargeCostH.toFixed(3)} €/h` : '',
        d.v2cSessionKwh > 0 ? `Session: ${fmtKwh(d.v2cSessionKwh)}` : '',
        d.sessionCostEst != null ? `Session cost: ~${d.sessionCostEst.toFixed(2)} €` : '',
      ].filter(Boolean).join('\n');

      if (isFree) {
        costDisplay = `
          <div class="cost-free" data-tip="${tipLines}">☀️ FREE</div>
          <div class="cost-mixed">100% solar power</div>`;
      } else if (isMixed) {
        const estCostStr = d.sessionCostEst != null ? `~${d.sessionCostEst.toFixed(2)} €` : (d.chargeCostH != null ? `${d.chargeCostH.toFixed(3)} €/h` : '');
        costDisplay = `
          <div class="cost-paid" data-tip="${tipLines}">${estCostStr}</div>
          <div class="cost-mixed">☀️ ${solarPct}% free · ⚡ ${100-solarPct}% grid</div>`;
      } else {
        const estCostStr = d.sessionCostEst != null ? `~${d.sessionCostEst.toFixed(2)} €` : (d.chargeCostH != null ? `${d.chargeCostH.toFixed(3)} €/h` : '—');
        costDisplay = `
          <div class="cost-paid" data-tip="${tipLines}">${estCostStr}</div>
          <div class="cost-mixed">⚡ Grid only</div>`;
      }

      if (d.v2cSessionKwh > 0) {
        costDisplay += `<div style="font-size:0.58em;color:#4a3a7a;margin-top:2px">Session: ${fmtKwh(d.v2cSessionKwh)}</div>`;
      }
    }

    const tipIdle = 'V2C Charger\nNo vehicle connected';
    return `
      <div class="ev-card ev-charger${active?' plugged':''}" data-tip="${active?'':'V2C Charger\nIdle — no vehicle connected'}">
        <div class="ev-name">V2C Charger</div>
        ${img}
        ${active
          ? `<div class="charger-power">${fmtW(d.v2cW)}</div><div class="charger-sub">Charging…</div>${costDisplay}`
          : `<div class="charger-idle">Idle</div>`}
      </div>`;
  }

  _buildEV(ev, index) {
    const theme = EV_THEMES[index % EV_THEMES.length];
    const r = 22, circ = 2 * Math.PI * r;
    const offset = circ * (1 - ev.bat / 100);
    const col = ev.bat > 50 ? '#34d399' : ev.bat > 20 ? '#fbbf24' : '#f87171';
    const targetOffset = ev.targetSoc != null ? circ * (1 - ev.targetSoc / 100) : null;
    const targetArc = (targetOffset != null && ev.isCharging)
      ? `<circle cx="28" cy="28" r="${r}" fill="none" stroke="rgba(52,211,153,0.35)" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 ${(circ-3).toFixed(2)}" stroke-dashoffset="${(targetOffset-1.5).toFixed(2)}" style="pointer-events:none"/>` : '';
    const imgEl = ev.image
      ? `<div class="car-img-wrap"><img src="${ev.image}" alt="${ev.name}" loading="lazy" onerror="this.parentElement.style.display='none'">${ev.isCharging?`<div class="charging-badge">⚡ CHG</div>`:''}</div>` : '';
    const etaLine = (ev.isCharging && ev.eta)
      ? `<div class="ev-eta">🏁 ${ev.eta}${ev.targetSoc!=null?' → '+ev.targetSoc+'%':''}</div>` : '';
    const batTip = [
      `${ev.name}`,
      `Battery: ${ev.bat}%`,
      `Range: ${ev.rng} km`,
      ev.targetSoc != null ? `Target SoC: ${ev.targetSoc}%` : '',
      ev.isCharging && ev.eta ? `ETA: ${ev.eta}` : '',
      ev.isCharging ? 'Charging via V2C' : '',
    ].filter(Boolean).join('\n');

    return `
      <div class="ev-card ${theme.cls}${ev.isCharging?' ev-is-charging':''}">
        <div class="ev-name">${ev.name}${ev.isCharging?' ⚡':''}</div>
        ${imgEl}
        <div class="bat-ring" data-tip="${batTip}">
          <svg viewBox="0 0 56 56">
            <circle class="bat-bg" cx="28" cy="28" r="${r}"/>
            <circle class="bat-fill" cx="28" cy="28" r="${r}" stroke="${ev.isCharging?'#34d399':col}" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>
            ${targetArc}
          </svg>
          <div class="bat-text">${ev.bat}<sub>%</sub></div>
        </div>
        <div class="ev-range" data-tip="${ev.rng} km range\n≈ ${Math.round(ev.rng / 6)} h driving">${ev.rng} <em>km</em></div>
        ${etaLine}
      </div>`;
  }

  _buildDevice(dev) {
    const on = dev.w > 5;
    const icon = SVG_ICONS[dev.icon] || SVG_ICONS.plug;
    return `<div class="device${on?' on':''}"><div class="dev-icon ${on?'on':'off'}">${icon}</div><div class="dev-name">${dev.name}</div><div class="dev-power">${fmtW(dev.w)}</div></div>`;
  }

  _drawChargingCable(shadow, d) {
    if (!d.chargerActive) return;
    const chargingIdx = d.evData.findIndex(ev => ev.isCharging);
    if (chargingIdx < 0) return;

    const evSection = shadow.querySelector('.ev-section');
    const chargerCard = shadow.querySelector('.ev-charger');
    const evCards = Array.from(shadow.querySelectorAll('.ev-card:not(.ev-charger)'));
    const evCard = evCards[chargingIdx];
    if (!chargerCard || !evCard || !evSection) return;

    evSection.style.position = 'relative';
    const sR = evSection.getBoundingClientRect();
    const cR = chargerCard.getBoundingClientRect();
    const eR = evCard.getBoundingClientRect();

    // Points relative to ev-section
    const x1 = cR.right - sR.left, y1 = cR.top + cR.height * 0.45 - sR.top;
    const x2 = eR.left  - sR.left, y2 = eR.top + eR.height * 0.45 - sR.top;
    const mx = (x1 + x2) / 2;
    const pathD = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;

    // Remove old overlay
    const old = shadow.querySelector('.cable-overlay');
    if (old) old.remove();

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('cable-overlay');
    svg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:${sR.height}px;pointer-events:none;overflow:visible;z-index:5;`;

    const defs = document.createElementNS(ns, 'defs');
    defs.innerHTML = `
      <linearGradient id="cbl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c084fc"/>
        <stop offset="100%" stop-color="#34d399"/>
      </linearGradient>`;

    const track = document.createElementNS(ns, 'path');
    track.setAttribute('d', pathD);
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke', 'url(#cbl-grad)');
    track.setAttribute('stroke-width', '2.5');
    track.setAttribute('stroke-linecap', 'round');
    track.setAttribute('opacity', '0.5');
    track.classList.add('cable-track');

    const animPath = document.createElementNS(ns, 'path');
    animPath.setAttribute('d', pathD);
    animPath.setAttribute('fill', 'none');
    animPath.setAttribute('stroke', 'none');
    animPath.id = 'cable-anim-path';

    const particles = document.createElementNS(ns, 'g');
    particles.id = 'cable-particles';

    svg.appendChild(defs);
    svg.appendChild(track);
    svg.appendChild(animPath);
    svg.appendChild(particles);
    evSection.appendChild(svg);

    // Animate particles along cable
    const interval = setInterval(() => {
      const p = shadow.getElementById('cable-anim-path');
      const cont = shadow.getElementById('cable-particles');
      if (!p || !cont) { clearInterval(interval); return; }
      this._spawnDot(p, cont, '#a78bfa');
    }, 350);
    this._particleTimers.push(interval);
  }

  _clearParticles() {
    this._particleTimers.forEach(t => clearInterval(t));
    this._particleTimers = [];
    this._animFrames.forEach(af => cancelAnimationFrame(af));
    this._animFrames = [];
  }

  _startParticles(shadow, d) {
    [
      { id:'pSolar', col:'#fbbf24', w:d.solarW,    active:d.solarW>20 },
      { id:'pImp',   col:'#f87171', w:d.gridImpW,  active:d.gridImpW>20 },
      { id:'pExp',   col:'#34d399', w:d.gridExpW,  active:d.gridExpW>20 },
      { id:'pV2c',   col:'#c084fc', w:d.v2cW,      active:d.v2cW>10 },
    ].filter(f => f.active).forEach(flow => {
      const ms = Math.max(300, Math.round(1200 / clamp(flow.w/1000, 0.2, 4)));
      this._particleTimers.push(setInterval(() => {
        const path = shadow.getElementById(flow.id);
        const cont = shadow.getElementById('particles');
        if (path && cont) this._spawnDot(path, cont, flow.col);
      }, ms));
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
    const dur = 1000 + Math.random() * 700, t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const pt = pathEl.getPointAtLength(p * len);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      const op = p < 0.12 ? p/0.12 : p > 0.88 ? (1-p)/0.12 : 1;
      dot.setAttribute('opacity', (op * 0.92).toFixed(3));
      if (p < 1) this._animFrames.push(requestAnimationFrame(step));
      else dot.remove();
    };
    this._animFrames.push(requestAnimationFrame(step));
  }
}

// ─── Card Editor ──────────────────────────────────────────────────────────────
class SmoothEnergyCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = SmoothEnergyCard._defaultConfig();
    this._hass = null;
  }

  setConfig(config) {
    this._config = { ...SmoothEnergyCard._defaultConfig(), ...migrateConfig(config) };
    if (config.devices !== undefined) this._config.devices = config.devices;
    if (config.evs !== undefined) this._config.evs = config.evs;
    this._render();
  }

  set hass(h) {
    this._hass = h;
    this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(el => { el.hass = h; });
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  _set(key, value) { this._config = { ...this._config, [key]: value }; this._fire(); }

  _setEv(idx, key, value) {
    const evs = this._config.evs.map((ev, i) => i === idx ? { ...ev, [key]: value } : ev);
    this._set('evs', evs);
  }
  _addEv() {
    const evs = [...(this._config.evs || []), { name: 'New EV', battery: '', range: '', image: '', charging: '', charging_power: '', target_soc: '', battery_capacity: 60 }];
    this._set('evs', evs);
    this._render();
  }
  _removeEv(idx) {
    const evs = (this._config.evs || []).filter((_, i) => i !== idx);
    this._set('evs', evs);
    this._render();
  }

  _setDevice(idx, key, value) {
    const devices = (this._config.devices || []).map((d, i) => i === idx ? { ...d, [key]: value } : d);
    this._set('devices', devices);
  }
  _addDevice() {
    const devices = [...(this._config.devices || []), { name: 'New Device', entity: '', icon: 'plug' }];
    this._set('devices', devices);
    this._render();
  }
  _removeDevice(idx) {
    const devices = (this._config.devices || []).filter((_, i) => i !== idx);
    this._set('devices', devices);
    this._render();
  }

  _render() {
    const c = this._config;
    const evs = c.evs || [];
    const devices = c.devices || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        * { box-sizing: border-box; }
        .editor {
          font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
          font-size: 14px;
          padding: 4px 0 16px;
        }
        /* Section */
        .section {
          background: var(--card-background-color, #fff);
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px 10px;
          background: var(--secondary-background-color, #f5f5f5);
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        .section-head h3 {
          margin: 0;
          font-size: 0.78em;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--primary-color, #3b82f6);
        }
        .section-body { padding: 12px 16px; }
        .row { display: grid; gap: 10px; margin-bottom: 10px; }
        .row.cols-2 { grid-template-columns: 1fr 1fr; }
        .row.cols-1 { grid-template-columns: 1fr; }
        .row:last-child { margin-bottom: 0; }
        /* Field */
        .field { display: flex; flex-direction: column; gap: 3px; }
        .field label {
          font-size: 0.72em; font-weight: 600;
          color: var(--secondary-text-color, #777);
          letter-spacing: 0.3px;
        }
        ha-entity-picker { display: block; }
        input[type="text"], input[type="number"], select {
          width: 100%;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 0.85em;
          font-family: inherit;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #333);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        input:focus, select:focus { border-color: var(--primary-color, #3b82f6); box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
        .hint {
          font-size: 0.7em;
          color: var(--disabled-text-color, #aaa);
          margin: 2px 0 0;
          line-height: 1.4;
        }
        /* EV / Device card */
        .list-item {
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
          position: relative;
          background: var(--secondary-background-color, #fafafa);
        }
        .list-item:last-child { margin-bottom: 0; }
        .list-item-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .list-item-title { font-size: 0.8em; font-weight: 700; color: var(--primary-text-color, #333); }
        .btn-remove {
          background: none; border: none; cursor: pointer; padding: 4px 6px;
          color: var(--error-color, #ef4444); border-radius: 6px;
          font-size: 0.9em; line-height: 1;
          transition: background 0.2s;
        }
        .btn-remove:hover { background: rgba(239,68,68,0.1); }
        .btn-add {
          display: flex; align-items: center; gap: 6px; justify-content: center;
          width: 100%; padding: 9px;
          border: 2px dashed var(--divider-color, #ccc);
          border-radius: 8px; background: none; cursor: pointer;
          font-size: 0.8em; font-weight: 600;
          color: var(--primary-color, #3b82f6);
          transition: border-color 0.2s, background 0.2s;
          margin-top: 8px;
        }
        .btn-add:hover { border-color: var(--primary-color, #3b82f6); background: rgba(59,130,246,0.04); }
        /* Icon select with preview */
        .icon-row { display: flex; align-items: center; gap: 8px; }
        .icon-preview { width: 20px; height: 20px; color: var(--primary-color, #3b82f6); flex-shrink: 0; }
        select.icon-select { flex: 1; }
      </style>
      <div class="editor">

        <!-- GENERAL -->
        <div class="section">
          <div class="section-head"><h3>⚙️ General</h3></div>
          <div class="section-body">
            <div class="row cols-1">
              <div class="field">
                <label>Card Title</label>
                <input type="text" data-key="title" value="${(c.title||'').replace(/"/g,'&quot;')}" placeholder="Energy Dashboard">
              </div>
            </div>
          </div>
        </div>

        <!-- POWER SENSORS -->
        <div class="section">
          <div class="section-head"><h3>⚡ Power Sensors</h3></div>
          <div class="section-body">
            <div class="row cols-1">
              <div class="field">
                <label>Solar Power</label>
                <ha-entity-picker data-key="solar_power" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-1">
              <div class="field">
                <label>Grid Power <span style="color:#f59e0b">(negative = exporting)</span></label>
                <ha-entity-picker data-key="grid_power" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-2">
              <div class="field">
                <label>House Consumption</label>
                <ha-entity-picker data-key="house_power" allow-custom-entity></ha-entity-picker>
              </div>
              <div class="field">
                <label>V2C Charger Power</label>
                <ha-entity-picker data-key="v2c_power" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-1">
              <div class="field">
                <label>Electricity Price (€/kWh)</label>
                <ha-entity-picker data-key="kwh_price" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
          </div>
        </div>

        <!-- SOLAR & SESSION -->
        <div class="section">
          <div class="section-head"><h3>☀️ Solar &amp; Session Data</h3></div>
          <div class="section-body">
            <div class="row cols-2">
              <div class="field">
                <label>Solar Production Today</label>
                <ha-entity-picker data-key="solar_today" allow-custom-entity></ha-entity-picker>
              </div>
              <div class="field">
                <label>V2C Session Energy</label>
                <ha-entity-picker data-key="v2c_session_energy" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-2">
              <div class="field">
                <label>Forecast Today</label>
                <ha-entity-picker data-key="solar_forecast_today" allow-custom-entity></ha-entity-picker>
              </div>
              <div class="field">
                <label>Forecast Tomorrow</label>
                <ha-entity-picker data-key="solar_forecast_tomorrow" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
          </div>
        </div>

        <!-- V2C CHARGER -->
        <div class="section">
          <div class="section-head"><h3>🔌 V2C Charger</h3></div>
          <div class="section-body">
            <div class="row cols-1">
              <div class="field">
                <label>Charger Image URL</label>
                <input type="text" data-key="v2c_image" value="${(c.v2c_image||'').replace(/"/g,'&quot;')}" placeholder="/local/images/v2ctrydan-1.png">
              </div>
            </div>
          </div>
        </div>

        <!-- ELECTRIC VEHICLES -->
        <div class="section">
          <div class="section-head">
            <h3>🚗 Electric Vehicles</h3>
          </div>
          <div class="section-body" id="evs-body">
            ${evs.map((ev, i) => this._buildEvForm(ev, i)).join('')}
            <button class="btn-add" data-action="add-ev">+ Add Vehicle</button>
          </div>
        </div>

        <!-- DEVICES -->
        <div class="section">
          <div class="section-head">
            <h3>🔌 Devices &amp; Smart Plugs</h3>
          </div>
          <div class="section-body" id="devices-body">
            ${devices.map((dev, i) => this._buildDeviceForm(dev, i)).join('')}
            <button class="btn-add" data-action="add-device">+ Add Device</button>
          </div>
        </div>

      </div>`;

    this._setupInteractivity();
  }

  _buildEvForm(ev, i) {
    return `
      <div class="list-item" data-ev-index="${i}">
        <div class="list-item-head">
          <span class="list-item-title">🚗 ${ev.name || 'EV ' + (i+1)}</span>
          <button class="btn-remove" data-action="remove-ev" data-index="${i}" title="Remove">✕</button>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Display Name</label>
            <input type="text" data-ev="${i}" data-ev-key="name" value="${(ev.name||'').replace(/"/g,'&quot;')}" placeholder="EV Name">
          </div>
          <div class="field">
            <label>Car Image URL</label>
            <input type="text" data-ev="${i}" data-ev-key="image" value="${(ev.image||'').replace(/"/g,'&quot;')}" placeholder="/local/...">
          </div>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Battery %</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="battery" allow-custom-entity></ha-entity-picker>
          </div>
          <div class="field">
            <label>Range (km)</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="range" allow-custom-entity></ha-entity-picker>
          </div>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Charging State</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="charging" allow-custom-entity></ha-entity-picker>
            <span class="hint">binary_sensor — on = charging</span>
          </div>
          <div class="field">
            <label>Charging Power (kW)</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="charging_power" allow-custom-entity></ha-entity-picker>
            <span class="hint">For ETA calculation</span>
          </div>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Charging Rate (%/h)</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="charging_rate" allow-custom-entity></ha-entity-picker>
            <span class="hint">Alternative to kW for ETA</span>
          </div>
          <div class="field">
            <label>Target SoC</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="target_soc" allow-custom-entity></ha-entity-picker>
            <span class="hint">For ETA goal</span>
          </div>
        </div>
        <div class="row cols-1">
          <div class="field">
            <label>Battery Capacity (kWh) — used for ETA from kW</label>
            <input type="number" data-ev="${i}" data-ev-key="battery_capacity" value="${ev.battery_capacity||60}" min="1" max="200" step="0.1">
          </div>
        </div>
      </div>`;
  }

  _buildDeviceForm(dev, i) {
    const iconOptions = DEVICE_ICONS.map(ic =>
      `<option value="${ic.value}"${dev.icon===ic.value?' selected':''}>${ic.label}</option>`
    ).join('');
    return `
      <div class="list-item" data-dev-index="${i}">
        <div class="list-item-head">
          <span class="list-item-title">${dev.name || 'Device ' + (i+1)}</span>
          <button class="btn-remove" data-action="remove-device" data-index="${i}" title="Remove">✕</button>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Display Name</label>
            <input type="text" data-dev="${i}" data-dev-key="name" value="${(dev.name||'').replace(/"/g,'&quot;')}" placeholder="Device name">
          </div>
          <div class="field">
            <label>Icon</label>
            <select data-dev="${i}" data-dev-key="icon">${iconOptions}</select>
          </div>
        </div>
        <div class="row cols-1">
          <div class="field">
            <label>Power Sensor</label>
            <ha-entity-picker data-dev="${i}" data-dev-key="entity" allow-custom-entity></ha-entity-picker>
          </div>
        </div>
      </div>`;
  }

  _setupInteractivity() {
    const sr = this.shadowRoot;
    const c = this._config;

    // Top-level entity pickers
    sr.querySelectorAll('ha-entity-picker[data-key]').forEach(el => {
      if (this._hass) el.hass = this._hass;
      el.value = c[el.dataset.key] || '';
      el.addEventListener('value-changed', e => {
        this._set(el.dataset.key, e.detail.value);
      });
    });

    // Top-level text/number inputs
    sr.querySelectorAll('input[data-key], select[data-key]').forEach(el => {
      el.addEventListener('change', () => { this._set(el.dataset.key, el.value); });
    });

    // EV entity pickers
    sr.querySelectorAll('ha-entity-picker[data-ev]').forEach(el => {
      const idx = parseInt(el.dataset.ev), key = el.dataset.evKey;
      if (this._hass) el.hass = this._hass;
      el.value = ((c.evs || [])[idx] || {})[key] || '';
      el.addEventListener('value-changed', e => { this._setEv(idx, key, e.detail.value); });
    });

    // EV text/number inputs
    sr.querySelectorAll('input[data-ev], select[data-ev]').forEach(el => {
      const idx = parseInt(el.dataset.ev), key = el.dataset.evKey;
      el.addEventListener('change', () => { this._setEv(idx, key, el.type === 'number' ? parseFloat(el.value) : el.value); });
    });

    // Device entity pickers
    sr.querySelectorAll('ha-entity-picker[data-dev]').forEach(el => {
      const idx = parseInt(el.dataset.dev);
      if (this._hass) el.hass = this._hass;
      el.value = ((c.devices || [])[idx] || {}).entity || '';
      el.addEventListener('value-changed', e => { this._setDevice(idx, 'entity', e.detail.value); });
    });

    // Device text/select inputs
    sr.querySelectorAll('input[data-dev], select[data-dev]').forEach(el => {
      const idx = parseInt(el.dataset.dev), key = el.dataset.devKey;
      el.addEventListener('change', () => { this._setDevice(idx, key, el.value); });
    });

    // Action buttons
    sr.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action, idx = btn.dataset.index !== undefined ? parseInt(btn.dataset.index) : null;
        if (action === 'add-ev')       this._addEv();
        if (action === 'remove-ev')    this._removeEv(idx);
        if (action === 'add-device')   this._addDevice();
        if (action === 'remove-device') this._removeDevice(idx);
      });
    });
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
    documentationURL: 'https://github.com/khrom06/Smooth-Energy-Card',
  });
}

console.info(
  `%c SMOOTH-ENERGY-CARD %c v${VERSION} `,
  'color:#fff;background:linear-gradient(90deg,#3b82f6,#8b5cf6);padding:3px 8px;border-radius:4px 0 0 4px;font-weight:700',
  'color:#60a5fa;background:#0f1428;padding:3px 8px;border-radius:0 4px 4px 0',
);
