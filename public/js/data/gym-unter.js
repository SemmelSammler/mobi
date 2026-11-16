// Studio-Übungen · Unterkörper (Quadrizeps, Beinbeuger, Gesäß, Waden)
const BEUGEN = ['Kontrolliert absenken · einatmen', 'Kraftvoll hochdrücken · ausatmen'];

export const GYM_UNTER = [
  // ---------- Quadrizeps ----------
  {
    id: 'kniebeuge', name: 'Kniebeuge', aka: 'Back Squat', group: 'quadrizeps', equip: 'langhantel', tools: 'Langhantel, Rack', level: 3, compound: true,
    primary: ['quadrizeps', 'gesaess'], secondary: ['adduktoren', 'ruecken_strecker', 'bauch'], fig: ['squat'], sets: 4, reps: [5, 8], rest: 180, step: 2.5, phases: BEUGEN,
    setup: 'Stange auf dem oberen Trapez, Griff eng genug für einen festen oberen Rücken. Füße schulterbreit, Zehen leicht nach außen.',
    how: ['Tief in den Bauch atmen, Rumpf fest', 'Hüfte und Knie gleichzeitig beugen, Knie folgen den Zehen', 'So tief, wie der Rücken gerade bleibt — mindestens Oberschenkel waagerecht', 'Über den ganzen Fuß nach oben drücken'],
    mistakes: ['Knie fallen nach innen', 'Fersen heben ab', 'Becken kippt unten weg („Butt Wink“)', 'Oberkörper klappt beim Hochkommen nach vorn'],
    why: 'Quadrizeps streckt das Knie, Gesäß und Adduktoren strecken die Hüfte. Tiefe Kniebeugen bringen deutlich mehr Wachstum für Gesäß und Adduktoren als halbe — bei ähnlichem Effekt auf den Quadrizeps. Der Rumpf muss die Last über der Fußmitte halten.'
  },
  {
    id: 'frontkniebeuge', name: 'Frontkniebeuge', aka: 'Front Squat', group: 'quadrizeps', equip: 'langhantel', tools: 'Langhantel, Rack', level: 3, compound: true,
    primary: ['quadrizeps'], secondary: ['gesaess', 'bauch', 'oberer_ruecken'], fig: ['squat', { bar: 'front' }], sets: 3, reps: [5, 8], rest: 180, step: 2.5, phases: BEUGEN,
    setup: 'Stange liegt auf den vorderen Schultern, Ellbogen hoch, Fingerspitzen sichern nur. Füße schulterbreit.',
    how: ['Ellbogen bleiben die ganze Zeit hoch', 'Aufrecht nach unten setzen, Knie weit nach vorn', 'Tief beugen', 'Mit den Ellbogen voran nach oben'],
    mistakes: ['Ellbogen sinken — die Stange rollt nach vorn', 'Oberer Rücken rundet ein', 'Fersen heben ab'],
    why: 'Die Last vor dem Körper zwingt zu einem aufrechten Oberkörper. Das Knie beugt weiter, die Hüfte weniger: mehr Arbeit für den Quadrizeps, weniger Scherkraft im unteren Rücken.'
  },
  {
    id: 'goblet-squat', name: 'Goblet Squat', aka: 'Kelch-Kniebeuge', group: 'quadrizeps', equip: 'kurzhantel', tools: 'Kurzhantel oder Kettlebell', level: 1, compound: true,
    primary: ['quadrizeps', 'gesaess'], secondary: ['bauch', 'adduktoren'], fig: ['squat', { bar: 'goblet' }], sets: 3, reps: [8, 15], rest: 90, step: 2, phases: BEUGEN,
    setup: 'Hantel senkrecht vor der Brust halten, Ellbogen eng. Füße schulterbreit.',
    how: ['Zwischen die Knie nach unten setzen', 'Ellbogen innen an den Knien vorbei', 'Unten aufrecht bleiben', 'Über die ganze Fußsohle hochdrücken'],
    mistakes: ['Hantel sinkt von der Brust weg', 'Rundrücken', 'Knie fallen nach innen'],
    why: 'Das Gewicht vor der Brust wirkt als Gegengewicht — fast jeder kommt so tief und aufrecht in die Hocke. Die beste Übung, um das Kniebeugen-Muster zu lernen, und ein guter Abschluss für die Beine.'
  },
  {
    id: 'beinpresse', name: 'Beinpresse', aka: 'Leg Press', group: 'quadrizeps', equip: 'maschine', tools: 'Beinpresse 45°', level: 1, compound: true,
    primary: ['quadrizeps', 'gesaess'], secondary: ['adduktoren', 'hamstrings'], fig: ['legPress'], sets: 3, reps: [8, 12], rest: 150, step: 10, phases: ['Langsam beugen · einatmen', 'Platte wegdrücken · ausatmen'],
    setup: 'Füße schulterbreit mittig auf die Platte. Gesäß und unterer Rücken fest am Polster.',
    how: ['Sicherung lösen, Beine fast gestreckt', 'In 3 Sekunden tief beugen, Knie Richtung Achseln', 'Stoppen, bevor sich das Becken vom Polster rollt', 'Kraftvoll drücken, Knie oben nicht durchschlagen'],
    mistakes: ['Becken rollt ein — der untere Rücken rundet unter Last', 'Nur wenige Zentimeter Weg mit zu viel Gewicht', 'Knie fallen nach innen', 'Hände drücken auf die Knie'],
    why: 'Der Rücken ist abgestützt, das Gleichgewicht spielt keine Rolle. So können die Beine sehr hoch belastet werden, ohne dass der Rumpf begrenzt. Füße tiefer auf der Platte: mehr Quadrizeps. Höher und breiter: mehr Gesäß und Adduktoren.'
  },
  {
    id: 'hackenschmidt', name: 'Hackenschmidt-Kniebeuge', aka: 'Hack Squat', group: 'quadrizeps', equip: 'maschine', tools: 'Hackenschmidt-Maschine', level: 2, compound: true,
    primary: ['quadrizeps'], secondary: ['gesaess'], fig: ['squat', { bar: 'none', pad: true }], sets: 3, reps: [8, 12], rest: 150, step: 10, phases: BEUGEN,
    setup: 'Schultern unter die Polster, Rücken flach anlegen. Füße schulterbreit, eher tief auf der Platte.',
    how: ['Sicherung lösen', 'Langsam tief beugen, Knie schieben weit nach vorn', 'Unten kurz halten', 'Hochdrücken, ohne die Knie durchzustrecken'],
    mistakes: ['Fersen heben ab', 'Gesäß löst sich vom Polster', 'Zu kurzer Weg'],
    why: 'Die geführte Bahn erlaubt eine sehr tiefe Kniebeugung bei aufrechtem Rumpf. Der Quadrizeps wird in gedehnter Position stark belastet — ein besonders wirksamer Wachstumsreiz.'
  },
  {
    id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', aka: 'Einbeinige Kniebeuge erhöht', group: 'quadrizeps', equip: 'kurzhantel', tools: 'Kurzhanteln, Bank', level: 2, compound: true, uni: true,
    primary: ['quadrizeps', 'gesaess'], secondary: ['adduktoren', 'hamstrings'], fig: ['splitSquat', { elevated: true }], sets: 3, reps: [8, 12], rest: 120, step: 2, phases: BEUGEN,
    setup: 'Hinteren Fußrücken auf die Bank legen, vorderen Fuß etwa einen großen Schritt davor. Hanteln seitlich.',
    how: ['Senkrecht nach unten sinken', 'Vorderes Knie über den Fuß, Ferse bleibt am Boden', 'Hinteres Knie fast bis zum Boden', 'Über das vordere Bein hochdrücken'],
    mistakes: ['Vorderer Fuß steht zu nah an der Bank', 'Abstoßen mit dem hinteren Bein', 'Knie kippt nach innen'],
    why: 'Fast das ganze Gewicht liegt auf einem Bein. Das gleicht Seitenunterschiede aus und fordert die Hüftstabilisatoren, die auch beim Laufen jeden Schritt abfangen. Vorgeneigt arbeitet mehr das Gesäß, aufrecht mehr der Quadrizeps.'
  },
  {
    id: 'ausfallschritte', name: 'Ausfallschritte', aka: 'Lunges', group: 'quadrizeps', equip: 'kurzhantel', tools: 'Kurzhanteln', level: 1, compound: true, uni: true,
    primary: ['quadrizeps', 'gesaess'], secondary: ['hamstrings', 'adduktoren'], fig: ['lunge'], sets: 3, reps: [8, 12], rest: 120, step: 2, phases: ['Schritt und absenken · einatmen', 'Zurückdrücken · ausatmen'],
    setup: 'Aufrecht stehen, Hanteln seitlich, Blick geradeaus.',
    how: ['Großen Schritt nach vorn', 'Beide Knie beugen, hinteres Knie Richtung Boden', 'Oberkörper bleibt aufrecht', 'Kraftvoll in den Stand zurückdrücken'],
    mistakes: ['Schritt zu kurz — die Ferse hebt ab', 'Vorderes Knie fällt nach innen', 'Oberkörper kippt nach vorn'],
    why: 'Das vordere Bein bremst erst ab und beschleunigt dann — ähnlich wie beim Laufen. Trainiert Kraft, Balance und Koordination in einem.'
  },
  {
    id: 'step-up', name: 'Step-up', aka: 'Aufsteiger', group: 'quadrizeps', equip: 'kurzhantel', tools: 'Kurzhanteln, Box', level: 1, compound: true, uni: true,
    primary: ['quadrizeps', 'gesaess'], secondary: ['waden'], fig: ['stepUp'], sets: 3, reps: [8, 12], rest: 90, step: 2, phases: ['Hochsteigen · ausatmen', 'Langsam absteigen · einatmen'],
    setup: 'Ein Fuß ganz auf der Box (etwa Kniehöhe), Hanteln seitlich.',
    how: ['Über das obere Bein hochdrücken', 'Oben Hüfte ganz strecken', 'In 3 Sekunden zurück absenken', 'Unteres Bein tippt nur auf'],
    mistakes: ['Abstoßen mit dem unteren Bein', 'Knie fällt nach innen', 'Fallenlassen beim Absteigen'],
    why: 'Die langsame Abwärtsphase belastet Quadrizeps und Gesäß exzentrisch — genau die Arbeit, die beim Bergablaufen anfällt. Gut für Läufer und für stabile Knie.'
  },
  {
    id: 'beinstrecker', name: 'Beinstrecker', aka: 'Leg Extension', group: 'quadrizeps', equip: 'maschine', tools: 'Beinstrecker', level: 1, compound: false,
    primary: ['quadrizeps'], secondary: [], fig: ['legExtension'], sets: 3, reps: [10, 15], rest: 75, step: 5, phases: ['Strecken · ausatmen', 'Langsam senken · einatmen'],
    setup: 'Kniegelenk auf Höhe der Drehachse, Polster knapp über dem Sprunggelenk. Lehne leicht zurück.',
    how: ['Beine ganz strecken', 'Oben eine Sekunde anspannen', 'In 3 Sekunden absenken', 'Unten nicht absetzen'],
    mistakes: ['Schwung und Abheben vom Sitz', 'Nicht ganz strecken', 'Drehachse falsch eingestellt'],
    why: 'Der gerade Oberschenkelmuskel (Rectus femoris) verläuft über Hüfte und Knie. Bei Kniebeugen wird er kaum trainiert, weil er sich an der Hüfte verkürzt, während er das Knie streckt. Der Beinstrecker schließt genau diese Lücke.'
  },

  // ---------- Beinbeuger & Gesäß ----------
  {
    id: 'rdl', name: 'Rumänisches Kreuzheben', aka: 'Romanian Deadlift', group: 'beinbeuger', equip: 'langhantel', tools: 'Langhantel', level: 2, compound: true,
    primary: ['hamstrings', 'gesaess'], secondary: ['ruecken_strecker', 'unterarm'], fig: ['deadlift', { rdl: true }], sets: 3, reps: [6, 10], rest: 150, step: 2.5, phases: ['Hüfte nach hinten schieben · einatmen', 'Hüfte nach vorn · ausatmen'],
    setup: 'Aufrecht stehen, Stange vor den Oberschenkeln, Knie leicht gebeugt und so fixiert.',
    how: ['Hüfte weit nach hinten schieben', 'Stange gleitet an den Beinen entlang', 'Bis zur deutlichen Dehnung, meist Mitte Schienbein', 'Gesäß anspannen, Hüfte nach vorn'],
    mistakes: ['Rücken rundet ein', 'Knie beugen zu stark — es wird eine Kniebeuge', 'Stange entfernt sich vom Körper'],
    why: 'Die Beinbeuger laufen über Hüfte und Knie. Bleibt das Knie fast gestreckt, während die Hüfte beugt, werden sie unter Last stark gedehnt — ein sehr wirksamer Wachstumsreiz und guter Schutz gegen Zerrungen beim Sprinten.'
  },
  {
    id: 'beinbeuger-sitzend', name: 'Beinbeuger sitzend', aka: 'Seated Leg Curl', group: 'beinbeuger', equip: 'maschine', tools: 'Beinbeuger sitzend', level: 1, compound: false,
    primary: ['hamstrings'], secondary: ['waden'], fig: ['legCurlSeated'], sets: 3, reps: [10, 15], rest: 75, step: 5, phases: ['Beugen · ausatmen', 'Langsam strecken · einatmen'],
    setup: 'Knie auf Höhe der Drehachse, Oberschenkelpolster fest, unteres Polster über der Ferse.',
    how: ['Beine fast gestreckt starten', 'Fersen kraftvoll unter den Sitz ziehen', 'Eine Sekunde halten', 'In 3 Sekunden strecken'],
    mistakes: ['Gesäß rutscht nach vorn', 'Halber Weg', 'Schwung'],
    why: 'Im Sitzen ist die Hüfte gebeugt, die Beinbeuger sind vorgedehnt. In einer Studie wuchsen sie so deutlich stärker als beim Beugen im Liegen. Wenn du nur einen Beinbeuger machst, dann diesen.'
  },
  {
    id: 'beinbeuger-liegend', name: 'Beinbeuger liegend', aka: 'Lying Leg Curl', group: 'beinbeuger', equip: 'maschine', tools: 'Beinbeuger liegend', level: 1, compound: false,
    primary: ['hamstrings'], secondary: ['waden'], fig: ['legCurlLying'], sets: 3, reps: [10, 15], rest: 75, step: 5, phases: ['Beugen · ausatmen', 'Langsam strecken · einatmen'],
    setup: 'Bäuchlings, Knie knapp hinter der Polsterkante, Rolle über der Ferse. Hüfte bleibt auf dem Polster.',
    how: ['Fersen Richtung Gesäß ziehen', 'Oben kurz halten', 'Langsam ablassen', 'Unten nicht ganz absetzen'],
    mistakes: ['Hüfte hebt ab', 'Zu schnelles Fallenlassen', 'Füße verdrehen'],
    why: 'Trainiert die Kniebeugung, die Kreuzheben und Kniebeugen nicht abdecken. Gute Ergänzung, wenn keine sitzende Maschine frei ist.'
  },
  {
    id: 'hip-thrust', name: 'Hip Thrust', aka: 'Hüftstoß', group: 'gesaess', equip: 'langhantel', tools: 'Langhantel, Bank, Polster', level: 2, compound: true,
    primary: ['gesaess'], secondary: ['hamstrings', 'quadrizeps'], fig: ['hipThrust'], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: ['Kontrolliert absenken · einatmen', 'Hüfte hochdrücken · ausatmen'],
    setup: 'Schulterblattunterkante an die Bankkante, Stange gepolstert in die Hüftbeuge. Füße so, dass die Schienbeine oben senkrecht stehen.',
    how: ['Kinn zur Brust, Rippen unten', 'Über die Fersen die Hüfte nach oben drücken', 'Oben Gesäß zwei Sekunden hart anspannen', 'Langsam senken'],
    mistakes: ['Hohlkreuz statt Hüftstreckung', 'Füße zu weit weg — die Beinbeuger übernehmen', 'Blick an die Decke mit überstrecktem Nacken'],
    why: 'Das Gesäß streckt die Hüfte — und wird hier am Ende der Bewegung am stärksten belastet, wo Kniebeugen fast entlasten. Eine starke Hüftstreckung macht dich im Sprint und am Berg schneller.'
  },
  {
    id: 'kabel-kickback', name: 'Kickback am Kabel', aka: 'Glute Kickback', group: 'gesaess', equip: 'kabel', tools: 'Kabelzug, Fußschlaufe', level: 1, compound: false, uni: true,
    primary: ['gesaess'], secondary: ['hamstrings'], fig: ['gluteKickback'], sets: 3, reps: [12, 15], rest: 60, step: 2.5, phases: ['Bein nach hinten · ausatmen', 'Langsam zurück · einatmen'],
    setup: 'Schlaufe am Fuß, mit den Händen am Turm festhalten. Oberkörper leicht vorneigen.',
    how: ['Bein gestreckt nach hinten führen', 'Am Ende Gesäß anspannen', 'Becken bleibt gerade', 'Langsam zurück'],
    mistakes: ['Hohlkreuz statt Hüftstreckung', 'Becken dreht auf', 'Schwung'],
    why: 'Isoliert die Hüftstreckung auf einer Seite. Sinnvoll, um das Gesäß ohne zusätzliche Last für Rücken und Knie zu ermüden.'
  },
  {
    id: 'abduktoren', name: 'Abduktorenmaschine', aka: 'Hip Abduction', group: 'gesaess', equip: 'maschine', tools: 'Abduktorenmaschine', level: 1, compound: false,
    primary: ['abduktoren', 'gesaess'], secondary: [], fig: ['abductor'], sets: 3, reps: [12, 20], rest: 60, step: 5, phases: ['Nach außen drücken · ausatmen', 'Langsam schließen · einatmen'],
    setup: 'Polster außen an den Knien. Aufrecht sitzen oder leicht vorlehnen.',
    how: ['Knie nach außen drücken', 'Außen kurz halten', 'Langsam zurück', 'Gewichte nicht absetzen'],
    mistakes: ['Schwung', 'Zu kleiner Weg', 'Rücken rund'],
    why: 'Der mittlere Gesäßmuskel hält das Becken waagerecht, wenn du auf einem Bein stehst — also bei jedem Laufschritt. Ist er schwach, kippt das Becken ab und das Knie fällt nach innen.'
  },
  {
    id: 'adduktoren', name: 'Adduktorenmaschine', aka: 'Hip Adduction', group: 'adduktoren', equip: 'maschine', tools: 'Adduktorenmaschine', level: 1, compound: false,
    primary: ['adduktoren'], secondary: [], fig: ['abductor', { inward: true }], sets: 3, reps: [12, 20], rest: 60, step: 5, phases: ['Zusammendrücken · ausatmen', 'Langsam öffnen · einatmen'],
    setup: 'Polster innen an den Knien. Startweite so wählen, dass du eine leichte Dehnung spürst.',
    how: ['Beine zusammenführen', 'Kurz halten', 'In 3 Sekunden öffnen', 'Dehnung außen zulassen'],
    mistakes: ['Startweite zu groß gewählt', 'Schwung', 'Oberkörper hilft mit'],
    why: 'Die Adduktoren sind eine große Muskelgruppe an der Oberschenkel-Innenseite. Sie stabilisieren das Becken und helfen bei der Hüftstreckung. Kräftige Adduktoren senken das Risiko für Leistenprobleme.'
  },
  {
    id: 'nordic-curl', name: 'Nordic Curl', aka: 'Nordic Hamstring', group: 'beinbeuger', equip: 'koerper', tools: 'Fersenfixierung', level: 3, compound: false, bw: true,
    primary: ['hamstrings'], secondary: ['gesaess', 'waden'], fig: ['nordic'], sets: 3, reps: [4, 8], rest: 120, step: 0, phases: ['So langsam wie möglich ablassen', 'Mit den Händen abdrücken und zurück'],
    setup: 'Auf einem Polster knien, Fersen fixieren. Körper von Knie bis Kopf eine Linie, Hände vor der Brust.',
    how: ['Als Brett langsam nach vorn sinken', 'So lange wie möglich mit den Beinbeugern bremsen', 'Mit den Händen abfangen', 'Abdrücken und zurück in den Kniestand'],
    mistakes: ['Hüfte knickt ab', 'Fallenlassen ohne zu bremsen', 'Zu viele Wiederholungen — Qualität zählt'],
    why: 'Die Beinbeuger bremsen dein Körpergewicht in der Dehnung ab (exzentrisch). Das verlängert die Muskelfasern messbar. In Studien halbierte die Übung etwa die Zahl der Oberschenkelzerrungen — wertvoll für jeden, der läuft.'
  },
  {
    id: 'good-morning', name: 'Good Morning', aka: 'Rumpfbeuge mit Stange', group: 'beinbeuger', equip: 'langhantel', tools: 'Langhantel, Rack', level: 3, compound: true,
    primary: ['hamstrings', 'ruecken_strecker'], secondary: ['gesaess'], fig: ['goodMorning'], sets: 3, reps: [8, 12], rest: 120, step: 2.5, phases: ['Hüfte nach hinten · einatmen', 'Aufrichten · ausatmen'],
    setup: 'Stange wie bei der Kniebeuge auf dem Rücken. Knie leicht gebeugt, Rumpf fest.',
    how: ['Hüfte weit nach hinten schieben', 'Oberkörper mit geradem Rücken vorneigen', 'Bis zur Dehnung in der Beinrückseite', 'Über die Hüfte aufrichten'],
    mistakes: ['Rundrücken', 'Zu schwer begonnen', 'Knie beugen nach'],
    why: 'Die Last sitzt weit weg von der Hüfte — der Hebel ist lang. Schon wenig Gewicht fordert Beinbeuger und Rückenstrecker stark. Mit leichtem Gewicht beginnen.'
  },
  {
    id: 'kb-swing', name: 'Kettlebell Swing', aka: 'KB-Schwung', group: 'gesaess', equip: 'kettlebell', tools: 'Kettlebell', level: 2, compound: true,
    primary: ['gesaess', 'hamstrings'], secondary: ['ruecken_strecker', 'bauch', 'unterarm'], fig: ['kbSwing'], sets: 3, reps: [12, 20], rest: 90, step: 4, phases: ['Hüfte explosiv strecken · ausatmen', 'Zurückschwingen lassen · einatmen'],
    setup: 'Kettlebell eine Fußlänge vor dir. Hüfte zurück, Rücken gerade, Kettlebell zu dir kippen.',
    how: ['Kettlebell zwischen die Beine nach hinten schwingen', 'Hüfte explosiv nach vorn strecken', 'Die Arme sind nur Seile — bis Brusthöhe', 'Zurückfallen lassen und in die Hüfte ausweichen'],
    mistakes: ['Kniebeuge statt Hüftbewegung', 'Arme heben das Gewicht', 'Oben ins Hohlkreuz lehnen'],
    why: 'Eine schnelle, kraftvolle Hüftstreckung — die gleiche Bewegung wie beim Sprint und Sprung. Trainiert Schnellkraft der hinteren Kette und nebenbei den Kreislauf.'
  },

  // ---------- Waden ----------
  {
    id: 'wadenheben-stehend', name: 'Wadenheben stehend', aka: 'Standing Calf Raise', group: 'waden', equip: 'maschine', tools: 'Wadenmaschine oder Stufe', level: 1, compound: false,
    primary: ['waden'], secondary: [], fig: ['calfRaise'], sets: 3, reps: [8, 15], rest: 75, step: 5, phases: ['Hochdrücken · ausatmen', 'Langsam tief senken · einatmen'],
    setup: 'Fußballen auf die Kante, Fersen frei. Knie gestreckt, Polster auf den Schultern.',
    how: ['Fersen tief absenken und 1–2 Sekunden in der Dehnung bleiben', 'Kraftvoll auf die Zehenspitzen', 'Oben kurz halten', 'Langsam zurück'],
    mistakes: ['Wippen ohne Dehnung unten', 'Knie beugen mit', 'Über die Außenkante abrollen'],
    why: 'Der Zwillingswadenmuskel läuft über das Knie — bei gestrecktem Bein arbeitet er voll. Die gedehnte untere Position bringt hier nachweislich das meiste Wachstum. Kräftige Waden und eine belastbare Achillessehne sind die Basis für jeden Laufschritt.'
  },
  {
    id: 'wadenheben-sitzend', name: 'Wadenheben sitzend', aka: 'Seated Calf Raise', group: 'waden', equip: 'maschine', tools: 'Wadenmaschine sitzend', level: 1, compound: false,
    primary: ['waden'], secondary: [], fig: ['calfRaise', { seated: true }], sets: 3, reps: [10, 20], rest: 60, step: 5, phases: ['Hochdrücken · ausatmen', 'Langsam tief senken · einatmen'],
    setup: 'Fußballen auf die Kante, Polster knapp über den Knien.',
    how: ['Fersen tief absenken', 'Unten kurz in der Dehnung bleiben', 'Hochdrücken', 'Oben halten'],
    mistakes: ['Federn', 'Zu kleiner Weg', 'Polster drückt auf die Kniescheibe'],
    why: 'Bei gebeugtem Knie ist der Zwillingswadenmuskel entspannt, der darunterliegende Schollenmuskel (Soleus) übernimmt. Er leistet beim Laufen die meiste Arbeit und reagiert gut auf höhere Wiederholungszahlen.'
  }
];
