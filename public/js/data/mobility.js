// mobi Übungsdatenbank v1
// Pose-Format: h=Kopf, n=Nacken/Schulter, p=Becken/Hüfte, b=Torso-Biegung,
// aL/aR=[Ellbogen,Hand], lL/lR=[Knie,Fuß] — Koordinatenraum 320x210, Boden y=196.

export const BLOCKS = [
  { id: 1, name: 'Aufwachen & Wirbelsäule', short: 'Wirbelsäule' },
  { id: 2, name: 'Hüfte & Beinrückseite', short: 'Hüfte' },
  { id: 3, name: 'Füße & Sprunggelenke', short: 'Sprunggelenke' },
  { id: 4, name: 'Schultern & BWS', short: 'Schultern' },
  { id: 5, name: 'Aktivierung', short: 'Aktivierung' }
];

// Übungen pro Block und Dauer: [B1,B2,B3,B4,B5]
// Mehr Zeit = mehr Übungen (nicht längere Einzelzeiten, siehe Faktor-Cap in routine.js).
export const PLAN = {
  5: { counts: [1, 1, 1, 1, 1] },
  10: { counts: [1, 2, 2, 2, 1] },
  15: { counts: [2, 4, 3, 2, 2] }
};

// Abendroutine: statisches Dehnen, lange Haltezeiten, Runterfahren.
export const ABLOCKS = [
  { id: 6, name: 'Ankommen & Atmen', short: 'Atmen' },
  { id: 7, name: 'Beinrückseite & Hüfte', short: 'Hüfte lang' },
  { id: 8, name: 'Rücken & Rotation', short: 'Rücken' },
  { id: 9, name: 'Brust & Nacken', short: 'Brust' },
  { id: 10, name: 'Abschluss', short: 'Abschluss' }
];

export const ABEND_PLAN = {
  10: { counts: [1, 3, 1, 1, 1] },
  15: { counts: [1, 4, 2, 1, 1] },
  20: { counts: [2, 4, 2, 2, 1] }
};

// Endgrad-Kraft: beladene Beweglichkeit — ROM-Zuwachs plus Kraft und Belastbarkeit.
export const KBLOCKS = [
  { id: 11, name: 'Beine · Endgrad', short: 'Beine' },
  { id: 12, name: 'Rumpf & Stütz', short: 'Stütz' }
];

export const KRAFT_PLAN = {
  15: { counts: [3, 1] },
  20: { counts: [4, 2] },
  25: { counts: [4, 3] }
};

// Zwischendurch: 3 schnelle Übungen gegen das Sitzen, direkt am Schreibtisch.
export const ZBLOCKS = [
  { id: 13, name: 'Am Schreibtisch', short: 'Büro' }
];

export const ZD_PLAN = {
  3: { counts: [3] }
};

// Fokustage: Zielbereiche für verdoppelte Haltezeiten (Abendroutine).
export const FOCUS_TARGETS = {
  sprunggelenk: { label: 'Sprunggelenk & Wade', areas: ['Sprunggelenk', 'Waden'] },
  huefte: { label: 'Hüfte & Beinrückseite', areas: ['Hüfte', 'Beinrückseite', 'Gesäß', 'Adduktoren'] },
  schulter: { label: 'Schultern & Oberkörper', areas: ['Schulter', 'BWS', 'Brust', 'Lat', 'Nacken'] }
};

const STAND = {
  h: [160, 36], n: [160, 58], p: [160, 122], b: 0,
  aL: [[149, 90], [145, 116]], aR: [[171, 90], [175, 116]],
  lL: [[154, 158], [151, 196]], lR: [[166, 158], [169, 196]]
};
const base = (o) => ({ ...STAND, ...o });

