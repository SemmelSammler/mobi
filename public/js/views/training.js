// Trainingsplan: Rotation, Tage bearbeiten, Plan wechseln, Wochenstruktur.
import { $, $$, esc, ICON, emit, openSheet, closeSheet, thumb, hydrateThumbs, toast, WD, WEEK_ORDER, ACTIVITIES } from '../ui.js';
import { byId, muscleNames } from '../data/index.js';
import { PROGRAMS, GOALS, programById } from '../data/programs.js';
import { getSettings, setSetting, getPlan, savePlan } from '../store.js';
import { ensurePlan, planFromTemplate, nextDayIndex, dayDuration, slotFor, plannedSets, VOLUME_GROUPS, GROUPS, getActive } from '../training.js';
import { beginWorkout, openWorkout } from './workout.js';
import { openExercise, pickExercise } from './uebungen.js';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function volumeBars(sets, { max = 25, target = [10, 20] } = {}) {
  return `<div class="vol">${VOLUME_GROUPS.map((g) => {
    const n = sets[g] || 0;
    const cls = n === 0 ? 'low' : n < target[0] ? '' : n <= target[1] + 4 ? 'ok' : 'high';
    return `<span>${GROUPS[g]}</span><span class="track"><i class="zone" style="left:${(target[0] / max) * 100}%;width:${((target[1] - target[0]) / max) * 100}%"></i><i class="fill ${cls}" style="width:${Math.min(100, (n / max) * 100)}%"></i></span><span class="n">${String(Math.round(n * 2) / 2).replace('.', ',')}</span>`;
  }).join('')}</div>`;
}

export function render() {
  const s = getSettings();
  const plan = ensurePlan();
  const idx = nextDayIndex(plan);
  const active = getActive();
  const tpl = programById(plan.templateId);
  const gymDays = WEEK_ORDER.filter((d) => s.weekPlan?.[d] === 'gym').length;
  const runDays = WEEK_ORDER.filter((d) => s.weekPlan?.[d] === 'laufen').length;
  $('#view-training').innerHTML = `
    <div class="row-between"><div class="stack gap-4"><h1 class="h1">Training</h1><span class="meta">${esc(plan.name)} · ${plan.days.length} Einheiten in Rotation</span></div>
      <button class="btn small ghost" data-act="switch">Plan wechseln</button></div>
    ${active ? `<div class="hero dark"><span class="eyebrow">Training läuft</span><div class="hero-title">${esc(active.name)}</div><button class="btn light" data-act="resume">${ICON.play} Fortsetzen</button></div>` : ''}
    <div class="stack gap-8">
      <span class="eyebrow">Dein Plan</span>
      <div class="list">${plan.days.map((d, i) => `<button class="row" data-day="${i}">
        <span class="tile ${i === idx ? 'accent' : ''}" style="font-weight:700;">${i + 1}</span>
        <span class="grow"><span class="t">${esc(d.name)}</span><span class="s">${d.slots.length} Übungen · ca. ${dayDuration(d)} min${d.focus ? ' · ' + esc(d.focus) : ''}</span></span>
        ${i === idx ? '<span class="badge">Als Nächstes</span>' : ''}${ICON.chev}</button>`).join('')}</div>
      <div class="dual"><button class="btn ghost" data-act="addday">${ICON.plus} Einheit</button><button class="btn ghost" data-act="free">Freies Training</button></div>
    </div>
    <div class="card stack gap-12">
      <div class="stack gap-4"><span class="h3">Wochenvolumen laut Plan</span><span class="meta">Harte Sätze pro Muskelgruppe, wenn du jede Einheit einmal pro Woche machst. Grüner Bereich: 10–20 Sätze.</span></div>
      ${volumeBars(plannedSets(plan))}
    </div>
    <div class="card stack gap-12">
      <div class="stack gap-4"><span class="h3">Wochenstruktur</span><span class="meta">${gymDays}× Studio · ${runDays}× Laufen. Der Plan läuft als Rotation: Egal an welchem Tag du gehst, es kommt immer die nächste Einheit.</span></div>
      ${WEEK_ORDER.map((d) => `<div class="plan-row"><span class="pd">${WD[d]}</span><select class="sel" data-wd="${d}" aria-label="Aktivität ${WD[d]}">${['gym', 'laufen', 'rad', 'schwimmen', 'ruhe', ''].map((k) => `<option value="${k}" ${(s.weekPlan?.[d] || '') === k ? 'selected' : ''}>${ACTIVITIES[k]}</option>`).join('')}</select><span></span></div>`).join('')}
      ${tpl?.run ? `<div class="note">${ICON.pulse ? '' : ''}<b>Laufen & Kraft:</b> ${esc(tpl.run)}</div>` : ''}
    </div>`;
  const root = $('#view-training');
  root.onclick = (e) => {
    const day = e.target.closest('[data-day]');
    if (day) return openDay(Number(day.dataset.day));
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'resume') openWorkout();
    else if (b.dataset.act === 'switch') openPlanPicker();
    else if (b.dataset.act === 'free') startGuard(() => beginWorkout(null, 0));
    else if (b.dataset.act === 'addday') {
      const p = getPlan();
      p.days.push({ id: uid(), name: `Einheit ${p.days.length + 1}`, focus: '', slots: [] });
      savePlan(p); emit('change'); openDay(p.days.length - 1);
    }
  };
  root.onchange = (e) => {
    const sel = e.target.closest('[data-wd]');
    if (!sel) return;
    const wp = { ...(getSettings().weekPlan || {}) };
    wp[Number(sel.dataset.wd)] = sel.value;
    setSetting('weekPlan', wp); emit('change');
  };
}

