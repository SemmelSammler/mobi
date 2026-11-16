// Gemeinsamer Zugriff auf alle Übungen (Mobility + Studio).
import { EXERCISES as MOB_RAW, MISTAKES, BLOCKS, ABLOCKS, KBLOCKS, ZBLOCKS } from './mobility.js';
import { GYM_OBER } from './gym-ober.js';
import { GYM_UNTER } from './gym-unter.js';
import { GYM_ARME } from './gym-arme.js';
import { musclesForAreas, MUSCLES } from './muscles.js';
import { buildFig } from '../figs.js';

export const SECTIONS = {
  morgen: {
    label: 'Morgenroutine', tag: 'Dynamisch', blocks: BLOCKS, tempo: [1.6, 0.2, 1.6, 0.2],
    phases: ['In die Bewegung · ausatmen', 'Zurück · einatmen'],
    science: 'Dynamisches Mobilisieren erwärmt das Gewebe, verteilt Gelenkflüssigkeit und weckt das Nervensystem. Anders als langes statisches Dehnen senkt es die Kraft direkt danach nicht — deshalb gehört es an den Morgen und vor das Training.'
  },
  abend: {
    label: 'Abendroutine', tag: 'Statisch', blocks: ABLOCKS, tempo: [3.2, 1.4, 3.2, 1],
    phases: ['Tiefer sinken · lang ausatmen', 'Halten · ruhig einatmen'],
    science: 'Bei langen Haltezeiten gewöhnt sich das Nervensystem an die Dehnung — die Dehntoleranz steigt, der Bewegungsumfang wächst. Entscheidend ist die Wochendosis pro Muskel. Langes Ausatmen aktiviert zusätzlich den Parasympathikus und hilft beim Runterfahren.'
  },
  endgrad: {
    label: 'Endgrad-Kraft', tag: 'Unter Last', blocks: KBLOCKS, tempo: [2.6, 0.8, 1.6, 0.4],
    phases: ['Langsam in die Endposition · einatmen', 'Kontrolliert zurück · ausatmen'],
    science: 'Krafttraining über den vollen Bewegungsumfang verbessert die Beweglichkeit ähnlich gut wie Dehnen — und macht die neue Reichweite gleichzeitig stark und belastbar. Das Tempo bleibt langsam, besonders am Endpunkt.'
  },
  buero: {
    label: 'Zwischendurch', tag: 'Am Schreibtisch', blocks: ZBLOCKS, tempo: [1.8, 0.4, 1.8, 0.3],
    phases: ['In die Bewegung · ausatmen', 'Zurück · einatmen'],
    science: 'Kurze Bewegungspausen unterbrechen lange Sitzphasen: Durchblutung und Gelenkstoffwechsel kommen wieder in Gang, verspannte Muskeln lösen sich. Häufig und kurz wirkt besser als selten und lang.'
  }
};

const sectionOfBlock = {};
for (const [key, sec] of Object.entries(SECTIONS)) for (const b of sec.blocks) sectionOfBlock[b.id] = key;
const blockName = {};
for (const sec of Object.values(SECTIONS)) for (const b of sec.blocks) blockName[b.id] = b.name;

export const MOBILITY = MOB_RAW.map((e) => {
  const section = sectionOfBlock[e.block];
  return {
    kind: 'mob', section, blockName: blockName[e.block],
    primary: musclesForAreas(e.areas), secondary: [],
    tempo: SECTIONS[section].tempo, phases: SECTIONS[section].phases,
    mistakes: MISTAKES[e.id] || [], ...e
  };
});

export const EQUIP = {
  langhantel: 'Langhantel', kurzhantel: 'Kurzhantel', kabel: 'Kabelzug', maschine: 'Maschine', koerper: 'Körpergewicht', kettlebell: 'Kettlebell'
};
export const LEVELS = { 1: 'Einsteiger', 2: 'Fortgeschritten', 3: 'Anspruchsvoll' };

export const GYM = [...GYM_OBER, ...GYM_UNTER, ...GYM_ARME].map((e) => ({ kind: 'gym', ...e, ...buildFig(e.fig) }));

export const EXERCISES = [...MOBILITY, ...GYM];
const INDEX = new Map(EXERCISES.map((e) => [e.id, e]));
export const byId = (id) => INDEX.get(id);
export const muscleNames = (list = []) => list.map((m) => MUSCLES[m]?.name).filter(Boolean);
