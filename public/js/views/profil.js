// Profil: Einstellungen, Darstellung, Datensicherung, Hintergrundwissen.
import { $, $$, esc, ICON, emit, openSheet, closeSheet, toast, chime } from '../ui.js';
import { getSettings, setSetting, exportData, importData, resetAll, getWorkouts } from '../store.js';
import { FOCUS_TARGETS } from '../data/mobility.js';
import { EXERCISES, GYM, MOBILITY } from '../data/index.js';
import { todayKey } from '../routine.js';

const DAY_OPTIONS = [[-1, 'Aus'], [1, 'Mo'], [2, 'Di'], [3, 'Mi'], [4, 'Do'], [5, 'Fr'], [6, 'Sa'], [0, 'So']];
const daySelect = (id, value) => `<select class="sel" id="${id}">${DAY_OPTIONS.map(([v, l]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
const targetSelect = (id, value) => `<select class="sel" id="${id}">${Object.entries(FOCUS_TARGETS).map(([k, t]) => `<option value="${k}" ${k === value ? 'selected' : ''}>${t.label}</option>`).join('')}</select>`;
const toggle = (id, on, title, sub) => `<div class="toggle-row"><div class="stack"><span style="font-weight:600;">${title}</span><span class="meta">${sub}</span></div><button class="switch ${on ? 'on' : ''}" id="${id}" role="switch" aria-checked="${on}" aria-label="${title}"></button></div>`;
const seg = (id, options, value, fmt = (m) => `${m} min`) => `<div class="seg" id="${id}">${options.map((m) => `<button data-v="${m}" class="${m === value ? 'active' : ''}">${fmt(m)}</button>`).join('')}</div>`;

export function applyTheme() {
  let t = getSettings().theme || 'auto';
  if (t === 'auto') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dunkel' : 'hell';
  document.documentElement.dataset.theme = t;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = t === 'dunkel' ? '#13110E' : '#FAF6EF';
}

export function openScience() {
  openSheet(`
    <h2 class="h2">Warum mobi so trainiert</h2>
    <span class="sec-l">Muskelaufbau</span>
    <ul class="bullets">
      <li><b>Volumen:</b> Mehr harte Sätze pro Muskel und Woche bringen mehr Wachstum, mit abnehmendem Zusatznutzen. 10–20 Sätze sind für die meisten der sinnvolle Bereich.</li>
      <li><b>Nähe zum Muskelversagen:</b> Entscheidend ist, dass ein Satz anstrengend endet — 1–3 Wiederholungen vor dem Versagen reichen. Ob 6 oder 15 Wiederholungen, ist dann zweitrangig.</li>
      <li><b>Progression:</b> Erst Wiederholungen bis zur oberen Grenze steigern, dann das Gewicht erhöhen. mobi schlägt dir den nächsten Schritt automatisch vor.</li>
      <li><b>Dehnung unter Last:</b> Übungen, die den Muskel in gedehnter Position fordern, wirken besonders stark. Deshalb achtet mobi auf volle Bewegungswege.</li>
      <li><b>Häufigkeit:</b> Bei gleichem Wochenvolumen ist es fast egal, wie du es verteilst. Zweimal pro Woche pro Muskel macht hohe Volumina aber leichter verträglich.</li>
    </ul>
    <span class="sec-l">Beweglichkeit</span>
    <ul class="bullets">
      <li><b>Morgens dynamisch:</b> Bewegen statt lange halten — das wärmt auf, ohne die Kraft danach zu senken.</li>
      <li><b>Abends statisch:</b> Lange Haltezeiten (45–90 s) erhöhen die Dehntoleranz. Was zählt, ist die Wochendosis pro Muskel.</li>
      <li><b>Kraft im Endbereich:</b> Krafttraining über den vollen Bewegungsumfang verbessert die Beweglichkeit ähnlich gut wie Dehnen.</li>
    </ul>
    <span class="sec-l">Kraft und Laufen</span>
    <ul class="bullets">
      <li>Viel Ausdauertraining kann den Kraftzuwachs der Beine leicht bremsen. Mit etwas Abstand zwischen harten Läufen und Beintraining bleibt der Effekt klein.</li>
      <li>Umgekehrt macht schweres Beintraining Läufer ökonomischer und senkt das Verletzungsrisiko — etwa durch Nordic Curls für die Beinrückseite.</li>
    </ul>
    <span class="sec-l">Quellen (Auswahl)</span>
    <p class="meta" style="margin:0;line-height:1.6;">Schoenfeld, Ogborn &amp; Krieger 2017 (Wochenvolumen) · Schoenfeld et al. 2017 (Lastbereiche) · Refalo et al. 2023 (Nähe zum Muskelversagen) · Schoenfeld, Grgic &amp; Krieger 2019 (Trainingshäufigkeit) · Maeo et al. 2021 und 2022 (Training in gedehnter Position) · Kubo et al. 2019 (Kniebeugentiefe) · Behm et al. 2016 (Dehnen und Leistung) · Afonso et al. 2021 (Krafttraining und Beweglichkeit) · Wilson et al. 2012 (Kraft und Ausdauer kombiniert) · van Dyk et al. 2019 (Nordic Curl).</p>
    <div class="note">mobi ersetzt keine ärztliche oder physiotherapeutische Beratung. Bei Schmerzen oder Vorerkrankungen bitte vorher abklären.</div>`);
}

export function render() {
  const s = getSettings();
  const root = $('#view-profil');
  root.innerHTML = `
    <h1 class="h1">Profil</h1>
    <div class="card stack gap-16">
      <div class="field"><label for="f-name">Dein Name</label><input class="input" type="text" id="f-name" value="${esc(s.name)}" maxlength="20" autocomplete="off"></div>
      <div class="field"><span class="label">Darstellung</span>${seg('f-theme', ['auto', 'hell', 'dunkel'], s.theme || 'auto', (v) => ({ auto: 'Automatisch', hell: 'Hell', dunkel: 'Dunkel' }[v]))}</div>
    </div>
    <div class="card stack gap-16">
      <span class="h3">Krafttraining</span>
      ${toggle('f-autorest', s.autoRest !== false, 'Pausentimer automatisch', 'Startet nach jedem abgehakten Satz')}
      ${toggle('f-sound', s.sound, 'Ton & Vibration', 'Signal bei Pausenende, Übungs- und Seitenwechsel')}
    </div>
    <div class="card stack gap-16">
      <span class="h3">Mobility</span>
      <div class="field"><span class="label">Standarddauer morgens</span>${seg('f-mins', [5, 10, 15], s.minutes)}</div>
      <div class="field"><span class="label">Standarddauer abends</span>${seg('f-eve', [10, 15, 20], s.eveMinutes)}</div>
      <div class="field"><span class="label">Fokustag 1 — längere Haltezeit abends</span><div class="dual">${daySelect('f1-day', s.focus1?.day ?? -1)}${targetSelect('f1-target', s.focus1?.target || 'sprunggelenk')}</div></div>
      <div class="field"><span class="label">Fokustag 2</span><div class="dual">${daySelect('f2-day', s.focus2?.day ?? -1)}${targetSelect('f2-target', s.focus2?.target || 'huefte')}</div></div>
      <div class="field"><span class="label">Endgrad-Kraft an diesen Tagen</span><div class="dual">${daySelect('k-day1', s.kraftDays?.[0] ?? -1)}${daySelect('k-day2', s.kraftDays?.[1] ?? -1)}</div></div>
      ${toggle('f-pnf', s.pnf, 'Contract-Relax (abends)', 'Geführt: 20 s sinken, 10 s sanft anspannen')}
    </div>
    <div class="card stack gap-12">
      <div class="stack gap-4"><span class="h3">Deine Daten</span><span class="meta" style="line-height:1.5;">Alles liegt nur auf diesem Gerät. Sichere regelmäßig eine Datei — damit ziehst du auch auf ein neues Gerät um.</span></div>
      <button class="btn ghost" id="btn-export">Sicherung herunterladen</button>
      <button class="btn ghost" id="btn-import">Sicherung einspielen</button>
      <input type="file" id="file-import" accept="application/json,.json" class="hidden">
      <button class="btn danger" id="btn-reset">Alle Daten löschen</button>
    </div>
    <button class="row" id="btn-science"><span class="tile accent">${ICON.flask}</span><span class="grow"><span class="t">Hintergrund & Wissenschaft</span><span class="s">Warum mobi so trainiert, mit Quellen</span></span>${ICON.chev}</button>
    <div class="card flat stack gap-8"><span class="h3">Als App installieren</span><span class="meta" style="line-height:1.5;">iPhone: in Safari <b>Teilen → Zum Home-Bildschirm</b>. Android: Menü → <b>App installieren</b>. Danach läuft mobi wie eine normale App — auch offline.</span></div>
    <div class="meta center">mobi 6.0 · ${EXERCISES.length} Übungen (${GYM.length} Kraft, ${MOBILITY.length} Mobility)</div>`;

  $('#f-name').onchange = (e) => { setSetting('name', e.target.value.trim() || 'Athlet'); emit('change'); };
  const segBind = (id, key, num = true) => { $(id).onclick = (e) => { const b = e.target.closest('[data-v]'); if (!b) return; setSetting(key, num ? Number(b.dataset.v) : b.dataset.v); if (key === 'theme') applyTheme(); emit('change'); }; };
  segBind('#f-theme', 'theme', false); segBind('#f-mins', 'minutes'); segBind('#f-eve', 'eveMinutes');
  const sw = (id, key, after) => { $(id).onclick = (e) => { const cur = key === 'autoRest' ? getSettings().autoRest !== false : Boolean(getSettings()[key]); setSetting(key, !cur); e.currentTarget.classList.toggle('on', !cur); e.currentTarget.setAttribute('aria-checked', String(!cur)); if (after) after(!cur); }; };
  sw('#f-autorest', 'autoRest'); sw('#f-pnf', 'pnf'); sw('#f-sound', 'sound', (on) => { if (on) chime([880]); });
  const saveFocus = () => {
    setSetting('focus1', { day: Number($('#f1-day').value), target: $('#f1-target').value });
    setSetting('focus2', { day: Number($('#f2-day').value), target: $('#f2-target').value });
    emit('change');
  };
  for (const id of ['f1-day', 'f1-target', 'f2-day', 'f2-target']) $(`#${id}`).onchange = saveFocus;
  const saveKraft = () => { setSetting('kraftDays', [...new Set([Number($('#k-day1').value), Number($('#k-day2').value)].filter((d) => d >= 0))]); emit('change'); };
  for (const id of ['k-day1', 'k-day2']) $(`#${id}`).onchange = saveKraft;
  $('#btn-science').onclick = openScience;

  $('#btn-export').onclick = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mobi-sicherung-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Sicherung erstellt');
  };
  $('#btn-import').onclick = () => $('#file-import').click();
  $('#file-import').onchange = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    let payload;
    try { payload = JSON.parse(await file.text()); if (payload.app !== 'mobi') throw new Error(); }
    catch { return toast('Das ist keine mobi-Sicherung'); }
    openSheet(`<h2 class="h2">Sicherung einspielen?</h2><p class="body">Die Daten auf diesem Gerät werden durch die Sicherung vom ${esc(String(payload.exportedAt || '').slice(0, 10))} ersetzt.</p>
      <button class="btn" id="imp-yes">Ersetzen</button><button class="btn ghost" data-no>Abbrechen</button>`, (sh) => {
      $('#imp-yes', sh).onclick = () => { try { importData(payload); closeSheet(); applyTheme(); emit('change'); toast('Sicherung eingespielt'); } catch (err) { toast(err.message); } };
      $('[data-no]', sh).onclick = closeSheet;
    });
  };
  $('#btn-reset').onclick = () => openSheet(`<h2 class="h2">Wirklich alles löschen?</h2><p class="body">Einstellungen, Trainingsplan und der gesamte Verlauf (${getWorkouts().length} Trainings) werden von diesem Gerät entfernt. Das lässt sich nicht rückgängig machen.</p>
    <button class="btn danger" id="rs-yes">Endgültig löschen</button><button class="btn ghost" data-no>Abbrechen</button>`, (sh) => {
    $('#rs-yes', sh).onclick = () => { resetAll(); closeSheet(); applyTheme(); emit('change'); toast('Alle Daten gelöscht'); };
    $('[data-no]', sh).onclick = closeSheet;
  });
}
