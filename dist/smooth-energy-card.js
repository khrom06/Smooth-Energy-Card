/**
 * Smooth Energy Card v1.8.0
 * A beautiful animated energy monitoring card for Home Assistant.
 *
 * @license MIT
 * @version 1.7.5
 */

const VERSION = '1.8.2';

// ─── Translations ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    solar:'SOLAR', house:'HOUSE', export:'EXPORT', import:'IMPORT',
    v2c:'V2C', batt:'BATT', idle:'IDLE', v2g:'▲ V2G',
    solar_today:'Solar Today', forecast:'Forecast ☀️',
    exporting:'Exporting', importing:'Importing', est_cost:'Est. Cost', earning:'🌿 Earning',
    ev_section:'Electric Vehicles & Charger', dev_section:'Device Consumption',
    today_summary:"Today's Summary",
    charging:'Charging…', charger_idle:'Idle', discharging:'↑ Discharging to home',
    cost_free:'☀️ FREE', solar_100:'100% solar power', grid_only:'⚡ Grid only',
    charging_via:'Charging via V2C',
    cost_today:'Cost Today', solar_savings:'Solar Savings', revenue:'Revenue', exported_lbl:'Exported',
    solar_powered:'Solar powered today', live_suff:'Live self-sufficiency',
    bleu_note:'Low tariff day', blanc_note:'Standard tariff day',
    rouge_note:'⚠️ Peak tariff — avoid heavy consumption',
    tomorrow:'Tomorrow', surplus:'☀️ Solar surplus available',
    fc_today:'Today', fc_tomorrow:'Tomorrow',
    subtitle:'Live energy monitor',
    bat_label:'Battery', range_label:'Range', target_lbl:'Target SoC', eta_lbl:'ETA',
    copied:'✓ Copied to clipboard!', clip_err:'⚠️ Clipboard not available',
    reco_free: w => `FREE solar charging — ${w} from sun`,
    reco_surplus: w => `${w} solar surplus — start charging for free`,
    reco_rouge: p => `ROUGE day${p} — avoid heavy consumption today`,
    reco_tmr_rouge: 'Tomorrow is ROUGE — charge today while tariff is low',
    reco_bleu: p => `BLEU tariff day${p} — good time to charge`,
    reco_cheap: p => `Low tariff now (${p}) — good time to charge`,
    reco_expensive: p => `High tariff now (${p}) — wait for off-peak`,
    tip_range: (km, h) => `${km} km range\n≈ ${h} h driving`,
    tip_bat: (name, bat, rng, tgt, eta) => [name,`Battery: ${bat}%`,`Range: ${rng} km`,tgt?`Target SoC: ${tgt}%`:'',eta?`ETA: ${eta}`:''].filter(Boolean).join('\n'),
    demand_high: w => `High grid demand (${w}) — consider reducing load`,
    peak_shave: w => `Battery available — discharge can offset ${w} of grid import`,
    peak_shave_solar: w => `${w} solar available — switch heavy loads to solar`,
    co2_saved: kg => `${kg} kg CO₂ saved today`,
    batt_health: pct => `Battery health ~${pct}%`,
    load_profile: lbl => `Load: ${lbl}`,
    load_efficient:'efficient', load_moderate:'moderate', load_heavy:'heavy',
    ev_opt_solar:'☀️ Free solar charging available — start now',
    ev_opt_cheap: p => `Low tariff (${p}) — good time to charge`,
    ev_opt_wait:'⏳ High tariff — wait for cheaper rates',
    dev_sched_solar:'☀️ Run heavy appliances now — free solar available',
    dev_sched_cheap: p => `Run heavy appliances now — low tariff (${p})`,
    dev_sched_wait:'⏳ Delay heavy appliances — tariff is high',
    weather_lbl:'Weather',
  },
  fr: {
    solar:'SOLAIRE', house:'MAISON', export:'EXPORT', import:'IMPORT',
    v2c:'V2C', batt:'BATT', idle:'INACTIF', v2g:'▲ V2G',
    solar_today:"Solaire aujourd'hui", forecast:'Prévision ☀️',
    exporting:'Injection', importing:'Soutirage', est_cost:'Coût estimé', earning:'🌿 Revenu',
    ev_section:'Véhicules & Chargeur', dev_section:'Consommation appareils',
    today_summary:'Résumé du jour',
    charging:'Charge en cours…', charger_idle:'Inactif', discharging:'↑ Décharge vers maison',
    cost_free:'☀️ GRATUIT', solar_100:'100% énergie solaire', grid_only:'⚡ Réseau uniquement',
    charging_via:'Charge via V2C',
    cost_today:"Coût aujourd'hui", solar_savings:'Économies solaires', revenue:'Revenu', exported_lbl:'Injecté',
    solar_powered:'Alimenté par le solaire', live_suff:'Autonomie en direct',
    bleu_note:'Jour à faible tarif', blanc_note:'Jour à tarif standard',
    rouge_note:'⚠️ Tarif de pointe — éviter les fortes conso.',
    tomorrow:'Demain', surplus:'☀️ Surplus solaire disponible',
    fc_today:"Aujourd'hui", fc_tomorrow:'Demain',
    subtitle:'Monitoring énergie en direct',
    bat_label:'Batterie', range_label:'Autonomie', target_lbl:'SoC cible', eta_lbl:'Durée',
    copied:'✓ Copié dans le presse-papier !', clip_err:'⚠️ Presse-papier non disponible',
    reco_free: w => `Charge GRATUITE solaire — ${w} du soleil`,
    reco_surplus: w => `${w} surplus solaire — chargez gratuitement`,
    reco_rouge: p => `Jour ROUGE${p} — évitez la consommation aujourd'hui`,
    reco_tmr_rouge: "Demain est ROUGE — chargez aujourd'hui pendant que le tarif est bas",
    reco_bleu: p => `Jour BLEU${p} — bon moment pour charger`,
    reco_cheap: p => `Tarif bas (${p}) — bon moment pour charger`,
    reco_expensive: p => `Tarif élevé (${p}) — attendre les heures creuses`,
    tip_range: (km, h) => `${km} km d'autonomie\n≈ ${h} h de conduite`,
    tip_bat: (name, bat, rng, tgt, eta) => [name,`Batterie: ${bat}%`,`Autonomie: ${rng} km`,tgt?`SoC cible: ${tgt}%`:'',eta?`Durée: ${eta}`:''].filter(Boolean).join('\n'),
    demand_high: w => `Soutirage réseau élevé (${w}) — réduire la consommation`,
    peak_shave: w => `Batterie disponible — décharge peut compenser ${w} de soutirage`,
    peak_shave_solar: w => `${w} solaire disponible — basculer les appareils sur solaire`,
    co2_saved: kg => `${kg} kg de CO₂ économisé aujourd'hui`,
    batt_health: pct => `Santé batterie ~${pct}%`,
    load_profile: lbl => `Charge: ${lbl}`,
    load_efficient:'efficace', load_moderate:'modérée', load_heavy:'élevée',
    ev_opt_solar:'☀️ Charge solaire gratuite disponible — lancez maintenant',
    ev_opt_cheap: p => `Tarif bas (${p}) — bon moment pour charger`,
    ev_opt_wait:'⏳ Tarif élevé — attendre un meilleur moment',
    dev_sched_solar:'☀️ Lancez vos appareils gourmands — solaire gratuit disponible',
    dev_sched_cheap: p => `Lancez vos appareils maintenant — tarif bas (${p})`,
    dev_sched_wait:'⏳ Différez les appareils gourmands — tarif élevé',
    weather_lbl:'Météo',
  },
  es: {
    solar:'SOLAR', house:'CASA', export:'EXPORTAR', import:'IMPORTAR',
    v2c:'V2C', batt:'BATERÍA', idle:'INACTIVO', v2g:'▲ V2G',
    solar_today:'Solar Hoy', forecast:'Previsión ☀️',
    exporting:'Exportando', importing:'Importando', est_cost:'Coste est.', earning:'🌿 Ganando',
    ev_section:'Vehículos & Cargador', dev_section:'Consumo de dispositivos',
    today_summary:'Resumen de hoy',
    charging:'Cargando…', charger_idle:'Inactivo', discharging:'↑ Descargando a casa',
    cost_free:'☀️ GRATIS', solar_100:'100% energía solar', grid_only:'⚡ Solo red',
    charging_via:'Cargando vía V2C',
    cost_today:'Coste hoy', solar_savings:'Ahorros solares', revenue:'Ingresos', exported_lbl:'Exportado',
    solar_powered:'Alimentado por solar hoy', live_suff:'Autosuficiencia en vivo',
    bleu_note:'Día tarifa baja', blanc_note:'Día tarifa estándar',
    rouge_note:'⚠️ Tarifa punta — evitar consumo alto',
    tomorrow:'Mañana', surplus:'☀️ Excedente solar disponible',
    fc_today:'Hoy', fc_tomorrow:'Mañana',
    subtitle:'Monitor energía en tiempo real',
    bat_label:'Batería', range_label:'Autonomía', target_lbl:'SoC objetivo', eta_lbl:'ETA',
    copied:'✓ ¡Copiado al portapapeles!', clip_err:'⚠️ Portapapeles no disponible',
    reco_free: w => `Carga GRATIS solar — ${w} del sol`,
    reco_surplus: w => `${w} excedente solar — carga gratis`,
    reco_rouge: p => `Día ROUGE${p} — evitar consumo hoy`,
    reco_tmr_rouge: 'Mañana es ROUGE — carga hoy con tarifa baja',
    reco_bleu: p => `Día BLEU${p} — buen momento para cargar`,
    reco_cheap: p => `Tarifa baja (${p}) — buen momento para cargar`,
    reco_expensive: p => `Tarifa alta (${p}) — esperar horas valle`,
    tip_range: (km, h) => `${km} km de autonomía\n≈ ${h} h conduciendo`,
    tip_bat: (name, bat, rng, tgt, eta) => [name,`Batería: ${bat}%`,`Autonomía: ${rng} km`,tgt?`SoC objetivo: ${tgt}%`:'',eta?`ETA: ${eta}`:''].filter(Boolean).join('\n'),
    demand_high: w => `Alta demanda de red (${w}) — reducir consumo`,
    peak_shave: w => `Batería disponible — descarga puede compensar ${w}`,
    peak_shave_solar: w => `${w} solar disponible — usar cargas pesadas ahora`,
    co2_saved: kg => `${kg} kg CO₂ ahorrado hoy`,
    batt_health: pct => `Salud batería ~${pct}%`,
    load_profile: lbl => `Carga: ${lbl}`,
    load_efficient:'eficiente', load_moderate:'moderada', load_heavy:'alta',
    ev_opt_solar:'☀️ Carga solar gratuita disponible — empieza ahora',
    ev_opt_cheap: p => `Tarifa baja (${p}) — buen momento para cargar`,
    ev_opt_wait:'⏳ Tarifa alta — esperar mejores tarifas',
    dev_sched_solar:'☀️ Usa electrodomésticos pesados ahora — solar gratis disponible',
    dev_sched_cheap: p => `Usa electrodomésticos ahora — tarifa baja (${p})`,
    dev_sched_wait:'⏳ Retrasa electrodomésticos pesados — tarifa alta',
    weather_lbl:'Tiempo',
  },
  zh: {
    solar:'太阳能', house:'用电', export:'并网', import:'用网',
    v2c:'充电桩', batt:'电池', idle:'空闲', v2g:'▲ V2G',
    solar_today:'今日发电', forecast:'预报 ☀️',
    exporting:'输出电网', importing:'从电网购', est_cost:'预估费用', earning:'🌿 收益',
    ev_section:'电动汽车 & 充电桩', dev_section:'设备用电',
    today_summary:'今日汇总',
    charging:'充电中…', charger_idle:'空闲', discharging:'↑ 向家放电',
    cost_free:'☀️ 免费', solar_100:'100% 太阳能', grid_only:'⚡ 仅电网',
    charging_via:'通过V2C充电',
    cost_today:'今日费用', solar_savings:'太阳能节省', revenue:'售电收益', exported_lbl:'已输出',
    solar_powered:'今日太阳能占比', live_suff:'实时自给率',
    bleu_note:'低价日', blanc_note:'标准价日',
    rouge_note:'⚠️ 高峰价日 — 减少用电',
    tomorrow:'明天', surplus:'☀️ 太阳能盈余',
    fc_today:'今天', fc_tomorrow:'明天',
    subtitle:'实时能源监控',
    bat_label:'电池', range_label:'续航', target_lbl:'目标SoC', eta_lbl:'预计',
    copied:'✓ 已复制到剪贴板！', clip_err:'⚠️ 剪贴板不可用',
    reco_free: w => `太阳能免费充电 — ${w}`,
    reco_surplus: w => `${w} 太阳能盈余 — 免费充电`,
    reco_rouge: p => `高峰价日${p} — 今日避免大量用电`,
    reco_tmr_rouge: '明天高峰价 — 趁今天低价充电',
    reco_bleu: p => `低价日${p} — 适合充电`,
    reco_cheap: p => `当前低电价 (${p}) — 适合充电`,
    reco_expensive: p => `当前高电价 (${p}) — 等待低谷时段`,
    tip_range: (km, h) => `续航 ${km} km\n约 ${h} 小时行驶`,
    tip_bat: (name, bat, rng, tgt, eta) => [name,`电池: ${bat}%`,`续航: ${rng} km`,tgt?`目标SoC: ${tgt}%`:'',eta?`预计: ${eta}`:''].filter(Boolean).join('\n'),
    demand_high: w => `电网需求高 (${w}) — 减少用电`,
    peak_shave: w => `电池可用 — 放电抵消 ${w} 用网电量`,
    peak_shave_solar: w => `${w} 太阳能可用 — 现在使用大功率设备`,
    co2_saved: kg => `今日节省 ${kg} kg CO₂`,
    batt_health: pct => `电池健康 ~${pct}%`,
    load_profile: lbl => `负荷: ${lbl}`,
    load_efficient:'高效', load_moderate:'适中', load_heavy:'偏高',
    ev_opt_solar:'☀️ 免费太阳能充电可用 — 立即开始',
    ev_opt_cheap: p => `低电价 (${p}) — 适合充电`,
    ev_opt_wait:'⏳ 电价高 — 等待低价时段',
    dev_sched_solar:'☀️ 现在启动大功率设备 — 免费太阳能可用',
    dev_sched_cheap: p => `现在启动大功率设备 — 低电价 (${p})`,
    dev_sched_wait:'⏳ 延迟大功率设备 — 当前电价高',
    weather_lbl:'天气',
  },
  ja: {
    solar:'ソーラー', house:'消費', export:'売電', import:'買電',
    v2c:'充電器', batt:'蓄電池', idle:'待機中', v2g:'▲ V2G',
    solar_today:'本日発電量', forecast:'予報 ☀️',
    exporting:'売電中', importing:'買電中', est_cost:'推定費用', earning:'🌿 収益',
    ev_section:'電気自動車 & 充電器', dev_section:'機器消費電力',
    today_summary:'本日のサマリー',
    charging:'充電中…', charger_idle:'待機中', discharging:'↑ 家庭へ放電',
    cost_free:'☀️ 無料', solar_100:'100% 太陽光', grid_only:'⚡ 系統電力のみ',
    charging_via:'V2C経由で充電中',
    cost_today:'本日のコスト', solar_savings:'太陽光節約額', revenue:'売電収益', exported_lbl:'売電量',
    solar_powered:'本日の太陽光自給率', live_suff:'リアルタイム自給率',
    bleu_note:'低料金日', blanc_note:'標準料金日',
    rouge_note:'⚠️ ピーク料金日 — 大量消費を避けてください',
    tomorrow:'明日', surplus:'☀️ 太陽光余剰電力あり',
    fc_today:'今日', fc_tomorrow:'明日',
    subtitle:'リアルタイムエネルギー監視',
    bat_label:'バッテリー', range_label:'航続距離', target_lbl:'目標SoC', eta_lbl:'所要時間',
    copied:'✓ クリップボードにコピーしました！', clip_err:'⚠️ クリップボードが利用できません',
    reco_free: w => `太陽光で無料充電中 — ${w}`,
    reco_surplus: w => `${w} 余剰電力あり — 無料充電のチャンス`,
    reco_rouge: p => `ピーク料金日${p} — 今日は消費を控えてください`,
    reco_tmr_rouge: '明日はピーク料金日 — 今日のうちに充電を',
    reco_bleu: p => `低料金日${p} — 充電に最適`,
    reco_cheap: p => `現在低料金 (${p}) — 充電に最適`,
    reco_expensive: p => `現在高料金 (${p}) — オフピーク時間まで待つ`,
    tip_range: (km, h) => `航続距離 ${km} km\n約 ${h} 時間走行`,
    tip_bat: (name, bat, rng, tgt, eta) => [name,`バッテリー: ${bat}%`,`航続距離: ${rng} km`,tgt?`目標SoC: ${tgt}%`:'',eta?`所要時間: ${eta}`:''].filter(Boolean).join('\n'),
    demand_high: w => `系統需要高 (${w}) — 電力消費を控えてください`,
    peak_shave: w => `蓄電池使用可能 — ${w} の系統電力を補償できます`,
    peak_shave_solar: w => `${w} の余剰太陽光 — 今が大型機器の使用好機`,
    co2_saved: kg => `本日 ${kg} kg CO₂削減`,
    batt_health: pct => `蓄電池健康度 ~${pct}%`,
    load_profile: lbl => `負荷: ${lbl}`,
    load_efficient:'効率的', load_moderate:'普通', load_heavy:'高負荷',
    ev_opt_solar:'☀️ 無料太陽光充電可能 — 今すぐ開始',
    ev_opt_cheap: p => `低料金 (${p}) — 充電に最適`,
    ev_opt_wait:'⏳ 料金高 — 安い時間帯まで待つ',
    dev_sched_solar:'☀️ 今すぐ大型機器を使用 — 無料太陽光あり',
    dev_sched_cheap: p => `今すぐ大型機器を使用 — 低料金 (${p})`,
    dev_sched_wait:'⏳ 大型機器を遅らせる — 現在料金高',
    weather_lbl:'天気',
  },
};

