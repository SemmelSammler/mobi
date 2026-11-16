// Studio-Übungen · Oberkörper (Brust, Rücken, Schultern)
// Felder: fig = Bewegungsvorlage, sets/reps/rest = Standard-Dosierung (Muskelaufbau),
// step = sinnvoller Gewichtssprung in kg, phases = Text zu Weg A→B und B→A der Animation.
const DRUECKEN = ['Kontrolliert absenken · einatmen', 'Kraftvoll drücken · ausatmen'];
const ZIEHEN = ['Ziehen · ausatmen', 'Langsam zurückführen · einatmen'];
const HEBEN = ['Heben · ausatmen', 'Langsam senken · einatmen'];

export const GYM_OBER = [
  // ---------- Brust ----------
  {
    id: 'bankdruecken', name: 'Bankdrücken', aka: 'Bench Press', group: 'brust', equip: 'langhantel', tools: 'Langhantel, Flachbank', level: 2, compound: true,
    primary: ['brust'], secondary: ['schulter_v', 'trizeps'], fig: ['benchPress'], sets: 4, reps: [6, 10], rest: 150, step: 2.5, phases: DRUECKEN,
    setup: 'Augen unter der Stange, Schulterblätter nach hinten-unten ziehen, Füße fest am Boden. Griff etwas breiter als schulterbreit.',
    how: ['Stange aus der Ablage über die Schultern führen, Arme gestreckt', 'In 2–3 Sekunden zur unteren Brust senken, Ellbogen etwa 45–70° vom Körper', 'Stange berührt leicht die Brust — ohne Abprallen', 'In leichtem Bogen zurück über die Schultern drücken'],
    mistakes: ['Schulterblätter lösen sich — die Schultern rollen nach vorn und übernehmen', 'Stange prallt von der Brust ab', 'Gesäß hebt von der Bank ab', 'Ellbogen stehen im 90°-Winkel ab — belastet das Schultergelenk'],
    why: 'Der große Brustmuskel führt den Oberarm vor dem Körper zusammen (horizontale Adduktion). Beim Bankdrücken arbeitet er unter hoher Last über einen großen Weg — besonders am tiefsten Punkt, wo er gedehnt ist. Vordere Schulter und Trizeps strecken den Arm mit.'
  },
  {
    id: 'schraegbank-lh', name: 'Schrägbankdrücken', aka: 'Incline Bench Press', group: 'brust', equip: 'langhantel', tools: 'Langhantel, Schrägbank 30°', level: 2, compound: true,
    primary: ['brust', 'schulter_v'], secondary: ['trizeps'], fig: ['benchPress', { incline: true }], sets: 3, reps: [6, 10], rest: 150, step: 2.5, phases: DRUECKEN,
    setup: 'Bank auf etwa 30° stellen. Schulterblätter fixieren, Füße fest aufstellen.',
    how: ['Stange über dem oberen Brustbein halten', 'Kontrolliert zum Schlüsselbein-Ansatz der Brust senken', 'Unterarme bleiben senkrecht unter der Stange', 'Gerade nach oben drücken'],
    mistakes: ['Bank zu steil (über 45°) — dann ist es ein Schulterdrücken', 'Stange landet zu tief auf der Brust', 'Hohlkreuz hebt den Winkel wieder auf'],
    why: 'Durch die Schräge zeigt der Kraftvektor mehr nach oben. Das verschiebt die Arbeit zu den oberen Fasern des Brustmuskels (Schlüsselbein-Anteil) und zur vorderen Schulter. Rund 30° treffen die obere Brust gut, ohne die Schulter dominieren zu lassen.'
  },
  {
    id: 'kh-bankdruecken', name: 'Kurzhantel-Bankdrücken', aka: 'Dumbbell Bench Press', group: 'brust', equip: 'kurzhantel', tools: 'Kurzhanteln, Flachbank', level: 1, compound: true,
    primary: ['brust'], secondary: ['schulter_v', 'trizeps'], fig: ['benchPress', { db: true }], sets: 3, reps: [8, 12], rest: 120, step: 2, phases: DRUECKEN,
    setup: 'Hanteln auf den Oberschenkeln ablegen, beim Zurücklegen mit den Knien hochschwingen. Schulterblätter zusammen.',
    how: ['Hanteln über der Brust, Handflächen zeigen zu den Füßen', 'Weit absenken, bis die Hanteln neben der Brust sind', 'Kurz die Dehnung spüren', 'Nach oben und leicht zueinander drücken, ohne anzuschlagen'],
    mistakes: ['Zu kurzer Weg — die Dehnung unten ist der wertvollste Teil', 'Hanteln wandern Richtung Gesicht', 'Handgelenke knicken nach hinten ab'],
    why: 'Ohne Stange können die Hände tiefer sinken und oben zusammenlaufen. Der Brustmuskel arbeitet dadurch über einen größeren Weg und wird unten stärker gedehnt. Jede Seite muss ihre Hantel selbst stabilisieren — Kraftunterschiede gleichen sich aus.'
  },
  {
    id: 'schraegbank-kh', name: 'Schrägbank-Kurzhanteldrücken', aka: 'Incline Dumbbell Press', group: 'brust', equip: 'kurzhantel', tools: 'Kurzhanteln, Schrägbank 30°', level: 1, compound: true,
    primary: ['brust', 'schulter_v'], secondary: ['trizeps'], fig: ['benchPress', { incline: true, db: true }], sets: 3, reps: [8, 12], rest: 120, step: 2, phases: DRUECKEN,
    setup: 'Bank auf 30° stellen. Schulterblätter nach hinten-unten, Brust raus.',
    how: ['Hanteln über den Schultern, Arme fast gestreckt', 'In einem Bogen neben die obere Brust senken', 'Ellbogen bleiben unter den Handgelenken', 'Nach oben drücken und oben nicht ausruhen'],
    mistakes: ['Schultern schieben oben nach vorn', 'Ellbogen wandern hinter die Schulterlinie', 'Bank zu steil eingestellt'],
    why: 'Kombiniert die Vorteile der Schräge (obere Brustfasern) mit dem größeren Bewegungsweg der Kurzhanteln. Eine der wirksamsten Übungen für die obere Brust.'
  },
  {
    id: 'brustpresse', name: 'Brustpresse', aka: 'Chest Press Maschine', group: 'brust', equip: 'maschine', tools: 'Brustpresse', level: 1, compound: true,
    primary: ['brust'], secondary: ['schulter_v', 'trizeps'], fig: ['machinePress'], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: ['Langsam zurückführen · einatmen', 'Nach vorn drücken · ausatmen'],
    setup: 'Sitzhöhe so einstellen, dass die Griffe auf Höhe der mittleren Brust liegen. Rücken und Schulterblätter am Polster.',
    how: ['Griffe fassen, Ellbogen leicht unter Schulterhöhe', 'Nach vorn drücken, bis die Arme fast gestreckt sind', 'Langsam zurück, bis die Brust deutlich gedehnt ist', 'Gewichte nicht absetzen — Spannung halten'],
    mistakes: ['Sitz zu tief — die Griffe liegen auf Schulterhöhe', 'Schultern lösen sich vom Polster', 'Nur halber Weg zurück'],
    why: 'Die geführte Bahn nimmt dir das Stabilisieren ab. So kannst du die Brust sicher bis nah ans Muskelversagen belasten — ideal am Ende einer Einheit oder wenn du ohne Trainingspartner schwer drücken willst.'
  },
  {
    id: 'butterfly', name: 'Butterfly', aka: 'Pec Deck', group: 'brust', equip: 'maschine', tools: 'Butterfly-Maschine', level: 1, compound: false,
    primary: ['brust'], secondary: ['schulter_v'], fig: ['pecDeck'], sets: 3, reps: [10, 15], rest: 75, step: 5, phases: ['Zusammenführen · ausatmen', 'Langsam öffnen · einatmen'],
    setup: 'Sitzhöhe: Oberarme waagerecht, Ellbogen leicht gebeugt. Rücken bleibt am Polster.',
    how: ['Arme weit geöffnet, Dehnung in der Brust spüren', 'Mit der Brust die Arme zusammenführen — Hände führen nicht', 'Vorn eine Sekunde anspannen', 'Langsam wieder weit öffnen'],
    mistakes: ['Schultern rollen nach vorn', 'Schwung aus dem Oberkörper', 'Arme werden gestreckt und gebeugt statt geführt'],
    why: 'Reine horizontale Adduktion: genau die Hauptfunktion des Brustmuskels, ohne dass der Trizeps begrenzt. Die Maschine hält die Spannung über den ganzen Weg — auch vorn, wo Kurzhanteln entlastet wären.'
  },
  {
    id: 'kabel-flys', name: 'Kabelzug-Flys', aka: 'Cable Crossover', group: 'brust', equip: 'kabel', tools: 'Kabelzug, zwei Griffe', level: 2, compound: false,
    primary: ['brust'], secondary: ['schulter_v'], fig: ['cableFly'], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: ['Zusammenführen · ausatmen', 'Langsam öffnen · einatmen'],
    setup: 'Rollen über Kopfhöhe. Einen Schritt nach vorn, leichte Schrittstellung, Oberkörper minimal vorgeneigt.',
    how: ['Arme weit, Ellbogen leicht gebeugt und fixiert', 'Hände in einem Bogen vor dem Bauch zusammenführen', 'Kurz halten, Brust fest anspannen', 'Langsam öffnen, bis die Brust gedehnt ist'],
    mistakes: ['Ellbogenwinkel ändert sich — es wird ein Drücken', 'Zu viel Gewicht, der Körper wird nach hinten gezogen', 'Schultern ziehen hoch'],
    why: 'Der Zug von oben-außen folgt dem Faserverlauf der unteren und mittleren Brust. Anders als bei freien Gewichten bleibt der Widerstand am Kabel auch bei geschlossenen Armen erhalten.'
  },
  {
    id: 'kabel-flys-tief', name: 'Kabel-Flys von unten', aka: 'Low-to-High Cable Fly', group: 'brust', equip: 'kabel', tools: 'Kabelzug, zwei Griffe', level: 2, compound: false,
    primary: ['brust', 'schulter_v'], secondary: [], fig: ['cableFly', { lowToHigh: true }], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: ['Nach oben zusammenführen · ausatmen', 'Langsam senken · einatmen'],
    setup: 'Rollen ganz unten. Einen Schritt nach vorn, Handflächen zeigen nach vorn-oben.',
    how: ['Arme seitlich unten, Ellbogen leicht gebeugt', 'Hände in einem Bogen bis vor das Gesicht führen', 'Oben kurz anspannen', 'Kontrolliert zurück'],
    mistakes: ['Arme werden gebeugt wie beim Curl', 'Schultern ziehen zu den Ohren', 'Hohlkreuz'],
    why: 'Die Bewegung von unten nach oben entspricht dem Faserverlauf des oberen Brustanteils. Eine gelenkschonende Ergänzung zum Schrägbankdrücken.'
  },
  {
    id: 'liegestuetz', name: 'Liegestütz', aka: 'Push-up', group: 'brust', equip: 'koerper', tools: 'Körpergewicht', level: 1, compound: true, bw: true,
    primary: ['brust'], secondary: ['schulter_v', 'trizeps', 'bauch'], fig: ['pushUp'], sets: 3, reps: [8, 20], rest: 90, step: 0, phases: DRUECKEN,
    setup: 'Hände etwas breiter als schulterbreit, Körper von Kopf bis Ferse eine Linie. Gesäß und Bauch anspannen.',
    how: ['Brust in 2 Sekunden Richtung Boden senken', 'Ellbogen zeigen etwa 45° nach hinten', 'Brust berührt fast den Boden', 'Als Brett nach oben drücken'],
    mistakes: ['Hüfte hängt durch', 'Kopf schiebt nach vorn', 'Nur halbe Tiefe'],
    why: 'Mechanisch ein Bankdrücken mit dem eigenen Körper (etwa 65 % des Gewichts). Zusätzlich muss der Rumpf den Körper als Brett halten, und die Schulterblätter bewegen sich frei — gut für die Schultergesundheit.'
  },
  {
    id: 'dips', name: 'Dips', aka: 'Barrenstütz', group: 'brust', equip: 'koerper', tools: 'Dip-Barren', level: 3, compound: true, bw: true,
    primary: ['brust', 'trizeps'], secondary: ['schulter_v'], fig: ['dip'], sets: 3, reps: [6, 12], rest: 150, step: 2.5, phases: DRUECKEN,
    setup: 'Im Stütz starten, Schultern tief, Beine hinten angewinkelt. Für mehr Brust: Oberkörper leicht nach vorn neigen.',
    how: ['Langsam absenken, Ellbogen zeigen nach hinten', 'Bis die Oberarme etwa waagerecht sind', 'Schultern bleiben weg von den Ohren', 'Kraftvoll in den Stütz drücken'],
    mistakes: ['Zu tief mit nach vorn rollenden Schultern', 'Schwung aus den Beinen', 'Ellbogen flattern nach außen'],
    why: 'Du bewegst dein ganzes Körpergewicht über einen großen Weg. Die Brust wird unten stark gedehnt, der Trizeps streckt den Arm gegen hohe Last. Aufrecht arbeitet mehr der Trizeps, vorgeneigt mehr die untere Brust.'
  },

  // ---------- Rücken ----------
  {
    id: 'klimmzug', name: 'Klimmzug', aka: 'Pull-up', group: 'ruecken', equip: 'koerper', tools: 'Klimmzugstange', level: 3, compound: true, bw: true,
    primary: ['lat'], secondary: ['bizeps', 'oberer_ruecken', 'unterarm'], fig: ['pullUp'], sets: 4, reps: [5, 10], rest: 150, step: 2.5, phases: ['Hochziehen · ausatmen', 'Langsam ablassen · einatmen'],
    setup: 'Griff etwas breiter als schulterbreit, Handflächen nach vorn. Aus dem langen Hang starten, Beine ruhig.',
    how: ['Schulterblätter nach unten ziehen — das startet die Bewegung', 'Ellbogen Richtung Hüfte ziehen', 'Kinn über die Stange, Brust Richtung Stange', 'In 2–3 Sekunden bis in den langen Hang ablassen'],
    mistakes: ['Halbe Wiederholungen ohne gestreckte Arme', 'Schwung aus den Beinen', 'Schultern bleiben an den Ohren'],
    why: 'Der Latissimus zieht den Oberarm von oben an den Körper heran. Im Hang ist er maximal gedehnt, und du bewegst dein volles Körpergewicht — ein starker Reiz für Rückenbreite und Griffkraft. Zu schwer? Nutze die Klimmzugmaschine oder den Latzug.'
  },
  {
    id: 'latzug', name: 'Latzug', aka: 'Lat Pulldown', group: 'ruecken', equip: 'kabel', tools: 'Latzug, breite Stange', level: 1, compound: true,
    primary: ['lat'], secondary: ['bizeps', 'oberer_ruecken'], fig: ['pulldown'], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: ['Zur Brust ziehen · ausatmen', 'Langsam nach oben · einatmen'],
    setup: 'Oberschenkel unter dem Polster fixieren. Stange etwas breiter als schulterbreit greifen, Oberkörper minimal zurücklehnen.',
    how: ['Arme lang, Lat gedehnt', 'Schulterblätter nach unten, dann Ellbogen zur Hüfte ziehen', 'Stange zum oberen Brustbein', 'Langsam bis zur vollen Streckung zurück'],
    mistakes: ['Weit nach hinten lehnen und mit Schwung reißen', 'Stange hinter den Nacken ziehen', 'Oben nicht ganz strecken'],
    why: 'Gleiche Zugrichtung wie der Klimmzug, aber mit frei wählbarem Gewicht. So triffst du den Wiederholungsbereich genau und kannst den Lat oben bewusst in die Dehnung lassen.'
  },
  {
    id: 'latzug-eng', name: 'Latzug eng', aka: 'Neutralgriff', group: 'ruecken', equip: 'kabel', tools: 'Latzug, V-Griff', level: 1, compound: true,
    primary: ['lat'], secondary: ['bizeps', 'oberer_ruecken'], fig: ['pulldown', { close: true }], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: ['Zur Brust ziehen · ausatmen', 'Langsam nach oben · einatmen'],
    setup: 'Engen Griff mit zueinander zeigenden Handflächen einhängen. Brust raus, Blick leicht nach oben.',
    how: ['Arme ganz strecken, Schultern dürfen leicht mit hochgehen', 'Ellbogen eng am Körper nach unten ziehen', 'Griff zum Brustbein', 'Kontrolliert zurück in die Dehnung'],
    mistakes: ['Rundrücken beim Ziehen', 'Ellbogen wandern nach außen', 'Zu viel Rücklage'],
    why: 'Mit engem Neutralgriff bewegt sich der Oberarm vor dem Körper nach unten (Schulterstreckung). Das belastet den Lat über einen besonders langen Weg und ist für viele Schultern die angenehmste Zugvariante.'
  },
  {
    id: 'lh-rudern', name: 'Langhantelrudern', aka: 'Bent-over Row', group: 'ruecken', equip: 'langhantel', tools: 'Langhantel', level: 2, compound: true,
    primary: ['oberer_ruecken', 'lat'], secondary: ['bizeps', 'ruecken_strecker', 'schulter_h'], fig: ['bentRow'], sets: 4, reps: [6, 10], rest: 150, step: 2.5, phases: ZIEHEN,
    setup: 'Hüftbreit stehen, Knie leicht gebeugt, aus der Hüfte vorbeugen bis der Oberkörper etwa 45° oder flacher steht. Rücken gerade.',
    how: ['Stange hängt unter den Schultern', 'Zum unteren Rippenbogen ziehen, Ellbogen nah am Körper', 'Schulterblätter oben zusammenziehen', 'Kontrolliert ablassen, Rücken bleibt stabil'],
    mistakes: ['Oberkörper richtet sich bei jeder Wiederholung auf', 'Rundrücken', 'Mit den Armen reißen statt mit dem Rücken ziehen'],
    why: 'Rudern zieht die Schulterblätter zusammen und den Oberarm nach hinten: Trapez, Rautenmuskeln, hintere Schulter und Lat arbeiten gemeinsam. Der Rückenstrecker hält dabei die vorgebeugte Haltung — das macht die Übung schwer, aber sehr umfassend.'
  },
  {
    id: 'kh-rudern', name: 'Kurzhantelrudern einarmig', aka: 'One-arm Row', group: 'ruecken', equip: 'kurzhantel', tools: 'Kurzhantel, Flachbank', level: 1, compound: true, uni: true,
    primary: ['lat', 'oberer_ruecken'], secondary: ['bizeps', 'schulter_h'], fig: ['oneArmRow'], sets: 3, reps: [8, 12], rest: 90, step: 2, phases: ZIEHEN,
    setup: 'Eine Hand und das gleichseitige Knie auf die Bank, Rücken waagerecht. Der andere Fuß steht stabil am Boden.',
    how: ['Hantel hängt lang unter der Schulter', 'Ellbogen nah am Körper Richtung Hüfte ziehen', 'Oben kurz halten', 'Langsam ablassen und die Schulter leicht vorlassen'],
    mistakes: ['Oberkörper dreht mit auf', 'Hantel wird zur Schulter statt zur Hüfte gezogen', 'Schwung aus dem ganzen Körper'],
    why: 'Die Bank stützt den Rumpf, der untere Rücken ist entlastet. Einarmig kannst du weiter nach hinten ziehen und unten weiter dehnen als mit der Stange — und du merkst sofort, wenn eine Seite schwächer ist.'
  },
  {
    id: 'kabelrudern', name: 'Rudern am Kabelzug', aka: 'Seated Cable Row', group: 'ruecken', equip: 'kabel', tools: 'Ruderzug, V-Griff', level: 1, compound: true,
    primary: ['oberer_ruecken', 'lat'], secondary: ['bizeps', 'schulter_h'], fig: ['seatedRow'], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: ZIEHEN,
    setup: 'Füße auf die Platte, Knie leicht gebeugt, aufrecht sitzen. Griff mit gestreckten Armen fassen.',
    how: ['Schultern nach vorn in die Dehnung lassen', 'Erst Schulterblätter zurück, dann Ellbogen nach hinten', 'Griff zum Bauchnabel', 'Langsam nach vorn, Oberkörper bleibt fast aufrecht'],
    mistakes: ['Weit vor- und zurückschaukeln', 'Schultern ziehen hoch', 'Rundrücken in der Vorlage'],
    why: 'Das Kabel hält den Zug über den gesamten Weg konstant. Du kannst die Schulterblätter vorn bewusst auseinandergleiten lassen — das trainiert Trapez und Rautenmuskeln über ihren vollen Weg.'
  },
  {
    id: 'rudermaschine', name: 'Rudermaschine brustgestützt', aka: 'Chest-supported Row', group: 'ruecken', equip: 'maschine', tools: 'Rudermaschine', level: 1, compound: true,
    primary: ['oberer_ruecken', 'lat'], secondary: ['bizeps', 'schulter_h'], fig: ['seatedRow', { machine: true }], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: ZIEHEN,
    setup: 'Brustpolster so einstellen, dass du die Griffe mit gestreckten Armen gerade erreichst. Brust bleibt am Polster.',
    how: ['Arme lang, Schultern leicht vor', 'Ellbogen nach hinten ziehen', 'Schulterblätter eine Sekunde zusammendrücken', 'Langsam zurück in die Dehnung'],
    mistakes: ['Brust löst sich vom Polster', 'Halber Weg nach vorn', 'Nacken verkrampft'],
    why: 'Das Polster übernimmt die Stabilisierung. Der untere Rücken ermüdet nicht mit, und du kannst den oberen Rücken isoliert bis nah ans Muskelversagen bringen — ideal an Tagen mit Kreuzheben oder Kniebeugen.'
  },
  {
    id: 't-bar-rudern', name: 'T-Bar-Rudern', aka: 'T-Bar Row', group: 'ruecken', equip: 'langhantel', tools: 'T-Bar oder Langhantel in der Ecke', level: 2, compound: true,
    primary: ['oberer_ruecken', 'lat'], secondary: ['bizeps', 'ruecken_strecker'], fig: ['bentRow', { tbar: true }], sets: 3, reps: [8, 12], rest: 120, step: 2.5, phases: ZIEHEN,
    setup: 'Über der Stange stehen, Griff fassen, Hüfte nach hinten schieben. Rücken gerade, Brust raus.',
    how: ['Arme lang, Gewicht knapp über dem Boden', 'Griff zur Brust ziehen', 'Oben kurz anspannen', 'Kontrolliert senken'],
    mistakes: ['Aufrichten mit jeder Wiederholung', 'Rundrücken', 'Zu große Scheiben verkürzen den Weg'],
    why: 'Die Stange dreht um einen festen Punkt. Dadurch ist die Bahn stabiler als beim freien Langhantelrudern, und du kannst schwer laden — ein starker Reiz für die Rückendicke.'
  },
  {
    id: 'kabel-ueberzug', name: 'Überzug am Kabel', aka: 'Straight-arm Pulldown', group: 'ruecken', equip: 'kabel', tools: 'Kabelzug, Seil oder Stange', level: 2, compound: false,
    primary: ['lat'], secondary: ['trizeps', 'bauch'], fig: ['straightArmPulldown'], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: ['Zu den Oberschenkeln ziehen · ausatmen', 'Langsam nach oben · einatmen'],
    setup: 'Rolle oben. Einen Schritt zurück, Oberkörper leicht vorneigen, Arme fast gestreckt.',
    how: ['Hände über Kopfhöhe, Lat gedehnt', 'Mit gestreckten Armen in einem Bogen nach unten ziehen', 'Hände bis an die Oberschenkel', 'Langsam zurück nach oben'],
    mistakes: ['Ellbogen beugen — der Trizeps übernimmt', 'Oberkörper wippt mit', 'Schultern ziehen hoch'],
    why: 'Der Lat streckt die Schulter — hier ohne Hilfe des Bizeps. Deshalb begrenzt nicht die Armkraft, sondern wirklich der Lat. Gut als Vor- oder Nachermüdung zu Klimmzügen und Latzug.'
  },
  {
    id: 'kreuzheben', name: 'Kreuzheben', aka: 'Deadlift', group: 'ruecken', equip: 'langhantel', tools: 'Langhantel', level: 3, compound: true,
    primary: ['gesaess', 'hamstrings', 'ruecken_strecker'], secondary: ['quadrizeps', 'trapez', 'unterarm', 'lat'], fig: ['deadlift'], sets: 3, reps: [3, 6], rest: 180, step: 5, phases: ['Kontrolliert ablegen · Rücken bleibt gerade', 'Boden wegdrücken und aufrichten · ausatmen'],
    setup: 'Stange über der Fußmitte, Schienbeine berühren sie fast. Griff schulterbreit, Rücken gerade, Lat anspannen („Achseln zu“).',
    how: ['Tief einatmen, Bauch fest', 'Boden wegdrücken — Hüfte und Schultern steigen gleichzeitig', 'Stange bleibt nah am Körper', 'Oben Hüfte strecken, nicht überstrecken', 'Hüfte zuerst zurück, Stange kontrolliert ablegen'],
    mistakes: ['Rundrücken im unteren Rücken', 'Hüfte schießt zuerst hoch', 'Stange entfernt sich vom Körper', 'Oben ins Hohlkreuz lehnen'],
    why: 'Die gesamte hintere Kette streckt Hüfte und Knie gegen sehr hohe Last. Der Rückenstrecker arbeitet haltend (isometrisch) und wird dabei stark. Wegen der hohen Gesamtbelastung reichen wenige schwere Sätze. Lege es nicht direkt vor einen harten Lauftag.'
  },
  {
    id: 'hyperextension', name: 'Rückenstrecken', aka: 'Hyperextension 45°', group: 'unterer_ruecken', equip: 'koerper', tools: 'Rückenstrecker-Bank', level: 1, compound: false, bw: true,
    primary: ['ruecken_strecker', 'gesaess'], secondary: ['hamstrings'], fig: ['backExtension'], sets: 3, reps: [10, 15], rest: 75, step: 2.5, phases: ['Langsam vorbeugen · einatmen', 'Aufrichten bis zur Linie · ausatmen'],
    setup: 'Polster knapp unter dem Beckenknochen, Füße fixiert. Arme vor der Brust kreuzen.',
    how: ['Mit geradem Rücken aus der Hüfte nach vorn sinken', 'Unten die Dehnung in der Beinrückseite spüren', 'Gesäß anspannen und aufrichten', 'Stoppen, wenn der Körper eine gerade Linie bildet'],
    mistakes: ['Oben ins Hohlkreuz überstrecken', 'Schwung holen', 'Polster zu hoch — die Hüfte kann nicht beugen'],
    why: 'Trainiert den Rückenstrecker dynamisch und mit wenig Stauchung der Wirbelsäule. Ein belastbarer unterer Rücken trägt dich durch Kniebeugen, Kreuzheben und lange Läufe.'
  },
  {
    id: 'shrugs', name: 'Shrugs', aka: 'Schulterheben', group: 'ruecken', equip: 'kurzhantel', tools: 'Kurzhanteln', level: 1, compound: false,
    primary: ['trapez'], secondary: ['unterarm'], fig: ['shrug'], sets: 3, reps: [10, 15], rest: 75, step: 2, phases: ['Schultern heben · ausatmen', 'Langsam senken · einatmen'],
    setup: 'Aufrecht stehen, Hanteln seitlich, Arme lang, Blick geradeaus.',
    how: ['Schultern gerade nach oben zu den Ohren ziehen', 'Oben eine Sekunde halten', 'Langsam ganz absenken — Dehnung zulassen', 'Arme bleiben gestreckt'],
    mistakes: ['Schultern kreisen', 'Kopf schiebt nach vorn', 'Arme beugen mit'],
    why: 'Der obere Trapezmuskel hebt das Schulterblatt. Shrugs belasten genau diese Funktion direkt. Die volle Dehnung unten macht den Unterschied.'
  },

  // ---------- Schultern ----------
  {
    id: 'schulterdruecken-lh', name: 'Schulterdrücken stehend', aka: 'Overhead Press', group: 'schultern', equip: 'langhantel', tools: 'Langhantel', level: 2, compound: true,
    primary: ['schulter_v', 'schulter_s'], secondary: ['trizeps', 'trapez', 'bauch'], fig: ['overheadPress'], sets: 3, reps: [6, 10], rest: 150, step: 2.5, phases: DRUECKEN,
    setup: 'Stange auf dem oberen Brustbein, Griff knapp außerhalb der Schultern. Gesäß und Bauch fest.',
    how: ['Stange gerade nach oben drücken, Kopf kurz zurücknehmen', 'Oben den Kopf „durch das Fenster“ schieben', 'Arme gestreckt, Stange über der Fußmitte', 'Kontrolliert zurück zum Brustbein'],
    mistakes: ['Starkes Hohlkreuz', 'Stange wandert nach vorn', 'Schwung aus den Beinen'],
    why: 'Die Schulter hebt den Arm über Kopf, der Trizeps streckt ihn. Im Stehen muss der ganze Rumpf die Last über dem Körper stabilisieren — das macht die Übung zu einem Krafttest für den gesamten Oberkörper.'
  },
  {
    id: 'schulterdruecken-kh', name: 'Kurzhantel-Schulterdrücken', aka: 'Dumbbell Shoulder Press', group: 'schultern', equip: 'kurzhantel', tools: 'Kurzhanteln, Bank mit Lehne', level: 1, compound: true,
    primary: ['schulter_v', 'schulter_s'], secondary: ['trizeps', 'trapez'], fig: ['overheadPress', { db: true, seated: true }], sets: 3, reps: [8, 12], rest: 120, step: 2, phases: DRUECKEN,
    setup: 'Lehne fast senkrecht (75–80°). Hanteln auf Schulterhöhe, Ellbogen leicht vor dem Körper.',
    how: ['Hanteln nach oben drücken, bis die Arme fast gestreckt sind', 'Oben nicht zusammenschlagen', 'Langsam senken, bis die Hanteln auf Ohrhöhe sind', 'Unterarme bleiben senkrecht'],
    mistakes: ['Hohlkreuz weg von der Lehne', 'Ellbogen weit hinter dem Körper', 'Nur das obere Drittel bewegen'],
    why: 'Die Lehne nimmt den Rumpf aus der Gleichung, die Schulter arbeitet isolierter. Mit Kurzhanteln findet jedes Schultergelenk seine eigene, angenehme Bahn.'
  },
  {
    id: 'schulterpresse', name: 'Schulterpresse', aka: 'Shoulder Press Maschine', group: 'schultern', equip: 'maschine', tools: 'Schulterpresse', level: 1, compound: true,
    primary: ['schulter_v', 'schulter_s'], secondary: ['trizeps'], fig: ['machinePress', { overhead: true }], sets: 3, reps: [8, 12], rest: 120, step: 5, phases: DRUECKEN,
    setup: 'Sitz so einstellen, dass die Griffe auf Schulterhöhe starten. Rücken am Polster.',
    how: ['Griffe nach oben drücken', 'Arme fast strecken', 'Langsam bis auf Schulterhöhe senken', 'Spannung halten, nicht absetzen'],
    mistakes: ['Sitz zu hoch — der Weg wird kurz', 'Rücken löst sich vom Polster', 'Schultern ziehen zu den Ohren'],
    why: 'Sichere, geführte Variante des Überkopfdrückens. Du kannst die Schultern ohne Balance-Anspruch ausbelasten.'
  },
  {
    id: 'seitheben', name: 'Seitheben', aka: 'Lateral Raise', group: 'schultern', equip: 'kurzhantel', tools: 'Kurzhanteln', level: 1, compound: false,
    primary: ['schulter_s'], secondary: ['trapez'], fig: ['lateralRaise'], sets: 3, reps: [12, 20], rest: 60, step: 1, phases: HEBEN,
    setup: 'Aufrecht stehen, Hanteln seitlich, Ellbogen minimal gebeugt, Oberkörper ganz leicht vorgeneigt.',
    how: ['Arme seitlich anheben — die Ellbogen führen', 'Bis knapp auf Schulterhöhe', 'Oben kurz halten', 'In 2–3 Sekunden senken'],
    mistakes: ['Schwung aus dem Oberkörper', 'Schultern ziehen zu den Ohren', 'Hände höher als die Ellbogen', 'Zu schwer — leichte Hanteln reichen völlig'],
    why: 'Der seitliche Deltamuskel spreizt den Arm ab. Bei Drückübungen arbeitet er kaum mit — deshalb braucht er für breite Schultern eigenes Training. Der Hebel ist lang: wenig Gewicht erzeugt viel Spannung.'
  },
  {
    id: 'kabel-seitheben', name: 'Seitheben am Kabel', aka: 'Cable Lateral Raise', group: 'schultern', equip: 'kabel', tools: 'Kabelzug, ein Griff', level: 2, compound: false, uni: true,
    primary: ['schulter_s'], secondary: ['trapez'], fig: ['lateralRaise', { cable: true }], sets: 3, reps: [12, 20], rest: 60, step: 2.5, phases: HEBEN,
    setup: 'Rolle ganz unten. Seitlich zum Turm stehen, den Griff mit der äußeren Hand vor dem Körper fassen.',
    how: ['Arm startet vor dem Oberschenkel', 'Seitlich bis auf Schulterhöhe heben', 'Kurz halten', 'Langsam zurück, bis das Kabel den Arm vor den Körper zieht'],
    mistakes: ['Oberkörper lehnt sich weg', 'Ellbogen sinkt unter die Hand', 'Zu schnelles Absenken'],
    why: 'Bei Kurzhanteln ist die Schulter unten fast entlastet. Das Kabel zieht schon in der gedehnten Startposition — der seitliche Deltamuskel steht über den ganzen Weg unter Spannung.'
  },
  {
    id: 'reverse-butterfly', name: 'Reverse Butterfly', aka: 'Reverse Pec Deck', group: 'schultern', equip: 'maschine', tools: 'Butterfly-Maschine (umgekehrt)', level: 1, compound: false,
    primary: ['schulter_h'], secondary: ['oberer_ruecken', 'trapez'], fig: ['pecDeck', { reverse: true }], sets: 3, reps: [12, 20], rest: 60, step: 5, phases: ['Nach hinten öffnen · ausatmen', 'Langsam schließen · einatmen'],
    setup: 'Mit der Brust zum Polster sitzen. Griffe auf Schulterhöhe, Arme fast gestreckt.',
    how: ['Arme in einem weiten Bogen nach außen-hinten führen', 'Bis sie in einer Linie mit den Schultern sind', 'Kurz halten', 'Langsam nach vorn zurück'],
    mistakes: ['Schulterblätter übernehmen alles — Arme führen, nicht die Mitte', 'Schwung', 'Schultern ziehen hoch'],
    why: 'Die hintere Schulter führt den Arm waagerecht nach hinten. Sie kommt im Alltag und bei Drückübungen zu kurz. Ein kräftiger hinterer Deltamuskel hält das Schultergelenk im Gleichgewicht.'
  },
  {
    id: 'face-pull', name: 'Face Pull', aka: 'Gesichtszug', group: 'schultern', equip: 'kabel', tools: 'Kabelzug, Seil', level: 1, compound: false,
    primary: ['schulter_h', 'oberer_ruecken'], secondary: ['trapez'], fig: ['facePull'], sets: 3, reps: [12, 20], rest: 60, step: 2.5, phases: ['Zum Gesicht ziehen · ausatmen', 'Langsam strecken · einatmen'],
    setup: 'Rolle auf Stirnhöhe, Seil mit Daumen nach hinten greifen. Einen Schritt zurück.',
    how: ['Arme lang nach vorn', 'Seil zum Gesicht ziehen, Ellbogen hoch und weit', 'Am Ende die Hände nach hinten drehen (Außenrotation)', 'Langsam zurück'],
    mistakes: ['Ellbogen sinken ab — es wird ein Rudern', 'Hohlkreuz und Rücklage', 'Zu schwer für die Außenrotation'],
    why: 'Verbindet das Zurückführen des Arms mit der Außenrotation. Das trainiert hintere Schulter, mittleren Trapez und die Rotatorenmanschette — das Gegengewicht zu viel Drücken und Schreibtischarbeit.'
  },
  {
    id: 'frontheben', name: 'Frontheben', aka: 'Front Raise', group: 'schultern', equip: 'kurzhantel', tools: 'Kurzhanteln', level: 1, compound: false,
    primary: ['schulter_v'], secondary: ['brust'], fig: ['frontRaise'], sets: 2, reps: [12, 15], rest: 60, step: 1, phases: HEBEN,
    setup: 'Aufrecht stehen, Hanteln vor den Oberschenkeln, Rumpf fest.',
    how: ['Arme fast gestreckt nach vorn heben', 'Bis auf Schulterhöhe', 'Kurz halten', 'Langsam senken'],
    mistakes: ['Zurücklehnen und Schwung', 'Über Schulterhöhe heben', 'Schultern hochziehen'],
    why: 'Die vordere Schulter hebt den Arm nach vorn. Sie arbeitet bei jedem Drücken schon kräftig mit — Frontheben lohnt sich deshalb vor allem, wenn du wenig drückst.'
  },
  {
    id: 'arnold-press', name: 'Arnold Press', aka: 'Arnold-Drücken', group: 'schultern', equip: 'kurzhantel', tools: 'Kurzhanteln, Bank mit Lehne', level: 2, compound: true,
    primary: ['schulter_v', 'schulter_s'], secondary: ['trizeps'], fig: ['overheadPress', { db: true, seated: true }], sets: 3, reps: [8, 12], rest: 120, step: 2, phases: ['Senken und eindrehen · einatmen', 'Hochdrücken und ausdrehen · ausatmen'],
    setup: 'Hanteln vor den Schultern, Handflächen zeigen zum Körper, Ellbogen vorn.',
    how: ['Ellbogen nach außen öffnen und gleichzeitig drücken', 'Oben zeigen die Handflächen nach vorn', 'Auf dem gleichen Weg zurück', 'Unten wieder eindrehen'],
    mistakes: ['Drehung und Drücken werden getrennt', 'Hohlkreuz', 'Zu schwer für eine saubere Drehung'],
    why: 'Durch die Drehung beginnt die Bewegung tiefer und vor dem Körper. Der Weg unter Spannung wird länger als beim normalen Schulterdrücken.'
  }
];