// Nur eine Einheit gleichzeitig: läuft schon eine, diese fortsetzen.
function startGuard(fn) {
  if (getActive()) { toast('Es läuft bereits ein Training'); openWorkout(); return; }
  fn();
}

function openDay(i) {
  const plan = getPlan();
  const day = plan.days[i];
  if (!day) return;
  const save = () => { savePlan(plan); emit('change'); };
  const slotRow = (sl, k) => {
    const ex = byId(sl.ex);
    return `<div class="card flat stack gap-8" style="padding:12px;">
      <div class="w-ex"><button data-info="${ex.id}">${thumb(ex.id)}</button>
        <button class="grow stack" data-info="${ex.id}"><span class="h3">${esc(ex.name)}</span><span class="meta">${esc(muscleNames(ex.primary).join(', '))}</span></button>
        <button class="icon-btn clear" data-up="${k}" aria-label="Nach oben" ${k === 0 ? 'disabled style="opacity:.3"' : ''}>${ICON.up}</button>
        <button class="icon-btn clear" data-rep="${k}" aria-label="Ersetzen">${ICON.swap}</button>
        <button class="icon-btn clear" data-del="${k}" aria-label="Entfernen">${ICON.trash}</button></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        <label class="field"><span class="label">Sätze</span><input class="input num" inputmode="numeric" data-k="${k}" data-f="sets" value="${sl.sets}"></label>
        <label class="field"><span class="label">${ex.unit === 'sek' ? 'Sek.' : 'Wdh.'} von</span><input class="input num" inputmode="numeric" data-k="${k}" data-f="min" value="${sl.reps[0]}"></label>
        <label class="field"><span class="label">bis</span><input class="input num" inputmode="numeric" data-k="${k}" data-f="max" value="${sl.reps[1]}"></label>
      </div></div>`;
  };
  openSheet(`
    <div class="stack gap-4" style="padding-right:44px;"><span class="eyebrow">Einheit ${i + 1} von ${plan.days.length}</span>
      <input class="input" id="d-name" value="${esc(day.name)}" maxlength="30" aria-label="Name der Einheit" style="font-size:19px;font-weight:700;"></div>
    <span class="meta">${day.slots.length} Übungen · ca. ${dayDuration(day)} min</span>
    <button class="btn" id="d-start" ${day.slots.length ? '' : 'disabled'}>${ICON.play} Dieses Training starten</button>
    <div class="list" id="d-slots">${day.slots.map(slotRow).join('') || '<div class="empty">Noch keine Übung in dieser Einheit.</div>'}</div>
    <button class="btn ghost" id="d-add">${ICON.plus} Übung hinzufügen</button>
    ${plan.days.length > 1 ? '<button class="btn danger" id="d-remove">Einheit löschen</button>' : ''}
  `, (sh) => {
    $('#d-name', sh).onchange = (e) => { day.name = e.target.value.trim() || `Einheit ${i + 1}`; save(); };
    $('#d-start', sh).onclick = () => { closeSheet(); startGuard(() => beginWorkout(getPlan(), i)); };
    $('#d-add', sh).onclick = () => pickExercise({ title: 'Übung hinzufügen', onPick: (id) => { day.slots.push(slotFor(id)); save(); openDay(i); } });
    const rm = $('#d-remove', sh);
    if (rm) rm.onclick = () => { plan.days.splice(i, 1); plan.next = 0; save(); closeSheet(); toast('Einheit gelöscht'); };
    $('#d-slots', sh).onchange = (e) => {
      const inp = e.target.closest('input[data-f]');
      if (!inp) return;
      const sl = day.slots[inp.dataset.k];
      const v = Math.max(1, Math.min(inp.dataset.f === 'sets' ? 10 : 600, parseInt(inp.value, 10) || 1));
      if (inp.dataset.f === 'sets') sl.sets = v;
      else if (inp.dataset.f === 'min') sl.reps = [v, Math.max(v, sl.reps[1])];
      else sl.reps = [Math.min(sl.reps[0], v), v];
      save(); openDay(i);
    };
    $('#d-slots', sh).onclick = (e) => {
      const t = e.target;
      const info = t.closest('[data-info]');
      if (info) return openExercise(info.dataset.info, { onClose: () => setTimeout(() => { if ($('#sheet-backdrop').classList.contains('hidden')) openDay(i); }, 0) });
      const up = t.closest('[data-up]');
      if (up) { const k = Number(up.dataset.up); if (k > 0) { [day.slots[k - 1], day.slots[k]] = [day.slots[k], day.slots[k - 1]]; save(); openDay(i); } return; }
      const del = t.closest('[data-del]');
      if (del) { day.slots.splice(Number(del.dataset.del), 1); save(); return openDay(i); }
      const rep = t.closest('[data-rep]');
      if (rep) {
        const k = Number(rep.dataset.rep);
        pickExercise({ title: 'Ersetzen durch', preferGroup: byId(day.slots[k].ex).group, onPick: (id) => { day.slots[k] = { ...slotFor(id), sets: day.slots[k].sets }; save(); openDay(i); } });
      }
    };
  });
}