function getLang(hass, config) {
  const cfg = config?.language;
  if (cfg && cfg !== 'auto' && TRANSLATIONS[cfg]) return cfg;
  const hl = (hass?.language || 'en').toLowerCase();
  if (hl.startsWith('fr')) return 'fr';
  if (hl.startsWith('es')) return 'es';
  if (hl.startsWith('zh')) return 'zh';
  if (hl.startsWith('ja')) return 'ja';
  return 'en';
}
function tr(hass, config, key, ...args) {
  const lang = getLang(hass, config);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const val = t[key] ?? TRANSLATIONS.en[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}

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

function parseTariffForecast(hass, entity) {
  if (!entity) return [];
  const s = haState(hass, entity);
  if (!s) return [];
  const a = s.attributes;
  let raw = a.raw_today || a.prices || a.today || a.forecast || a.forecasts || [];
  if (typeof raw === 'object' && !Array.isArray(raw)) raw = Object.values(raw);
  if (!Array.isArray(raw) || raw.length === 0) {
    // Try state itself as comma-separated
    const fromState = parseFloat(s.state);
    return isNaN(fromState) ? [] : [fromState];
  }
  return raw.slice(0, 24).map(p => {
    if (typeof p === 'number') return p;
    if (typeof p === 'object' && p !== null) {
      const v = p.value ?? p.price ?? p.total ?? p.spotPrice ?? p.importPrice ?? 0;
      return typeof v === 'number' ? v : parseFloat(v) || 0;
    }
    return parseFloat(p) || 0;
  });
}

function weatherIcon(condition) {
  const c = (condition || '').toLowerCase();
  if (c.includes('sunny') || c === 'clear-night' || c === 'clear') return '☀️';
  if (c.includes('partly') || c.includes('cloudy-night')) return '⛅';
  if (c.includes('cloud')) return '☁️';
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) return '🌧️';
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) return '❄️';
  if (c.includes('thunder') || c.includes('lightning') || c.includes('storm')) return '⛈️';
  if (c.includes('wind') || c.includes('breez')) return '💨';
  if (c.includes('fog') || c.includes('mist') || c.includes('haz')) return '🌫️';
  return '🌤️';
}

function getChargingReco(d, c, t) {
  if (!c.evs || c.evs.length === 0) return null;

  const normalize = s => {
    const l = (s||'').toLowerCase();
    if (l.includes('rouge')||l.includes('red')) return 'red';
    if (l.includes('blanc')||l.includes('white')) return 'white';
    if (l.includes('bleu')||l.includes('blue')) return 'blue';
    return null;
  };
  const todayColor    = normalize(d.tempoToday);
  const tomorrowColor = normalize(d.tempoTomorrow);

  // Already charging free from solar
  if (d.chargerActive && d.solarFreeW > 0 && d.gridChargeW < 50) {
    return { icon:'☀️', text: t.reco_free(fmtW(d.solarFreeW)), cls:'reco-free' };
  }

  // Solar surplus available now, not charging
  const surplusW = Math.max(0, d.solarW - d.houseW - (d.battCharging ? d.battW : 0));
  if (!d.chargerActive && surplusW > 800) {
    return { icon:'💡', text: t.reco_surplus(fmtW(surplusW)), cls:'reco-good' };
  }

  // ROUGE day — avoid
  if (todayColor === 'red') {
    const priceStr = d.price != null ? ` (${d.price.toFixed(3)} €/kWh)` : '';
    return { icon:'⚠️', text: t.reco_rouge(priceStr), cls:'reco-warn' };
  }

  // Tomorrow is ROUGE — charge today!
  if (tomorrowColor === 'red' && todayColor !== 'red') {
    return { icon:'⏰', text: t.reco_tmr_rouge, cls:'reco-info' };
  }

  // BLEU day and not charging — good opportunity
  if (todayColor === 'blue' && !d.chargerActive) {
    const priceStr = d.price != null ? ` at ${d.price.toFixed(3)} €/kWh` : '';
    return { icon:'💙', text: t.reco_bleu(priceStr), cls:'reco-good' };
  }

  // Price alert — very cheap
  const priceAlertLow = parseFloat(c.price_alert_low);
  if (!isNaN(priceAlertLow) && d.price != null && d.price <= priceAlertLow) {
    return { icon:'💚', text: t.reco_cheap(d.price.toFixed(3)+' €/kWh'), cls:'reco-good' };
  }

  // Price alert — very expensive
  const priceAlertHigh = parseFloat(c.price_alert_high);
  if (!isNaN(priceAlertHigh) && d.price != null && d.price >= priceAlertHigh) {
    return { icon:'🔴', text: t.reco_expensive(d.price.toFixed(3)+' €/kWh'), cls:'reco-warn' };
  }

  return null;
}

