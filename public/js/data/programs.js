// Trainingsplan-Vorlagen. Slot = [Übungs-ID, Sätze, Wdh. von, Wdh. bis].
// Alle Pläne laufen als Rotation: Das nächste Training ist immer das nächste in der Reihe —
// egal, an welchem Wochentag du gehst. So passt derselbe Plan zu 3, 4 oder 5 Studiotagen.
export const GOALS = {
  muskelaufbau: { name: 'Muskelaufbau', hint: '6–15 Wdh., 1–3 Wdh. vor Muskelversagen stoppen, 10–20 Sätze pro Muskel und Woche' },
  kraft: { name: 'Maximalkraft', hint: '3–6 Wdh. mit langen Pausen, wenige schwere Grundübungen' },
  laeufer: { name: 'Athletisch / Läufer', hint: 'Beine, Rumpf und Verletzungsschutz, moderates Volumen' },
  fitness: { name: 'Allgemeine Fitness', hint: 'Ganzkörper, mittlere Wiederholungen, zeitsparend' }
};

export const PROGRAMS = [
  {
    id: 'ul4', name: 'Oberkörper / Unterkörper', goal: 'muskelaufbau', perWeek: '4 (3–5 möglich)',
    desc: 'Jede Muskelgruppe zweimal pro Woche, vier klar getrennte Einheiten. Der beste Allrounder für Muskelaufbau.',
    run: 'Lauftage am besten nach einem Oberkörper-Tag oder mit einem Tag Abstand zu den Beinen legen.',
    days: [
      { name: 'Oberkörper A', focus: 'Brust & Rückenbreite', slots: [['bankdruecken', 4, 6, 10], ['latzug', 3, 8, 12], ['schraegbank-kh', 3, 8, 12], ['kabelrudern', 3, 8, 12], ['seitheben', 3, 12, 20], ['ueberkopf-trizeps', 3, 10, 15], ['schraegbank-curl', 3, 10, 15]] },
      { name: 'Unterkörper A', focus: 'Kniebeuge & Beinrückseite', slots: [['kniebeuge', 4, 5, 8], ['rdl', 3, 6, 10], ['beinpresse', 3, 8, 12], ['beinbeuger-sitzend', 3, 10, 15], ['wadenheben-stehend', 3, 8, 15], ['kabel-crunch', 3, 10, 15]] },
      { name: 'Oberkörper B', focus: 'Schultern & Rückendicke', slots: [['schulterdruecken-kh', 3, 8, 12], ['lh-rudern', 4, 6, 10], ['butterfly', 3, 10, 15], ['latzug-eng', 3, 8, 12], ['kabel-seitheben', 3, 12, 20], ['face-pull', 3, 12, 20], ['trizepsdruecken', 3, 10, 15], ['hammer-curl', 3, 10, 15]] },
      { name: 'Unterkörper B', focus: 'Gesäß & einbeinig', slots: [['hip-thrust', 3, 8, 12], ['bulgarian-split-squat', 3, 8, 12], ['beinstrecker', 3, 10, 15], ['beinbeuger-liegend', 3, 10, 15], ['wadenheben-sitzend', 3, 10, 20], ['knieheben-haengend', 3, 8, 15]] }
    ]
  },
  {
    id: 'gk3', name: 'Ganzkörper', goal: 'fitness', perWeek: '3',
    desc: 'Drei Einheiten, jede trainiert den ganzen Körper. Ideal bei drei Studiotagen oder wenn Laufen Vorrang hat.',
    run: 'Zwischen zwei Einheiten mindestens einen Tag Pause oder einen lockeren Lauf legen.',
    days: [
      { name: 'Ganzkörper A', focus: 'Kniebeuge & Drücken', slots: [['kniebeuge', 3, 5, 8], ['bankdruecken', 3, 6, 10], ['kabelrudern', 3, 8, 12], ['beinbeuger-sitzend', 3, 10, 15], ['seitheben', 3, 12, 20], ['kabel-crunch', 3, 10, 15]] },
      { name: 'Ganzkörper B', focus: 'Hüfte & Ziehen', slots: [['rdl', 3, 6, 10], ['schulterdruecken-kh', 3, 8, 12], ['latzug', 3, 8, 12], ['beinpresse', 3, 8, 12], ['kh-curl', 3, 8, 12], ['trizepsdruecken', 3, 10, 15]] },
      { name: 'Ganzkörper C', focus: 'Einbeinig & Rücken', slots: [['bulgarian-split-squat', 3, 8, 12], ['schraegbank-kh', 3, 8, 12], ['kh-rudern', 3, 8, 12], ['hip-thrust', 3, 8, 12], ['face-pull', 3, 12, 20], ['wadenheben-stehend', 3, 8, 15], ['plank', 3, 30, 60]] }
    ]
  },
  {
    id: 'ppl5', name: 'Push / Pull / Beine + OK / UK', goal: 'muskelaufbau', perWeek: '5',
    desc: 'Fünf Einheiten mit hohem Volumen: drei Schwerpunkt-Tage plus ein Ober- und ein Unterkörpertag.',
    run: 'Bei fünf Studiotagen die Läufe locker halten und nicht direkt vor „Beine“ oder „Unterkörper“ legen.',
    days: [
      { name: 'Push', focus: 'Brust, Schultern, Trizeps', slots: [['bankdruecken', 4, 6, 10], ['schulterdruecken-kh', 3, 8, 12], ['schraegbank-kh', 3, 8, 12], ['seitheben', 4, 12, 20], ['ueberkopf-trizeps', 3, 10, 15], ['trizepsdruecken', 3, 10, 15]] },
      { name: 'Pull', focus: 'Rücken, Bizeps', slots: [['latzug', 4, 8, 12], ['lh-rudern', 3, 6, 10], ['kabelrudern', 3, 8, 12], ['face-pull', 3, 12, 20], ['schraegbank-curl', 3, 10, 15], ['hammer-curl', 3, 10, 15]] },
      { name: 'Beine', focus: 'Quadrizeps, Beinbeuger, Waden', slots: [['kniebeuge', 4, 5, 8], ['rdl', 3, 6, 10], ['beinpresse', 3, 8, 12], ['beinbeuger-sitzend', 3, 10, 15], ['wadenheben-stehend', 4, 8, 15], ['kabel-crunch', 3, 10, 15]] },
      { name: 'Oberkörper', focus: 'Zweiter Reiz, mehr Maschinen', slots: [['schraegbank-lh', 3, 6, 10], ['latzug-eng', 3, 8, 12], ['brustpresse', 3, 8, 12], ['rudermaschine', 3, 8, 12], ['kabel-seitheben', 3, 12, 20], ['reverse-butterfly', 3, 12, 20], ['kabel-curl', 2, 10, 15], ['stirndruecken', 2, 8, 12]] },
      { name: 'Unterkörper', focus: 'Gesäß & Maschinen', slots: [['hip-thrust', 3, 8, 12], ['hackenschmidt', 3, 8, 12], ['beinbeuger-liegend', 3, 10, 15], ['beinstrecker', 3, 10, 15], ['wadenheben-sitzend', 3, 10, 20], ['knieheben-haengend', 3, 8, 15]] }
    ]
  },
  {
    id: 'ppl3', name: 'Push / Pull / Beine', goal: 'muskelaufbau', perWeek: '3–6',
    desc: 'Der Klassiker: drei Einheiten, die du ein- oder zweimal pro Woche durchläufst.',
    run: 'Den Lauf nach „Beine“ locker halten oder einen Tag Abstand lassen.',
    days: [
      { name: 'Push', focus: 'Brust, Schultern, Trizeps', slots: [['bankdruecken', 4, 6, 10], ['schulterdruecken-kh', 3, 8, 12], ['schraegbank-kh', 3, 8, 12], ['seitheben', 4, 12, 20], ['ueberkopf-trizeps', 3, 10, 15], ['trizepsdruecken', 3, 10, 15]] },
      { name: 'Pull', focus: 'Rücken, Bizeps', slots: [['latzug', 4, 8, 12], ['lh-rudern', 3, 6, 10], ['kabelrudern', 3, 8, 12], ['face-pull', 3, 12, 20], ['schraegbank-curl', 3, 10, 15], ['hammer-curl', 3, 10, 15]] },
      { name: 'Beine', focus: 'Quadrizeps, Beinbeuger, Waden', slots: [['kniebeuge', 4, 5, 8], ['rdl', 3, 6, 10], ['beinpresse', 3, 8, 12], ['beinbeuger-sitzend', 3, 10, 15], ['wadenheben-stehend', 4, 8, 15], ['kabel-crunch', 3, 10, 15]] }
    ]
  },
  {
    id: 'lauf2', name: 'Kraft für Läufer', goal: 'laeufer', perWeek: '2',
    desc: 'Zwei kompakte Einheiten für Laufökonomie und Verletzungsschutz: schwere Beine, Waden, Hüfte und Rumpf.',
    run: 'An Tagen mit lockeren Läufen oder mit mindestens 6 Stunden Abstand zu harten Laufeinheiten trainieren.',
    days: [
      { name: 'Läufer A', focus: 'Schwer & zweibeinig', slots: [['kniebeuge', 3, 5, 8], ['rdl', 3, 6, 10], ['step-up', 3, 8, 12], ['wadenheben-stehend', 3, 8, 12], ['kh-rudern', 3, 8, 12], ['plank', 3, 30, 60]] },
      { name: 'Läufer B', focus: 'Einbeinig & Hüfte', slots: [['bulgarian-split-squat', 3, 8, 12], ['hip-thrust', 3, 8, 12], ['nordic-curl', 3, 4, 8], ['wadenheben-sitzend', 3, 10, 20], ['abduktoren', 2, 12, 20], ['liegestuetz', 3, 8, 20], ['holzhacker', 3, 10, 15]] }
    ]
  },
  {
    id: 'kraft3', name: 'Grundkraft', goal: 'kraft', perWeek: '3',
    desc: 'Schwere Grundübungen mit wenigen Wiederholungen und langen Pausen. Für alle, die vor allem stärker werden wollen.',
    run: 'Kreuzheben und Kniebeuge nicht am Tag vor einem harten Lauf.',
    days: [
      { name: 'Kraft A', focus: 'Kniebeuge & Bankdrücken', slots: [['kniebeuge', 5, 3, 5], ['bankdruecken', 5, 3, 5], ['lh-rudern', 4, 5, 8], ['plank', 3, 30, 60]] },
      { name: 'Kraft B', focus: 'Kreuzheben & Überkopf', slots: [['kreuzheben', 4, 3, 5], ['schulterdruecken-lh', 4, 4, 6], ['klimmzug', 4, 4, 8], ['hyperextension', 3, 10, 15]] },
      { name: 'Kraft C', focus: 'Front & Zug', slots: [['frontkniebeuge', 4, 4, 6], ['enges-bankdruecken', 4, 5, 8], ['t-bar-rudern', 4, 6, 8], ['farmers-walk', 3, 30, 45]] }
    ]
  }
];

export const programById = (id) => PROGRAMS.find((p) => p.id === id);
