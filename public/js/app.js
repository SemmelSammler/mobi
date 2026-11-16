// mobi — Einstieg: Navigation, Thema, Erststart, Service Worker.
import { $, $$, esc, ICON, on, emit, openSheet, closeSheet } from './ui.js';
import { getSettings, setSetting, hasData, savePlan, getActive } from './store.js';
import { planFromTemplate, ensurePlan } from './training.js';
import { GOALS } from './data/programs.js';
import { render as renderHeute } from './views/heute.js';
import { render as renderTraining, openPlanPicker } from './views/training.js';
import { render as renderUebungen } from './views/uebungen.js';
import { render as renderVerlauf } from './views/verlauf.js';
import { render as renderProfil, applyTheme } from './views/profil.js';
import { openWorkout } from './views/workout.js';

const VIEWS = {
  heute: { label: 'Heute', icon: 'sun', render: renderHeute },
  training: { label: 'Training', icon: 'dumbbell', render: renderTraining },
  uebungen: { label: 'Übungen', icon: 'grid', render: renderUebungen },
  verlauf: { label: 'Verlauf', icon: 'chart', render: renderVerlauf },
  profil: { label: 'Profil', icon: 'user', render: renderProfil }
};
let current = 'heute';
const dirty = new Set();

function showView(name) {
  current = name;
  for (const v of Object.keys(VIEWS)) $(`#view-${v}`).classList.toggle('hidden', v !== name);
  for (const t of $$('.tab')) { t.classList.toggle('active', t.dataset.view === name); t.setAttribute('aria-current', t.dataset.view === name ? 'page' : 'false'); }
  if (dirty.has(name)) { VIEWS[name].render(); dirty.delete(name); }
  window.scrollTo(0, 0);
}

function renderResume() {
  const a = getActive();
  const btn = $('#resume');
  const show = Boolean(a) && $('#workout').classList.contains('hidden') && current !== 'heute' && current !== 'training';
  btn.classList.toggle('hidden', !show);
  if (show) btn.innerHTML = `<i class="pulse"></i><span class="grow"><b>${esc(a.name)}</b> läuft</span><span style="font-weight:650;">Fortsetzen</span>`;
}

// Nach jeder Datenänderung: sichtbare Ansicht sofort neu zeichnen, die anderen beim nächsten Öffnen.
on('change', () => {
  for (const v of Object.keys(VIEWS)) dirty.add(v);
  // Die Übungsliste behält Suchfeld und Scrollposition, solange sie offen ist.
  VIEWS[current].render();
  dirty.delete(current);
  renderResume();
});

$('#tabbar').innerHTML = Object.entries(VIEWS).map(([k, v]) => `<button class="tab" data-view="${k}">${ICON[v.icon]}<span>${v.label}</span></button>`).join('');
$('#tabbar').onclick = (e) => { const t = e.target.closest('.tab'); if (t) { showView(t.dataset.view); renderResume(); } };
$('#resume').onclick = openWorkout;

// ---------- Erststart ----------
function onboarding() {
  const st = { days: 4, goal: 'muskelaufbau' };
  const tplFor = () => (st.goal === 'kraft' ? 'kraft3' : st.goal === 'laeufer' ? 'lauf2' : st.goal === 'fitness' ? 'gk3' : st.days <= 3 ? 'gk3' : st.days === 4 ? 'ul4' : 'ppl5');
  const draw = () => openSheet(`
    <div class="stack gap-4"><span class="eyebrow">Willkommen bei mobi</span><h2 class="h2">Training und Beweglichkeit in einer App.</h2></div>
    <p class="body">Drei kurze Angaben, dann steht dein Plan. Alles lässt sich später ändern.</p>
    <div class="field"><label for="ob-name">Wie heißt du?</label><input class="input" id="ob-name" maxlength="20" autocomplete="given-name" value="${esc(st.name || '')}" placeholder="Vorname"></div>
    <div class="field"><span class="label">Wie oft gehst du pro Woche ins Studio?</span><div class="seg" id="ob-days">${[2, 3, 4, 5].map((d) => `<button data-v="${d}" class="${st.days === d ? 'active' : ''}">${d}×</button>`).join('')}</div></div>
    <div class="field"><span class="label">Was ist dein Hauptziel?</span><div class="list">${Object.entries(GOALS).map(([k, g]) => `<button class="row" data-goal="${k}" style="${st.goal === k ? 'border-color:var(--accent);' : ''}"><span class="grow"><span class="t">${g.name}</span><span class="s" style="white-space:normal;">${g.hint}</span></span>${st.goal === k ? `<span class="badge">Gewählt</span>` : ''}</button>`).join('')}</div></div>
    <button class="btn" id="ob-go">Los geht’s</button>`, (sh) => {
    $('#ob-name', sh).oninput = (e) => { st.name = e.target.value; };
    $('#ob-days', sh).onclick = (e) => { const b = e.target.closest('[data-v]'); if (b) { st.days = Number(b.dataset.v); draw(); } };
    for (const b of $$('[data-goal]', sh)) b.onclick = () => { st.goal = b.dataset.goal; draw(); };
    $('#ob-go', sh).onclick = () => {
      setSetting('name', (st.name || '').trim() || 'Athlet');
      setSetting('onboarded', 6);
      savePlan(planFromTemplate(st.days === 2 && st.goal === 'muskelaufbau' ? 'gk3' : tplFor()));
      closeSheet(); emit('change');
    };
  });
  draw();
}

function whatsNew() {
  openSheet(`
    <div class="stack gap-4"><span class="eyebrow">Neu in mobi 6</span><h2 class="h2">Jetzt auch dein Trainingsplan fürs Studio.</h2></div>
    <ul class="bullets">
      <li><b>Krafttraining mit Plan:</b> Sätze und Gewichte loggen, Pausentimer, automatische Vorschläge fürs nächste Mal.</li>
      <li><b>72 Studio-Übungen</b> mit animierter Ausführung, Körperkarte und physiologischem Hintergrund.</li>
      <li><b>Verlauf:</b> Wochenvolumen pro Muskel, Kraftwerte, Rekorde.</li>
      <li><b>Dunkles Design</b> und Datensicherung als Datei.</li>
    </ul>
    <p class="body">Dein bisheriger Verlauf und deine Einstellungen sind unverändert da. Als Startplan ist „Oberkörper / Unterkörper“ eingestellt.</p>
    <button class="btn" id="wn-plan">Plan ansehen oder wechseln</button><button class="btn ghost" data-no>Später</button>`, (sh) => {
    $('#wn-plan', sh).onclick = () => { showView('training'); openPlanPicker(); };
    $('[data-no]', sh).onclick = closeSheet;
  });
}

// ---------- Start ----------
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
const fresh = !hasData();
if (!fresh) ensurePlan();
for (const v of Object.keys(VIEWS)) dirty.add(v);
showView('heute');
renderResume();
if (fresh) onboarding();
else if (getSettings().onboarded !== 6) { setSetting('onboarded', 6); whatsNew(); }
if (getActive()) renderResume();

try {
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
} catch { /* Sandbox ohne Service-Worker-Zugriff */ }
