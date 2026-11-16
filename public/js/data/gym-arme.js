// Studio-Übungen · Arme und Rumpf
const CURL = ['Beugen · ausatmen', 'Langsam senken · einatmen'];
const STRECKEN = ['Strecken · ausatmen', 'Langsam zurück · einatmen'];

export const GYM_ARME = [
  // ---------- Bizeps ----------
  {
    id: 'lh-curl', name: 'Langhantel-Curl', aka: 'Barbell Curl', group: 'bizeps', equip: 'langhantel', tools: 'Langhantel oder SZ-Stange', level: 1, compound: false,
    primary: ['bizeps'], secondary: ['unterarm'], fig: ['curl'], sets: 3, reps: [8, 12], rest: 90, step: 2.5, phases: CURL,
    setup: 'Schulterbreit stehen, Stange im Untergriff, Ellbogen neben dem Körper.',
    how: ['Stange in einem Bogen nach oben beugen', 'Ellbogen bleiben an Ort und Stelle', 'Oben kurz anspannen', 'In 2–3 Sekunden ganz strecken'],
    mistakes: ['Schwung aus dem Rücken', 'Ellbogen wandern nach vorn', 'Unten nicht ganz strecken'],
    why: 'Der Bizeps beugt den Ellbogen und dreht den Unterarm nach außen. Mit der Stange kannst du beide Arme schwer und gleichmäßig belasten.'
  },
  {
    id: 'kh-curl', name: 'Kurzhantel-Curl', aka: 'Dumbbell Curl', group: 'bizeps', equip: 'kurzhantel', tools: 'Kurzhanteln', level: 1, compound: false,
    primary: ['bizeps'], secondary: ['unterarm'], fig: ['curl', { tool: 'db' }], sets: 3, reps: [8, 12], rest: 75, step: 1, phases: CURL,
    setup: 'Aufrecht stehen oder sitzen, Hanteln seitlich, Handflächen zeigen nach vorn.',
    how: ['Hanteln beugen', 'Den kleinen Finger oben leicht nach außen drehen', 'Kurz halten', 'Langsam ganz strecken'],
    mistakes: ['Schultern rollen nach vorn', 'Abwechselnd mit Schwung', 'Halbe Streckung'],
    why: 'Die freie Drehung des Unterarms nutzt beide Funktionen des Bizeps. Seitenunterschiede fallen sofort auf.'
  },
  {
    id: 'hammer-curl', name: 'Hammer-Curl', aka: 'Neutralgriff-Curl', group: 'bizeps', equip: 'kurzhantel', tools: 'Kurzhanteln', level: 1, compound: false,
    primary: ['bizeps', 'unterarm'], secondary: [], fig: ['curl', { tool: 'db' }], sets: 3, reps: [10, 15], rest: 75, step: 1, phases: CURL,
    setup: 'Hanteln seitlich, Daumen zeigen nach vorn — wie beim Halten eines Hammers.',
    how: ['Mit neutralem Griff beugen', 'Ellbogen bleiben am Körper', 'Oben kurz halten', 'Langsam senken'],
    mistakes: ['Hanteln schwingen vor dem Körper', 'Handgelenk knickt ab', 'Zu schnell'],
    why: 'Im Neutralgriff übernehmen der Armbeuger (Brachialis) unter dem Bizeps und der Oberarmspeichenmuskel mehr Arbeit. Das macht den Arm dicker und stärkt den Griff für alle Zugübungen.'
  },
  {
    id: 'schraegbank-curl', name: 'Schrägbank-Curl', aka: 'Incline Curl', group: 'bizeps', equip: 'kurzhantel', tools: 'Kurzhanteln, Schrägbank 50–60°', level: 2, compound: false,
    primary: ['bizeps'], secondary: ['unterarm'], fig: ['inclineCurl'], sets: 3, reps: [10, 15], rest: 75, step: 1, phases: CURL,
    setup: 'Bank auf 50–60°, zurücklehnen, Arme hängen senkrecht nach unten hinter dem Körper.',
    how: ['Aus der Dehnung beugen', 'Oberarme bleiben senkrecht', 'Oben kurz anspannen', 'Langsam bis zur vollen Streckung'],
    mistakes: ['Ellbogen kommen nach vorn', 'Schultern lösen sich von der Lehne', 'Zu schwer'],
    why: 'Der Arm hängt hinter dem Körper — der lange Bizepskopf, der über die Schulter läuft, wird vorgedehnt. Training in gedehnter Position ist ein starker Wachstumsreiz.'
  },
  {
    id: 'scott-curl', name: 'Scott-Curl', aka: 'Preacher Curl', group: 'bizeps', equip: 'langhantel', tools: 'SZ-Stange, Scott-Bank', level: 1, compound: false,
    primary: ['bizeps'], secondary: ['unterarm'], fig: ['preacherCurl'], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: CURL,
    setup: 'Achseln an die Polsterkante, Oberarme liegen ganz auf.',
    how: ['Arme fast strecken', 'Stange beugen, Oberarme bleiben liegen', 'Oben kurz anspannen', 'Sehr kontrolliert senken'],
    mistakes: ['Unten ruckartig ins Gelenk fallen', 'Gesäß hebt ab', 'Halber Weg'],
    why: 'Das Polster verhindert jeden Schwung. Der Bizeps ist am schwersten Punkt gestreckt — die Belastung liegt dort, wo sie am meisten bewirkt.'
  },
  {
    id: 'kabel-curl', name: 'Kabel-Curl', aka: 'Cable Curl', group: 'bizeps', equip: 'kabel', tools: 'Kabelzug, Stange', level: 1, compound: false,
    primary: ['bizeps'], secondary: ['unterarm'], fig: ['curl', { tool: 'cable' }], sets: 3, reps: [10, 15], rest: 60, step: 2.5, phases: CURL,
    setup: 'Rolle unten, einen Schritt zurück, Ellbogen am Körper.',
    how: ['Stange zur Schulter beugen', 'Oben anspannen', 'Langsam strecken', 'Spannung unten halten'],
    mistakes: ['Zurücklehnen', 'Ellbogen wandern', 'Gewicht setzt ab'],
    why: 'Der gleichmäßige Zug des Kabels hält den Bizeps auch oben und unten unter Spannung. Gut für höhere Wiederholungen am Ende der Einheit.'
  },

  // ---------- Trizeps ----------
  {
    id: 'trizepsdruecken', name: 'Trizepsdrücken am Kabel', aka: 'Pushdown', group: 'trizeps', equip: 'kabel', tools: 'Kabelzug, Seil oder Stange', level: 1, compound: false,
    primary: ['trizeps'], secondary: [], fig: ['pushdown'], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: ['Nach unten strecken · ausatmen', 'Langsam beugen · einatmen'],
    setup: 'Rolle oben. Ellbogen an den Körper, Oberkörper minimal vorneigen.',
    how: ['Unterarme nach unten strecken', 'Unten das Seil leicht auseinanderziehen', 'Kurz halten', 'Langsam bis über 90° beugen'],
    mistakes: ['Ellbogen wandern vor und zurück', 'Schultern drücken mit', 'Oberkörper lehnt sich auf das Gewicht'],
    why: 'Der Trizeps streckt den Ellbogen. Am Kabel bleibt die Spannung konstant und das Gelenk wird geschont. Der Trizeps macht rund zwei Drittel der Oberarmmasse aus.'
  },
  {
    id: 'ueberkopf-trizeps', name: 'Überkopf-Trizepsstrecken', aka: 'Overhead Extension', group: 'trizeps', equip: 'kabel', tools: 'Kabelzug, Seil', level: 2, compound: false,
    primary: ['trizeps'], secondary: [], fig: ['overheadExtension'], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: STRECKEN,
    setup: 'Mit dem Rücken zum Turm, Seil hinter dem Kopf, Ellbogen zeigen nach vorn-oben. Schrittstellung.',
    how: ['Hände tief hinter den Kopf sinken lassen', 'Unterarme nach oben strecken', 'Oberarme bleiben ruhig', 'Langsam zurück in die Dehnung'],
    mistakes: ['Ellbogen klappen nach außen', 'Hohlkreuz', 'Zu kurzer Weg hinter dem Kopf'],
    why: 'Der lange Trizepskopf läuft über die Schulter. Mit dem Arm über Kopf ist er gedehnt. In einem direkten Vergleich wuchs der Trizeps so deutlich stärker als beim Drücken nach unten.'
  },
  {
    id: 'ueberkopf-kh', name: 'Trizepsstrecken mit Kurzhantel', aka: 'French Press', group: 'trizeps', equip: 'kurzhantel', tools: 'Kurzhantel', level: 1, compound: false,
    primary: ['trizeps'], secondary: [], fig: ['overheadExtension', { cable: false }], sets: 3, reps: [10, 15], rest: 75, step: 2, phases: STRECKEN,
    setup: 'Eine Hantel mit beiden Händen über den Kopf, Ellbogen nah am Kopf.',
    how: ['Hantel hinter den Kopf senken', 'Tiefe Dehnung zulassen', 'Nach oben strecken', 'Oberarme bleiben senkrecht'],
    mistakes: ['Ellbogen weit auseinander', 'Hohlkreuz', 'Hantel wird nur halb gesenkt'],
    why: 'Gleiches Prinzip wie am Kabel: Der lange Trizepskopf arbeitet aus der Dehnung. Geht überall, wo eine Hantel liegt.'
  },
  {
    id: 'stirndruecken', name: 'Stirndrücken', aka: 'Skullcrusher', group: 'trizeps', equip: 'langhantel', tools: 'SZ-Stange, Flachbank', level: 2, compound: false,
    primary: ['trizeps'], secondary: [], fig: ['skullCrusher'], sets: 3, reps: [8, 12], rest: 90, step: 2.5, phases: ['Zur Stirn senken · einatmen', 'Strecken · ausatmen'],
    setup: 'Auf der Bank liegen, Stange über der Brust, Arme leicht Richtung Kopf geneigt.',
    how: ['Nur die Unterarme bewegen', 'Stange zur Stirn oder knapp hinter den Kopf senken', 'Kurz in der Dehnung bleiben', 'Arme strecken'],
    mistakes: ['Ellbogen spreizen nach außen', 'Oberarme pendeln mit', 'Zu schnell gesenkt'],
    why: 'Der leicht nach hinten geneigte Oberarm hält alle drei Trizepsköpfe über den ganzen Weg unter Spannung. Sinkt die Stange hinter den Kopf, wird der lange Kopf zusätzlich gedehnt.'
  },
  {
    id: 'enges-bankdruecken', name: 'Enges Bankdrücken', aka: 'Close-grip Bench', group: 'trizeps', equip: 'langhantel', tools: 'Langhantel, Flachbank', level: 2, compound: true,
    primary: ['trizeps', 'brust'], secondary: ['schulter_v'], fig: ['benchPress'], sets: 3, reps: [6, 10], rest: 120, step: 2.5, phases: ['Kontrolliert absenken · einatmen', 'Kraftvoll drücken · ausatmen'],
    setup: 'Wie Bankdrücken, aber Griff nur schulterbreit. Ellbogen nah am Körper.',
    how: ['Stange zur unteren Brust senken', 'Ellbogen streifen fast die Rippen', 'Kurz berühren', 'Gerade nach oben drücken'],
    mistakes: ['Griff zu eng — die Handgelenke knicken', 'Ellbogen flattern nach außen', 'Abprallen'],
    why: 'Der enge Griff verlängert den Weg im Ellbogen. Der Trizeps übernimmt den größten Teil — und kann hier mit viel mehr Gewicht arbeiten als bei Isolationsübungen.'
  },

  // ---------- Bauch & Rumpf ----------
  {
    id: 'kabel-crunch', name: 'Crunch am Kabel', aka: 'Cable Crunch', group: 'core', equip: 'kabel', tools: 'Kabelzug, Seil', level: 1, compound: false,
    primary: ['bauch'], secondary: ['schraege'], fig: ['cableCrunch'], sets: 3, reps: [10, 15], rest: 60, step: 2.5, phases: ['Einrollen · ausatmen', 'Langsam aufrichten · einatmen'],
    setup: 'Vor dem Turm knien, Seil neben dem Kopf halten. Hüfte bleibt über den Knien.',
    how: ['Brustbein Richtung Becken einrollen', 'Die Wirbelsäule rundet sich bewusst', 'Unten Bauch anspannen', 'Langsam aufrichten und strecken'],
    mistakes: ['Hüfte beugt — es wird ein Hinsetzen', 'Arme ziehen das Gewicht', 'Zu kleiner Weg'],
    why: 'Der gerade Bauchmuskel beugt die Wirbelsäule. Am Kabel kannst du ihn wie jeden anderen Muskel schwer und im Bereich 10–15 Wiederholungen belasten, statt endlose Wiederholungen zu machen.'
  },
  {
    id: 'beinheben-haengend', name: 'Beinheben hängend', aka: 'Hanging Leg Raise', group: 'core', equip: 'koerper', tools: 'Klimmzugstange', level: 3, compound: false, bw: true,
    primary: ['bauch', 'hueftbeuger'], secondary: ['schraege', 'unterarm'], fig: ['hangingLegRaise'], sets: 3, reps: [6, 12], rest: 90, step: 0, phases: ['Beine heben · ausatmen', 'Langsam senken · einatmen'],
    setup: 'Im Hang an der Stange, Schultern aktiv nach unten, Körper ruhig.',
    how: ['Becken einrollen', 'Gestreckte Beine bis zur Waagerechten heben', 'Oben kurz halten', 'Langsam senken, ohne zu pendeln'],
    mistakes: ['Schwung holen', 'Nur die Hüfte beugt — das Becken rollt nicht ein', 'Fallenlassen'],
    why: 'Die Hüftbeuger heben die Beine, der Bauch rollt das Becken ein — erst dieses Einrollen trainiert die Bauchmuskeln wirklich. Der Hang stärkt nebenbei den Griff und entlastet die Wirbelsäule.'
  },
  {
    id: 'knieheben-haengend', name: 'Knieheben hängend', aka: 'Hanging Knee Raise', group: 'core', equip: 'koerper', tools: 'Klimmzugstange', level: 2, compound: false, bw: true,
    primary: ['bauch', 'hueftbeuger'], secondary: ['unterarm'], fig: ['hangingLegRaise', { knees: true }], sets: 3, reps: [8, 15], rest: 75, step: 0, phases: ['Knie zur Brust · ausatmen', 'Langsam senken · einatmen'],
    setup: 'Im Hang, Schultern aktiv, Beine geschlossen.',
    how: ['Knie Richtung Brust ziehen', 'Becken am Ende einrollen', 'Kurz halten', 'Langsam strecken'],
    mistakes: ['Pendeln', 'Knie nur bis Hüfthöhe', 'Schultern hängen passiv'],
    why: 'Die leichtere Variante des Beinhebens: kürzerer Hebel, gleiche Aufgabe. Der richtige Einstieg, bis das Becken sauber einrollt.'
  },
  {
    id: 'plank', name: 'Unterarmstütz', aka: 'Plank', group: 'core', equip: 'koerper', tools: 'Körpergewicht', level: 1, compound: false, bw: true, unit: 'sek',
    primary: ['bauch', 'schraege'], secondary: ['schulter_v', 'gesaess'], fig: ['plank'], sets: 3, reps: [30, 60], rest: 60, step: 0, phases: ['Spannung halten · ruhig atmen', 'Spannung halten · ruhig atmen'],
    setup: 'Ellbogen unter den Schultern, Körper von Kopf bis Ferse eine Linie.',
    how: ['Gesäß und Bauch fest anspannen', 'Becken leicht einrollen', 'Ellbogen gedanklich Richtung Zehen ziehen', 'Ruhig weiteratmen'],
    mistakes: ['Hüfte hängt durch', 'Gesäß zu hoch', 'Luft anhalten'],
    why: 'Der Rumpf verhindert hier eine Bewegung (das Durchhängen) — genau seine Hauptaufgabe bei Kniebeugen, Kreuzheben und beim Laufen. Lieber kürzer mit voller Spannung als minutenlang locker.'
  },
  {
    id: 'ab-wheel', name: 'Bauchroller', aka: 'Ab Wheel Rollout', group: 'core', equip: 'koerper', tools: 'Bauchroller', level: 3, compound: false, bw: true,
    primary: ['bauch'], secondary: ['lat', 'schraege', 'schulter_v'], fig: ['abWheel'], sets: 3, reps: [6, 12], rest: 90, step: 0, phases: ['Langsam ausrollen · einatmen', 'Zurückziehen · ausatmen'],
    setup: 'Auf einem Polster knien, Roller unter den Schultern, Becken eingerollt.',
    how: ['Langsam nach vorn rollen', 'Hüfte und Arme strecken gleichzeitig', 'Nur so weit, wie der Rücken stabil bleibt', 'Mit Bauch und Lat zurückziehen'],
    mistakes: ['Hohlkreuz am Endpunkt', 'Gesäß bleibt hinten — nur die Arme rollen', 'Zu weit, zu früh'],
    why: 'Der Bauch bremst die Streckung des ganzen Körpers unter langer Hebelwirkung. Das ist eine der intensivsten Rumpfübungen überhaupt — die Reichweite langsam steigern.'
  },
  {
    id: 'reverse-crunch', name: 'Reverse Crunch', aka: 'Beckenheben', group: 'core', equip: 'koerper', tools: 'Matte', level: 1, compound: false, bw: true,
    primary: ['bauch'], secondary: ['hueftbeuger'], fig: ['reverseCrunch'], sets: 3, reps: [10, 15], rest: 60, step: 0, phases: ['Becken einrollen · ausatmen', 'Langsam abrollen · einatmen'],
    setup: 'Rückenlage, Arme neben dem Körper, Hüfte und Knie 90° gebeugt.',
    how: ['Knie Richtung Brust ziehen', 'Becken vom Boden abrollen', 'Oben kurz halten', 'Wirbel für Wirbel ablegen'],
    mistakes: ['Schwung aus den Beinen', 'Nur die Beine pendeln', 'Kopf drückt in den Boden'],
    why: 'Der Bauch rollt das Becken zum Brustkorb — die untere Hälfte der Bewegung, die bei normalen Crunches fehlt. Rückenfreundlich und überall machbar.'
  },
  {
    id: 'bauchmaschine', name: 'Bauchmaschine', aka: 'Ab Crunch Machine', group: 'core', equip: 'maschine', tools: 'Bauchmaschine', level: 1, compound: false,
    primary: ['bauch'], secondary: ['schraege'], fig: ['machineCrunch'], sets: 3, reps: [10, 15], rest: 60, step: 5, phases: ['Einrollen · ausatmen', 'Langsam aufrichten · einatmen'],
    setup: 'Polster auf Brusthöhe, Füße fixiert.',
    how: ['Brustkorb Richtung Becken rollen', 'Bauch anspannen', 'Kurz halten', 'Langsam zurück'],
    mistakes: ['Mit den Armen ziehen', 'Aus der Hüfte beugen', 'Zu schnell'],
    why: 'Einfach zu dosieren und zu steigern. Der Bauch wird wie jeder andere Muskel progressiv belastet.'
  },
  {
    id: 'holzhacker', name: 'Holzhacker am Kabel', aka: 'Woodchop', group: 'core', equip: 'kabel', tools: 'Kabelzug, ein Griff', level: 2, compound: false, uni: true,
    primary: ['schraege'], secondary: ['bauch', 'schulter_v'], fig: ['woodchop'], sets: 3, reps: [10, 15], rest: 60, step: 2.5, phases: ['Diagonal nach unten ziehen · ausatmen', 'Kontrolliert zurück · einatmen'],
    setup: 'Rolle oben, seitlich zum Turm stehen, Griff mit beiden Händen fassen. Füße breit.',
    how: ['Arme fast gestreckt', 'Diagonal zur gegenüberliegenden Hüfte ziehen', 'Der Brustkorb dreht, die Hüfte dreht mit', 'Langsam zurück'],
    mistakes: ['Nur die Arme arbeiten', 'Unterer Rücken verdreht sich allein', 'Schwung'],
    why: 'Die schrägen Bauchmuskeln drehen den Rumpf und übertragen Kraft zwischen Ober- und Unterkörper. Beim Laufen stabilisieren sie die gegenläufige Bewegung von Schultern und Becken.'
  },
  {
    id: 'farmers-walk', name: "Farmer's Walk", aka: 'Lastentragen', group: 'core', equip: 'kurzhantel', tools: 'Schwere Kurzhanteln oder Kettlebells', level: 1, compound: true, unit: 'sek',
    primary: ['unterarm', 'trapez'], secondary: ['bauch', 'schraege', 'gesaess'], fig: ['farmerWalk'], sets: 3, reps: [30, 45], rest: 90, step: 2, phases: ['Aufrecht gehen · ruhig atmen', 'Aufrecht gehen · ruhig atmen'],
    setup: 'Schwere Hanteln mit geradem Rücken aufheben. Schultern zurück, Rumpf fest.',
    how: ['Mit kurzen, zügigen Schritten gehen', 'Aufrecht bleiben', 'Schultern nicht hängen lassen', 'Kontrolliert absetzen'],
    mistakes: ['Zur Seite schwanken', 'Rundrücken beim Aufheben', 'Zu leicht — es soll fordernd sein'],
    why: 'Griff, Trapez und der gesamte Rumpf halten gleichzeitig. Die Griffkraft begrenzt oft Kreuzheben und Klimmzüge — hier trainierst du sie direkt.'
  }
];