export const EXERCISES = [
  // ---------- Block 1 · Aufwachen & Wirbelsäule ----------
  {
    id: 'katze-kuh', block: 1, name: 'Katze-Kuh', dose: '8–10 Wdh.', secs: 45, perSide: false, equip: null,
    areas: ['Wirbelsäule'],
    benefit: 'Bewegt jede Etage deiner Wirbelsäule durch Beugung und Streckung — das direkte Gegenprogramm zu acht Stunden Bürostuhl und die sanfteste Art, morgens wach zu werden.',
    how: ['Vierfüßlerstand, Hände unter den Schultern', 'Ausatmen: Rücken rund machen, Kopf locker hängen lassen', 'Einatmen: Brustbein nach vorn schieben, Blick leicht anheben'],
    accent: [166, 98],
    poseA: { h: [112, 108], n: [126, 92], p: [204, 94], b: -26, aL: [[124, 130], [122, 166]], aR: [[130, 130], [128, 166]], lL: [[214, 164], [258, 170]], lR: [[220, 166], [264, 172]] },
    poseB: { h: [106, 76], n: [124, 98], p: [206, 100], b: 22, aL: [[122, 132], [120, 168]], aR: [[128, 134], [126, 170]], lL: [[214, 164], [258, 170]], lR: [[220, 166], [264, 172]] }
  },
  {
    id: 'kind-kobra', block: 1, name: 'Kind-zu-Kobra-Flow', dose: '6 Wdh.', secs: 50, perSide: false, equip: null,
    areas: ['Wirbelsäule', 'Hüfte'],
    benefit: 'Wechselt zwischen maximaler Beugung und sanfter Streckung — mobilisiert Wirbelsäule und Hüfte in einem fließenden Atemrhythmus.',
    how: ['Aus der Kindhaltung (Po auf den Fersen) nach vorn schieben', 'Hüfte absenken, Brust nach vorn-oben aufrichten', 'Mit dem Atem fließen: einatmen vor, ausatmen zurück'],
    accent: [150, 120],
    poseA: { h: [92, 128], n: [112, 120], p: [196, 152], b: -18, aL: [[74, 150], [50, 176]], aR: [[80, 152], [56, 178]], lL: [[218, 178], [258, 184]], lR: [[224, 180], [264, 186]] },
    poseB: { h: [92, 64], n: [106, 88], p: [196, 158], b: 26, aL: [[100, 130], [96, 168]], aR: [[106, 132], [102, 170]], lL: [[236, 172], [280, 182]], lR: [[242, 174], [286, 184]] }
  },
  {
    id: 'thread-needle', block: 1, name: 'Thread the Needle', dose: '5 Wdh. je Seite', secs: 50, perSide: true, equip: null,
    areas: ['BWS'],
    benefit: 'Rotiert gezielt die Brustwirbelsäule — die Etage, die vom Sitzen am stärksten einrostet und die du beim Laufen und Schwimmen für den Armzug brauchst.',
    how: ['Vierfüßlerstand', 'Einen Arm unter dem Körper hindurchfädeln, Schulter Richtung Boden', 'Zurückkommen und weit zur Decke öffnen'],
    accent: [150, 105],
    poseA: { h: [110, 96], n: [124, 92], p: [204, 94], b: 0, aL: [[122, 130], [120, 166]], aR: [[128, 132], [126, 168]], lL: [[214, 164], [258, 170]], lR: [[220, 166], [264, 172]] },
    poseB: { h: [128, 140], n: [130, 110], p: [204, 94], b: -10, aL: [[150, 140], [186, 152]], aR: [[128, 132], [126, 168]], lL: [[214, 164], [258, 170]], lR: [[220, 166], [264, 172]] }
  },
  {
    id: 'seitneigung', block: 1, name: 'Seitneigung mit Überziehen', dose: '5 Wdh. je Seite', secs: 45, perSide: true, equip: null,
    areas: ['Wirbelsäule', 'Rumpf'],
    benefit: 'Dehnt die seitliche Rumpfkette vom Becken bis zur Achsel — eine Richtung, in die sich der Körper im Alltag praktisch nie bewegt.',
    how: ['Aufrecht stehen, ein Arm über den Kopf', 'Langsam zur Gegenseite neigen, dabei lang machen', 'Nicht einknicken — Gefühl von Länge, nicht von Stauchung'],
    accent: [172, 92],
    poseA: base({ aL: [[148, 36], [154, 14]], lL: [[150, 158], [144, 196]], lR: [[170, 158], [176, 196]] }),
    poseB: { h: [196, 48], n: [186, 66], p: [160, 122], b: 14, aL: [[206, 40], [228, 32]], aR: [[176, 96], [180, 120]], lL: [[150, 158], [144, 196]], lR: [[170, 158], [176, 196]] }
  },
  {
    id: 'beckenkippen', block: 1, name: 'Beckenkippen im Stand', dose: '10 Wdh.', secs: 40, perSide: false, equip: null,
    areas: ['Wirbelsäule', 'Hüfte'],
    benefit: 'Bringt dir die Kontrolle über dein Becken zurück — die Basis für eine gesunde Lendenwirbelsäule beim Sitzen, Laufen und bei jeder Kraftübung.',
    how: ['Hände auf die Beckenknochen', 'Becken langsam nach vorn kippen (Hohlkreuz) und nach hinten (einrollen)', 'Nur das Becken bewegt sich, der Brustkorb bleibt ruhig'],
    accent: [160, 122],
    poseA: base({ b: 8, p: [156, 122], aL: [[146, 96], [152, 112]], aR: [[174, 96], [168, 112]] }),
    poseB: base({ b: -8, p: [164, 122], aL: [[146, 96], [152, 112]], aR: [[174, 96], [168, 112]] })
  },
  {
    id: 'hws-mobilisation', block: 1, name: 'Nacken-Rotation & Kinn-Zug', dose: 'je 5 Wdh.', secs: 45, perSide: false, equip: null,
    areas: ['Nacken'],
    benefit: 'Die Halswirbelsäule steht beim Bildschirmarbeiten stundenlang still. Langsame Rotationen und der Kinn-Zug nach hinten halten sie beweglich — auch fürs Schulterblick-Drehen und die Wasserlage beim Schwimmen.',
    how: ['Aufrecht stehen oder sitzen, Schultern locker', 'Kopf langsam so weit wie angenehm nach links und rechts drehen', 'Dann Kinn waagerecht nach hinten ziehen (Doppelkinn), kurz halten'],
    accent: [160, 40],
    poseA: base({ h: [166, 40], aL: [[146, 96], [152, 112]], aR: [[174, 96], [168, 112]] }),
    poseB: base({ h: [152, 38], aL: [[146, 96], [152, 112]], aR: [[174, 96], [168, 112]] })
  },

  // ---------- Block 2 · Hüfte & Beinrückseite ----------
  {
    id: 'wgs', block: 2, name: "World's Greatest Stretch", dose: '5 Wdh. je Seite', secs: 60, perSide: true, equip: null,
    areas: ['Hüfte', 'BWS'],
    benefit: 'Der Alleskönner: öffnet den Hüftbeuger, aktiviert das Gesäß und rotiert die Brustwirbelsäule — drei Sitz-Probleme in einer einzigen Übung.',
    how: ['Tiefer Ausfallschritt, Hände neben den vorderen Fuß', 'Ellbogen Richtung Boden sinken lassen', 'Dann den Arm weit nach oben aufdrehen, Blick folgt der Hand'],
    accent: [172, 132],
    poseA: { h: [142, 48], n: [150, 72], p: [172, 132], b: 6, aL: [[128, 120], [114, 172]], aR: [[146, 120], [142, 170]], lL: [[108, 152], [90, 196]], lR: [[230, 170], [288, 194]] },
    poseB: { h: [142, 48], n: [150, 72], p: [172, 132], b: 6, aL: [[128, 120], [114, 172]], aR: [[172, 50], [190, 32]], lL: [[108, 152], [90, 196]], lR: [[230, 170], [288, 194]] }
  },
  {
    id: 'neunzig-neunzig', block: 2, name: '90/90-Hüftwechsel', dose: '8 Wechsel', secs: 55, perSide: false, equip: null,
    areas: ['Hüfte'],
    benefit: 'Trainiert Innen- und Außenrotation der Hüfte — die zwei Bewegungsrichtungen, die bei Vielsitzern zuerst verloren gehen und ohne die runde Hüftbewegungen unmöglich sind.',
    how: ['Sitzend beide Beine 90° anwinkeln, eins vor, eins zur Seite', 'Knie gemeinsam zur anderen Seite kippen lassen', 'Aufrecht bleiben, Hände dürfen stützen'],
    accent: [160, 152],
    poseA: { h: [150, 84], n: [152, 104], p: [160, 152], b: 4, aL: [[136, 130], [128, 152]], aR: [[168, 130], [176, 152]], lL: [[112, 154], [100, 186]], lR: [[210, 158], [232, 186]] },
    poseB: { h: [150, 84], n: [152, 104], p: [160, 152], b: -4, aL: [[136, 130], [128, 152]], aR: [[168, 130], [176, 152]], lL: [[208, 156], [230, 184]], lR: [[112, 154], [98, 184]] }
  },
  {
    id: 'tiefe-hocke', block: 2, name: 'Tiefe Hocke mit Aufstützen', dose: '45 Sek.', secs: 45, perSide: false, equip: null,
    areas: ['Hüfte', 'Sprunggelenk'],
    benefit: 'Die tiefe Hocke ist die ehrlichste Ganzkörper-Messlatte: Sie fordert Hüfte, Sprunggelenke und Rücken gleichzeitig. Mit den Ellbogen die Knie sanft nach außen drücken öffnet die Hüfte Stück für Stück.',
    how: ['So tief wie möglich in die Hocke, Fersen bleiben am Boden', 'Ellbogen gegen die Knie-Innenseiten, Hände zusammen', 'Sanft hin- und herwippen, Brust aufrecht'],
    accent: [168, 150],
    poseA: { h: [150, 74], n: [154, 94], p: [168, 146], b: 8, aL: [[128, 110], [112, 124]], aR: [[134, 112], [118, 126]], lL: [[118, 150], [108, 196]], lR: [[130, 154], [122, 196]] },
    poseB: { h: [152, 92], n: [156, 110], p: [172, 158], b: 8, aL: [[130, 122], [114, 134]], aR: [[136, 124], [120, 136]], lL: [[116, 156], [106, 196]], lR: [[128, 160], [120, 196]] }
  },
  {
    id: 'hip-cars', block: 2, name: 'Hip CARs (Hüftkreise)', dose: '2 langsame Kreise je Richtung', secs: 80, perSide: true, equip: null,
    areas: ['Hüfte'],
    benefit: 'Kontrollierte Kreise durch den vollen Bewegungsradius der Hüfte — hält die Gelenkkapsel geschmeidig und erschließt Bewegungsbereiche, die du sonst nie besuchst.',
    how: ['Stehend festhalten, ein Knie hoch anheben', 'Knie in ~10 Sekunden pro Kreis so weit wie möglich zur Seite und nach hinten führen', 'Ganzkörperspannung halten — Oberkörper bleibt komplett ruhig'],
    accent: [160, 122],
    poseA: base({ aL: [[146, 96], [152, 112]], aR: [[174, 96], [168, 112]], lL: [[118, 128], [122, 164]] }),
    poseB: base({ aL: [[146, 96], [152, 112]], aR: [[174, 96], [168, 112]], lL: [[196, 138], [188, 174]] })
  },
  {
    id: 'beinpendel', block: 2, name: 'Beinpendel vor/zurück', dose: '10 Schwünge je Seite', secs: 45, perSide: true, equip: 'Wand',
    areas: ['Hüfte', 'Beinrückseite'],
    benefit: 'Dynamisches Schwingen bereitet Hüftbeuger und Beinrückseite genau auf das vor, was sie beim Laufen tun müssen — die klassische Läufer-Vorbereitung.',
    how: ['Seitlich an der Wand abstützen', 'Gestrecktes Bein locker vor- und zurückschwingen', 'Mit jedem Schwung etwas größer werden, ohne Schwung zu erzwingen'],
    accent: [160, 122],
    props: [['line', 60, 56, 60, 196]],
    poseA: base({ aL: [[110, 74], [64, 82]], lL: [[120, 148], [100, 178]] }),
    poseB: base({ aL: [[110, 74], [64, 82]], lL: [[198, 152], [220, 182]] })
  },
  {
    id: 'beinpendel-seit', block: 2, name: 'Beinpendel seitlich', dose: '10 Schwünge je Seite', secs: 45, perSide: true, equip: null,
    areas: ['Adduktoren', 'Hüfte'],
    benefit: 'Öffnet die Hüfte zur Seite und lockert die Adduktoren — die Innenseite der Oberschenkel, die beim Radfahren und Sitzen chronisch verkürzt.',
    how: ['Vor einer Wand oder frei stehen, Arme zur Balance', 'Bein vor dem Körper zur Seite und zurück pendeln', 'Standbein leicht gebeugt, Oberkörper ruhig'],
    accent: [160, 122],
    poseA: base({ aL: [[130, 80], [108, 76]], aR: [[190, 80], [212, 76]], lL: [[130, 152], [112, 188]] }),
    poseB: base({ aL: [[130, 80], [108, 76]], aR: [[190, 80], [212, 76]], lL: [[178, 156], [196, 186]] })
  },
  {
    id: 'hueftschub', block: 2, name: 'Ausfallschritt mit Hüftschub', dose: '8 Wdh. je Seite', secs: 50, perSide: true, equip: null,
    areas: ['Hüfte'],
    benefit: 'Dehnt den Hüftbeuger dynamisch in die Streckung — die Bewegung, die dir nach Bürotagen fehlt und ohne die es keinen kraftvollen Laufschritt gibt.',
    how: ['Ausfallschritt, hinteres Knie darf schweben oder aufsetzen', 'Becken aktiv nach vorn schieben, Gesäß anspannen', 'Arme lang nach oben für extra Dehnung'],
    accent: [176, 134],
    poseA: { h: [150, 52], n: [152, 74], p: [164, 134], b: 4, aL: [[140, 48], [136, 24]], aR: [[164, 48], [160, 24]], lL: [[118, 150], [104, 196]], lR: [[226, 168], [280, 192]] },
    poseB: { h: [158, 50], n: [160, 72], p: [180, 134], b: 6, aL: [[148, 46], [144, 22]], aR: [[172, 46], [168, 22]], lL: [[122, 152], [104, 196]], lR: [[238, 164], [290, 190]] }
  },
  {
    id: 'frosch-wippe', block: 2, name: 'Frosch-Wippe', dose: '10 Wdh.', secs: 45, perSide: false, equip: null,
    areas: ['Adduktoren', 'Hüfte'],
    benefit: 'Im breiten Kniestand vor- und zurückwippen dehnt die Oberschenkel-Innenseiten — ein blinder Fleck fast jedes Trainingsplans und ein Schlüssel für tiefe Hocken.',
    how: ['Vierfüßlerstand, Knie deutlich breiter als die Hüfte', 'Unterarme aufsetzen, Rücken lang', 'Becken langsam nach hinten und wieder nach vorn schieben'],
    accent: [205, 112],
    poseA: { h: [112, 112], n: [126, 102], p: [200, 110], b: -8, aL: [[120, 140], [112, 168]], aR: [[126, 142], [118, 170]], lL: [[214, 172], [262, 176]], lR: [[220, 174], [268, 178]] },
    poseB: { h: [120, 118], n: [132, 106], p: [216, 118], b: -8, aL: [[124, 142], [116, 170]], aR: [[130, 144], [122, 172]], lL: [[224, 174], [268, 178]], lR: [[230, 176], [274, 180]] }
  },
  {
    id: 'elephant-walk', block: 7, name: 'Elephant Walks', dose: '10 Wdh. im Wechsel', secs: 50, perSide: false, equip: 'Plyobox',
    areas: ['Beinrückseite'],
    benefit: 'Starker Einstieg in die Abend-Dehnung: Im Wechsel ein Knie durchstrecken dehnt die Hamstrings dynamisch an, bevor die langen Haltepositionen kommen. Die Hände auf der Plyobox machen es für deinen Startpunkt machbar.',
    how: ['Vorbeugen, Hände auf die Plyobox stützen, Knie gebeugt', 'Abwechselnd ein Knie strecken, Ferse bleibt am Boden', 'Rücken lang lassen, Zug in der Beinrückseite zulassen'],
    accent: [180, 158],
    props: [['rect', 52, 150, 58, 46]],
    poseA: { h: [102, 110], n: [116, 116], p: [178, 124], b: 16, aL: [[96, 134], [84, 150]], aR: [[102, 136], [90, 150]], lL: [[180, 156], [176, 196]], lR: [[196, 166], [192, 196]] },
    poseB: { h: [102, 110], n: [116, 116], p: [178, 124], b: 16, aL: [[96, 134], [84, 150]], aR: [[102, 136], [90, 150]], lL: [[186, 164], [182, 196]], lR: [[192, 158], [190, 196]] }
  },
  {
    id: 'aktives-beinheben', block: 2, name: 'Aktives Beinheben (Rückenlage)', dose: '8 Wdh. je Seite', secs: 60, perSide: true, equip: null,
    areas: ['Beinrückseite', 'Hüfte'],
    benefit: 'Das gestreckte Bein aktiv und kontrolliert anheben trainiert die Beinrückseite in ihrer Länge und die Hüftbeuger in ihrer Kraft — im Liegen völlig rückenschonend, ideal direkt nach dem Aufstehen.',
    how: ['Rückenlage, ein Bein aufgestellt, das andere gestreckt', 'Gestrecktes Bein langsam so hoch wie möglich heben — ohne Schwung', 'Oben 2 Sekunden halten, kontrolliert absenken'],
    accent: [170, 176],
    poseA: { h: [70, 182], n: [92, 180], p: [170, 178], b: 0, aL: [[112, 188], [132, 192]], aR: [[118, 188], [138, 192]], lL: [[212, 160], [252, 148]], lR: [[226, 158], [268, 176]] },
    poseB: { h: [70, 182], n: [92, 180], p: [170, 178], b: 0, aL: [[112, 188], [132, 192]], aR: [[118, 188], [138, 192]], lL: [[196, 128], [222, 92]], lR: [[226, 158], [268, 176]] }
  },

  // ---------- Block 3 · Füße & Sprunggelenke ----------
  {
    id: 'ankle-rocks', block: 3, name: 'Ankle Rocks an der Wand', dose: '10 Wdh. je Seite', secs: 50, perSide: true, equip: 'Wand', core: true,
    areas: ['Sprunggelenk'],
    benefit: 'Dein wichtigster Lauf-Limiter: Das Knie über die Zehen Richtung Wand schieben verbessert die Dorsalflexion — ohne sie kein runder Abrollschritt, kein sauberer Squat, keine tiefe Hocke.',
    how: ['Halber Kniestand vor der Wand, Fuß eine Handbreit entfernt', 'Knie langsam über die Zehen Richtung Wand schieben', 'Ferse bleibt zwingend am Boden'],
    accent: [104, 182],
    props: [['line', 64, 50, 64, 196]],
    poseA: { h: [124, 66], n: [128, 88], p: [150, 140], b: 4, aL: [[100, 100], [66, 96]], aR: [[104, 104], [68, 102]], lL: [[110, 150], [104, 196]], lR: [[196, 172], [244, 178]] },
    poseB: { h: [116, 70], n: [122, 92], p: [148, 142], b: 4, aL: [[96, 102], [66, 100]], aR: [[100, 106], [68, 106]], lL: [[96, 148], [104, 196]], lR: [[196, 172], [244, 178]] }
  },
  {
    id: 'zehen-fersen', block: 3, name: 'Zehen-Fersen-Wechsel', dose: '12 Wdh.', secs: 40, perSide: false, equip: null,
    areas: ['Fuß', 'Sprunggelenk'],
    benefit: 'Der Wechsel zwischen Zehen- und Fersenstand weckt Füße und Schienbeine auf — die Basis für Balance und einen aktiven Fußabdruck.',
    how: ['Hüftbreit stehen', 'Hoch auf die Zehenspitzen, kurz halten', 'Zurück und auf die Fersen rollen, Zehen ziehen hoch'],
    accent: [160, 190],
    poseA: { h: [160, 30], n: [160, 52], p: [160, 116], b: 0, aL: [[149, 84], [145, 110]], aR: [[171, 84], [175, 110]], lL: [[154, 152], [151, 190]], lR: [[166, 152], [169, 190]] },
    poseB: { h: [160, 34], n: [160, 56], p: [160, 120], b: -3, aL: [[149, 88], [145, 114]], aR: [[171, 88], [175, 114]], lL: [[154, 156], [157, 194]], lR: [[166, 156], [175, 194]] }
  },
  {
    id: 'grosszehen', block: 3, name: 'Großzehen-Mobilisation', dose: '10 Wdh. je Seite', secs: 45, perSide: true, equip: null,
    areas: ['Fuß'],
    benefit: 'Die Großzehe braucht beim Laufen rund 60 Grad Streckung für den Abdruck — hat sie die nicht, weicht dein ganzer Schritt aus. Diese Übung gibt sie dir zurück.',
    how: ['Halber Kniestand, hinterer Fuß auf den Zehen aufgestellt', 'Gewicht sanft nach vorn verlagern — Dehnung unter der Großzehe', 'Langsam vor und zurück wippen'],
    accent: [246, 186],
    poseA: { h: [124, 66], n: [128, 88], p: [150, 140], b: 4, aL: [[124, 116], [112, 136]], aR: [[128, 120], [116, 140]], lL: [[110, 150], [104, 196]], lR: [[198, 172], [246, 186]] },
    poseB: { h: [132, 68], n: [136, 90], p: [160, 138], b: 4, aL: [[130, 118], [118, 138]], aR: [[134, 122], [122, 142]], lL: [[114, 150], [104, 196]], lR: [[206, 170], [248, 184]] }
  },

  // ---------- Block 4 · Schultern & BWS ----------
  {
    id: 'banddurchzuege', block: 4, name: 'Banddurchzüge', dose: '8 Wdh.', secs: 50, perSide: false, equip: 'Dehnband',
    areas: ['Schulter'],
    benefit: 'Mit dem Band in einem großen Bogen über den Kopf: bewegt die Schultern durch ihren kompletten Radius und öffnet die Brust — das Gegenteil der Schreibtisch-Haltung.',
    how: ['Band breit greifen, Arme lang', 'In einem großen Bogen über den Kopf nach hinten führen', 'So eng greifen, wie es mit gestreckten Armen gerade geht'],
    accent: [160, 58],
    poseA: base({ aL: [[136, 100], [118, 128]], aR: [[142, 102], [124, 132]] }),
    poseB: base({ aL: [[146, 32], [128, 18]], aR: [[176, 32], [194, 20]] })
  },
  {
    id: 'wall-slides', block: 4, name: 'Wall Slides', dose: '8 Wdh.', secs: 45, perSide: false, equip: 'Wand',
    areas: ['Schulter', 'BWS'],
    benefit: 'Arme an der Wand nach oben schieben trainiert Schulterblattführung und BWS-Streckung gleichzeitig — die Haltungs-Übung schlechthin für Vielsitzer.',
    how: ['Rücken an die Wand, Unterarme in W-Position anlegen', 'Arme langsam an der Wand nach oben strecken', 'Unterarme und Handrücken bleiben so nah wie möglich an der Wand'],
    accent: [160, 58],
    poseA: base({ aL: [[128, 86], [124, 58]], aR: [[192, 86], [196, 58]], lL: [[150, 158], [144, 196]], lR: [[170, 158], [176, 196]] }),
    poseB: base({ aL: [[136, 42], [126, 16]], aR: [[184, 42], [194, 16]], lL: [[150, 158], [144, 196]], lR: [[170, 158], [176, 196]] })
  },
  {
    id: 'open-book', block: 4, name: 'Open Book', dose: '6 Wdh. je Seite', secs: 50, perSide: true, equip: null,
    areas: ['BWS'],
    benefit: 'In Seitlage den oberen Arm weit aufklappen rotiert die Brustwirbelsäule isoliert — mehr Rotation dort heißt: weniger Ausweichen über die Lendenwirbelsäule beim Laufen und Schwimmen.',
    how: ['Seitlage, Knie 90° übereinander, Arme gestapelt nach vorn', 'Oberen Arm wie ein Buch weit zur anderen Seite aufklappen', 'Blick folgt der Hand, Knie bleiben fest übereinander'],
    accent: [130, 140],
    poseA: { h: [86, 148], n: [108, 152], p: [190, 156], b: -6, aL: [[92, 168], [74, 182]], aR: [[94, 166], [76, 180]], lL: [[228, 150], [258, 172]], lR: [[232, 154], [262, 176]] },
    poseB: { h: [92, 140], n: [110, 150], p: [190, 156], b: -6, aL: [[92, 168], [74, 182]], aR: [[132, 118], [152, 94]], lL: [[228, 150], [258, 172]], lR: [[232, 154], [262, 176]] }
  },
  {
    id: 'pull-aparts', block: 4, name: 'Band Pull-Aparts', dose: '12 Wdh.', secs: 40, perSide: false, equip: 'Dehnband',
    areas: ['Schulter', 'Rumpf'],
    benefit: 'Das Band vor der Brust auseinanderziehen aktiviert den oberen Rücken — die Muskulatur, die dich aufrecht hält und die beim Sitzen verkümmert.',
    how: ['Band schulterbreit vor der Brust greifen, Arme gestreckt', 'Band auseinanderziehen, bis es die Brust berührt', 'Schulterblätter bewusst zusammenziehen, langsam zurück'],
    accent: [160, 70],
    poseA: base({ aL: [[140, 86], [148, 64]], aR: [[180, 86], [172, 64]] }),
    poseB: base({ aL: [[118, 80], [86, 78]], aR: [[202, 80], [234, 78]] })
  },
  {
    id: 'schulter-cars', block: 4, name: 'Schulter-CARs', dose: '4 Kreise je Richtung/Seite', secs: 50, perSide: true, equip: null,
    areas: ['Schulter'],
    benefit: 'Ein Arm zeichnet langsam den größtmöglichen Kreis — hält die Schulterkapsel beweglich und deckt genau die Winkel ab, die Alltag und Krafttraining auslassen.',
    how: ['Aufrecht stehen, ein Arm gestreckt', 'So langsam und groß wie möglich einen Kreis zeichnen', 'Rumpf fest — nur die Schulter bewegt sich'],
    accent: [160, 58],
    poseA: base({ aL: [[142, 44], [150, 20]] }),
    poseB: base({ aL: [[178, 86], [196, 120]] })
  },
  {
    id: 'bws-streckung', block: 4, name: 'BWS-Streckung über Kante', dose: '8 Wdh.', secs: 50, perSide: false, equip: 'Plyobox',
    areas: ['BWS'],
    benefit: 'Ellbogen auf der Box, Brustkorb Richtung Boden sinken lassen: streckt gezielt die Brustwirbelsäule — die Region, die vom Sitzen am rundesten wird.',
    how: ['Kniend die Ellbogen auf Box oder Stuhl legen', 'Brustkorb zwischen den Armen Richtung Boden sinken lassen', 'Kurz halten, zurück in den runden Rücken, wiederholen'],
    accent: [150, 128],
    props: [['rect', 52, 140, 66, 56]],
    poseA: { h: [132, 118], n: [142, 124], p: [210, 138], b: -6, aL: [[100, 138], [80, 144]], aR: [[106, 142], [86, 148]], lL: [[224, 180], [266, 184]], lR: [[230, 182], [272, 186]] },
    poseB: { h: [130, 134], n: [140, 136], p: [210, 138], b: -16, aL: [[100, 140], [80, 146]], aR: [[106, 144], [86, 150]], lL: [[224, 180], [266, 184]], lR: [[230, 182], [272, 186]] }
  },

  {
    id: 'handgelenke', block: 4, name: 'Handgelenk-Mobilisation im Stütz', dose: '8 Wdh. je Richtung', secs: 45, perSide: false, equip: null,
    areas: ['Handgelenk', 'Unterarm'],
    benefit: 'Handgelenke tragen dich bei Stütz, Liegestütz und Dips — und tippen sonst nur. Belastete Kreise und Gewichtsverlagerungen im Vierfüßlerstand machen sie belastbar und beweglich.',
    how: ['Vierfüßlerstand, Hände flach, Finger zeigen erst nach vorn', 'Gewicht langsam vor, zurück und zur Seite verlagern', 'Dann Fingerspitzen zu dir drehen und sanft zurücklehnen'],
    accent: [122, 168],
    poseA: { h: [110, 96], n: [124, 92], p: [204, 94], b: 0, aL: [[122, 130], [120, 166]], aR: [[128, 132], [126, 168]], lL: [[214, 164], [258, 170]], lR: [[220, 166], [264, 172]] },
    poseB: { h: [98, 100], n: [114, 96], p: [196, 96], b: 0, aL: [[114, 132], [118, 166]], aR: [[120, 134], [124, 168]], lL: [[210, 164], [256, 170]], lR: [[216, 166], [262, 172]] }
  },

  // ---------- Block 5 · Aktivierung ----------
  {
    id: 'glute-bridge', block: 5, name: 'Glute Bridge', dose: '12 Wdh.', secs: 45, perSide: false, equip: null,
    areas: ['Gesäß', 'Rumpf'],
    benefit: 'Schaltet das Gesäß ein, das beim Sitzen den ganzen Tag abgeschaltet ist — ein waches Gesäß entlastet den unteren Rücken und ist dein Motor beim Laufen.',
    how: ['Rückenlage, Füße hüftbreit aufgestellt', 'Becken anheben, bis Knie–Hüfte–Schulter eine Linie bilden', 'Oben das Gesäß 2 Sekunden bewusst anspannen'],
    accent: [174, 158],
    poseA: { h: [70, 182], n: [92, 180], p: [172, 178], b: -4, aL: [[112, 188], [132, 192]], aR: [[118, 188], [138, 192]], lL: [[204, 142], [218, 192]], lR: [[210, 146], [224, 194]] },
    poseB: { h: [70, 182], n: [94, 178], p: [176, 140], b: -8, aL: [[112, 188], [132, 192]], aR: [[118, 188], [138, 192]], lL: [[206, 138], [218, 192]], lR: [[212, 142], [224, 194]] }
  },
  {
    id: 'bird-dog', block: 5, name: 'Bird Dog', dose: '6 Wdh. je Seite', secs: 50, perSide: true, equip: null,
    areas: ['Rumpf', 'Gesäß'],
    benefit: 'Arm und Gegenbein gleichzeitig strecken zwingt den Rumpf, das Becken stabil zu halten — genau die Stabilität, die dich beim Laufen effizient macht.',
    how: ['Vierfüßlerstand, Rücken neutral', 'Einen Arm nach vorn, das Gegenbein nach hinten strecken', 'Becken bleibt waagerecht — nichts kippt zur Seite'],
    accent: [165, 95],
    poseA: { h: [110, 96], n: [124, 92], p: [204, 94], b: 0, aL: [[122, 130], [120, 166]], aR: [[128, 132], [126, 168]], lL: [[214, 164], [258, 170]], lR: [[220, 166], [264, 172]] },
    poseB: { h: [104, 90], n: [122, 92], p: [204, 94], b: 0, aL: [[90, 86], [58, 84]], aR: [[128, 132], [126, 168]], lL: [[214, 164], [258, 170]], lR: [[262, 94], [302, 92]] }
  },
  {
    id: 'hocke-halten', block: 5, name: 'Tiefe Hocke halten', dose: '40 Sek.', secs: 40, perSide: false, equip: null,
    areas: ['Hüfte', 'Sprunggelenk', 'Rumpf'],
    benefit: 'Die tiefe Hocke war jahrtausendelang eine normale Ruheposition. Täglich gehalten ist sie dein bester Indikator für Sprunggelenk- und Hüftbeweglichkeit — wird sie leichter, wirkt das Programm.',
    how: ['So tief wie möglich in die Hocke, Fersen am Boden', 'Brust aufrecht, Atmung ruhig weiterlaufen lassen', 'Zu schwer? Fersen auf ein gefaltetes Handtuch stellen'],
    accent: [168, 152],
    poseA: { h: [152, 90], n: [156, 108], p: [170, 156], b: 8, aL: [[130, 120], [114, 132]], aR: [[136, 122], [120, 134]], lL: [[116, 154], [106, 196]], lR: [[128, 158], [120, 196]] },
    poseB: { h: [154, 92], n: [158, 110], p: [174, 158], b: 8, aL: [[132, 122], [116, 134]], aR: [[138, 124], [122, 136]], lL: [[118, 156], [108, 196]], lR: [[130, 160], [122, 196]] }
  },
  {
    id: 'dead-bug', block: 5, name: 'Dead Bug', dose: '8 Wdh. im Wechsel', secs: 45, perSide: false, equip: null,
    areas: ['Rumpf'],
    benefit: 'Arme und Beine bewegen, während der untere Rücken am Boden bleibt: baut die tiefe Rumpfspannung auf, die deine Wirbelsäule bei allem anderen schützt.',
    how: ['Rückenlage, Arme senkrecht hoch, Beine im 90°-Winkel', 'Einen Arm und das Gegenbein langsam Richtung Boden strecken', 'Unterer Rücken bleibt die ganze Zeit am Boden'],
    accent: [140, 160],
    poseA: { h: [70, 182], n: [92, 180], p: [172, 178], b: 0, aL: [[96, 150], [98, 122]], aR: [[102, 152], [104, 124]], lL: [[196, 140], [232, 142]], lR: [[202, 144], [238, 146]] },
    poseB: { h: [70, 182], n: [92, 180], p: [172, 178], b: 0, aL: [[64, 158], [42, 174]], aR: [[102, 152], [104, 124]], lL: [[196, 140], [232, 142]], lR: [[226, 160], [268, 172]] }
  },
  {
    id: 'seitschritte-band', block: 5, name: 'Seitschritte mit Band', dose: '10 Schritte hin und zurück', secs: 45, perSide: false, equip: 'Dehnband',
    areas: ['Gesäß', 'Hüfte'],
    benefit: 'Band um die Beine, seitlich gehen: weckt die Hüftabduktoren — die kleinen Gesäßmuskeln, die eine stabile Beinachse beim Laufen unterstützen.',
    how: ['Band um die Unterschenkel knoten, leichte Kniebeuge', 'Kontrollierte Schritte zur Seite, Spannung halten', 'Füße zeigen nach vorn, Oberkörper ruhig'],
    accent: [160, 126],
    poseA: { h: [160, 44], n: [160, 66], p: [160, 126], b: 0, aL: [[136, 96], [122, 84]], aR: [[184, 96], [198, 84]], lL: [[146, 158], [138, 196]], lR: [[174, 158], [182, 196]] },
    poseB: { h: [160, 44], n: [160, 66], p: [160, 126], b: 0, aL: [[136, 96], [122, 84]], aR: [[184, 96], [198, 84]], lL: [[128, 156], [104, 194]], lR: [[192, 156], [216, 194]] }
  },
  {
    id: 'plank-push', block: 5, name: 'Plank mit Schulterblatt-Push', dose: '30 Sek.', secs: 40, perSide: false, equip: null,
    areas: ['Schulter', 'Rumpf'],
    benefit: 'Im Stütz die Schulterblätter aktiv auseinanderschieben stabilisiert den Schultergürtel — die Grundlage für Dips, Liegestütze und eine belastbare Schwimm-Schulter.',
    how: ['Hoher Stütz, Hände unter den Schultern', 'Schulterblätter zusammenziehen und aktiv auseinanderschieben', 'Körper bleibt dabei eine gerade Linie'],
    accent: [110, 130],
    poseA: { h: [74, 126], n: [96, 132], p: [186, 140], b: -4, aL: [[100, 164], [102, 196]], aR: [[106, 166], [108, 196]], lL: [[234, 156], [284, 174]], lR: [[240, 158], [290, 176]] },
    poseB: { h: [76, 116], n: [96, 124], p: [186, 136], b: -12, aL: [[100, 160], [102, 196]], aR: [[106, 162], [108, 196]], lL: [[234, 154], [284, 172]], lR: [[240, 156], [290, 174]] }
  },

  // ================= ABENDROUTINE =================
  // ---------- Block 6 · Ankommen & Atmen ----------
  {
    id: 'abend-atmung', block: 6, name: '4-6-Atmung in Rückenlage', dose: '8 Atemzüge', secs: 60, perSide: false, equip: null,
    areas: ['Atmung'],
    benefit: 'Länger aus- als einatmen (4 Sek. ein, 6 Sek. aus) hilft dem Nervensystem, in den Ruhemodus zu wechseln — ein guter Einstieg, um die folgenden Dehnungen ruhig anzunehmen, und ein bewährtes Einschlaf-Ritual.',
    how: ['Rückenlage, Knie aufgestellt, Hände auf den Bauch', '4 Sekunden durch die Nase ein — der Bauch hebt sich', '6 Sekunden lang aus, Schultern schwer werden lassen'],
    accent: [130, 165],
    poseA: { h: [70, 182], n: [92, 180], p: [172, 178], b: 0, aL: [[112, 168], [132, 164]], aR: [[118, 170], [138, 166]], lL: [[204, 142], [218, 192]], lR: [[210, 146], [224, 194]] },
    poseB: { h: [70, 182], n: [92, 178], p: [172, 178], b: -3, aL: [[112, 164], [132, 160]], aR: [[118, 166], [138, 162]], lL: [[204, 142], [218, 192]], lR: [[210, 146], [224, 194]] }
  },
  {
    id: 'knie-zur-brust', block: 6, name: 'Knie zur Brust schaukeln', dose: '45 Sek.', secs: 45, perSide: false, equip: null,
    areas: ['Lendenwirbelsäule'],
    benefit: 'Beide Knie umarmen und sanft schaukeln massiert die Lendenwirbelsäule und löst die Spannung, die sich dort über den Tag ansammelt.',
    how: ['Rückenlage, beide Knie zur Brust ziehen', 'Mit den Armen umarmen', 'Langsam vor-zurück oder seitlich schaukeln'],
    accent: [148, 172],
    poseA: { h: [80, 168], n: [100, 174], p: [168, 174], b: 14, aL: [[124, 152], [142, 130]], aR: [[130, 156], [148, 134]], lL: [[150, 116], [114, 132]], lR: [[156, 120], [120, 136]] },
    poseB: { h: [86, 167], n: [106, 173], p: [173, 173], b: 14, aL: [[129, 152], [147, 131]], aR: [[135, 156], [153, 135]], lL: [[155, 116], [119, 133]], lR: [[161, 120], [125, 137]] }
  },

  // ---------- Block 7 · Beinrückseite & Hüfte ----------
  {
    id: 'hamstring-band', block: 7, name: 'Liegende Beinrückseiten-Dehnung', dose: '45 Sek. je Seite', secs: 90, perSide: true, equip: 'Dehnband', core: true, pnf: true,
    areas: ['Beinrückseite'],
    benefit: 'Deine wichtigste Abend-Übung auf dem Weg zu den Zehen: Im Liegen mit dem Band ist die Beinrückseite völlig sicher gelagert und kann lange, entspannte Dehnung annehmen — genau so entsteht echter Längenzuwachs.',
    how: ['Rückenlage, Band um den Fußballen', 'Bein gestreckt Richtung Decke ziehen, bis es deutlich zieht', 'Atmung ruhig — mit jedem Ausatmen einen Hauch weiter'],
    accent: [148, 100],
    props: [['line', 136, 116, 148, 92]],
    poseA: { h: [70, 182], n: [92, 180], p: [170, 178], b: 0, aL: [[118, 152], [134, 118]], aR: [[124, 156], [140, 122]], lL: [[158, 128], [150, 94]], lR: [[226, 158], [268, 176]] },
    poseB: { h: [70, 182], n: [92, 180], p: [170, 178], b: 0, aL: [[116, 148], [130, 112]], aR: [[122, 152], [136, 116]], lL: [[152, 124], [140, 90]], lR: [[226, 158], [268, 176]] }
  },
  {
    id: 'figure-4', block: 7, name: 'Liegende Taube (Figure 4)', dose: '45 Sek. je Seite', secs: 90, perSide: true, equip: null, pnf: true,
    areas: ['Gesäß', 'Hüfte'],
    benefit: 'Dehnt Gesäß und tiefe Hüftrotatoren — die Muskeln, die vom Sitzen fest werden und beim Laufen oft ins Knie oder in den unteren Rücken ausstrahlen.',
    how: ['Rückenlage, einen Knöchel aufs andere Knie legen', 'Das untere Bein anheben und den Oberschenkel zu dir ziehen', 'Knie des oberen Beins sanft von dir wegdrücken'],
    accent: [178, 150],
    poseA: { h: [70, 182], n: [92, 180], p: [168, 176], b: 0, aL: [[124, 148], [156, 138]], aR: [[130, 152], [162, 142]], lL: [[196, 134], [214, 158]], lR: [[184, 146], [158, 132]] },
    poseB: { h: [70, 182], n: [92, 180], p: [168, 176], b: 0, aL: [[122, 146], [152, 134]], aR: [[128, 150], [158, 138]], lL: [[192, 130], [210, 154]], lR: [[180, 142], [154, 128]] }
  },
  {
    id: 'couch-stretch', block: 7, name: 'Couch Stretch', dose: '45 Sek. je Seite', secs: 90, perSide: true, equip: 'Plyobox/Sofa', core: true,
    areas: ['Hüfte', 'Oberschenkel'],
    benefit: 'Die intensivste Hüftbeuger-Dehnung: hinterer Fuß erhöht, Becken aufgerichtet. Genau das Gegenteil deiner Sitzhaltung — und der Schlüssel zu einer vollen Hüftstreckung beim Laufen.',
    how: ['Kniestand vor Plyobox oder Sofa, hinteres Schienbein an die Kante', 'Becken einrollen und aufrichten, dann leicht nach vorn', 'Gesäß der hinteren Seite anspannen — das vertieft die Dehnung'],
    accent: [176, 140],
    props: [['rect', 240, 138, 56, 58]],
    poseA: { h: [150, 58], n: [152, 80], p: [174, 140], b: 4, aL: [[140, 110], [132, 136]], aR: [[146, 112], [138, 138]], lL: [[120, 152], [108, 196]], lR: [[228, 182], [258, 144]] },
    poseB: { h: [156, 56], n: [158, 78], p: [182, 138], b: 6, aL: [[146, 108], [138, 134]], aR: [[152, 110], [144, 136]], lL: [[124, 152], [108, 196]], lR: [[232, 180], [258, 144]] }
  },
  {
    id: 'schmetterling', block: 7, name: 'Schmetterling', dose: '60 Sek.', secs: 60, perSide: false, equip: null, pnf: true,
    areas: ['Adduktoren', 'Hüfte'],
    benefit: 'Fußsohlen zusammen, Knie sinken lassen: öffnet Leiste und Innenseiten der Oberschenkel — eine Region, die Radfahren und Sitzen gleichermaßen verkürzen.',
    how: ['Aufrecht sitzen, Fußsohlen aneinander', 'Fersen so nah wie angenehm zum Körper', 'Knie schwer Richtung Boden sinken lassen, Rücken lang'],
    accent: [164, 152],
    poseA: { h: [160, 62], n: [160, 84], p: [164, 150], b: 2, aL: [[138, 128], [152, 166]], aR: [[144, 130], [158, 168]], lL: [[112, 158], [150, 172]], lR: [[216, 160], [178, 174]] },
    poseB: { h: [158, 68], n: [158, 90], p: [164, 152], b: 6, aL: [[136, 132], [150, 168]], aR: [[142, 134], [156, 170]], lL: [[110, 162], [150, 174]], lR: [[218, 164], [178, 176]] }
  },
  {
    id: 'happy-baby', block: 7, name: 'Happy Baby', dose: '45 Sek.', secs: 45, perSide: false, equip: null,
    areas: ['Hüfte', 'Lendenwirbelsäule'],
    benefit: 'Öffnet die Hüfte in der Tiefe und entspannt gleichzeitig den unteren Rücken — eine der wohltuendsten Positionen nach einem langen Sitztag.',
    how: ['Rückenlage, Knie weit zur Brust, Füße greifen', 'Knie Richtung Achseln ziehen, Fußsohlen zur Decke', 'Sanft seitlich schaukeln erlaubt'],
    accent: [168, 165],
    poseA: { h: [70, 182], n: [92, 180], p: [168, 174], b: -4, aL: [[126, 142], [168, 112]], aR: [[132, 146], [174, 116]], lL: [[186, 130], [170, 104]], lR: [[194, 134], [178, 108]] },
    poseB: { h: [70, 182], n: [92, 180], p: [172, 174], b: -4, aL: [[130, 142], [172, 112]], aR: [[136, 146], [178, 116]], lL: [[190, 130], [174, 104]], lR: [[198, 134], [182, 108]] }
  },
  {
    id: 'vorbeuge-band', block: 7, name: 'Sitzende Vorbeuge', dose: '60 Sek.', secs: 60, perSide: false, equip: 'Dehnband', pnf: true,
    areas: ['Beinrückseite', 'Rücken'],
    benefit: 'Die Zehen-Berührung im Sitzen geübt: Das Band um die Füße lässt dich entspannt in die Vorbeuge sinken, ohne zu reißen. Dein Fortschritts-Test — jede Woche ein Stück weiter.',
    how: ['Langsitz, Band um beide Fußballen', 'Mit langem Rücken aus der Hüfte nach vorn neigen', 'Dort atmen, wo es zieht — nicht federn, nur sinken'],
    accent: [110, 158],
    props: [['line', 66, 168, 104, 148]],
    poseA: { h: [128, 84], n: [140, 102], p: [176, 156], b: 8, aL: [[112, 128], [102, 148]], aR: [[118, 130], [108, 150]], lL: [[116, 162], [64, 170]], lR: [[122, 166], [70, 174]] },
    poseB: { h: [118, 94], n: [132, 110], p: [176, 156], b: 12, aL: [[106, 132], [98, 150]], aR: [[112, 134], [104, 152]], lL: [[116, 162], [64, 170]], lR: [[122, 166], [70, 174]] }
  },

  {
    id: 'gastroc-wand', block: 7, name: 'Wadendehnung gestreckt an der Wand', dose: '45 Sek. je Seite', secs: 90, perSide: true, equip: 'Wand', pnf: true,
    areas: ['Waden', 'Sprunggelenk'],
    benefit: 'Die Ankle Rocks am Morgen arbeiten mit gebeugtem Knie — hier kommt die zweite Hälfte: Mit gestrecktem Knie erreicht die Dehnung den oberen Wadenmuskel. Beides zusammen löst dein Dorsalflexions-Defizit.',
    how: ['Hände an die Wand, ein Bein weit nach hinten', 'Hinteres Knie gestreckt, Ferse fest am Boden, Fuß zeigt gerade nach vorn', 'Hüfte Richtung Wand schieben, bis es in der Wade zieht'],
    accent: [252, 190],
    props: [['line', 60, 44, 60, 196]],
    poseA: { h: [126, 52], n: [132, 74], p: [166, 124], b: 4, aL: [[96, 92], [62, 88]], aR: [[100, 96], [62, 94]], lL: [[130, 152], [116, 196]], lR: [[208, 158], [250, 194]] },
    poseB: { h: [120, 54], n: [126, 76], p: [160, 126], b: 4, aL: [[92, 94], [62, 92]], aR: [[96, 98], [62, 98]], lL: [[126, 152], [114, 196]], lR: [[204, 160], [250, 194]] }
  },
  {
    id: 'ischias-slider', block: 7, name: 'Ischiasnerv-Slider', dose: '10 Wdh. je Seite', secs: 70, perSide: true, equip: 'Stuhl/Box',
    areas: ['Beinrückseite', 'Nervensystem'],
    benefit: 'Wenn das Vorbeugen stark limitiert ist, bremst oft die Spannung des Ischiasnervs, nicht der Muskel. Slider bewegen den Nerv sanft durch sein Gleitlager — ohne Ziehen, ohne Halten. Wichtig: Es darf dabei nie kribbeln.',
    how: ['Aufrecht auf Box/Stuhl sitzen, leicht lümmeln', 'Knie strecken und GLEICHZEITIG den Blick heben', 'Knie beugen und gleichzeitig einrollen — fließender Wechsel, nie in den Zug'],
    accent: [130, 152],
    props: [['rect', 176, 150, 84, 46]],
    poseA: { h: [206, 62], n: [204, 84], p: [214, 148], b: 4, aL: [[228, 122], [240, 148]], aR: [[234, 126], [246, 152]], lL: [[164, 164], [158, 196]], lR: [[196, 168], [190, 196]] },
    poseB: { h: [200, 58], n: [200, 82], p: [214, 148], b: 2, aL: [[226, 122], [238, 148]], aR: [[232, 126], [244, 152]], lL: [[152, 154], [112, 146]], lR: [[196, 168], [190, 196]] }
  },
  {
    id: 'quad-seitenlage', block: 7, name: 'Quadrizeps-Dehnung in Seitenlage', dose: '45 Sek. je Seite', secs: 90, perSide: true, equip: null,
    areas: ['Oberschenkel', 'Hüfte'],
    benefit: 'Die sanfte Einstiegsvariante zum Couch Stretch: In Seitenlage den Fuß zum Gesäß ziehen dehnt die Oberschenkel-Vorderseite, ohne das Becken zu zwingen — ideal, solange der Couch Stretch noch zu intensiv ist.',
    how: ['Seitenlage, unteres Bein leicht angewinkelt für Stabilität', 'Oberen Fuß greifen und Richtung Gesäß ziehen', 'Becken leicht einrollen — der Zug wandert in den vorderen Oberschenkel'],
    accent: [190, 160],
    poseA: { h: [70, 166], n: [92, 168], p: [172, 172], b: -4, aL: [[124, 148], [168, 142]], aR: [[100, 186], [122, 190]], lL: [[202, 152], [176, 138]], lR: [[218, 176], [260, 182]] },
    poseB: { h: [70, 166], n: [92, 168], p: [172, 172], b: -4, aL: [[126, 146], [172, 140]], aR: [[100, 186], [122, 190]], lL: [[206, 150], [180, 134]], lR: [[218, 176], [260, 182]] }
  },

  // ---------- Block 8 · Rücken & Rotation ----------
  {
    id: 'twist', block: 8, name: 'Liegender Twist', dose: '45 Sek. je Seite', secs: 90, perSide: true, equip: null,
    areas: ['Wirbelsäule', 'BWS'],
    benefit: 'Die abgelegten Knie rotieren die gesamte Wirbelsäule passiv und schwer — löst den Rücken nach dem Tag und dehnt nebenbei Gesäß und Brustkorb.',
    how: ['Rückenlage, Knie angewinkelt zur Seite ablegen', 'Beide Schultern bleiben am Boden', 'Arme im T, Blick zur Gegenseite'],
    accent: [150, 150],
    poseA: { h: [70, 178], n: [92, 176], p: [168, 172], b: 0, aL: [[110, 150], [96, 126]], aR: [[120, 190], [140, 192]], lL: [[148, 186], [116, 190]], lR: [[154, 182], [122, 186]] },
    poseB: { h: [70, 178], n: [92, 176], p: [168, 172], b: 0, aL: [[106, 148], [90, 122]], aR: [[120, 190], [140, 192]], lL: [[144, 188], [112, 192]], lR: [[150, 184], [118, 188]] }
  },
  {
    id: 'kindhaltung', block: 8, name: 'Kindhaltung, lang atmen', dose: '60 Sek.', secs: 60, perSide: false, equip: null,
    areas: ['Rücken', 'Schulter'],
    benefit: 'Der Klassiker zum Loslassen: dehnt den ganzen Rücken und die Schultern, während das Gewicht auf den Oberschenkeln ruht — perfekt, um tief in den Bauch zu atmen.',
    how: ['Fersensitz, Knie etwas geöffnet', 'Oberkörper nach vorn ablegen, Arme lang', 'In den unteren Rücken atmen, Stirn entspannt'],
    accent: [150, 125],
    poseA: { h: [92, 128], n: [112, 120], p: [196, 152], b: -18, aL: [[74, 150], [50, 176]], aR: [[80, 152], [56, 178]], lL: [[218, 178], [258, 184]], lR: [[224, 180], [264, 186]] },
    poseB: { h: [90, 132], n: [110, 124], p: [196, 154], b: -16, aL: [[72, 152], [48, 178]], aR: [[78, 154], [54, 180]], lL: [[218, 178], [258, 184]], lR: [[224, 180], [264, 186]] }
  },
  {
    id: 'seitdehnung-sitz', block: 8, name: 'Sitzende Seitdehnung', dose: '30 Sek. je Seite', secs: 60, perSide: true, equip: null,
    areas: ['Rumpf', 'Rücken'],
    benefit: 'Verlängert die seitliche Rumpfkette in Ruhe — mehr Platz zum Atmen und ein Ausgleich für die zusammengesunkene Sitzhaltung.',
    how: ['Schneidersitz, eine Hand stützt seitlich', 'Anderen Arm über den Kopf zur Gegenseite ziehen', 'Beide Sitzbeinhöcker bleiben am Boden'],
    accent: [172, 110],
    poseA: { h: [178, 62], n: [172, 82], p: [162, 150], b: 8, aL: [[196, 52], [216, 42]], aR: [[196, 130], [214, 152]], lL: [[116, 164], [156, 176]], lR: [[210, 166], [170, 178]] },
    poseB: { h: [186, 66], n: [178, 86], p: [162, 150], b: 12, aL: [[204, 54], [226, 46]], aR: [[198, 132], [216, 154]], lL: [[116, 164], [156, 176]], lR: [[210, 166], [170, 178]] }
  },

  // ---------- Block 9 · Brust & Nacken ----------
  {
    id: 'brust-boden', block: 9, name: 'Brustöffner am Boden', dose: '40 Sek. je Seite', secs: 80, perSide: true, equip: null,
    areas: ['Brust', 'Schulter'],
    benefit: 'In Bauchlage mit ausgestrecktem Arm aufrollen dehnt Brustmuskel und vordere Schulter — die Muskeln, die dich den ganzen Tag nach vorn ziehen.',
    how: ['Bauchlage, einen Arm im rechten Winkel zur Seite', 'Über die Gegenseite langsam aufdrehen, ggf. Knie aufstellen', 'Dehnung vorn in Brust/Schulter zulassen, ruhig atmen'],
    accent: [120, 155],
    poseA: { h: [74, 172], n: [96, 174], p: [176, 178], b: 4, aL: [[68, 158], [46, 150]], aR: [[118, 186], [140, 188]], lL: [[216, 168], [258, 180]], lR: [[222, 172], [264, 184]] },
    poseB: { h: [76, 166], n: [98, 170], p: [176, 176], b: 6, aL: [[66, 150], [44, 140]], aR: [[118, 184], [140, 186]], lL: [[214, 160], [252, 176]], lR: [[222, 172], [264, 184]] }
  },
  {
    id: 'nacken', block: 9, name: 'Nackendehnung seitlich', dose: '30 Sek. je Seite', secs: 60, perSide: true, equip: null,
    areas: ['Nacken'],
    benefit: 'Löst den oberen Trapezmuskel — die klassische Bildschirm-Verspannung zwischen Schulter und Ohr, oft die Quelle von Spannungskopfschmerz.',
    how: ['Aufrecht sitzen, eine Hand zieht den Kopf sanft zur Seite', 'Gegenschulter aktiv Richtung Boden schieben', 'Nur Eigengewicht des Arms — nicht reißen'],
    accent: [166, 44],
    poseA: base({ h: [166, 40], aL: [[152, 36], [176, 46]], aR: [[176, 96], [182, 122]] }),
    poseB: base({ h: [172, 44], aL: [[156, 38], [182, 50]], aR: [[178, 98], [186, 124]] })
  },

  {
    id: 'lat-box', block: 9, name: 'Lat-Dehnung kniend an der Box', dose: '60 Sek.', secs: 60, perSide: false, equip: 'Plyobox',
    areas: ['Lat', 'Schulter'],
    benefit: 'Der breite Rückenmuskel begrenzt deine Überkopf-Beweglichkeit — entscheidend für den Armzug beim Schwimmen und alles über Kopf. Kniend mit langen Armen auf der Box lässt er sich gezielt in die Länge ziehen.',
    how: ['Kniend vor der Plyobox, beide Hände auf die Kante', 'Arme lang, Brustkorb zwischen den Armen Richtung Boden sinken lassen', 'Für mehr Zug: Hüfte leicht nach hinten schieben und tief atmen'],
    accent: [140, 120],
    props: [['rect', 40, 130, 72, 66]],
    poseA: { h: [136, 108], n: [146, 114], p: [214, 138], b: -10, aL: [[96, 124], [50, 130]], aR: [[102, 128], [56, 134]], lL: [[228, 180], [270, 184]], lR: [[234, 182], [276, 186]] },
    poseB: { h: [134, 120], n: [144, 124], p: [216, 140], b: -18, aL: [[94, 130], [50, 132]], aR: [[100, 134], [56, 136]], lL: [[228, 180], [270, 184]], lR: [[234, 182], [276, 186]] }
  },

  // ---------- Block 10 · Abschluss ----------
  {
    id: 'beine-wand', block: 10, name: 'Beine an die Wand', dose: '90 Sek.', secs: 90, perSide: false, equip: 'Wand',
    areas: ['Erholung', 'Beinrückseite'],
    benefit: 'Beine hoch an der Wand entlastet müde Beine spürbar und ist ein ruhiges Abschluss-Ritual zum Runterfahren — besonders angenehm nach Lauf- oder Radtagen.',
    how: ['Gesäß nah an die Wand, Beine anlehnen', 'Arme entspannt neben den Körper', 'Augen zu, nur atmen'],
    accent: [220, 140],
    props: [['line', 240, 40, 240, 196]],
    poseA: { h: [70, 182], n: [92, 180], p: [186, 176], b: 0, aL: [[116, 188], [136, 190]], aR: [[122, 188], [142, 190]], lL: [[216, 128], [234, 82]], lR: [[222, 132], [238, 86]] },
    poseB: { h: [70, 182], n: [92, 180], p: [186, 176], b: 0, aL: [[114, 186], [134, 188]], aR: [[120, 186], [140, 188]], lL: [[216, 128], [234, 82]], lR: [[222, 132], [238, 86]] }
  },
  {
    id: 'sternenlage', block: 10, name: 'Ausklang in Rückenlage', dose: '60 Sek.', secs: 60, perSide: false, equip: null,
    areas: ['Erholung', 'Atmung'],
    benefit: 'Eine Minute nichts tun, schwer werden, nachspüren — das signalisiert deinem Körper: Der Tag ist erledigt. Ein ruhiger Übergang Richtung Schlaf.',
    how: ['Rückenlage, Beine lang, Arme leicht geöffnet', 'Mit jedem Ausatmen bewusst schwerer werden', 'Gedanken kommen lassen und weiterziehen lassen'],
    accent: [130, 170],
    poseA: { h: [70, 182], n: [92, 180], p: [172, 178], b: 0, aL: [[114, 190], [136, 192]], aR: [[120, 190], [142, 192]], lL: [[214, 176], [262, 180]], lR: [[220, 178], [268, 182]] },
    poseB: { h: [70, 182], n: [92, 179], p: [172, 178], b: -2, aL: [[114, 189], [136, 191]], aR: [[120, 189], [142, 191]], lL: [[214, 176], [262, 180]], lR: [[220, 178], [268, 182]] }
  },

  // ================= ENDGRAD-KRAFT =================
  // ---------- Block 11 · Beine · Endgrad ----------
  {
    id: 'atg-split-squat', block: 11, name: 'ATG Split Squat', dose: '3×8 je Seite', secs: 180, perSide: true, equip: null, core: true,
    areas: ['Sprunggelenk', 'Hüfte', 'Oberschenkel'],
    benefit: 'Die Königsübung für dein Sprunggelenk: Das vordere Knie wandert unter Last so weit wie möglich über die Zehen — das baut Beweglichkeit auf, die du auch halten kannst, weil Kraft am Endpunkt entsteht. Genau das fehlt reiner Dehnung.',
    how: ['Großer Ausfallschritt, Ferse vorn bleibt fest am Boden', 'Knie langsam so weit wie möglich über die Zehen schieben, Hüfte sinkt tief', 'Nur so tief, wie du kontrolliert wieder hochkommst — Steigerung über Wochen'],
    accent: [104, 148],
    poseA: { h: [148, 44], n: [150, 66], p: [168, 128], b: 4, aL: [[138, 96], [146, 116]], aR: [[160, 96], [168, 116]], lL: [[112, 146], [130, 196]], lR: [[220, 168], [262, 192]] },
    poseB: { h: [150, 56], n: [152, 78], p: [172, 138], b: 6, aL: [[140, 106], [148, 126]], aR: [[162, 106], [170, 126]], lL: [[106, 154], [130, 196]], lR: [[226, 172], [266, 194]] }
  },
  {
    id: 'deficit-rdl', block: 11, name: 'Deficit-RDL mit Hanteln', dose: '3×10', secs: 150, perSide: false, equip: 'Plyobox + Hanteln', core: true,
    areas: ['Beinrückseite', 'Gesäß', 'Rücken'],
    benefit: 'Hüftbeugen mit langem Rücken auf der Box: Die Hanteln ziehen dich tiefer, als du normal kommst — die Beinrückseite lernt Länge unter Last. Der schnellste belegte Weg zu einer nachhaltigen Vorbeuge.',
    how: ['Auf der Plyobox stehen, Hanteln in den Händen', 'Hüfte nach hinten schieben, Rücken bleibt lang — Hanteln an den Beinen entlang tief', 'So tief, wie der Rücken gerade bleibt, dann Gesäß anspannen und hoch'],
    accent: [178, 108],
    props: [['rect', 118, 180, 92, 16]],
    poseA: { h: [160, 20], n: [160, 42], p: [160, 106], b: 0, aL: [[149, 74], [145, 100]], aR: [[171, 74], [175, 100]], lL: [[154, 142], [151, 180]], lR: [[166, 142], [169, 180]] },
    poseB: { h: [92, 96], n: [108, 102], p: [178, 106], b: 10, aL: [[110, 136], [112, 170]], aR: [[116, 138], [118, 172]], lL: [[176, 142], [170, 180]], lR: [[182, 144], [176, 180]] }
  },
  {
    id: 'wadenheben-gestreckt', block: 11, name: 'Wadenheben gestreckt, volle Länge', dose: '3×12 langsam', secs: 150, perSide: false, equip: 'Plyobox', core: true,
    areas: ['Waden', 'Sprunggelenk'],
    benefit: 'Auf der Boxkante mit gestrecktem Knie durch die komplette Länge: unten tief einsinken, oben hoch hinaus. Baut die Wade exzentrisch auf — Beweglichkeit und Achillessehnen-Belastbarkeit in einer Übung.',
    how: ['Fußballen auf die Kante, Knie gestreckt, festhalten erlaubt', '3 Sekunden absinken, bis die Ferse deutlich unter der Kante ist', 'Kurz halten, dann kraftvoll so hoch wie möglich drücken'],
    accent: [160, 178],
    props: [['rect', 118, 180, 92, 16]],
    poseA: { h: [160, 24], n: [160, 46], p: [160, 110], b: 0, aL: [[149, 78], [145, 104]], aR: [[171, 78], [175, 104]], lL: [[154, 146], [151, 186]], lR: [[166, 146], [169, 186]] },
    poseB: { h: [160, 10], n: [160, 32], p: [160, 96], b: 0, aL: [[149, 64], [145, 90]], aR: [[171, 64], [175, 90]], lL: [[154, 134], [151, 174]], lR: [[166, 134], [169, 174]] }
  },
  {
    id: 'cossack-squat', block: 11, name: 'Cossack Squat', dose: '2×6 je Seite', secs: 120, perSide: true, equip: null,
    areas: ['Adduktoren', 'Hüfte', 'Sprunggelenk'],
    benefit: 'Tiefe seitliche Kniebeuge: ein Bein trägt, das andere streckt sich lang zur Seite — Innenschenkel und Hüfte arbeiten am Endgrad, statt nur gedehnt zu werden.',
    how: ['Breiter Stand, ein Bein beugen und tief zur Seite sinken', 'Das andere Bein bleibt gestreckt, Zehen zeigen zur Decke', 'Ferse des tiefen Beins am Boden lassen, Brust aufrecht'],
    accent: [136, 152],
    poseA: { h: [150, 70], n: [152, 92], p: [156, 144], b: 6, aL: [[128, 112], [110, 122]], aR: [[134, 114], [116, 124]], lL: [[120, 156], [110, 196]], lR: [[216, 170], [258, 190]] },
    poseB: { h: [146, 78], n: [148, 100], p: [150, 152], b: 6, aL: [[124, 118], [106, 128]], aR: [[130, 120], [112, 130]], lL: [[114, 162], [106, 196]], lR: [[218, 172], [262, 192]] }
  },

  // ---------- Block 12 · Rumpf & Stütz ----------
  {
    id: 'stuetz-dipstangen', block: 12, name: 'Stützhalte auf den Dipstangen', dose: '3×20 Sek.', secs: 120, perSide: false, equip: 'Dipstangen',
    areas: ['Schulter', 'Rumpf'],
    benefit: 'Der gestreckte Stütz auf deinen Dipstangen baut genau die Schulter- und Rumpfstabilität auf, die Schwimmen und Krafttraining brauchen — mit aktiven Schulterblatt-Drücken als Bonus.',
    how: ['Auf die Dipstangen stützen, Arme gestreckt, Körper ruhig', 'Schultern aktiv von den Ohren wegschieben', 'Halten und ruhig atmen; wer mag: kleine Schulterblatt-Dips'],
    accent: [160, 78],
    props: [['line', 104, 122, 104, 196], ['line', 216, 122, 216, 196]],
    poseA: { h: [160, 42], n: [160, 64], p: [160, 122], b: 0, aL: [[130, 92], [106, 120]], aR: [[190, 92], [214, 120]], lL: [[156, 154], [152, 184]], lR: [[164, 154], [168, 184]] },
    poseB: { h: [160, 36], n: [160, 58], p: [160, 116], b: 0, aL: [[130, 88], [106, 120]], aR: [[190, 88], [214, 120]], lL: [[156, 150], [152, 180]], lR: [[164, 150], [168, 180]] }
  },
  {
    id: 'jefferson-curl', block: 12, name: 'Jefferson Curl (leicht)', dose: '2×6 sehr langsam', secs: 120, perSide: false, equip: 'Hantel 5 kg + Plyobox',
    areas: ['Wirbelsäule', 'Beinrückseite'],
    benefit: 'Wirbel für Wirbel mit leichtem Gewicht in die Vorbeuge und zurück: macht die gesamte Rückseite belastbar statt nur lang. Fortgeschritten — erst einsteigen, wenn sich die freie Vorbeuge gut anfühlt, und bei 5 kg bleiben.',
    how: ['Auf der Plyobox stehen, Hantel in beiden Händen, Kinn zur Brust', 'Wirbel für Wirbel sehr langsam abrollen, Knie gestreckt lassen', 'Unten kurz hängen, genauso langsam wieder aufrollen — nie in den Schmerz'],
    accent: [150, 130],
    props: [['rect', 118, 180, 92, 16]],
    poseA: { h: [160, 20], n: [160, 42], p: [160, 106], b: 0, aL: [[149, 74], [145, 102]], aR: [[171, 74], [175, 102]], lL: [[154, 142], [151, 180]], lR: [[166, 142], [169, 180]] },
    poseB: { h: [130, 132], n: [140, 112], p: [162, 102], b: 28, aL: [[122, 142], [118, 170]], aR: [[128, 144], [124, 172]], lL: [[156, 140], [153, 180]], lR: [[168, 140], [171, 180]] }
  },
  // ================= ZWISCHENDURCH =================
  {
    id: 'buero-schulterkreisen', block: 13, name: 'Schulterkreisen rückwärts', dose: '10 große Kreise', secs: 30, perSide: false, equip: null,
    areas: ['Schulter', 'Nacken'],
    benefit: 'Rollt die nach vorn gesackte Schreibtisch-Haltung zurück — der schnellste Reset für Schultern und Nacken.',
    how: ['Aufrecht stehen, Arme locker', 'Schultern groß nach hinten-unten kreisen', 'Langsam — Brustbein hebt sich mit jedem Kreis'],
    accent: [160, 58],
    poseA: base({ aL: [[142, 88], [134, 114]], aR: [[164, 86], [158, 112]] }),
    poseB: base({ n: [160, 54], h: [160, 32], aL: [[152, 92], [146, 118]], aR: [[174, 90], [168, 116]] })
  },
  {
    id: 'buero-brustoeffner', block: 13, name: 'Türrahmen-Brustöffner', dose: '30 Sek.', secs: 35, perSide: false, equip: 'Türrahmen',
    areas: ['Brust', 'Schulter'],
    benefit: 'Unterarme an den Türrahmen, einen Schritt durchlehnen: öffnet die Brust nach Stunden über der Tastatur — im Vorbeigehen erledigt.',
    how: ['Unterarme beidseitig an den Türrahmen, Ellbogen etwa schulterhoch', 'Einen kleinen Schritt durch die Tür lehnen', 'Dehnung vorn in der Brust spüren, ruhig atmen'],
    accent: [160, 70],
    props: [['line', 108, 36, 108, 196], ['line', 212, 36, 212, 196]],
    poseA: { h: [160, 36], n: [160, 58], p: [160, 122], b: 0, aL: [[128, 72], [112, 50]], aR: [[192, 72], [208, 50]], lL: [[154, 158], [151, 196]], lR: [[166, 158], [169, 196]] },
    poseB: { h: [166, 38], n: [166, 60], p: [166, 124], b: 6, aL: [[132, 72], [112, 50]], aR: [[196, 72], [208, 50]], lL: [[152, 158], [146, 196]], lR: [[176, 160], [186, 196]] }
  },
  {
    id: 'buero-hueftoeffner', block: 13, name: 'Stehender Hüftbeuger-Opener', dose: '20 Sek. je Seite', secs: 40, perSide: true, equip: null,
    areas: ['Hüfte'],
    benefit: 'Das direkte Gegengift zum Sitzen: kleiner Ausfallschritt, Gesäß anspannen, Arm hoch — die Hüfte klappt wieder auf.',
    how: ['Kleiner Ausfallschritt, hinteres Bein lang', 'Gesäß anspannen, Becken leicht nach vorn schieben', 'Arm der hinteren Seite lang nach oben strecken'],
    accent: [166, 128],
    poseA: base({ p: [164, 124], aL: [[148, 44], [152, 18]], lL: [[190, 156], [214, 190]] }),
    poseB: base({ p: [170, 124], h: [162, 34], n: [162, 56], aL: [[150, 42], [154, 14]], lL: [[196, 154], [222, 188]] })
  },
  {
    id: 'buero-hocke', block: 13, name: 'Minuten-Hocke', dose: '30 Sek.', secs: 30, perSide: false, equip: null,
    areas: ['Hüfte', 'Sprunggelenk'],
    benefit: 'Einmal pro Arbeitstag ganz runter: Die kurze Hocke hält Hüfte und Sprunggelenke bei der Sache — festhalten am Schreibtisch ausdrücklich erlaubt.',
    how: ['Hüftbreit, Fersen am Boden, gern an Tischkante festhalten', 'So tief wie möglich in die Hocke sinken', 'Brust aufrecht, 30 Sekunden ruhig atmen'],
    accent: [168, 152],
    poseA: { h: [152, 90], n: [156, 108], p: [170, 156], b: 8, aL: [[132, 122], [112, 112]], aR: [[138, 124], [118, 114]], lL: [[116, 154], [106, 196]], lR: [[128, 158], [120, 196]] },
    poseB: { h: [154, 94], n: [158, 112], p: [174, 158], b: 8, aL: [[134, 124], [114, 114]], aR: [[140, 126], [120, 116]], lL: [[118, 156], [108, 196]], lR: [[130, 160], [122, 196]] }
  },
  {
    id: 'buero-nacken', block: 13, name: 'Nacken-Pause', dose: '15 Sek. je Seite', secs: 30, perSide: true, equip: null,
    areas: ['Nacken'],
    benefit: 'Kopf sanft zur Seite sinken lassen löst die Bildschirm-Spannung zwischen Schulter und Ohr, bevor sie zum Kopfschmerz wird.',
    how: ['Aufrecht sitzen oder stehen', 'Ohr Richtung Schulter sinken lassen, Hand legt nur ihr Gewicht auf', 'Gegenschulter bewusst Richtung Boden schieben'],
    accent: [166, 44],
    poseA: base({ h: [168, 40], aL: [[150, 38], [178, 48]], aR: [[176, 96], [182, 122]] }),
    poseB: base({ h: [174, 44], aL: [[154, 40], [184, 52]], aR: [[178, 98], [186, 124]] })
  },
  {
    id: 'buero-waden', block: 13, name: 'Wadenheben am Schreibtisch', dose: '15 Wdh.', secs: 30, perSide: false, equip: null,
    areas: ['Waden'],
    benefit: 'Bringt die Wadenpumpe an — mehr Blutfluss in schweren Sitz-Beinen, ganz ohne Schweiß.',
    how: ['Hüftbreit stehen, Fingerspitzen auf dem Tisch', 'Hoch auf die Zehenspitzen, kurz halten', 'Langsam absenken, Fersen kurz entlasten'],
    accent: [160, 188],
    poseA: base({}),
    poseB: { h: [160, 28], n: [160, 50], p: [160, 114], b: 0, aL: [[149, 82], [145, 108]], aR: [[171, 82], [175, 108]], lL: [[154, 150], [151, 188]], lR: [[166, 150], [169, 188]] }
  },
  {
    id: 'buero-rotation', block: 13, name: 'Stehende Rumpfrotation', dose: '8 Wdh. je Seite', secs: 30, perSide: false, equip: null,
    areas: ['BWS', 'Rumpf'],
    benefit: 'Locker um die eigene Achse drehen mobilisiert die Brustwirbelsäule und schüttelt die Sitzstarre ab.',
    how: ['Hüftbreit stehen, Arme locker hängen lassen', 'Oberkörper entspannt nach links und rechts drehen', 'Arme schwingen passiv mit, Hüfte bleibt nach vorn'],
    accent: [160, 90],
    poseA: base({ aL: [[132, 92], [116, 104]], aR: [[186, 92], [200, 82]] }),
    poseB: base({ aL: [[134, 92], [120, 80]], aR: [[184, 92], [198, 106]] })
  },
  {
    id: 'buero-handgelenke', block: 13, name: 'Handgelenk-Wecker', dose: '20 Sek.', secs: 30, perSide: false, equip: null,
    areas: ['Handgelenk', 'Unterarm'],
    benefit: 'Handflächen aneinander und sanft absenken dehnt die Unterarm-Beuger — die Tipp- und Maus-Muskeln, die sonst nie Pause machen.',
    how: ['Handflächen vor der Brust aneinander (Gebetshaltung)', 'Hände langsam Richtung Bauch absenken, Handflächen bleiben zusammen', 'Ellbogen leicht anheben, 20 Sekunden halten'],
    accent: [160, 108],
    poseA: base({ aL: [[138, 96], [156, 104]], aR: [[182, 96], [164, 104]] }),
    poseB: base({ aL: [[136, 100], [156, 114]], aR: [[184, 100], [164, 114]] })
  },

  {
    id: 'seitplanke', block: 12, name: 'Seitplanke', dose: '2×20 Sek. je Seite', secs: 120, perSide: true, equip: null,
    areas: ['Rumpf', 'Hüfte'],
    benefit: 'Die seitliche Rumpfwand stabilisiert dein Becken bei jedem Laufschritt — die Seitplanke trainiert sie direkt und schützt nebenbei den unteren Rücken.',
    how: ['Seitlage, Ellbogen unter der Schulter', 'Hüfte anheben, bis der Körper eine gerade Linie ist', 'Oben halten, Becken nicht absinken lassen, ruhig atmen'],
    accent: [178, 158],
    poseA: { h: [80, 136], n: [102, 146], p: [178, 158], b: -4, aL: [[98, 172], [96, 196]], aR: [[138, 138], [150, 122]], lL: [[224, 168], [268, 178]], lR: [[228, 172], [272, 182]] },
    poseB: { h: [80, 132], n: [102, 142], p: [178, 152], b: -6, aL: [[98, 170], [96, 196]], aR: [[138, 134], [150, 118]], lL: [[224, 166], [268, 176]], lR: [[228, 170], [272, 180]] }
  }
];