export function openPlanPicker() {
  const cur = getPlan();
  openSheet(`
    <h2 class="h2">Plan wählen</h2>
    <p class="body">Jede Vorlage ist ein Startpunkt — Übungen, Sätze und Wiederholungen kannst du danach frei anpassen.</p>
    <div class="list">${PROGRAMS.map((p) => `<button class="card flat stack gap-8" data-tpl="${p.id}" style="text-align:left;${cur?.templateId === p.id ? 'border-color:var(--accent);' : ''}">
      <div class="row-between"><span class="h3">${esc(p.name)}</span>${cur?.templateId === p.id ? '<span class="badge">Aktiv</span>' : ''}</div>
      <div class="chips"><span class="chip accent">${GOALS[p.goal].name}</span><span class="chip">${p.perWeek}× pro Woche</span><span class="chip">${p.days.length} Einheiten</span></div>
      <span class="meta" style="line-height:1.45;">${esc(p.desc)}</span></button>`).join('')}</div>
  `, (sh) => {
    for (const b of $$('[data-tpl]', sh)) b.onclick = () => {
      const tpl = programById(b.dataset.tpl);
      openSheet(`
        <h2 class="h2" style="padding-right:44px;">${esc(tpl.name)}</h2>
        <div class="note">${esc(GOALS[tpl.goal].hint)}</div>
        ${tpl.days.map((d) => `<div class="stack gap-4"><span class="h3">${esc(d.name)}</span><span class="meta" style="line-height:1.5;">${d.slots.map((x) => `${esc(byId(x[0]).name)} ${x[1]}×${x[2]}–${x[3]}`).join(' · ')}</span></div>`).join('')}
        <p class="meta" style="margin:0;">Dein bisheriger Plan wird ersetzt. Dein Trainingsverlauf bleibt erhalten.</p>
        <button class="btn" id="tpl-use">Diesen Plan verwenden</button>`, (s2) => {
        $('#tpl-use', s2).onclick = () => { savePlan(planFromTemplate(tpl.id)); closeSheet(); emit('change'); toast(`Plan „${tpl.name}“ aktiv`); };
      });
    };
  });
}