function getSunArc() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const rise = 6.0, set = 21.0;
  if (h < rise || h > set) return null;
  const t = (h - rise) / (set - rise);
  const p0 = {x:20,y:100}, p1 = {x:180,y:15}, p2 = {x:340,y:100};
  const mt = 1 - t;
  const sx = mt*mt*p0.x + 2*mt*t*p1.x + t*t*p2.x;
  const sy = mt*mt*p0.y + 2*mt*t*p1.y + t*t*p2.y;
  const noon = 1 - Math.abs(t - 0.5) * 2;
  return { t, x: sx, y: sy, noon };
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
  .card-hud { position:absolute; inset:0; pointer-events:none; z-index:0; overflow:hidden; border-radius:20px; }
  .card-hud::before { content:''; position:absolute; inset:0;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(96,165,250,0.025) 39px, rgba(96,165,250,0.025) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(96,165,250,0.025) 39px, rgba(96,165,250,0.025) 40px);
    animation: hud-drift 30s linear infinite; }
  @keyframes hud-drift { from{background-position:0 0,0 0} to{background-position:40px 40px,40px 40px} }
  .card-hud::after { content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 70% 50% at 20% 20%, rgba(96,165,250,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 60% 60% at 80% 80%, rgba(192,132,252,0.05) 0%, transparent 70%); }
  .card > * { position:relative; z-index:1; }
  .header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; z-index:20; }
  .title-block .title { font-size:1.25em; font-weight:800; background:linear-gradient(120deg,#7dd3fc,#818cf8,#c084fc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:0.5px; }
  .title-block .subtitle { font-size:0.68em; color:#3d5280; margin-top:1px; letter-spacing:0.3px; }
  .price-pill { background:rgba(96,165,250,0.1); border:1px solid rgba(96,165,250,0.25); border-radius:20px; padding:5px 14px; text-align:center; min-width:80px; }
  .price-pill .val { font-size:1em; font-weight:700; color:#60a5fa; line-height:1; }
  .price-pill .lbl { font-size:0.6em; color:#3d5280; margin-top:2px; letter-spacing:0.5px; }

  .flow-wrap { position:relative; width:100%; margin-bottom:14px; user-select:none; }
  .flow-svg { width:100%; height:auto; display:block; overflow:visible; }
  .n-ring { fill:#0c1020; stroke-width:2.5; }
  .n-solar { stroke:#fbbf24; } .n-house { stroke:#60a5fa; } .n-grid { stroke:#6b7db8; } .n-v2c { stroke:#a78bfa; }
  .n-name  { font-size:9.5px;  font-weight:700; fill:rgba(255,255,255,0.75); text-anchor:middle; letter-spacing:0.8px; dominant-baseline:auto; filter:drop-shadow(0 1px 2px rgba(0,0,0,0.9)); }
  .n-power { font-size:12.5px; font-weight:800; fill:white; text-anchor:middle; dominant-baseline:auto; filter:drop-shadow(0 1px 3px rgba(0,0,0,0.95)); }
  .c-solar{fill:#fbbf24;} .c-house{fill:#60a5fa;} .c-grid-imp{fill:#f87171;} .c-grid-exp{fill:#34d399;} .c-v2c{fill:#c084fc;} .c-idle{fill:#2a3558;}
  .track { fill:none; stroke-width:2.5; stroke-linecap:round; opacity:0.25; }
  .t-solar{stroke:#fbbf24;} .t-imp{stroke:#f87171;} .t-exp{stroke:#34d399;} .t-v2c{stroke:#c084fc;}
  .v2c-ring-pulse { fill:none; stroke:#c084fc; stroke-width:2; opacity:0; animation:v2c-svg-pulse 1.6s ease-in-out infinite; }
  @keyframes v2c-svg-pulse { 0%{opacity:0.6;r:28} 100%{opacity:0;r:46} }
  .v2c-bolt-active { animation:bolt-blink 0.9s ease-in-out infinite alternate; }
  @keyframes bolt-blink { from{opacity:1} to{opacity:0.35} }

  .surplus { background:linear-gradient(90deg,rgba(52,211,153,0.08),rgba(16,185,129,0.04)); border:1px solid rgba(52,211,153,0.2); border-radius:10px; padding:7px 14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.78em; }
  .surplus .s-lbl{color:#34d399;font-weight:600;} .surplus .s-val{color:#34d399;font-weight:700;font-size:1.05em;}

  /* ── STATS TABS ── */
  .stats-tabs { display:flex; gap:4px; margin-bottom:8px; }
  .stats-tab { flex:1; padding:5px 8px; border-radius:8px; border:1px solid rgba(96,165,250,0.15); background:rgba(96,165,250,0.04); font-size:0.68em; font-weight:700; color:#3d5280; cursor:pointer; text-align:center; transition:background 0.15s,color 0.15s,border-color 0.15s; letter-spacing:0.3px; }
  .stats-tab.active { background:rgba(96,165,250,0.14); border-color:rgba(96,165,250,0.35); color:#60a5fa; }
  .stats-tab-panel { display:none; }
  .stats-tab-panel.active { display:block; }
  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; margin-bottom:14px; }
  .stat { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:9px 5px; text-align:center; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); position:relative; }
  .stat .sv{font-size:0.9em;font-weight:700;line-height:1;margin-bottom:3px;} .stat .sl{font-size:0.58em;font-weight:600;color:#3d5280;text-transform:uppercase;letter-spacing:0.5px;}
  .st-sol .sv{color:#fbbf24;} .st-exp .sv{color:#34d399;} .st-imp .sv{color:#f87171;} .st-earn .sv{color:#34d399;} .st-cost .sv{color:#f87171;}

  .ev-section{margin-bottom:14px;}
  .section-title { font-size:0.62em; font-weight:700; letter-spacing:1.8px; color:#2a3558; text-transform:uppercase; margin-bottom:8px; }
  .ev-grid { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
  .ev-card { flex:1 1 110px; max-width:180px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:10px 8px; display:flex; flex-direction:column; align-items:center; gap:5px; position:relative; overflow:hidden; transition:border-color 0.4s,box-shadow 0.4s; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }
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
  .ev-warranty { font-size:0.55em; font-weight:700; text-align:center; border-radius:5px; padding:2px 5px; border:1px solid; }
  .ev-warranty.ok  { color:#34d399; background:rgba(52,211,153,0.08); border-color:rgba(52,211,153,0.2); }
  .ev-warranty.warn{ color:#fbbf24; background:rgba(251,191,36,0.08); border-color:rgba(251,191,36,0.2); }
  .ev-warranty.exp { color:#f87171; background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.2); }
  .ev-health { font-size:0.6em; font-weight:700; color:#60a5fa; }
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

  .devices-grid{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px;justify-content:center;}
  .device{flex:1 1 78px;max-width:120px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.05);border-radius:11px;padding:8px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;transition:border-color 0.3s,background 0.3s;position:relative;overflow:hidden;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}
  .device.on{border-color:rgba(251,191,36,0.25);background:rgba(251,191,36,0.04);}
  .device.on::after{content:'';position:absolute;bottom:0;left:15%;right:15%;height:1.5px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.5),transparent);}
  .device { cursor:pointer; }
  .dev-expand { display:none; width:100%; margin-top:6px; border-top:1px solid rgba(96,165,250,0.1); padding-top:5px; }
  .device.expanded .dev-expand { display:block; }
  .dev-expand-spark { display:flex; justify-content:center; }
  .dev-expand-info { font-size:0.6em; color:#3d5280; text-align:center; margin-top:2px; }
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

  /* ── TEMPO BANNER ── */
  .tempo-banner { display:flex; align-items:center; gap:10px; padding:8px 14px; border-radius:10px; margin-bottom:14px; border:1px solid; font-size:0.78em; flex-wrap:wrap; }
  .tempo-banner.blue { background:rgba(59,130,246,0.08); border-color:rgba(59,130,246,0.25); }
  .tempo-banner.white { background:rgba(255,255,255,0.04); border-color:rgba(200,200,220,0.2); }
  .tempo-banner.red { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.35); animation:tempo-red-pulse 2s ease-in-out infinite; }
  @keyframes tempo-red-pulse { 0%,100%{border-color:rgba(239,68,68,0.35)} 50%{border-color:rgba(239,68,68,0.75)} }
  .tempo-pill { border-radius:6px; padding:2px 9px; font-weight:800; font-size:1em; letter-spacing:0.5px; }
  .tempo-pill.blue { background:rgba(59,130,246,0.18); color:#60a5fa; }
  .tempo-pill.white { background:rgba(200,210,240,0.12); color:#e2e8f0; }
  .tempo-pill.red { background:rgba(239,68,68,0.18); color:#f87171; }
  .tempo-note { color:#4a5f8a; flex:1; font-size:0.95em; }
  .tempo-tomorrow { font-size:0.9em; color:#3d5280; display:flex; align-items:center; gap:6px; }

  /* ── DAILY SUMMARY ── */
  .daily-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-bottom:14px; }
  .ds-tile { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.05); border-radius:11px; padding:9px 6px; text-align:center; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }
  .ds-tile .dv { font-size:0.9em; font-weight:800; line-height:1; margin-bottom:3px; }
  .ds-tile .dl { font-size:0.58em; font-weight:600; color:#3d5280; text-transform:uppercase; letter-spacing:0.5px; }
  .ds-cost .dv { color:#f87171; }
  .ds-save .dv { color:#34d399; }
  .ds-rev .dv { color:#fbbf24; }

  /* ── PRICE ALERT ── */
  .price-pill.alert-high { border-color:rgba(248,113,113,0.5); }
  .price-pill.alert-high .val { color:#f87171; animation:price-blink 1.2s ease-in-out infinite alternate; }
  .price-pill.alert-low { border-color:rgba(52,211,153,0.4); }
  .price-pill.alert-low .val { color:#34d399; }
  @keyframes price-blink { from{opacity:1} to{opacity:0.45} }

  /* ── PRICE FORECAST CHART ── */
  .price-chart { margin-bottom:10px; }
  .price-chart-title { font-size:0.62em; font-weight:700; color:#3d5280; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:4px; }
  .price-chart svg { display:block; width:100%; border-radius:6px; overflow:visible; }

  /* ── HISTORY MODAL ── */
  .history-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:10000; display:flex; align-items:center; justify-content:center; }
  .history-modal { background:rgba(15,23,42,0.98); border:1px solid rgba(96,165,250,0.2); border-radius:16px; padding:20px; min-width:300px; max-width:94vw; box-shadow:0 16px 48px rgba(0,0,0,0.6); color:#cbd5e1; }
  .history-modal-title { font-size:0.85em; font-weight:800; color:#60a5fa; margin-bottom:14px; }
  .history-modal-close { float:right; background:none; border:none; color:#60a5fa; font-size:1.1em; cursor:pointer; }
  .history-modal svg { display:block; width:100%; }

  /* ── ECO BADGES ROW ── */
  .eco-badges { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; justify-content:center; }
  .eco-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:0.72em; font-weight:700; border:1px solid; white-space:nowrap; }
  .eco-co2  { background:rgba(52,211,153,0.1); border-color:rgba(52,211,153,0.3); color:#34d399; }
  .eco-batt { background:rgba(96,165,250,0.1); border-color:rgba(96,165,250,0.25); color:#60a5fa; }
  .eco-load-efficient { background:rgba(52,211,153,0.08); border-color:rgba(52,211,153,0.2); color:#34d399; }
  .eco-load-moderate  { background:rgba(251,191,36,0.08); border-color:rgba(251,191,36,0.2); color:#fbbf24; }
  .eco-load-heavy     { background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.25); color:#f87171; }

  /* ── CHARGING RECOMMENDATION ── */
  .charging-reco { display:flex; align-items:center; gap:10px; padding:8px 14px; border-radius:10px; margin-bottom:12px; font-size:0.78em; border:1px solid; }
  .reco-free  { background:rgba(52,211,153,0.08); border-color:rgba(52,211,153,0.3); color:#34d399; }
  .reco-good  { background:rgba(96,165,250,0.08); border-color:rgba(96,165,250,0.25); color:#60a5fa; }
  .reco-info  { background:rgba(251,191,36,0.08); border-color:rgba(251,191,36,0.25); color:#fbbf24; }
  .reco-warn  { background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.3); color:#f87171; animation:tempo-red-pulse 2.5s ease-in-out infinite; }
  .reco-icon  { font-size:1.2em; flex-shrink:0; }
  .reco-text  { flex:1; }

  /* ── SELF-SUFFICIENCY GAUGE ── */
  .suff-wrap { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:8px 16px 8px 8px; margin-bottom:14px; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); cursor:pointer; }
  .suff-label .suff-main { font-size:1.1em; font-weight:800; line-height:1; }
  .suff-label .suff-sub { font-size:0.65em; color:#3d5280; margin-top:3px; }

  /* ── TAP CURSOR ── */
  .ev-card, .device { cursor:pointer; }

  /* ── LIGHT THEME ── */
  :host([theme="light"]) .card { background:linear-gradient(160deg,#f0f6ff 0%,#ffffff 60%,#f8faff 100%); color:#1e293b; border-color:rgba(59,130,246,0.12); box-shadow:0 8px 32px rgba(59,130,246,0.08); }
  :host([theme="light"]) .title-block .title { background:linear-gradient(120deg,#2563eb,#7c3aed,#9333ea); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  :host([theme="light"]) .title-block .subtitle { color:#94a3b8; }
  :host([theme="light"]) .price-pill { background:rgba(37,99,235,0.07); border-color:rgba(37,99,235,0.2); }
  :host([theme="light"]) .price-pill .val { color:#2563eb; }
  :host([theme="light"]) .price-pill .lbl { color:#94a3b8; }
  :host([theme="light"]) .stat { background:rgba(0,0,0,0.025); border-color:rgba(0,0,0,0.07); }
  :host([theme="light"]) .stat .sl { color:#94a3b8; }
  :host([theme="light"]) .surplus { background:linear-gradient(90deg,rgba(16,185,129,0.07),rgba(5,150,105,0.03)); border-color:rgba(16,185,129,0.25); }
  :host([theme="light"]) .section-title { color:#94a3b8; }
  :host([theme="light"]) .ev-card { background:rgba(0,0,0,0.025); border-color:rgba(0,0,0,0.08); }
  :host([theme="light"]) .ev-name { color:#64748b; }
  :host([theme="light"]) .ev-range { color:#475569; }
  :host([theme="light"]) .bat-text { color:#1e293b; }
  :host([theme="light"]) .bat-text sub { color:#94a3b8; }
  :host([theme="light"]) .bat-bg { stroke:rgba(0,0,0,0.08); }
  :host([theme="light"]) .charger-sub { color:#94a3b8; }
  :host([theme="light"]) .charger-idle { color:#cbd5e1; }
  :host([theme="light"]) .charge-cost-block { background:rgba(124,58,237,0.04); border-color:rgba(124,58,237,0.15); }
  :host([theme="light"]) .device { background:rgba(0,0,0,0.02); border-color:rgba(0,0,0,0.06); }
  :host([theme="light"]) .device.on { background:rgba(251,191,36,0.05); border-color:rgba(251,191,36,0.2); }
  :host([theme="light"]) .dev-name { color:#64748b; }
  :host([theme="light"]) .dev-power { color:#475569; }
  :host([theme="light"]) .dev-icon.off { color:#cbd5e1; }
  :host([theme="light"]) .ds-tile { background:rgba(0,0,0,0.02); border-color:rgba(0,0,0,0.06); }
  :host([theme="light"]) .ds-tile .dl { color:#94a3b8; }
  :host([theme="light"]) .tempo-note { color:#64748b; }
  :host([theme="light"]) .tempo-tomorrow { color:#94a3b8; }
  :host([theme="light"]) .forecast-row { color:#94a3b8; }
  :host([theme="light"]) .n-ring { fill:#f8faff; }
  :host([theme="light"]) .n-name  { fill:rgba(255,255,255,0.9); filter:drop-shadow(0 1px 2px rgba(0,0,0,0.7)); }
  :host([theme="light"]) .n-power { fill:white; filter:drop-shadow(0 1px 3px rgba(0,0,0,0.85)); }
  :host([theme="light"]) .track { opacity:0.18; }
  :host([theme="light"]) [data-tip]::after { background:rgba(241,245,249,0.98); color:#1e293b; border-color:rgba(59,130,246,0.2); box-shadow:0 4px 16px rgba(0,0,0,0.1); }
  :host([theme="light"]) [data-tip]::before { border-top-color:rgba(59,130,246,0.2); }

  /* ── SPARKLINES ── */
  .stat { position:relative; }
  .spark { position:absolute; bottom:4px; left:4px; right:4px; pointer-events:none; opacity:0.7; }

  /* ── BATTERY NODE ── */
  .n-bat { stroke:#34d399; }

  /* ── DEVICE ALERTS & RANKING ── */
  .device.alert { border-color:rgba(248,113,113,0.45)!important; }
  @keyframes dev-alert-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(248,113,113,0);border-color:rgba(248,113,113,0.45)} 50%{box-shadow:0 0 12px 3px rgba(248,113,113,0.25);border-color:rgba(248,113,113,0.85)} }
  .device.alert { animation:dev-alert-pulse 1.6s ease-in-out infinite; }
  .dev-rank { position:absolute; top:4px; left:5px; font-size:0.55em; font-weight:800; color:#2a3558; }

  /* ── WOW: ENERGY STREAK BADGE ── */
  .streak-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:20px; font-size:0.65em; font-weight:800; border:1px solid; flex-shrink:0; }
  .streak-badge.fire { color:#fb923c; background:rgba(251,146,60,0.1); border-color:rgba(251,146,60,0.3); }
  .streak-badge.score { color:#34d399; background:rgba(52,211,153,0.08); border-color:rgba(52,211,153,0.25); }
  .streak-badge.score-ok { color:#60a5fa; background:rgba(96,165,250,0.08); border-color:rgba(96,165,250,0.2); }

  /* ── WOW: AMBIENT GLOW ── */
  .card { transition: box-shadow 2s ease; }
  .card.amb-surplus { box-shadow:0 8px 40px rgba(0,0,0,0.5),0 0 60px rgba(52,211,153,0.12),inset 0 0 100px rgba(52,211,153,0.025); }
  .card.amb-import  { box-shadow:0 8px 40px rgba(0,0,0,0.5),0 0 60px rgba(248,113,113,0.1),inset 0 0 100px rgba(248,113,113,0.03); }

  /* ── WOW: PEAK FLASH & ALARM ── */
  @keyframes peak-flash { 0%,100%{box-shadow:0 8px 40px rgba(0,0,0,0.5)} 50%{box-shadow:0 8px 40px rgba(0,0,0,0.5),inset 0 0 0 2px rgba(248,113,113,0.9),0 0 60px rgba(248,113,113,0.35)} }
  .card.peak-flash { animation:peak-flash 0.55s ease-in-out 4; }
  .card.peak-alarm { box-shadow:0 8px 40px rgba(0,0,0,0.5),0 0 0 2px rgba(248,113,113,0.45),0 0 50px rgba(248,113,113,0.18)!important; }

  /* ── WOW: ECLIPSE SHADOW (cloud cover) ── */
  @keyframes cloud-sweep { 0%,100%{opacity:0.05} 50%{opacity:0.45} }
  .card.weather-cloudy .flow-wrap::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 55% 70% at 16% 30%, rgba(10,12,20,0.55) 0%, transparent 65%); animation:cloud-sweep 14s ease-in-out infinite; pointer-events:none; z-index:2; border-radius:4px; }

  /* ── SHARE BUTTON & STATS POPUP ── */
  .share-btn { background:rgba(96,165,250,0.08); border:1px solid rgba(96,165,250,0.2); border-radius:8px; padding:5px 9px; cursor:default; font-size:0.78em; color:#60a5fa; transition:background 0.2s,border-color 0.2s; flex-shrink:0; position:relative; }
  .share-btn:hover { background:rgba(96,165,250,0.16); border-color:rgba(96,165,250,0.4); }
  .stats-popup { position:absolute; top:calc(100% + 8px); right:0; min-width:230px; background:rgba(15,23,42,0.97); border:1px solid rgba(96,165,250,0.25); border-radius:12px; padding:12px 14px; box-shadow:0 8px 32px rgba(0,0,0,0.5); z-index:9999; opacity:0; pointer-events:none; transition:opacity 0.18s,transform 0.18s; transform:translateY(-4px); }
  .stats-popup.show { opacity:1; pointer-events:auto; transform:translateY(0); }
  .stats-popup pre { margin:0; font-family:monospace; font-size:0.72em; color:#cbd5e1; line-height:1.6; white-space:pre; }
  .stats-popup-copy { margin-top:9px; width:100%; background:rgba(96,165,250,0.12); border:1px solid rgba(96,165,250,0.25); border-radius:6px; color:#60a5fa; font-size:0.72em; padding:4px 0; cursor:pointer; transition:background 0.15s; }
  .stats-popup-copy:hover { background:rgba(96,165,250,0.22); }
  .stats-popup-copy.ok { color:#34d399; border-color:rgba(52,211,153,0.3); }
  /* Weather forecast popup */
  .weather-popup { position:absolute; top:4px; left:4px; min-width:190px; background:rgba(15,23,42,0.96); border:1px solid rgba(251,191,36,0.3); border-radius:12px; padding:10px 12px; box-shadow:0 8px 28px rgba(0,0,0,0.55); z-index:9999; opacity:0; pointer-events:none; transition:opacity 0.18s,transform 0.18s; transform:translateY(-4px); }
  .weather-popup.show { opacity:1; pointer-events:auto; transform:translateY(0); }
  .weather-popup-current { display:flex; align-items:center; gap:6px; font-size:0.78em; font-weight:700; color:#fde68a; margin-bottom:8px; border-bottom:1px solid rgba(251,191,36,0.15); padding-bottom:6px; }
  .weather-popup-current .wc-temp { margin-left:auto; font-size:1.1em; color:#fbbf24; }
  .weather-popup-rows { display:flex; flex-direction:column; gap:3px; }
  .weather-popup-row { display:flex; align-items:center; gap:6px; font-size:0.7em; color:#94a3b8; }
  .weather-popup-row .wf-time { width:32px; font-size:0.85em; color:#64748b; }
  .weather-popup-row .wf-icon { width:18px; text-align:center; }
  .weather-popup-row .wf-temp { margin-left:auto; color:#fbbf24; font-weight:600; }
  .weather-popup-row .wf-rain { color:#60a5fa; font-size:0.85em; margin-left:4px; }
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
    this._domReady = false;
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
      tempo_color_today: '',
      tempo_color_tomorrow: '',
      grid_energy_import: '',   // must be a DAILY-reset sensor (utility_meter helper), NOT a cumulative counter
      grid_energy_export: '',   // same — daily reset only
      feed_in_rate: 0,
      price_alert_high: null,
      price_alert_low: null,
      theme: 'dark',
      battery_power: '',
      battery_soc: '',
      language: 'auto',   // 'auto' | 'en' | 'fr' | 'es' | 'zh' | 'ja'
      grid_demand_threshold: 3000,  // W — show demand alert above this
      co2_intensity: '',            // g/kWh sensor or leave empty (uses 400 g/kWh default)
      battery_rated_capacity: 0,    // kWh — for health indicator (0 = disabled)
      weather_entity: '',           // weather.xxx — shows current condition icon on solar orb
      weather_forecast_entity: '',  // weather.xxx — used for hourly forecast popup (defaults to weather_entity)
      tariff_forecast: '',          // sensor with raw_today/prices array attribute
      chargers: [],                 // additional chargers: [{name, power, image, session_energy}]
      devices_sort: false,
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
    this._domReady = false;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Subscribe to weather forecast (HA 2023.9+ moved forecast data out of attributes)
    const we = this._config?.weather_forecast_entity || this._config?.weather_entity;
    if (we && we !== this._weatherEntitySubscribed) {
      if (this._weatherUnsub) { try { this._weatherUnsub(); } catch(e) {} this._weatherUnsub = null; }
      this._weatherEntitySubscribed = we;
      hass.connection.subscribeMessage(
        (msg) => { this._weatherForecastData = msg.forecast || []; },
        { type: 'weather/subscribe_forecast', entity_id: we, forecast_type: 'hourly' }
      ).then(unsub => { this._weatherUnsub = unsub; }).catch(() => {});
    } else if (!we && this._weatherUnsub) {
      try { this._weatherUnsub(); } catch(e) {}
      this._weatherUnsub = null;
      this._weatherEntitySubscribed = null;
    }
    if (!this._domReady) {
      this._render();
    } else {
      const d = this._data();
      if (d) this._patch(d);
    }
    // Fetch sparklines at most every 5 minutes
    const now = Date.now();
    if (!this._lastSparkFetch || now - this._lastSparkFetch > 5 * 60 * 1000) {
      this._lastSparkFetch = now;
      this._fetchSparklines();
    }
  }
  getCardSize() { return 8; }
  _t(key, ...args) { return tr(this._hass, this._config, key, ...args); }
  disconnectedCallback() {
    this._clearParticles();
    if (this._weatherUnsub) { try { this._weatherUnsub(); } catch(e) {} this._weatherUnsub = null; }
  }

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

    const chargerActive = Math.abs(v2cW) > 10;
    const v2gActive     = v2cW < -10; // EV discharging to home

    // Tempo
    const tempoToday    = c.tempo_color_today    ? strState(h, c.tempo_color_today)    : null;
    const tempoTomorrow = c.tempo_color_tomorrow ? strState(h, c.tempo_color_tomorrow) : null;

    // Daily summary — sensors MUST be daily-reset (utility_meter helper).
    // Guard: >300 kWh "today" is physically impossible for a house → sensor is a cumulative counter, ignore it.
    const _rawImport    = c.grid_energy_import ? numState(h, c.grid_energy_import, null) : null;
    const _rawExport    = c.grid_energy_export ? numState(h, c.grid_energy_export, null) : null;
    const importKwhDay  = (_rawImport  != null && _rawImport  < 300) ? _rawImport  : null;
    const exportKwhDay  = (_rawExport  != null && _rawExport  < 300) ? _rawExport  : null;
    // selfConsumedKwh requires BOTH solar_today AND grid_energy_export (daily reset).
    // Without export data we cannot know how much solar stayed in the house, so null = don't show.
    const selfConsumedKwh = (solarToday != null && exportKwhDay != null) ? Math.max(0, solarToday - exportKwhDay) : null;
    const costToday     = (importKwhDay   != null && price != null) ? importKwhDay * price : null;
    const savingsToday  = (selfConsumedKwh != null && price != null) ? selfConsumedKwh * price : null;
    const feedIn        = parseFloat(c.feed_in_rate) || 0;
    const revenueToday  = (exportKwhDay != null && price != null && feedIn > 0) ? exportKwhDay * price * feedIn : null;

    // Process EVs
    const today = new Date();
    let evData = (c.evs || []).map(ev => {
      const bat  = clamp(numState(h, ev.battery, 0), 0, 100);
      const rng  = numState(h, ev.range, 0);
      const targetSoc = ev.target_soc ? numState(h, ev.target_soc, null) : null;
      const isCharging = ev.charging ? strState(h, ev.charging) === 'on' : false;
      const eta  = isCharging ? calcEta(h, bat, ev.charging_power||null, ev.charging_rate||null, ev.target_soc||null, ev.battery_capacity||60) : null;
      // #24 Battery health + warranty
      const battHealth = ev.battery_health ? clamp(numState(h, ev.battery_health, null), 0, 100) : null;
      let warrantyMonths = null;
      if (ev.purchase_date) {
        const purchased = new Date(ev.purchase_date);
        const warrantyYears = parseFloat(ev.warranty_years) || 8;
        const warrantyEnd = new Date(purchased);
        warrantyEnd.setFullYear(warrantyEnd.getFullYear() + warrantyYears);
        const msLeft = warrantyEnd - today;
        warrantyMonths = msLeft > 0 ? Math.round(msLeft / (1000 * 60 * 60 * 24 * 30)) : 0;
      }
      return { ...ev, bat, rng, targetSoc, isCharging, eta, battHealth, warrantyMonths };
    });
    // Fallback: if charger active and no EV reports charging state, mark first EV
    if (chargerActive && evData.length > 0 && !evData.some(ev => ev.isCharging) && !evData[0].charging) {
      evData[0] = { ...evData[0], isCharging: true };
    }

    const battW   = c.battery_power ? toWatts(h, c.battery_power) : 0;
    const battSoc = c.battery_soc   ? numState(h, c.battery_soc, null) : null;
    const battCharging    = battW > 10;
    const battDischarging = battW < -10;
    const hasBattery = !!(c.battery_power || c.battery_soc);

    let costH = null;
    if (price != null) costH = (gridImpW/1000)*price - (gridExpW/1000)*price*0.11;

    const solarFreeW  = chargerActive ? Math.min(solarW, v2cW) : 0;
    const gridChargeW = chargerActive ? Math.max(0, v2cW - solarW) : 0;
    const chargeCostH = (price != null && chargerActive) ? (gridChargeW/1000)*price : null;
    const sessionCostEst = (v2cSessionKwh > 0 && price != null && chargerActive && v2cW > 10)
      ? v2cSessionKwh * (v2cW > 0 ? gridChargeW/v2cW : 1) * price : null;

    let devices = (c.devices || []).map(d => ({
      name: d.name, icon: d.icon||'plug', w: toWatts(h, d.entity),
      alert_above: d.alert_above != null ? parseFloat(d.alert_above) : null,
    }));
    if (c.devices_sort) devices = [...devices].sort((a, b) => b.w - a.w);

    // Self-sufficiency
    const liveSelfW    = Math.min(solarW, houseW + v2cW + Math.max(0, battW||0));
    const liveTotalW   = houseW + v2cW + Math.max(0, battW||0);
    const liveSuffPct  = liveTotalW > 0 ? clamp((liveSelfW / liveTotalW) * 100, 0, 100) : 0;
    const daySelfKwh   = (solarToday != null && exportKwhDay != null) ? Math.max(0, solarToday - exportKwhDay) : null;
    const dayTotalKwh  = (daySelfKwh != null && importKwhDay != null) ? daySelfKwh + importKwhDay : null;
    const daySuffPct   = (dayTotalKwh != null && dayTotalKwh > 0) ? clamp((daySelfKwh / dayTotalKwh) * 100, 0, 100) : null;

    // #5 CO₂ saved today from self-consumed solar
    const co2Intensity = c.co2_intensity ? numState(h, c.co2_intensity, null) : null;
    const co2GperKwh = co2Intensity != null ? co2Intensity : 400; // default 400 g/kWh EU avg
    const co2SavedKg = selfConsumedKwh != null ? Math.round((selfConsumedKwh * co2GperKwh) / 10) / 100 : null;

    // #16 Battery health
    const ratedKwh = parseFloat(c.battery_rated_capacity) || 0;
    const battHealthPct = (ratedKwh > 0 && battSoc != null && battSoc > 10 && battSoc < 90 && battW !== 0)
      ? null  // live charging makes estimation unreliable — show only if we have SoC data
      : (ratedKwh > 0 && battSoc != null ? Math.min(100, Math.round(100)) : null); // placeholder — needs cycle data
    // Simple health: if user provides rated capacity, compare energy range
    // For now: just flag if SoC sensor exists with rated capacity (can be extended with history)
    const battHealth = ratedKwh > 0 && battSoc != null ? Math.min(100, 100) : null; // shown if configured

    // #18 Load profile badge
    const avgHouseW = houseW; // live reading
    const loadLabel = avgHouseW > 5000 ? 'heavy' : avgHouseW > 2000 ? 'moderate' : 'efficient';

    return {
      solarW, gridW, gridImpW, gridExpW, houseW, v2cW, isExp, price, costH,
      solarToday, fcToday, fcTomorrow, chargerActive,
      solarFreeW, gridChargeW, chargeCostH, sessionCostEst, v2cSessionKwh,
      evData, devices,
      surplusW: Math.max(0, solarW - houseW - v2cW),
      tempoToday, tempoTomorrow,
      importKwhDay, exportKwhDay, selfConsumedKwh, costToday, savingsToday, revenueToday,
      battW, battSoc, battCharging, battDischarging, hasBattery,
      liveSuffPct, daySuffPct, daySelfKwh, dayTotalKwh,
      v2gActive,
      co2SavedKg, battHealth, ratedKwh, loadLabel,
      // #12 weather
      weatherCondition: c.weather_entity ? strState(h, c.weather_entity) : null,
      weatherTemp: c.weather_entity ? (haState(h, c.weather_entity)?.attributes?.temperature ?? null) : null,
      weatherForecast: (c.weather_forecast_entity || c.weather_entity) ? (this._weatherForecastData || []) : [],
      // #4 tariff forecast
      tariffPrices: parseTariffForecast(h, c.tariff_forecast),
      // #1 additional chargers
      extraChargers: (c.chargers || []).map(ch => ({
        ...ch,
        w: ch.power ? toWatts(h, ch.power) : 0,
        sessionKwh: ch.session_energy ? numState(h, ch.session_energy, null) : null,
      })),
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
    if (d) { const extra = this._cardClasses(d); if (extra) card.className += ' ' + extra; }
    card.innerHTML = d ? this._buildCard(d) : `<div style="padding:30px;text-align:center;color:#3d5280;font-size:0.85em">Connecting to Home Assistant…</div>`;
    shadow.appendChild(card);
    if (d) {
      const rawTheme = this._config.theme || 'dark';
      const resolvedTheme = rawTheme === 'auto'
        ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : rawTheme;
      this.setAttribute('theme', resolvedTheme);
      // React to system colour-scheme changes when theme is 'auto'
      if (rawTheme === 'auto') {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        if (!this._mqlListener) {
          this._mqlListener = e => this.setAttribute('theme', e.matches ? 'dark' : 'light');
          mql.addEventListener('change', this._mqlListener);
        }
      } else if (this._mqlListener) {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this._mqlListener);
        this._mqlListener = null;
      }
      this._clearParticles();
      this._startParticles(shadow, d);
      // Draw cable after layout is painted
      requestAnimationFrame(() => requestAnimationFrame(() => this._drawChargingCable(shadow, d)));
      this._domReady = true;
      requestAnimationFrame(() => this._setupTapHandlers(shadow));
      this._fetchSparklines();
    }
  }

  _patch(d) {
    const shadow = this.shadowRoot;
    const card = shadow.querySelector('.card');
    if (!card) { this._render(); return; }

    // WOW: ambient glow + peak alarm + eclipse shadow classes
    const newClasses = this._cardClasses(d);
    ['amb-surplus','amb-import','peak-alarm','weather-cloudy'].forEach(c => card.classList.remove(c));
    if (newClasses) newClasses.split(' ').forEach(c => c && card.classList.add(c));
    // WOW: peak flash (one-shot animation when threshold newly crossed)
    const threshold = parseFloat(this._config.grid_demand_threshold) || 3000;
    const isPeak = d.gridImpW > threshold;
    if (isPeak && !this._wasPeak) {
      card.classList.remove('peak-flash');
      void card.offsetWidth; // reflow to restart animation
      card.classList.add('peak-flash');
      setTimeout(() => card.classList.remove('peak-flash'), 2500);
    }
    this._wasPeak = isPeak;

    // WOW: header score badge
    const headerScore = card.querySelector('[data-uid="header-score"]');
    if (headerScore) headerScore.innerHTML = this._buildHeaderScore(d);

    // Price pill
    const priceVal = card.querySelector('[data-uid="price-val"]');
    if (priceVal) priceVal.textContent = d.price != null ? d.price.toFixed(3) + ' €' : '—';

    // Flow SVG — rebuild (no persistent CSS animations live inside SVG)
    const flowWrap = card.querySelector('[data-uid="flow-wrap"]');
    if (flowWrap) {
      flowWrap.innerHTML = this._buildFlowSVG(d) + this._buildWeatherPopup(d);
      this._setupWeatherPopup(flowWrap);
    }

    // Surplus banner
    const surplusWrap = card.querySelector('[data-uid="surplus-wrap"]');
    if (surplusWrap) surplusWrap.innerHTML = d.surplusW > 50
      ? `<div class="surplus"><span class="s-lbl">${this._t('surplus')}</span><span class="s-val">${fmtW(d.surplusW)}</span></div>` : '';

    // Self-sufficiency gauge
    const suffWrap = card.querySelector('[data-uid="suff-wrap"]');
    if (suffWrap) suffWrap.innerHTML = this._buildSufficiencyGauge(d);

    // Stats
    const statsEl = card.querySelector('[data-uid="stats"]');
    if (statsEl) statsEl.innerHTML = this._buildStats(d);

    // Daily summary (hidden anchor + today tab panel)
    const dailySummaryEl = card.querySelector('[data-uid="daily-summary"]');
    if (dailySummaryEl) dailySummaryEl.innerHTML = this._buildDailySummary(d);
    const dailySummaryTab = card.querySelector('[data-uid="daily-summary-tab"]');
    if (dailySummaryTab) dailySummaryTab.innerHTML = this._buildDailySummary(d);

    // Price alert classes
    const pricePill = card.querySelector('.price-pill');
    if (pricePill && d.price != null) {
      const hi = parseFloat(this._config.price_alert_high);
      const lo = parseFloat(this._config.price_alert_low);
      pricePill.classList.remove('alert-high', 'alert-low');
      if (!isNaN(hi) && d.price >= hi) pricePill.classList.add('alert-high');
      else if (!isNaN(lo) && d.price <= lo) pricePill.classList.add('alert-low');
    }

    // Charging recommendation
    const recoEl = card.querySelector('[data-uid="charging-reco"]');
    if (recoEl) recoEl.innerHTML = this._buildChargingReco(d);

    // Price chart
    const priceChartEl = card.querySelector('[data-uid="price-chart"]');
    if (priceChartEl) priceChartEl.innerHTML = this._buildPriceChart(d);

    // Eco badges (CO₂, battery health, load profile)
    const ecoBadgesEl = card.querySelector('[data-uid="eco-badges"]');
    if (ecoBadgesEl) ecoBadgesEl.innerHTML = this._buildEcoBadges(d);

    // EV optimizer + device scheduler
    const evOptEl = card.querySelector('[data-uid="ev-optimizer"]');
    if (evOptEl) evOptEl.innerHTML = this._buildEvOptimizer(d);
    const devSchedEl = card.querySelector('[data-uid="dev-scheduler"]');
    if (devSchedEl) devSchedEl.innerHTML = this._buildDevScheduler(d);

    // Grid demand + peak shaving alerts
    const gridAlertsEl = card.querySelector('[data-uid="grid-alerts"]');
    if (gridAlertsEl) gridAlertsEl.innerHTML = this._buildGridAlerts(d);

    // EV section — update in-place to preserve running CSS animations
    this._patchEvGrid(card, d);

    // Devices
    const devicesGrid = card.querySelector('[data-uid="devices-grid"]');
    if (devicesGrid) devicesGrid.innerHTML = d.devices.map((dev, i) => this._buildDevice(dev, this._config.devices_sort ? i : null)).join('');

    // Forecast
    const forecastEl = card.querySelector('[data-uid="forecast-row"]');
    if (forecastEl) forecastEl.innerHTML = this._buildForecast(d);

    // Particles + cable
    this._clearParticles();
    this._startParticles(shadow, d);
    requestAnimationFrame(() => requestAnimationFrame(() => this._drawChargingCable(shadow, d)));
  }

  _patchEvGrid(card, d) {
    // Charger card
    const chargerCard = card.querySelector('.ev-charger');
    if (chargerCard) {
      const active = d.chargerActive;
      if (active) chargerCard.classList.add('plugged');
      else chargerCard.classList.remove('plugged');

      if (!active) chargerCard.setAttribute('data-tip', 'V2C Charger\nIdle — no vehicle connected');
      else chargerCard.removeAttribute('data-tip');

      const chargerImg = chargerCard.querySelector('.v2c-img');
      if (chargerImg) chargerImg.className = `v2c-img${active ? ' plugged' : ''}`;

      const content = chargerCard.querySelector('[data-uid="charger-content"]');
      if (content) content.innerHTML = d.v2gActive
        ? `<div class="charger-power" style="color:#34d399">${fmtW(Math.abs(d.v2cW))}</div><div class="charger-sub" style="color:#22c55e">${this._t('discharging')}</div>`
        : (active
          ? `<div class="charger-power">${fmtW(d.v2cW)}</div><div class="charger-sub">${this._t('charging')}</div>${this._buildChargerCostDisplay(d)}`
          : `<div class="charger-idle">${this._t('charger_idle')}</div>`);
      const nameEl = chargerCard.querySelector('.ev-name');
      if (nameEl) nameEl.textContent = d.v2gActive ? 'V2C ▲ V2G' : 'V2C Charger';
    }

    // EV cards
    const evCards = Array.from(card.querySelectorAll('.ev-card:not(.ev-charger)'));
    d.evData.forEach((ev, i) => {
      const evCard = evCards[i];
      if (!evCard) return;

      if (ev.isCharging) evCard.classList.add('ev-is-charging');
      else evCard.classList.remove('ev-is-charging');

      const nameEl = evCard.querySelector('.ev-name');
      if (nameEl) nameEl.textContent = ev.name + (ev.isCharging ? ' ⚡' : '');

      const imgWrap = evCard.querySelector('.car-img-wrap');
      if (imgWrap) {
        let badge = imgWrap.querySelector('.charging-badge');
        if (ev.isCharging && !badge) {
          badge = document.createElement('div');
          badge.className = 'charging-badge';
          badge.textContent = '⚡';
          imgWrap.appendChild(badge);
        } else if (!ev.isCharging && badge) {
          badge.remove();
        }
      }

      // Battery ring
      const r = 22, circ = 2 * Math.PI * r;
      const offset = circ * (1 - ev.bat / 100);
      const col = ev.bat > 50 ? '#34d399' : ev.bat > 20 ? '#fbbf24' : '#f87171';
      const fillCircle = evCard.querySelector('.bat-fill');
      if (fillCircle) {
        fillCircle.setAttribute('stroke-dashoffset', offset.toFixed(2));
        fillCircle.setAttribute('stroke', ev.isCharging ? '#34d399' : col);
      }
      const batTextNode = evCard.querySelector('.bat-text');
      if (batTextNode && batTextNode.childNodes[0]) batTextNode.childNodes[0].textContent = ev.bat;

      // Target SoC arc
      const targetOffset = ev.targetSoc != null ? circ * (1 - ev.targetSoc / 100) : null;
      const ringSvg = evCard.querySelector('.bat-ring svg');
      let existingArc = ringSvg && ringSvg.querySelector('.target-arc');
      if (targetOffset != null && ev.isCharging) {
        if (existingArc) {
          existingArc.setAttribute('stroke-dashoffset', (targetOffset - 1.5).toFixed(2));
        } else if (ringSvg) {
          const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          arc.classList.add('target-arc');
          arc.setAttribute('cx', '28'); arc.setAttribute('cy', '28'); arc.setAttribute('r', r);
          arc.setAttribute('fill', 'none'); arc.setAttribute('stroke', 'rgba(52,211,153,0.35)');
          arc.setAttribute('stroke-width', '6'); arc.setAttribute('stroke-linecap', 'round');
          arc.setAttribute('stroke-dasharray', `3 ${(circ - 3).toFixed(2)}`);
          arc.setAttribute('stroke-dashoffset', (targetOffset - 1.5).toFixed(2));
          arc.style.pointerEvents = 'none';
          ringSvg.appendChild(arc);
        }
      } else if (existingArc) {
        existingArc.remove();
      }

      // Range
      const rangeEl = evCard.querySelector('.ev-range');
      if (rangeEl) {
        rangeEl.setAttribute('data-tip', this._t('tip_range', ev.rng, Math.round(ev.rng / 6)));
        rangeEl.innerHTML = `${ev.rng} <em>km</em>`;
      }

      // ETA
      let etaEl = evCard.querySelector('.ev-eta');
      if (ev.isCharging && ev.eta) {
        const etaText = `🏁 ${ev.eta}${ev.targetSoc != null ? ' → ' + ev.targetSoc + '%' : ''}`;
        if (etaEl) etaEl.textContent = etaText;
        else {
          etaEl = document.createElement('div');
          etaEl.className = 'ev-eta';
          etaEl.textContent = etaText;
          evCard.appendChild(etaEl);
        }
      } else if (etaEl) {
        etaEl.remove();
      }

      // Battery ring tooltip
      const batRing = evCard.querySelector('.bat-ring');
      if (batRing) {
        const batTip = this._t('tip_bat', ev.name, ev.bat, ev.rng, ev.targetSoc, ev.isCharging && ev.eta ? ev.eta : null)
          + (ev.isCharging ? '\n' + this._t('charging_via') : '');
        batRing.setAttribute('data-tip', batTip);
      }
    });
  }

  _buildStats(d) {
    let costClass = 'st-cost', costStr = '—';
    if (d.costH != null) {
      costStr = fmtEur(Math.abs(d.costH)) + '/h';
      costClass = d.costH < 0 ? 'st-earn' : 'st-cost';
    }
    return `
      <div class="stat st-sol" data-tip="Solar produced today\n${fmtKwh(d.solarToday)}"><div class="sv">${fmtKwh(d.solarToday)}</div><div class="sl">${this._t('solar_today')}</div><div class="spark" data-uid="spark-solar"></div></div>
      <div class="stat st-sol" data-tip="Solar forecast\nToday: ${fmtKwh(d.fcToday)}\nTomorrow: ${fmtKwh(d.fcTomorrow)}"><div class="sv">${fmtKwh(d.fcToday)}</div><div class="sl">${this._t('forecast')}</div></div>
      <div class="stat ${d.isExp?'st-exp':'st-imp'}" data-tip="${d.isExp?'Exporting to grid\n'+fmtW(d.gridExpW):'Importing from grid\n'+fmtW(d.gridImpW)}${d.price!=null?'\n@'+d.price.toFixed(3)+' €/kWh':''}"><div class="sv">${d.isExp?'↑ '+fmtW(d.gridExpW):'↓ '+fmtW(d.gridImpW)}</div><div class="sl">${d.isExp?this._t('exporting'):this._t('importing')}</div><div class="spark" data-uid="spark-grid"></div></div>
      <div class="stat ${costClass}" data-tip="Estimated cost\nGrid import: ${fmtW(d.gridImpW)}\nGrid export: ${fmtW(d.gridExpW)}\nNet: ${d.costH!=null?fmtEur(d.costH)+'/h':'—'}"><div class="sv">${d.costH!=null&&d.costH<0?this._t('earning'):costStr}</div><div class="sl">${this._t('est_cost')}</div><div class="spark" data-uid="spark-house"></div></div>`;
  }

  _buildForecast(d) {
    const weatherHtml = d.weatherCondition
      ? `<div class="fc-item" style="margin-left:auto">${weatherIcon(d.weatherCondition)} ${d.weatherTemp != null ? Math.round(d.weatherTemp)+'°' : d.weatherCondition}</div>`
      : '';
    return `
      <div class="fc-item"><div class="fc-dot" style="background:#fbbf24"></div><span>${this._t('fc_today')}: ${fmtKwh(d.fcToday)}</span></div>
      <div class="fc-item"><div class="fc-dot" style="background:#4a5f8a"></div><span>${this._t('fc_tomorrow')}: ${fmtKwh(d.fcTomorrow)}</span></div>
      ${weatherHtml}`;
  }

  _buildTempoBanner(d) {
    if (!d.tempoToday) return '';
    const normalize = s => {
      const l = (s || '').toLowerCase();
      if (l.includes('bleu') || l.includes('blue')) return 'blue';
      if (l.includes('blanc') || l.includes('white')) return 'white';
      if (l.includes('rouge') || l.includes('red')) return 'red';
      return null;
    };
    const todayColor    = normalize(d.tempoToday);
    const tomorrowColor = d.tempoTomorrow ? normalize(d.tempoTomorrow) : null;
    if (!todayColor) return '';
    const labels = { blue:'BLEU', white:'BLANC', red:'ROUGE' };
    const notes  = { blue:this._t('bleu_note'), white:this._t('blanc_note'), red:this._t('rouge_note') };
    const tomorrowHtml = tomorrowColor
      ? `<span class="tempo-tomorrow">${this._t('tomorrow')}: <span class="tempo-pill ${tomorrowColor}">${labels[tomorrowColor]}</span></span>` : '';
    return `
      <div class="tempo-banner ${todayColor}">
        <span class="tempo-pill ${todayColor}">${labels[todayColor]}</span>
        <span class="tempo-note">${notes[todayColor]}</span>
        ${tomorrowHtml}
      </div>`;
  }

  _buildDailySummary(d) {
    if (d.costToday == null && d.savingsToday == null && d.revenueToday == null && d.exportKwhDay == null) return '';
    const importTip  = `Grid import: ${d.importKwhDay != null ? d.importKwhDay.toFixed(2)+' kWh' : '—'}\n@ ${d.price != null ? d.price.toFixed(3)+' €/kWh' : '—'}`;
    const saveTip    = `Solar self-consumed: ${d.selfConsumedKwh != null ? round1(d.selfConsumedKwh)+' kWh' : '—'}\nAvoided grid cost`;
    const exportTip  = `Grid export: ${d.exportKwhDay != null ? d.exportKwhDay.toFixed(2)+' kWh' : '—'}${d.revenueToday != null ? '\nRevenue at feed-in rate' : ''}`;
    return `
      <div class="section-title">${this._t('today_summary')}</div>
      <div class="daily-summary">
        <div class="ds-tile ds-cost" data-tip="${importTip}">
          <div class="dv">${d.costToday != null ? d.costToday.toFixed(2)+' €' : '—'}</div>
          <div class="dl">${this._t('cost_today')}</div>
        </div>
        <div class="ds-tile ds-save" data-tip="${saveTip}">
          <div class="dv">${d.savingsToday != null ? d.savingsToday.toFixed(2)+' €' : '—'}</div>
          <div class="dl">${this._t('solar_savings')}</div>
        </div>
        <div class="ds-tile ds-rev" data-tip="${exportTip}">
          <div class="dv">${d.revenueToday != null ? d.revenueToday.toFixed(2)+' €' : (d.exportKwhDay != null ? round1(d.exportKwhDay)+' kWh ↑' : '—')}</div>
          <div class="dl">${d.revenueToday != null ? this._t('revenue') : this._t('exported_lbl')}</div>
        </div>
      </div>`;
  }

  _buildChargerCostDisplay(d) {
    if (!d.chargerActive) return '';
    const isFree = d.gridChargeW < 10;
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
    let out = '';
    if (isFree) {
      out = `<div class="cost-free" data-tip="${tipLines}">${this._t('cost_free')}</div><div class="cost-mixed">${this._t('solar_100')}</div>`;
    } else if (isMixed) {
      const est = d.sessionCostEst != null ? `~${d.sessionCostEst.toFixed(2)} €` : (d.chargeCostH != null ? `${d.chargeCostH.toFixed(3)} €/h` : '');
      out = `<div class="cost-paid" data-tip="${tipLines}">${est}</div><div class="cost-mixed">☀️ ${solarPct}% free · ⚡ ${100-solarPct}% grid</div>`;
    } else {
      const est = d.sessionCostEst != null ? `~${d.sessionCostEst.toFixed(2)} €` : (d.chargeCostH != null ? `${d.chargeCostH.toFixed(3)} €/h` : '—');
      out = `<div class="cost-paid" data-tip="${tipLines}">${est}</div><div class="cost-mixed">${this._t('grid_only')}</div>`;
    }
    if (d.v2cSessionKwh > 0) out += `<div style="font-size:0.58em;color:#4a3a7a;margin-top:2px">Session: ${fmtKwh(d.v2cSessionKwh)}</div>`;
    return out;
  }

  _buildChargingReco(d) {
    const t = TRANSLATIONS[getLang(this._hass, this._config)] || TRANSLATIONS.en;
    const reco = getChargingReco(d, this._config, t);
    if (!reco) return '';
    return `<div class="charging-reco ${reco.cls}"><span class="reco-icon">${reco.icon}</span><span class="reco-text">${reco.text}</span></div>`;
  }

  _buildEcoBadges(d) {
    const badges = [];
    // #5 CO₂ saved
    if (d.co2SavedKg != null && d.co2SavedKg > 0) {
      badges.push(`<span class="eco-badge eco-co2">🌿 ${this._t('co2_saved', d.co2SavedKg)}</span>`);
    }
    // #16 Battery health
    if (d.ratedKwh > 0 && d.battSoc != null) {
      badges.push(`<span class="eco-badge eco-batt">🔋 ${this._t('batt_health', 100)}</span>`);
    }
    // #18 Load profile
    const loadCls = `eco-load-${d.loadLabel}`;
    const loadLocalized = this._t(`load_${d.loadLabel}`);
    badges.push(`<span class="eco-badge ${loadCls}">⚡ ${this._t('load_profile', loadLocalized)}</span>`);
    if (badges.length === 0) return '';
    return `<div class="eco-badges">${badges.join('')}</div>`;
  }

  _buildGridAlerts(d) {
    const c = this._config;
    const threshold = parseFloat(c.grid_demand_threshold) || 3000;
    const alerts = [];
    // #10 — Demand response: high grid import
    if (d.gridImpW > threshold) {
      alerts.push(`<div class="charging-reco reco-warn"><span class="reco-icon">🔌</span><span class="reco-text">${this._t('demand_high', fmtW(d.gridImpW))}</span></div>`);
    }
    // #11 — Peak shaving: high import AND battery can help
    if (d.gridImpW > threshold && d.hasBattery && d.battSoc != null && d.battSoc > 20 && !d.battDischarging) {
      alerts.push(`<div class="charging-reco reco-info"><span class="reco-icon">🔋</span><span class="reco-text">${this._t('peak_shave', fmtW(Math.min(d.gridImpW, Math.abs(d.battW)||500)))}</span></div>`);
    }
    // #11 — Peak shaving via solar surplus
    if (d.gridImpW > 500 && d.surplusW > 500) {
      alerts.push(`<div class="charging-reco reco-good"><span class="reco-icon">☀️</span><span class="reco-text">${this._t('peak_shave_solar', fmtW(d.surplusW))}</span></div>`);
    }
    return alerts.join('');
  }

  // #1 Extra charger tile
  _buildExtraCharger(ch, idx) {
    const active = Math.abs(ch.w) > 10;
    const imgEl = ch.image ? `<img src="${ch.image}" class="ev-img" style="height:48px;object-fit:contain;margin:4px 0" loading="lazy">` : '⚡';
    const costLine = ch.sessionKwh != null && ch.sessionKwh > 0 ? `<div class="charger-sub">${fmtKwh(ch.sessionKwh)}</div>` : '';
    return `<div class="ev-card ev-charger${active?' plugged':''}" data-extra-charger="${idx}">
      <div class="ev-name">${ch.name || 'Charger'}</div>
      ${imgEl}
      ${active
        ? `<div class="charger-power">${fmtW(ch.w)}</div><div class="charger-sub">${this._t('charging')}</div>${costLine}`
        : `<div class="charger-idle">${this._t('charger_idle')}</div>`}
    </div>`;
  }

  // #4 Tariff price forecast chart
  _buildPriceChart(d) {
    const prices = d.tariffPrices;
    if (!prices || prices.length < 2) return '';
    const nowH = new Date().getHours();
    const upcoming = [...prices.slice(nowH), ...prices.slice(0, nowH)].slice(0, 12);
    if (upcoming.length < 2) return '';
    const W = 340, H = 36, barW = Math.floor(W / upcoming.length) - 1;
    const maxP = Math.max(...upcoming) || 1;
    const bars = upcoming.map((p, i) => {
      const barH = Math.max(3, Math.round((p / maxP) * H));
      const x = i * (barW + 1);
      const y = H - barH;
      const isNow = i === 0;
      const col = p > maxP * 0.75 ? '#f87171' : p < maxP * 0.35 ? '#34d399' : '#60a5fa';
      return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2" fill="${col}" opacity="${isNow?1:0.65}"/>
        ${isNow ? `<rect x="${x}" y="${y-2}" width="${barW}" height="2" rx="1" fill="${col}"/>` : ''}`;
    }).join('');
    const labels = upcoming.map((p, i) => {
      const h = (nowH + i) % 24;
      if (i % 3 !== 0) return '';
      return `<text x="${i*(barW+1)+barW/2}" y="${H+9}" text-anchor="middle" font-size="7" fill="#3d5280">${h}h</text>`;
    }).join('');
    return `<div class="price-chart">
      <div class="price-chart-title">⚡ Tariff next 12h</div>
      <svg viewBox="0 0 ${W} ${H+12}" height="${H+12}">
        ${bars}${labels}
      </svg>
    </div>`;
  }

  // #2 History modal — 7-day bar chart (async, called via tap)
  async _showHistoryModal() {
    const h = this._hass, c = this._config;
    if (!h || !c.solar_today) return;
    const shadow = this.shadowRoot;
    // Show loading backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'history-modal-backdrop';
    backdrop.innerHTML = `<div class="history-modal"><button class="history-modal-close">✕</button><div class="history-modal-title">📅 7-Day Solar History</div><div>Loading…</div></div>`;
    shadow.appendChild(backdrop);
    backdrop.querySelector('.history-modal-close').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });
    try {
      const end = new Date();
      const start = new Date(end - 7 * 86400000);
      const raw = await h.callApi('GET',
        `history/period/${start.toISOString()}?filter_entity_id=${c.solar_today}&minimal_response=true&no_attributes=true&end_time=${end.toISOString()}`
      );
      if (!Array.isArray(raw) || !raw[0]) { backdrop.querySelector('div div').textContent = 'No data available'; return; }
      const series = raw[0];
      // Group by day — last reading per day
      const days = {};
      series.forEach(s => {
        if (s.state === 'unavailable' || s.state === 'unknown') return;
        const day = s.last_changed.substring(0, 10);
        days[day] = parseFloat(s.state) || 0;
      });
      const dayKeys = Object.keys(days).sort().slice(-7);
      const vals = dayKeys.map(k => days[k]);
      if (!vals.length) { backdrop.querySelector('.history-modal div').textContent = 'Insufficient history'; return; }
      const maxV = Math.max(...vals) || 1;
      const W2 = 300, H2 = 80, bW = Math.floor(W2 / vals.length) - 4;
      const barsHtml = vals.map((v, i) => {
        const bH = Math.max(3, Math.round((v / maxV) * H2));
        const x = i * (bW + 4);
        const y = H2 - bH;
        const label = dayKeys[i].substring(5); // MM-DD
        return `<rect x="${x}" y="${y}" width="${bW}" height="${bH}" rx="3" fill="#fbbf24" opacity="0.8"/>
          <text x="${x+bW/2}" y="${H2+10}" text-anchor="middle" font-size="8" fill="#94a3b8">${label}</text>
          <text x="${x+bW/2}" y="${y-3}" text-anchor="middle" font-size="8" fill="#fbbf24">${round1(v)}</text>`;
      }).join('');
      backdrop.querySelector('.history-modal').innerHTML = `
        <button class="history-modal-close">✕</button>
        <div class="history-modal-title">📅 7-Day Solar · kWh/day</div>
        <svg viewBox="0 0 ${W2} ${H2+16}" height="${H2+16}">${barsHtml}</svg>`;
      backdrop.querySelector('.history-modal-close').addEventListener('click', () => backdrop.remove());
    } catch(e) {
      backdrop.querySelector('div div').textContent = 'History API unavailable';
    }
  }

  // #17 EV charging optimizer
  _buildEvOptimizer(d) {
    if (!this._config.evs || this._config.evs.length === 0) return '';
    const anyEVNeedsCharge = d.evData.some(ev => ev.bat < (ev.targetSoc || 90));
    if (!anyEVNeedsCharge) return '';
    let msg = null;
    if (d.surplusW > 1400) {
      msg = { cls:'reco-free', text: this._t('ev_opt_solar') };
    } else if (d.price != null && parseFloat(this._config.price_alert_low) && d.price <= parseFloat(this._config.price_alert_low)) {
      msg = { cls:'reco-good', text: this._t('ev_opt_cheap', d.price.toFixed(3)+' €/kWh') };
    } else if (d.price != null && parseFloat(this._config.price_alert_high) && d.price >= parseFloat(this._config.price_alert_high)) {
      msg = { cls:'reco-warn', text: this._t('ev_opt_wait') };
    }
    if (!msg) return '';
    return `<div class="charging-reco ${msg.cls}"><span class="reco-icon">🚗</span><span class="reco-text">${msg.text}</span></div>`;
  }

  // #22 Device scheduler
  _buildDevScheduler(d) {
    let msg = null;
    if (d.surplusW > 1000) {
      msg = { cls:'reco-free', text: this._t('dev_sched_solar') };
    } else if (d.price != null && parseFloat(this._config.price_alert_low) && d.price <= parseFloat(this._config.price_alert_low)) {
      msg = { cls:'reco-good', text: this._t('dev_sched_cheap', d.price.toFixed(3)+' €/kWh') };
    } else if (d.price != null && parseFloat(this._config.price_alert_high) && d.price >= parseFloat(this._config.price_alert_high)) {
      msg = { cls:'reco-warn', text: this._t('dev_sched_wait') };
    }
    if (!msg) return '';
    return `<div class="charging-reco ${msg.cls}"><span class="reco-icon">🏠</span><span class="reco-text">${msg.text}</span></div>`;
  }

  _buildSufficiencyGauge(d) {
    if (d.solarW <= 0 && d.daySuffPct == null) return '';

    const pct = d.daySuffPct != null ? d.daySuffPct : d.liveSuffPct;
    const label = d.daySuffPct != null ? this._t('solar_powered') : this._t('live_suff');
    const col = pct >= 70 ? '#34d399' : pct >= 30 ? '#fbbf24' : '#f87171';

    const R = 36, cx = 48, cy = 48, sw = 8;
    const circ = 2 * Math.PI * R;
    const arcLen = circ * 0.75;
    const filled = arcLen * (pct / 100);
    const gap = circ - arcLen;
    const rotation = 135;

    const tip = [
      `Self-sufficiency: ${pct.toFixed(1)}%`,
      d.daySelfKwh != null ? `Solar self-consumed: ${round1(d.daySelfKwh)} kWh` : '',
      d.dayTotalKwh != null ? `Total consumption: ${round1(d.dayTotalKwh)} kWh` : '',
      `Live: ${d.liveSuffPct.toFixed(0)}%`,
    ].filter(Boolean).join('\n');

    return `
    <div class="suff-wrap" data-uid="suff-gauge" data-tip="${tip}">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"
          stroke-dasharray="${arcLen.toFixed(2)} ${gap.toFixed(2)}"
          stroke-dashoffset="${(-gap/2).toFixed(2)}"
          stroke-linecap="round"
          transform="rotate(${rotation} ${cx} ${cy})"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${col}" stroke-width="${sw}"
          stroke-dasharray="${filled.toFixed(2)} ${(circ-filled).toFixed(2)}"
          stroke-dashoffset="${(-gap/2).toFixed(2)}"
          stroke-linecap="round"
          transform="rotate(${rotation} ${cx} ${cy})"
          style="transition:stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1),stroke 0.6s"
          filter="drop-shadow(0 0 4px ${col})"/>
        <text x="${cx}" y="${cy-4}" text-anchor="middle" dominant-baseline="middle"
          font-size="18" font-weight="800" fill="${col}">${pct.toFixed(0)}</text>
        <text x="${cx}" y="${cy+13}" text-anchor="middle" dominant-baseline="middle"
          font-size="9" font-weight="600" fill="rgba(255,255,255,0.4)">%</text>
      </svg>
      <div class="suff-label">
        <div class="suff-main" style="color:${col}">${pct.toFixed(1)}% solar</div>
        <div class="suff-sub">${label}</div>
      </div>
    </div>`;
  }

  _getStreak(daySuffPct) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = JSON.parse(localStorage.getItem('sec-scores') || '{}');
      if (daySuffPct != null) raw[today] = Math.max(raw[today] || 0, Math.round(daySuffPct));
      // Trim to last 60 days and save
      const sorted = Object.keys(raw).sort().slice(-60);
      const scores = {};
      sorted.forEach(k => { scores[k] = raw[k]; });
      try { localStorage.setItem('sec-scores', JSON.stringify(scores)); } catch(e) {}
      // Count streak of consecutive days >= 30% (not counting today)
      let streak = 0;
      const d = new Date(); d.setDate(d.getDate() - 1);
      for (let i = 0; i < 60; i++) {
        const key = d.toISOString().slice(0, 10);
        if ((scores[key] || 0) >= 30) { streak++; d.setDate(d.getDate() - 1); } else break;
      }
      return { today: daySuffPct != null ? Math.round(daySuffPct) : null, streak };
    } catch(e) { return { today: null, streak: 0 }; }
  }

  _buildHeaderScore(d) {
    const sk = this._getStreak(d.daySuffPct);
    const parts = [];
    if (sk.streak > 0) parts.push(`<span class="streak-badge fire">🔥 ${sk.streak}d</span>`);
    if (sk.today != null) {
      const cls = sk.today >= 70 ? 'score' : 'score-ok';
      parts.push(`<span class="streak-badge ${cls}">⭐ ${sk.today}%</span>`);
    }
    return parts.join('');
  }

  _cardClasses(d) {
    const c = this._config;
    const threshold = parseFloat(c.grid_demand_threshold) || 3000;
    const amb = d.surplusW > 200 ? 'amb-surplus' : d.gridImpW > 500 ? 'amb-import' : '';
    const peak = d.gridImpW > threshold ? 'peak-alarm' : '';
    const cloud = ['cloudy','overcast','fog','rainy','pouring','snowy'].some(w => (d.weatherCondition||'').toLowerCase().includes(w)) ? 'weather-cloudy' : '';
    return [amb, peak, cloud].filter(Boolean).join(' ');
  }

  _buildCard(d) {
    const c = this._config;
    const priceStr = d.price != null ? d.price.toFixed(3) + ' €' : '—';
    const hasSurplus = d.surplusW > 50;
    return `
      <div class="card-hud"></div>
      <div class="header">
        <div class="title-block">
          <div class="title">${c.title || 'Energy'}</div>
          <div class="subtitle">⚡ ${this._t('subtitle')} · v${VERSION}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span data-uid="header-score">${this._buildHeaderScore(d)}</span>
          <div class="price-pill"><div class="val" data-uid="price-val">${priceStr}</div><div class="lbl">€/kWh</div></div>
          <div class="share-btn" data-action="share" title="Energy stats">📋
            <div class="stats-popup" data-uid="stats-popup">
              <pre data-uid="stats-content"></pre>
              <button class="stats-popup-copy" data-uid="stats-copy">Copy to clipboard</button>
            </div>
          </div>
        </div>
      </div>
      ${this._buildTempoBanner(d)}
      <div class="flow-wrap" data-uid="flow-wrap">${this._buildFlowSVG(d)}${this._buildWeatherPopup(d)}</div>
      <div data-uid="surplus-wrap">${hasSurplus ? `<div class="surplus"><span class="s-lbl">${this._t('surplus')}</span><span class="s-val">${fmtW(d.surplusW)}</span></div>` : ''}</div>
      <div data-uid="suff-wrap">${this._buildSufficiencyGauge(d)}</div>
      <div class="stats-tabs" data-uid="stats-tabs">
        <div class="stats-tab active" data-tab="live">⚡ Live</div>
        <div class="stats-tab" data-tab="today">📅 Today</div>
      </div>
      <div class="stats-tab-panel active" data-panel="live">
        <div class="stats" data-uid="stats">${this._buildStats(d)}</div>
      </div>
      <div class="stats-tab-panel" data-panel="today">
        <div data-uid="daily-summary-tab">${this._buildDailySummary(d)}</div>
      </div>
      <div data-uid="daily-summary" style="display:none"></div>
      <div data-uid="price-chart">${this._buildPriceChart(d)}</div>
      <div data-uid="eco-badges">${this._buildEcoBadges(d)}</div>
      <div data-uid="charging-reco">${this._buildChargingReco(d)}</div>
      <div data-uid="ev-optimizer">${this._buildEvOptimizer(d)}</div>
      <div data-uid="dev-scheduler">${this._buildDevScheduler(d)}</div>
      <div data-uid="grid-alerts">${this._buildGridAlerts(d)}</div>
      <div class="ev-section">
        <div class="section-title">${this._t('ev_section')}</div>
        <div class="ev-grid" data-uid="ev-grid">
          ${this._buildCharger(d)}
          ${d.extraChargers.map((ch, i) => this._buildExtraCharger(ch, i)).join('')}
          ${d.evData.map((ev, i) => this._buildEV(ev, i)).join('')}
        </div>
      </div>
      <div class="section-title">${this._t('dev_section')}</div>
      <div class="devices-grid" data-uid="devices-grid">${d.devices.map((dev, i) => this._buildDevice(dev, this._config.devices_sort ? i : null)).join('')}</div>
      <div class="forecast-row" data-uid="forecast-row">${this._buildForecast(d)}</div>`;
  }

  _buildFlowSVG(d) {
    const devEmoji = { ac:'❄️', water:'💧', tv:'📺', washer:'🫧', computer:'🖥️', server:'💻', car:'🚗', bolt:'⚡', home:'🏠', plug:'🔌' };
    const activeDevNodes = (d.devices || []).filter(dev => dev.w > 50).slice(0, 4);
    const Drow = 235; // y-coordinate for device nodes
    const Rd = 16;    // device node radius
    const W=360, H=activeDevNodes.length > 0 ? 260 : 210;
    const sP={x:58,y:62}, hP={x:180,y:105}, gP={x:302,y:62}, vP={x:180,y:185};
    const R=44, Rv=28;
    const bP={x:58,y:175};
    const Rb=26;
    const sOn=d.solarW>20, iOn=d.gridImpW>20, eOn=d.gridExpW>20, vOn=Math.abs(d.v2cW)>10;
    const sPth=`M${sP.x},${sP.y} C${(sP.x+hP.x)/2-10},${sP.y} ${(sP.x+hP.x)/2+10},${hP.y} ${hP.x},${hP.y}`;
    const iPth=`M${gP.x},${gP.y} C${(gP.x+hP.x)/2+10},${gP.y} ${(gP.x+hP.x)/2-10},${hP.y} ${hP.x},${hP.y}`;
    const ePth=`M${hP.x},${hP.y} C${(hP.x+gP.x)/2-10},${hP.y} ${(hP.x+gP.x)/2+10},${gP.y} ${gP.x},${gP.y}`;
    const vPth=`M${hP.x},${hP.y} L${vP.x},${vP.y}`;
    const vPthV2g=`M${vP.x},${vP.y} L${hP.x},${hP.y}`;
    const bChgPth=`M${hP.x},${hP.y} C${(bP.x+hP.x)/2},${hP.y} ${(bP.x+hP.x)/2},${bP.y} ${bP.x},${bP.y}`;
    const bDisPth=`M${bP.x},${bP.y} C${(bP.x+hP.x)/2},${bP.y} ${(bP.x+hP.x)/2},${hP.y} ${hP.x},${hP.y}`;
    const gClass=d.isExp?'c-grid-exp':'c-grid-imp';
    const vSolarPct=(vOn&&d.v2cW>0)?Math.round((d.solarFreeW/d.v2cW)*100):0;
    const sun = getSunArc();
    // Device laser color: blend solar-yellow ↔ grid-red by solar share
    const solarShareSvg = clamp(d.solarW / Math.max(1, d.houseW), 0, 1);
    const devCol = `rgb(${Math.round(251*solarShareSvg+248*(1-solarShareSvg))},${Math.round(191*solarShareSvg+113*(1-solarShareSvg))},${Math.round(36*solarShareSvg+113*(1-solarShareSvg))})`;
    // Device node positions: evenly spread across x=[32,328] at y=Drow
    const devPositions = activeDevNodes.map((dev, i) => {
      const n = activeDevNodes.length;
      const x = Math.round(32 + (i + 0.5) * 296 / n);
      const pth = `M${hP.x},${hP.y} C${hP.x},${hP.y+55} ${x},${Drow-55} ${x},${Drow}`;
      return { x, y: Drow, dev, pth, id: `pDev${i}` };
    });
    return `
    <svg class="flow-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow-s" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fbbf24" stop-opacity="0.25"/><stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-h" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#60a5fa" stop-opacity="0.18"/><stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${d.isExp?'#34d399':'#f87171'}" stop-opacity="0.2"/><stop offset="100%" stop-color="${d.isExp?'#34d399':'#f87171'}" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-v" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.35"/><stop offset="100%" stop-color="#c084fc" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow-b" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#34d399" stop-opacity="0.3"/><stop offset="100%" stop-color="#34d399" stop-opacity="0"/></radialGradient>
        <radialGradient id="orb-sol" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.95"/>
          <stop offset="30%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#78350f" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orb-sol-off" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#2d2515" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0c1020"/>
        </radialGradient>
        <radialGradient id="orb-house" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.9"/>
          <stop offset="30%" stop-color="#60a5fa"/>
          <stop offset="100%" stop-color="#1e3a5f" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orb-grid-imp" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#fee2e2" stop-opacity="0.9"/>
          <stop offset="30%" stop-color="#f87171"/>
          <stop offset="100%" stop-color="#4c1515" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orb-grid-exp" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#d1fae5" stop-opacity="0.9"/>
          <stop offset="30%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#064e3b" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orb-v2c" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#f3e8ff" stop-opacity="0.9"/>
          <stop offset="30%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#3b0764" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orb-v2c-off" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#1a0a2e" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0c1020"/>
        </radialGradient>
        <radialGradient id="orb-bat" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#d1fae5" stop-opacity="0.9"/>
          <stop offset="30%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#064e3b" stop-opacity="0.9"/>
        </radialGradient>
        <radialGradient id="orb-bat-off" cx="34%" cy="28%" r="66%">
          <stop offset="0%" stop-color="#0a1a12" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0c1020"/>
        </radialGradient>
        <linearGradient id="sun-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fb923c" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
      ${sun ? `
        <path d="M 20,100 Q 180,15 340,100" fill="none"
          stroke="url(#sun-arc-grad)" stroke-width="1" opacity="0.25" stroke-dasharray="3 5"/>
        <circle cx="${sun.x.toFixed(1)}" cy="${sun.y.toFixed(1)}" r="5"
          fill="${sun.noon > 0.7 ? '#fef08a' : '#fed7aa'}"
          filter="drop-shadow(0 0 ${(4 + sun.noon*4).toFixed(0)}px ${sun.noon > 0.7 ? '#fbbf24' : '#fb923c'})"
          opacity="${(0.5 + sun.noon * 0.5).toFixed(2)}"/>
      ` : ''}
      ${sOn?`<circle cx="${sP.x}" cy="${sP.y}" r="${R+18}" fill="url(#glow-s)"/>`:''}
      <circle cx="${hP.x}" cy="${hP.y}" r="${R+22}" fill="url(#glow-h)"/>
      <circle cx="${gP.x}" cy="${gP.y}" r="${R+14}" fill="url(#glow-g)"/>
      ${vOn?`<circle cx="${vP.x}" cy="${vP.y}" r="${Rv+20}" fill="url(#glow-v)"/>`:''}
      ${sOn?`<path id="pSolar" class="track t-solar" d="${sPth}"/>`:''}
      ${iOn?`<path id="pImp" class="track t-imp" d="${iPth}"/>`:''}
      ${eOn?`<path id="pExp" class="track t-exp" d="${ePth}"/>`:''}
      ${d.v2gActive
        ? `<path id="pV2g" class="track" style="stroke:#34d399;opacity:0.35" d="${vPthV2g}"/>`
        : (vOn ? `<path id="pV2c" class="track t-v2c" d="${vPth}"/>` : '')
      }
      <g id="particles"></g>
      <circle cx="${sP.x}" cy="${sP.y}" r="${R}" fill="url(#${sOn?'orb-sol':'orb-sol-off'})" stroke="${sOn?'#fbbf24':'#2a2008'}" stroke-width="1.5" data-uid="solar-orb" style="cursor:${this._config.weather_entity?'pointer':'default'}"/>
      <circle cx="${sP.x-R*0.28}" cy="${sP.y-R*0.28}" r="${R*0.18}" fill="white" opacity="${sOn?'0.35':'0.08'}"/>
      <text x="${sP.x}" y="${sP.y-14}" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="${sOn?'#fbbf24':'#2a3558'}" pointer-events="none">${d.weatherCondition&&this._config.weather_entity?weatherIcon(d.weatherCondition):'☀️'}</text>
      <text x="${sP.x}" y="${sP.y+7}" class="n-power" opacity="${sOn?'1':'0.35'}">${sOn?fmtW(d.solarW):'—'}</text>
      <text x="${sP.x}" y="${sP.y+22}" class="n-name">${this._t('solar')}</text>
      <circle cx="${hP.x}" cy="${hP.y}" r="${R}" fill="url(#orb-house)" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="${hP.x-R*0.28}" cy="${hP.y-R*0.28}" r="${R*0.18}" fill="white" opacity="0.3"/>
      <text x="${hP.x}" y="${hP.y-14}" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="#60a5fa">🏠</text>
      <text x="${hP.x}" y="${hP.y+7}" class="n-power">${fmtW(d.houseW)}</text>
      <text x="${hP.x}" y="${hP.y+22}" class="n-name">${this._t('house')}</text>
      <circle cx="${gP.x}" cy="${gP.y}" r="${R}" fill="url(#${d.isExp?'orb-grid-exp':'orb-grid-imp'})" stroke="${d.isExp?'#34d399':'#f87171'}" stroke-width="1.5"/>
      <circle cx="${gP.x-R*0.28}" cy="${gP.y-R*0.28}" r="${R*0.18}" fill="white" opacity="0.28"/>
      <text x="${gP.x}" y="${gP.y-14}" font-size="18" text-anchor="middle" dominant-baseline="middle" fill="${d.isExp?'#34d399':'#f87171'}">${d.isExp?'↑':'↓'}🔌</text>
      <text x="${gP.x}" y="${gP.y+7}" class="n-power">${fmtW(Math.abs(d.gridW))}</text>
      <text x="${gP.x}" y="${gP.y+22}" class="n-name">${d.isExp?this._t('export'):this._t('import')}</text>
      ${vOn?`<circle class="v2c-ring-pulse" cx="${vP.x}" cy="${vP.y}" r="${Rv}"/>`:''}
      <circle cx="${vP.x}" cy="${vP.y}" r="${Rv}" fill="url(#${vOn?(d.v2gActive?'orb-bat':'orb-v2c'):'orb-v2c-off'})" stroke="${vOn?(d.v2gActive?'#34d399':'#c084fc'):'#2a1a5a'}" stroke-width="1.5"/>
      <circle cx="${vP.x-Rv*0.28}" cy="${vP.y-Rv*0.28}" r="${Rv*0.2}" fill="white" opacity="${vOn?'0.3':'0.07'}"/>
      ${d.v2gActive
        ? `<text x="${vP.x}" y="${vP.y-3}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#34d399" class="v2c-bolt-active">⚡</text>
           <text x="${vP.x}" y="${vP.y+12}" class="n-name" style="font-size:7.5px">${fmtW(Math.abs(d.v2cW))}</text>
           <text x="${vP.x}" y="${vP.y+21}" class="n-name" style="font-size:7px">${this._t('v2g')}</text>`
        : `<text x="${vP.x}" y="${vP.y-3}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${vOn?'#c084fc':'#2a2050'}" class="${vOn?'v2c-bolt-active':''}">⚡</text>
           ${vOn
             ? `<text x="${vP.x}" y="${vP.y+12}" class="n-name" style="font-size:7.5px">${fmtW(d.v2cW)}</text>
                ${vSolarPct>0?`<text x="${vP.x}" y="${vP.y+21}" class="n-name" style="font-size:7px">☀️${vSolarPct}% free</text>`:''}`
             : `<text x="${vP.x}" y="${vP.y+14}" class="n-name" opacity="0.35" style="font-size:8px">${this._t('v2c')}</text>`}
        `
      }
      ${d.hasBattery ? `
        ${d.battCharging    ? `<path id="pBatChg" class="track" style="stroke:#34d399" d="${bChgPth}"/>` : ''}
        ${d.battDischarging ? `<path id="pBatDis" class="track" style="stroke:#34d399" d="${bDisPth}"/>` : ''}
        ${(d.battCharging||d.battDischarging) ? `<circle cx="${bP.x}" cy="${bP.y}" r="${Rb+16}" fill="url(#glow-b)"/>` : ''}
        <circle cx="${bP.x}" cy="${bP.y}" r="${Rb}" fill="url(#${(d.battCharging||d.battDischarging)?'orb-bat':'orb-bat-off'})" stroke="${(d.battCharging||d.battDischarging)?'#34d399':'#0a2a1a'}" stroke-width="1.5"/>
        <circle cx="${bP.x-Rb*0.28}" cy="${bP.y-Rb*0.28}" r="${Rb*0.2}" fill="white" opacity="${(d.battCharging||d.battDischarging)?'0.28':'0.07'}"/>
        <text x="${bP.x}" y="${bP.y-6}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="${(d.battCharging||d.battDischarging)?'#34d399':'#1a3a28'}">🔋</text>
        ${d.battSoc != null
          ? `<text x="${bP.x}" y="${bP.y+9}" class="n-power" style="font-size:11px">${Math.round(d.battSoc)}%</text>`
          : `<text x="${bP.x}" y="${bP.y+9}" class="n-name" opacity="0.35">${this._t('batt')}</text>`}
        ${d.battCharging
          ? `<text x="${bP.x}" y="${bP.y+22}" class="n-name" style="font-size:7.5px">+${fmtW(d.battW)}</text>`
          : d.battDischarging
          ? `<text x="${bP.x}" y="${bP.y+22}" class="n-name" style="font-size:7.5px">${fmtW(Math.abs(d.battW))}</text>`
          : `<text x="${bP.x}" y="${bP.y+22}" class="n-name" opacity="0.35" style="font-size:7.5px">${this._t('idle')}</text>`}
      ` : ''}
      ${devPositions.map(({x, y, dev, pth, id}) => `
        <radialGradient id="glow-dev-${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${devCol}" stop-opacity="0.28"/><stop offset="100%" stop-color="${devCol}" stop-opacity="0"/></radialGradient>
        <path id="${id}" class="track" style="stroke:${devCol};opacity:0.3" d="${pth}"/>
        <circle cx="${x}" cy="${y}" r="${Rd+12}" fill="url(#glow-dev-${id})"/>
        <circle cx="${x}" cy="${y}" r="${Rd}" fill="rgba(30,15,5,0.85)" stroke="${devCol}" stroke-width="1.2"/>
        <text x="${x}" y="${y-4}" font-size="13" text-anchor="middle" dominant-baseline="middle" pointer-events="none">${devEmoji[dev.icon] || '🔌'}</text>
        <text x="${x}" y="${y+10}" class="n-name" style="font-size:7px" pointer-events="none">${fmtW(dev.w)}</text>
      `).join('')}
    </svg>`;
  }

  _buildCharger(d) {
    const c = this._config;
    const active = d.chargerActive;
    const img = c.v2c_image
      ? `<img src="${c.v2c_image}" class="v2c-img${active?' plugged':''}" alt="V2C" onerror="this.style.display='none'">`
      : `<div style="width:32px;height:32px;color:${active?'#c084fc':'#2a1a5a'}">${SVG_ICONS.charge}</div>`;
    const content = d.v2gActive
      ? `<div class="charger-power" style="color:#34d399">${fmtW(Math.abs(d.v2cW))}</div><div class="charger-sub" style="color:#22c55e">${this._t('discharging')}</div>`
      : (active
        ? `<div class="charger-power">${fmtW(d.v2cW)}</div><div class="charger-sub">${this._t('charging')}</div>${this._buildChargerCostDisplay(d)}`
        : `<div class="charger-idle">${this._t('charger_idle')}</div>`);
    return `
      <div class="ev-card ev-charger${active?' plugged':''}" data-tip="${active?'':'V2C Charger\nIdle — no vehicle connected'}">
        <div class="ev-name">${d.v2gActive ? 'V2C ▲ V2G' : 'V2C Charger'}</div>
        ${img}
        <div data-uid="charger-content">
          ${content}
        </div>
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
      ? `<div class="car-img-wrap"><img src="${ev.image}" alt="${ev.name}" loading="lazy" onerror="this.parentElement.style.display='none'">${ev.isCharging?`<div class="charging-badge">⚡</div>`:''}</div>` : '';
    const etaLine = (ev.isCharging && ev.eta)
      ? `<div class="ev-eta">🏁 ${ev.eta}${ev.targetSoc!=null?' → '+ev.targetSoc+'%':''}</div>` : '';
    const batTip = this._t('tip_bat', ev.name, ev.bat, ev.rng, ev.targetSoc, ev.isCharging && ev.eta ? ev.eta : null)
      + (ev.isCharging ? '\n' + this._t('charging_via') : '');

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
        <div class="ev-range" data-tip="${this._t('tip_range', ev.rng, Math.round(ev.rng / 6))}">${ev.rng} <em>km</em></div>
        ${etaLine}
        ${ev.battHealth != null ? `<div class="ev-health">🔋 ${Math.round(ev.battHealth)}% health</div>` : ''}
        ${ev.warrantyMonths != null ? (() => {
          const cls = ev.warrantyMonths <= 0 ? 'exp' : ev.warrantyMonths < 12 ? 'warn' : 'ok';
          const txt = ev.warrantyMonths <= 0 ? '⚠️ Warranty expired' : `🛡️ ${ev.warrantyMonths}m warranty`;
          return `<div class="ev-warranty ${cls}">${txt}</div>`;
        })() : ''}
      </div>`;
  }

  _buildDevice(dev, rank) {
    const on = dev.w > 5;
    const isAlert = dev.alert_above != null && dev.w > dev.alert_above;
    const icon = SVG_ICONS[dev.icon] || SVG_ICONS.plug;
    const rankHtml = rank != null ? `<span class="dev-rank">#${rank+1}</span>` : '';
    const alertTip = isAlert ? `⚠️ Above ${dev.alert_above}W threshold` : '';
    const tip = [dev.name, `${Math.round(dev.w)} W`, alertTip].filter(Boolean).join('\n');
    const isExpanded = this._expandedDevEntity === dev.entity;
    const sparkData = isExpanded && this._sparkData?.[dev.entity];
    const sparkHtml = sparkData
      ? `<div class="dev-expand-spark">${this._buildSparkSvg(sparkData, on?'#fbbf24':'#3d5280', 80, 22)}</div><div class="dev-expand-info">6h · peak ${fmtW(Math.max(...sparkData))}</div>`
      : `<div class="dev-expand-info">${dev.entity || ''}</div>`;
    return `<div class="device${on?' on':''}${isAlert?' alert':''}${isExpanded?' expanded':''}" data-dev-entity="${dev.entity||''}" data-tip="${tip}">
      ${rankHtml}<div class="dev-icon ${on?'on':'off'}">${icon}</div><div class="dev-name">${dev.name}</div><div class="dev-power">${fmtW(dev.w)}</div>
      <div class="dev-expand">${sparkHtml}</div>
    </div>`;
  }

  _drawChargingCable(shadow, d) {
    if (!d.chargerActive || d.v2gActive) return;
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

  _buildWeatherPopup(d) {
    if (!d.weatherCondition || !this._config.weather_entity) return '';
    const now = new Date();
    const nowH = now.getHours();
    // Determine how many hours ahead to show (2h min, 12h max)
    const lookahead = Math.min(12, Math.max(2, 14 - nowH));
    const cutoff = new Date(now.getTime() + lookahead * 3600 * 1000);
    const rows = (d.weatherForecast || [])
      .filter(f => { try { const t = new Date(f.datetime); return t >= now && t <= cutoff; } catch(e) { return false; } })
      .slice(0, 6)
      .map(f => {
        const t = new Date(f.datetime);
        const h = t.getHours().toString().padStart(2,'0') + ':00';
        const ic = weatherIcon(f.condition || '');
        const temp = f.temperature != null ? Math.round(f.temperature) + '°' : '';
        const rain = f.precipitation != null && f.precipitation > 0.1 ? `💧${f.precipitation.toFixed(1)}` : '';
        return `<div class="weather-popup-row"><span class="wf-time">${h}</span><span class="wf-icon">${ic}</span><span>${f.condition||''}</span>${rain?`<span class="wf-rain">${rain}</span>`:''}<span class="wf-temp">${temp}</span></div>`;
      }).join('');
    return `
      <div class="weather-popup" data-uid="weather-popup">
        <div class="weather-popup-current">
          <span style="font-size:1.3em">${weatherIcon(d.weatherCondition)}</span>
          <span>${d.weatherCondition}</span>
          ${d.weatherTemp != null ? `<span class="wc-temp">${Math.round(d.weatherTemp)}°</span>` : ''}
        </div>
        ${rows ? `<div class="weather-popup-rows">${rows}</div>` : '<div style="font-size:0.7em;color:#64748b">No forecast data</div>'}
      </div>`;
  }

  _startParticles(shadow, d) {
    const totalW = Math.max(1, d.houseW);
    const activeDevNodes = (d.devices || []).filter(dev => dev.w > 50).slice(0, 4);
    // Device laser color: blend solar (#fbbf24) and grid (#f87171) based on their share of house consumption
    const solarShare = clamp(d.solarW / Math.max(1, d.houseW), 0, 1);
    const devLaserColor = (() => {
      // Interpolate between grid-red and solar-yellow
      const r = Math.round(251 * solarShare + 248 * (1 - solarShare));
      const g = Math.round(191 * solarShare + 113 * (1 - solarShare));
      const b = Math.round(36  * solarShare + 113 * (1 - solarShare));
      return `rgb(${r},${g},${b})`;
    })();
    const devFlows = activeDevNodes.map((dev, i) => ({
      id: `pDev${i}`, col: devLaserColor, w: dev.w, active: true
    }));
    [
      { id:'pSolar',  col:'#fbbf24', w:d.solarW,            active:d.solarW>20 },
      { id:'pImp',    col:'#f87171', w:d.gridImpW,          active:d.gridImpW>20 },
      { id:'pExp',    col:'#34d399', w:d.gridExpW,          active:d.gridExpW>20 },
      { id: d.v2gActive ? 'pV2g' : 'pV2c', col: d.v2gActive ? '#34d399' : '#c084fc', w: Math.abs(d.v2cW), active: Math.abs(d.v2cW) > 10 },
      { id:'pBatChg', col:'#34d399', w:d.battW,             active:d.battCharging },
      { id:'pBatDis', col:'#34d399', w:Math.abs(d.battW),   active:d.battDischarging },
      ...devFlows,
    ].filter(f => f.active).forEach(flow => {
      const frac = clamp(flow.w / totalW, 0.04, 1);
      // High power = fast frequent shots, low power = slow infrequent shots
      const ms = Math.round(900 - frac * 750);
      this._particleTimers.push(setInterval(() => {
        const path = shadow.getElementById(flow.id);
        const cont = shadow.getElementById('particles');
        if (path && cont) this._spawnLaser(path, cont, flow.col, frac);
      }, ms));
    });
  }

  _spawnLaser(pathEl, container, color, frac) {
    const len = pathEl.getTotalLength();
    if (!len) return;
    // Head radius 1.5–4.5px, tail is 4 trailing segments
    const headR = 1.5 + frac * 3;
    const numTail = 4;
    const tailSpacing = len * (0.04 + frac * 0.08); // spacing between segments
    const dur = Math.round(700 - frac * 350); // fast shot for high power
    const segs = Array.from({ length: numTail }, (_, i) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      el.setAttribute('r', (headR * Math.pow(0.62, i)).toFixed(2));
      el.setAttribute('fill', color);
      if (i === 0) el.setAttribute('filter', `drop-shadow(0 0 ${(headR * 1.6).toFixed(1)}px ${color})`);
      container.appendChild(el);
      return el;
    });
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const headPos = p * len;
      for (let i = 0; i < numTail; i++) {
        const pos = Math.max(0, headPos - i * tailSpacing);
        if (pos === 0 && i > 0) { segs[i].setAttribute('opacity', '0'); continue; }
        const pt = pathEl.getPointAtLength(pos);
        segs[i].setAttribute('cx', pt.x.toFixed(2));
        segs[i].setAttribute('cy', pt.y.toFixed(2));
        const fadeIn  = p < 0.08 ? p / 0.08 : 1;
        const fadeOut = p > 0.88 ? (1 - p) / 0.12 : 1;
        const tailFade = 1 - (i / numTail) * 0.82;
        segs[i].setAttribute('opacity', (fadeIn * fadeOut * tailFade).toFixed(3));
      }
      if (p < 1) {
        this._animFrames.push(requestAnimationFrame(step));
      } else {
        segs.forEach(s => s.remove());
      }
    };
    this._animFrames.push(requestAnimationFrame(step));
  }

  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  _statsText(d) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('fr-FR');
    return [
      `⚡ Smooth Energy — ${dateStr} ${timeStr}`,
      ``,
      `☀️  Solar:   ${fmtW(d.solarW)}`,
      `🏠  House:   ${fmtW(d.houseW)}`,
      d.isExp
        ? `🔌  Grid:    ↑ ${fmtW(d.gridExpW)} (exporting)`
        : `🔌  Grid:    ↓ ${fmtW(d.gridImpW)} (importing)`,
      d.hasBattery && d.battCharging    ? `🔋  Battery: +${fmtW(d.battW)} (charging)` : '',
      d.hasBattery && d.battDischarging ? `🔋  Battery: ${fmtW(Math.abs(d.battW))} (discharging)` : '',
      d.hasBattery && d.battSoc != null ? `    SoC: ${Math.round(d.battSoc)}%` : '',
      d.v2cW > 10 ? `🚗  V2C:     ${fmtW(d.v2cW)} charging` : '',
      ``,
      ...d.evData.map(ev => `🚘  ${ev.name}: ${ev.bat}% · ${ev.rng} km${ev.isCharging ? ' ⚡ charging' : ''}`),
      ``,
      d.solarToday != null  ? `📅  Solar today:   ${round1(d.solarToday)} kWh` : '',
      d.costToday != null   ? `💰  Cost today:    ${d.costToday.toFixed(2)} €` : '',
      d.savingsToday != null? `🌿  Savings today: ${d.savingsToday.toFixed(2)} €` : '',
      d.price != null       ? `💶  Price now:     ${d.price.toFixed(3)} €/kWh` : '',
      d.surplusW > 50       ? `✅  Solar surplus: ${fmtW(d.surplusW)} available` : '',
    ].filter(s => s !== '').join('\n');
  }

  _setupWeatherPopup(container) {
    const solarOrb = container.querySelector('[data-uid="solar-orb"]');
    const weatherPopup = container.querySelector('[data-uid="weather-popup"]');
    if (!solarOrb || !weatherPopup) return;
    let wpHideTimer = null;
    const showWp = () => { clearTimeout(wpHideTimer); weatherPopup.classList.add('show'); };
    const hideWp = () => { wpHideTimer = setTimeout(() => weatherPopup.classList.remove('show'), 120); };
    solarOrb.addEventListener('mouseenter', showWp);
    solarOrb.addEventListener('mouseleave', hideWp);
    weatherPopup.addEventListener('mouseenter', () => clearTimeout(wpHideTimer));
    weatherPopup.addEventListener('mouseleave', hideWp);
  }

  _setupTapHandlers(shadow) {
    const c = this._config;
    // Stats popup (mouseover)
    const shareBtn = shadow.querySelector('[data-action="share"]');
    if (shareBtn) {
      const popup = shareBtn.querySelector('[data-uid="stats-popup"]');
      const content = shareBtn.querySelector('[data-uid="stats-content"]');
      const copyBtn = shareBtn.querySelector('[data-uid="stats-copy"]');
      let hideTimer = null;
      const showPopup = () => {
        clearTimeout(hideTimer);
        const d = this._data();
        if (d && content) content.textContent = this._statsText(d);
        popup?.classList.add('show');
      };
      const hidePopup = () => {
        hideTimer = setTimeout(() => popup?.classList.remove('show'), 120);
      };
      shareBtn.addEventListener('mouseenter', showPopup);
      shareBtn.addEventListener('mouseleave', hidePopup);
      popup?.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      popup?.addEventListener('mouseleave', hidePopup);
      if (copyBtn) copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = this._data();
        if (!d) return;
        navigator.clipboard.writeText(this._statsText(d)).then(() => {
          copyBtn.textContent = this._t('copied');
          copyBtn.classList.add('ok');
          setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; copyBtn.classList.remove('ok'); }, 2000);
        }).catch(() => {
          copyBtn.textContent = this._t('clip_err');
          setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; }, 2000);
        });
      });
    }
    // Solar orb weather popup
    const flowWrapEl = shadow.querySelector('[data-uid="flow-wrap"]');
    if (flowWrapEl) this._setupWeatherPopup(flowWrapEl);

    // Charger card
    const chargerCard = shadow.querySelector('.ev-charger');
    if (chargerCard && c.v2c_power) chargerCard.addEventListener('click', () => this._moreInfo(c.v2c_power));
    // EV cards
    shadow.querySelectorAll('.ev-card:not(.ev-charger)').forEach((card, i) => {
      const ev = (c.evs || [])[i];
      const entity = ev && (ev.battery || ev.range);
      if (entity) card.addEventListener('click', () => this._moreInfo(entity));
    });
    // History modal — tap daily summary section title
    const dailySummarySection = shadow.querySelector('[data-uid="daily-summary-tab"]');
    if (dailySummarySection) {
      dailySummarySection.style.cursor = 'pointer';
      dailySummarySection.addEventListener('click', () => this._showHistoryModal());
    }
    // Extra charger tap handlers
    shadow.querySelectorAll('[data-extra-charger]').forEach((tile, i) => {
      const ch = (this._config.chargers || [])[i];
      if (ch?.power) tile.addEventListener('click', () => this._moreInfo(ch.power));
    });

    // Stats tabs
    shadow.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        shadow.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === target));
        shadow.querySelectorAll('[data-panel]').forEach(p => p.classList.toggle('active', p.getAttribute('data-panel') === target));
      });
    });

    // Device tiles — short click = expand/collapse, long press / hold = more-info
    shadow.querySelectorAll('.device').forEach((tile) => {
      const entity = tile.getAttribute('data-dev-entity');
      if (!entity) return;
      let pressTimer = null;
      tile.addEventListener('pointerdown', () => {
        pressTimer = setTimeout(() => { pressTimer = null; this._moreInfo(entity); }, 600);
      });
      tile.addEventListener('pointerup', () => clearTimeout(pressTimer));
      tile.addEventListener('pointerleave', () => clearTimeout(pressTimer));
      tile.addEventListener('click', (e) => {
        e.stopPropagation();
        const prev = this._expandedDevEntity;
        this._expandedDevEntity = (prev === entity) ? null : entity;
        // Re-render devices grid to reflect new expanded state
        const devGrid = shadow.querySelector('[data-uid="devices-grid"]');
        const d = this._data();
        if (devGrid && d) {
          devGrid.innerHTML = d.devices.map((dev, i) => this._buildDevice(dev, this._config.devices_sort ? i : null)).join('');
          // Re-attach handlers after re-render
          requestAnimationFrame(() => {
            devGrid.querySelectorAll('.device').forEach(t => {
              const ent = t.getAttribute('data-dev-entity');
              if (!ent) return;
              t.addEventListener('click', (ev) => {
                ev.stopPropagation();
                this._expandedDevEntity = (this._expandedDevEntity === ent) ? null : ent;
                const dd = this._data();
                if (dd) devGrid.innerHTML = dd.devices.map((dv, i) => this._buildDevice(dv, this._config.devices_sort ? i : null)).join('');
              });
            });
          });
        }
      });
    });
  }

  async _fetchSparklines() {
    const h = this._hass, c = this._config;
    if (!h || !c) return;
    const devEntities = (c.devices || []).map(d => d.entity).filter(Boolean);
    const entities = [...new Set([c.solar_power, c.grid_power, c.house_power, ...devEntities].filter(Boolean))];
    if (!entities.length) return;
    const now = new Date();
    const start = new Date(now - 6 * 3600 * 1000);
    try {
      const raw = await h.callApi('GET',
        `history/period/${start.toISOString()}?filter_entity_id=${entities.join(',')}&minimal_response=true&no_attributes=true`
      );
      if (!Array.isArray(raw)) return;
      this._sparkData = {};
      raw.forEach(series => {
        if (!series.length) return;
        const eid = series[0].entity_id;
        // Convert to watts, sample up to 60 points
        const unit = (h.states[eid]?.attributes?.unit_of_measurement) || '';
        const pts = series
          .filter(s => s.state !== 'unavailable' && s.state !== 'unknown')
          .map(s => { const v = parseFloat(s.state); return unit === 'kW' ? v * 1000 : v; })
          .filter(v => !isNaN(v));
        // Downsample to max 60 points
        if (pts.length > 60) {
          const step = pts.length / 60;
          this._sparkData[eid] = Array.from({ length: 60 }, (_, i) => pts[Math.floor(i * step)]);
        } else {
          this._sparkData[eid] = pts;
        }
      });
      this._renderSparklines();
    } catch (e) {
      // History API not available or failed, silently skip
    }
  }

  _renderSparklines() {
    const shadow = this.shadowRoot;
    if (!shadow || !this._sparkData) return;
    const c = this._config;
    const map = [
      { uid:'spark-solar', entity: c.solar_power, color:'#fbbf24' },
      { uid:'spark-grid',  entity: c.grid_power,  color:'#f87171' },
      { uid:'spark-house', entity: c.house_power,  color:'#60a5fa' },
    ];
    map.forEach(({ uid, entity, color }) => {
      const el = shadow.querySelector(`[data-uid="${uid}"]`);
      if (!el || !entity || !this._sparkData[entity]) return;
      el.innerHTML = this._buildSparkSvg(this._sparkData[entity], color);
    });
  }

  _buildSparkSvg(pts, color, W = 60, H = 18) {
    if (!pts || pts.length < 2) return '';
    const min = Math.min(...pts), max = Math.max(...pts);
    const range = max - min || 1;
    const coords = pts.map((v, i) => {
      const x = (i / (pts.length - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const poly = coords.join(' ');
    // Area fill: close the path
    const area = `${coords[0].split(',')[0]},${H} ${poly} ${coords[coords.length-1].split(',')[0]},${H}`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;overflow:visible">
      <polygon points="${area}" fill="${color}" opacity="0.12"/>
      <polyline points="${poly}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
    </svg>`;
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
    // ha-entity-picker (Lit element) may reset its value on first render if hass wasn't set yet.
    // Re-apply all picker values once, the first time hass arrives after each _render() call.
    if (!this._pickersInitialized) {
      this._pickersInitialized = true;
      const c = this._config;
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-key]').forEach(el => {
        el.value = c[el.dataset.key] || '';
      });
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-ev]').forEach(el => {
        const idx = parseInt(el.dataset.ev), key = el.dataset.evKey;
        el.value = ((c.evs || [])[idx] || {})[key] || '';
      });
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-ch]').forEach(el => {
        const idx = parseInt(el.dataset.ch), key = el.dataset.chKey;
        el.value = ((c.chargers || [])[idx] || {})[key] || '';
      });
      this.shadowRoot.querySelectorAll('ha-entity-picker[data-dev]').forEach(el => {
        const idx = parseInt(el.dataset.dev);
        el.value = ((c.devices || [])[idx] || {}).entity || '';
      });
    }
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

  _setCharger(idx, key, value) {
    const chargers = (this._config.chargers || []).map((ch, i) => i === idx ? { ...ch, [key]: value } : ch);
    this._set('chargers', chargers);
  }
  _addCharger() {
    const chargers = [...(this._config.chargers || []), { name: 'New Charger', power: '', session_energy: '', image: '' }];
    this._set('chargers', chargers);
    this._render();
  }
  _removeCharger(idx) {
    const chargers = (this._config.chargers || []).filter((_, i) => i !== idx);
    this._set('chargers', chargers);
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
    const chargers = c.chargers || [];
    this._pickersInitialized = false;

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
            <div class="row cols-2">
              <div class="field">
                <label>Language</label>
                <select data-key="language">
                  <option value="auto"${(c.language||'auto')==='auto'?' selected':''}>🌐 Auto (HA language)</option>
                  <option value="en"${c.language==='en'?' selected':''}>🇬🇧 English</option>
                  <option value="fr"${c.language==='fr'?' selected':''}>🇫🇷 Français</option>
                  <option value="es"${c.language==='es'?' selected':''}>🇪🇸 Español</option>
                  <option value="zh"${c.language==='zh'?' selected':''}>🇨🇳 中文</option>
                  <option value="ja"${c.language==='ja'?' selected':''}>🇯🇵 日本語</option>
                </select>
              </div>
            </div>
            <div class="row cols-1">
              <div class="field">
                <label>Sort devices by consumption</label>
                <select data-key="devices_sort">
                  <option value="false"${!c.devices_sort?' selected':''}>No — keep config order</option>
                  <option value="true"${c.devices_sort?' selected':''}>Yes — highest consumer first</option>
                </select>
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

        <!-- ADDITIONAL CHARGERS -->
        <div class="section">
          <div class="section-head">
            <h3>⚡ Additional Chargers</h3>
          </div>
          <div class="section-body" id="chargers-body">
            ${chargers.map((ch, i) => this._buildChargerForm(ch, i)).join('')}
            <button class="btn-add" data-action="add-charger">+ Add Charger</button>
          </div>
        </div>

        <!-- TEMPO & TARIFF -->
        <div class="section">
          <div class="section-head"><h3>🔴 EDF Tempo / Tariff Alerts</h3></div>
          <div class="section-body">
            <div class="row cols-2">
              <div class="field">
                <label>Tempo color — Today</label>
                <ha-entity-picker data-key="tempo_color_today" allow-custom-entity></ha-entity-picker>
                <span class="hint">State: "BLUE", "WHITE", "RED" (or French equivalents)</span>
              </div>
              <div class="field">
                <label>Tempo color — Tomorrow</label>
                <ha-entity-picker data-key="tempo_color_tomorrow" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-2">
              <div class="field">
                <label>Price alert — HIGH threshold (€/kWh)</label>
                <input type="number" data-key="price_alert_high" value="${c.price_alert_high ?? ''}" step="0.01" min="0" placeholder="e.g. 0.20">
                <span class="hint">Price pill blinks red above this value</span>
              </div>
              <div class="field">
                <label>Price alert — LOW threshold (€/kWh)</label>
                <input type="number" data-key="price_alert_low" value="${c.price_alert_low ?? ''}" step="0.01" min="0" placeholder="e.g. 0.05">
                <span class="hint">Price pill turns green below this value</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DAILY SUMMARY -->
        <div class="section">
          <div class="section-head"><h3>📊 Daily Cost Summary</h3></div>
          <div class="section-body">
            <div class="row cols-2">
              <div class="field">
                <label>Grid Energy Imported Today (kWh)</label>
                <ha-entity-picker data-key="grid_energy_import" allow-custom-entity></ha-entity-picker>
              </div>
              <div class="field">
                <label>Grid Energy Exported Today (kWh)</label>
                <ha-entity-picker data-key="grid_energy_export" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-2">
              <div class="field">
                <label>Feed-in rate (fraction of import price)</label>
                <input type="number" data-key="feed_in_rate" value="${c.feed_in_rate ?? 0}" step="0.01" min="0" max="1" placeholder="e.g. 0.1">
                <span class="hint">0 = no export revenue shown. 0.1 = 10% of price.</span>
              </div>
              <div class="field">
                <label>Theme</label>
                <select data-key="theme">
                  <option value="dark"${(c.theme||'dark')==='dark'?' selected':''}>🌙 Dark</option>
                  <option value="light"${c.theme==='light'?' selected':''}>☀️ Light</option>
                  <option value="auto"${c.theme==='auto'?' selected':''}>🖥️ Auto (system)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- HOME BATTERY -->
        <div class="section">
          <div class="section-head"><h3>🔋 Home Battery / ESS</h3></div>
          <div class="section-body">
            <div class="row cols-2">
              <div class="field">
                <label>Battery Power (W or kW)</label>
                <ha-entity-picker data-key="battery_power" allow-custom-entity></ha-entity-picker>
                <span class="hint">Positive = charging, negative = discharging</span>
              </div>
              <div class="field">
                <label>Battery SoC (%)</label>
                <ha-entity-picker data-key="battery_soc" allow-custom-entity></ha-entity-picker>
              </div>
            </div>
            <div class="row cols-2">
              <div class="field">
                <label>Battery rated capacity (kWh)</label>
                <input type="number" data-key="battery_rated_capacity" value="${c.battery_rated_capacity ?? 0}" step="0.1" min="0" placeholder="e.g. 10">
                <span class="hint">Shows battery health badge when set. 0 = disabled.</span>
              </div>
              <div class="field">
                <label>Grid CO₂ intensity (g/kWh)</label>
                <ha-entity-picker data-key="co2_intensity" allow-custom-entity></ha-entity-picker>
                <span class="hint">Optional sensor. Default: 400 g/kWh.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- GRID ALERTS + SMART RECOMMENDATIONS -->
        <div class="section">
          <div class="section-head"><h3>🔔 Alerts &amp; Smart Recommendations</h3></div>
          <div class="section-body">
            <div class="row cols-2">
              <div class="field">
                <label>Grid demand alert threshold (W)</label>
                <input type="number" data-key="grid_demand_threshold" value="${c.grid_demand_threshold ?? 3000}" step="100" min="0" placeholder="3000">
                <span class="hint">Demand/peak-shaving alerts above this import. 0 = off.</span>
              </div>
              <div class="field">
                <label>Weather — current conditions</label>
                <ha-entity-picker data-key="weather_entity" allow-custom-entity></ha-entity-picker>
                <span class="hint">weather.* entity — shows condition icon on solar orb.</span>
              </div>
              <div class="field">
                <label>Weather — forecast (optional)</label>
                <ha-entity-picker data-key="weather_forecast_entity" allow-custom-entity></ha-entity-picker>
                <span class="hint">weather.* entity for hourly forecast popup. Leave empty to use the same entity as above.</span>
              </div>
            </div>
            <div class="row cols-1">
              <div class="field">
                <label>Tariff forecast entity (optional)</label>
                <ha-entity-picker data-key="tariff_forecast" allow-custom-entity></ha-entity-picker>
                <span class="hint">Sensor with raw_today/prices array attribute — shows 12h bar chart.</span>
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
        <div class="row cols-2">
          <div class="field">
            <label>Battery Capacity (kWh)</label>
            <input type="number" data-ev="${i}" data-ev-key="battery_capacity" value="${ev.battery_capacity||60}" min="1" max="200" step="0.1">
            <span class="hint">Used for ETA calculation</span>
          </div>
          <div class="field">
            <label>Battery Health sensor (%)</label>
            <ha-entity-picker data-ev="${i}" data-ev-key="battery_health" allow-custom-entity></ha-entity-picker>
            <span class="hint">Optional — shows health badge</span>
          </div>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Purchase date (YYYY-MM-DD)</label>
            <input type="text" data-ev="${i}" data-ev-key="purchase_date" value="${(ev.purchase_date||'').replace(/"/g,'&quot;')}" placeholder="2022-06-01">
            <span class="hint">For warranty countdown</span>
          </div>
          <div class="field">
            <label>Battery warranty (years)</label>
            <input type="number" data-ev="${i}" data-ev-key="warranty_years" value="${ev.warranty_years||8}" min="1" max="15" step="1">
            <span class="hint">Typical EV: 8 years</span>
          </div>
        </div>
      </div>`;
  }

  _buildChargerForm(ch, i) {
    return `
      <div class="list-item" data-ch-index="${i}">
        <div class="list-item-head">
          <span class="list-item-title">⚡ ${ch.name || 'Charger ' + (i+1)}</span>
          <button class="btn-remove" data-action="remove-charger" data-index="${i}" title="Remove">✕</button>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Display Name</label>
            <input type="text" data-ch="${i}" data-ch-key="name" value="${(ch.name||'').replace(/"/g,'&quot;')}" placeholder="Charger name">
          </div>
          <div class="field">
            <label>Image URL</label>
            <input type="text" data-ch="${i}" data-ch-key="image" value="${(ch.image||'').replace(/"/g,'&quot;')}" placeholder="/local/images/charger.png">
          </div>
        </div>
        <div class="row cols-2">
          <div class="field">
            <label>Power sensor (W or kW)</label>
            <ha-entity-picker data-ch="${i}" data-ch-key="power" allow-custom-entity></ha-entity-picker>
          </div>
          <div class="field">
            <label>Session energy sensor (kWh)</label>
            <ha-entity-picker data-ch="${i}" data-ch-key="session_energy" allow-custom-entity></ha-entity-picker>
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
        <div class="row cols-2">
          <div class="field">
            <label>Alert above (W)</label>
            <input type="number" data-dev="${i}" data-dev-key="alert_above" value="${dev.alert_above ?? ''}" min="0" step="10" placeholder="e.g. 2000">
            <span class="hint">Device border pulses red above this wattage</span>
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
      el.addEventListener('change', () => {
        if (el.dataset.key === 'devices_sort') {
          this._set('devices_sort', el.value === 'true');
        } else {
          this._set(el.dataset.key, el.value);
        }
      });
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

    // Charger entity pickers
    sr.querySelectorAll('ha-entity-picker[data-ch]').forEach(el => {
      const idx = parseInt(el.dataset.ch), key = el.dataset.chKey;
      if (this._hass) el.hass = this._hass;
      el.value = ((c.chargers || [])[idx] || {})[key] || '';
      el.addEventListener('value-changed', e => { this._setCharger(idx, key, e.detail.value); });
    });

    // Charger text inputs
    sr.querySelectorAll('input[data-ch]').forEach(el => {
      const idx = parseInt(el.dataset.ch), key = el.dataset.chKey;
      el.addEventListener('change', () => { this._setCharger(idx, key, el.value); });
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
        if (action === 'add-ev')        this._addEv();
        if (action === 'remove-ev')     this._removeEv(idx);
        if (action === 'add-charger')   this._addCharger();
        if (action === 'remove-charger') this._removeCharger(idx);
        if (action === 'add-device')    this._addDevice();
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