export const byId = (id) => EXERCISES.find((e) => e.id === id);
export const byBlock = (blockId) => EXERCISES.filter((e) => e.block === blockId);

// Häufige Fehler je Übung — wird in der Detailansicht angezeigt.
export const MISTAKES = {
  'katze-kuh': ['Bewegung kommt nur aus Kopf und Schultern statt aus der ganzen Wirbelsäule', 'Zu schnell — pro Richtung ruhig 3–4 Sekunden'],
  'kind-kobra': ['Schultern wandern zu den Ohren', 'Hüfte hebt in der Kobra vom Boden ab — flach lassen'],
  'thread-needle': ['Hüfte dreht mit — sie bleibt über den Knien', 'Arm wird nur abgelegt statt aktiv durchgeschoben'],
  'seitneigung': ['Oberkörper kippt nach vorn statt sauber zur Seite', 'Stauchen statt lang machen — erst wachsen, dann neigen'],
  'beckenkippen': ['Brustkorb macht mit — nur das Becken kippt', 'Mit Schwung statt langsam und bewusst'],
  'hws-mobilisation': ['Schultern heben sich beim Drehen mit', 'Kinn sinkt ab — der Blick bleibt waagerecht'],
  'wgs': ['Vorderes Knie fällt nach innen', 'Rotation kommt nur aus dem Arm statt aus dem Brustkorb'],
  'neunzig-neunzig': ['Oberkörper sackt beim Wechsel zusammen — aufrecht bleiben', 'Füße heben ab und helfen mit Schwung'],
  'tiefe-hocke': ['Fersen heben ab — Stand breiter oder Handtuch unter die Fersen', 'Rundrücken — Brust aktiv aufrichten'],
  'hip-cars': ['Becken kippt mit — nur das Bein kreist', 'Zu schnell: ~10 Sekunden pro Kreis sind das Ziel'],
  'beinpendel': ['Schwung kommt aus dem Rücken statt aus der Hüfte', 'Standbein passiv durchgestreckt statt leicht gebeugt'],
  'beinpendel-seit': ['Oberkörper pendelt mit', 'Fuß dreht auswärts — Zehen zeigen nach vorn'],
  'hueftschub': ['Hohlkreuz statt Hüftstreckung — Gesäß fest anspannen', 'Schritt zu kurz, das Becken kommt nicht nach vorn'],
  'frosch-wippe': ['Knie zu eng — deutlich breiter als die Hüfte', 'Lendenwirbelsäule rundet beim Zurückschieben ein'],
  'aktives-beinheben': ['Knie beugt beim Heben — lieber weniger hoch', 'Unterer Rücken drückt ins Hohlkreuz'],
  'ankle-rocks': ['Ferse hebt ab — dann näher an die Wand', 'Knie weicht nach innen aus — über die Kleinzehe führen'],
  'zehen-fersen': ['Festkrallen — frei balancieren bringt mehr', 'Zu kleine Bewegung: oben richtig hoch, hinten Zehen richtig anziehen'],
  'grosszehen': ['Zu viel Druck — sanft wippen statt pressen', 'Fuß knickt seitlich weg'],
  'banddurchzuege': ['Ellbogen beugen — Arme bleiben lang, notfalls breiter greifen', 'Hohlkreuz beim Überziehen — Rippen unten lassen'],
  'wall-slides': ['Unterarme verlieren den Wandkontakt', 'Schultern schieben zu den Ohren'],
  'open-book': ['Knie heben ab — dann rotiert die Lendenwirbelsäule statt der Brustkorb', 'Arm schwingt nur, ohne dass sich der Brustkorb öffnet'],
  'pull-aparts': ['Schultern ziehen hoch — bewusst tief lassen', 'Handgelenke knicken ein'],
  'schulter-cars': ['Rumpf lehnt mit — der Körper bleibt still', 'Kreis wird klein und hektisch statt groß und langsam'],
  'bws-streckung': ['Hohlkreuz statt Brustkorb-Streckung — Rippen nicht rausschieben', 'Ellbogen rutschen breiter als schulterbreit'],
  'handgelenke': ['Ruckartige Wechsel — langsam verlagern', 'Schmerz oben im Handgelenk: weniger Gewicht auf die Hände'],
  'glute-bridge': ['Oben ins Hohlkreuz gedrückt — Becken leicht einrollen', 'Schub aus den Zehen statt aus den Fersen'],
  'bird-dog': ['Becken kippt zur Seite', 'Kopf im Nacken — Blick zum Boden, Nacken lang'],
  'hocke-halten': ['Gewicht wandert auf die Zehenspitzen', 'Knie kollabieren nach innen'],
  'dead-bug': ['Unterer Rücken hebt ab — Bewegung verkleinern', 'Luft anhalten — ruhig weiteratmen'],
  'seitschritte-band': ['Oberkörper wankt — klein und kontrolliert steigen', 'Füße drehen auswärts'],
  'plank-push': ['Hüfte sackt durch', 'Ellbogen überstreckt — minimal weich lassen'],
  'abend-atmung': ['Brust hebt sich statt Bauch', 'Ausatmen zu kurz — es darf länger sein als das Einatmen'],
  'knie-zur-brust': ['Nacken angespannt hochgezogen — Kopf liegt schwer', 'Zu kräftig ziehen — sanftes Schaukeln reicht'],
  'hamstring-band': ['Knie beugt — dann Bein weniger weit ziehen', 'Das andere Bein hebt ab — es bleibt lang am Boden'],
  'figure-4': ['Kopf hebt ab und der Nacken verspannt', 'Fußgelenk hängt lose — Fuß anziehen (flexen)'],
  'couch-stretch': ['Hohlkreuz statt Dehnung — Becken einrollen, Gesäß anspannen', 'Zu nah oder zu weit von der Kante gestartet'],
  'schmetterling': ['Knie mit den Händen herunterdrücken', 'Rundrücken — aus der Hüfte aufrecht sitzen'],
  'happy-baby': ['Steißbein hebt weit ab', 'Schultern verkrampfen beim Greifen — notfalls Schienbeine statt Füße fassen'],
  'vorbeuge-band': ['Mit rundem Rücken reißen statt aus der Hüfte kippen', 'Wippen — einfach halten und atmen'],
  'elephant-walk': ['Rücken rundet komplett ein — lang lassen', 'Ferse hebt beim Strecken ab'],
  'gastroc-wand': ['Hinteres Knie beugt — dann arbeitet der falsche Muskel', 'Hinterer Fuß dreht auswärts'],
  'ischias-slider': ['In den Zug arbeiten — Slider müssen völlig beschwerdefrei bleiben', 'Kopf und Bein gegenläufig statt gleichzeitig bewegt'],
  'quad-seitenlage': ['Ins Hohlkreuz ziehen statt Becken einrollen', 'Knie wandert nach oben — es bleibt in Linie mit der Hüfte'],
  'twist': ['Obere Schulter hebt vom Boden ab', 'Knie rutschen auseinander — stapeln, Kissen dazwischen hilft'],
  'kindhaltung': ['Schultern zu den Ohren gezogen', 'Flacher Brustatem statt tief in Bauch und Rücken'],
  'seitdehnung-sitz': ['Sitzbeinhöcker hebt ab — er bleibt am Boden', 'Nach vorn eingeknickt statt zur Seite verlängert'],
  'brust-boden': ['Zu schnell zu weit aufgedreht — in kleinen Stufen', 'Schulter zuckt hoch statt lang zu bleiben'],
  'nacken': ['Ziehen statt nur das Armgewicht wirken lassen', 'Gegenschulter hebt mit hoch — aktiv Richtung Boden schieben'],
  'lat-box': ['Ellbogen beugen — Arme bleiben lang', 'Ins Hohlkreuz gesackt statt Brustkorb sinken lassen'],
  'beine-wand': ['Gesäß zu weit von der Wand', 'Beine aktiv gestreckt — einfach anlehnen lassen'],
  'sternenlage': ['Gedanken bei der To-do-Liste — immer wieder zum Atem zurück', 'Auskühlen — Decke drüber, warm entspannt besser'],
  'atg-split-squat': ['Ferse vorn hebt ab — Bewegungsumfang verkleinern', 'Tiefe erzwingen — Steigerung über Wochen, nicht pro Satz'],
  'deficit-rdl': ['Unterer Rücken rundet ein — vorher stoppen', 'Zu viel Kniebeugung — es ist ein Hüft-Hinge'],
  'wadenheben-gestreckt': ['Zu schnell abgesenkt — die 3 Sekunden sind die Übung', 'Knie beugt unten mit'],
  'cossack-squat': ['Ferse des tiefen Beins hebt ab', 'Oberkörper fällt weit nach vorn'],
  'stuetz-dipstangen': ['Schultern sinken zu den Ohren', 'Schwingen — Körperspannung halten'],
  'jefferson-curl': ['Zu viel Gewicht — 5 kg reichen lange', 'Schneller als 5 Sekunden pro Weg ist zu schnell'],
  'seitplanke': ['Hüfte hängt durch', 'Ellbogen steht nicht unter der Schulter'],
  'buero-schulterkreisen': ['Kleine hektische Kreise — groß und langsam rollen', 'Kopf schiebt dabei nach vorn'],
  'buero-brustoeffner': ['Hohlkreuz beim Durchlehnen', 'Ellbogen deutlich über oder unter Schulterhöhe'],
  'buero-hueftoeffner': ['Oberkörper lehnt nach vorn — aufrecht bleiben', 'Gesäß der hinteren Seite bleibt locker — anspannen!'],
  'buero-hocke': ['Fersen oben — breiter stehen oder festhalten', 'Hektisch absitzen — 30 Sekunden ruhig atmen'],
  'buero-nacken': ['Gegenschulter zieht mit hoch', 'Ruckartig — den Kopf langsam sinken lassen'],
  'buero-waden': ['Schwung statt Kontrolle', 'Oben nicht ganz hochgedrückt'],
  'buero-rotation': ['Knie und Hüfte drehen mit — sie bleiben nach vorn', 'Mit den Armen Schwung reißen'],
  'buero-handgelenke': ['Zu fester Druck — sanfte Dehnung reicht', 'Schultern spannen mit an']
};
