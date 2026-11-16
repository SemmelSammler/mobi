# mobi — Training & Beweglichkeit

Version 6.1 · PWA auf Cloudflare Workers (reine statische Auslieferung, kein Server-Code)

> **Herkunft:** Version 5 wurde am 16.11.2026 aus der Live-Version
> (https://mobi.bonni-jason.workers.dev) rekonstruiert, weil der Quellcode lokal fehlte.
> Version 6 baut darauf auf: neues Design, Krafttraining mit Plan, neue Übungsdarstellung.
> Der erste Commit dieses Repos enthält den unveränderten rekonstruierten Stand.

## Zweck
Eine App für zwei Dinge:
- **Mobility:** geführte Morgen-, Abend- und Zwischendurch-Routinen plus Endgrad-Kraft (66 Übungen).
- **Krafttraining:** Trainingsplan als Rotation, Logger für Sätze und Gewichte, Pausentimer,
  automatische Progression, Auswertung (72 Studio-Übungen).

Jede Übung hat eine animierte Figur mit hervorgehobener Zielmuskulatur, eine Körperkarte,
Schritt-für-Schritt-Ausführung, typische Fehler und den physiologischen Hintergrund.

## Aufbau
```
public/                      wird 1:1 ausgeliefert (kein Build-Schritt, native ES-Module)
  index.html                 App-Hülle
  css/app.css                Design-System (Farb-Tokens, helles und dunkles Thema)
  fonts/                     Instrument Sans, selbst gehostet (OFL-Lizenz liegt bei)
  sw.js                      Service Worker (Offline-Cache)
  js/
    app.js                   Einstieg: Navigation, Thema, Erststart
    ui.js                    DOM-Helfer, Icons, Sheet, Toast, Ton
    store.js                 Speicherung (localStorage), Sicherung/Wiederherstellung
    routine.js               baut die Mobility-Routine des Tages
    training.js              Plan, Rotation, Progression, Rekorde, Wochenvolumen
    rig.js                   Gelenk-Rig: Posen aus Winkeln und Zielpunkten
    figs.js                  45 Bewegungsvorlagen für Studio-Übungen (Seiten- und Frontansicht)
    figure.js                zeichnet und animiert die Figur samt Geräten
    musclemap.js             Körperkarte vorn/hinten
    data/
      mobility.js            Mobility-Übungen (aus v5 übernommen)
      gym-ober.js / gym-unter.js / gym-arme.js   Studio-Übungen
      muscles.js             Muskelgruppen und Zuordnungen
      programs.js            sechs Trainingsplan-Vorlagen
      index.js               gemeinsamer Zugriff auf alle Übungen
    views/                   heute, training, workout (Logger), player (Mobility),
                             uebungen (Bibliothek + Detail), verlauf, profil
tests/
  check-data.mjs             Datenprüfung (Pflichtfelder, IDs, Posen, Plan-Verweise)
  test-logic.mjs             Logiktests (Rotation, Progression, Rekorde, Sicherung)
  shot.cjs, scenarios.cjs    Browser-Durchläufe mit Screenshots (Playwright)
  flow61.cjs                 prüft Überlauf bei 320/375/430 px, Lauf im Plan, Verschieben, Ersetzen
  seed.json                  Beispieldaten für die Durchläufe
wrangler.jsonc               Worker-Konfiguration (nur Static Assets)
```

## Datenfluss
```
data/*  ──►  routine.js   ──►  views/player.js        (Mobility)
        ──►  training.js  ──►  views/workout.js       (Krafttraining)
                 ▲                    │
                 └──── store.js ◄─────┘   Einstellungen, Plan, Verlauf
```
Alles läuft im Browser. Es gibt keine API und keine externen Abrufe; nur die Links
„Video-Anleitung suchen“ führen zu YouTube.

## Speicherung (nur lokal, `localStorage`)
| Schlüssel | Inhalt |
|---|---|
| `mobi.settings` | Name, Thema, Dauern, Ton, Fokustage, Wochenstruktur (je Wochentag: Studio, feste Einheit, Laufart, km) |
| `mobi.history` | je Tag: Routinen, Studio-Zähler, Ausdauer-Einheiten nach Art (km, min, Laufart) |
| `mobi.plan` | aktiver Trainingsplan mit Einheiten, Übungen, Sätzen, Rotationszeiger |
| `mobi.workouts` | alle geloggten Trainings mit Sätzen (Gewicht × Wiederholungen) |
| `mobi.active` | laufendes Training (übersteht Neuladen und App-Wechsel) |
| `mobi.decks`, `mobi.blacklist`, `mobi.assessments` | Mobility-Rotation, ausgeblendete Übungen, Beweglichkeits-Checks |

Die Schlüssel aus Version 5 sind unverändert; vorhandene Daten werden weiterverwendet.
Im Profil gibt es **Sicherung herunterladen / einspielen** (JSON-Datei). Einen Abgleich
zwischen Geräten gibt es noch nicht.

## Trainingslogik in Kürze
- **Rotation:** Nach jedem abgeschlossenen Training rückt der Plan eine Einheit weiter —
  unabhängig vom Wochentag. Derselbe Plan passt so zu 3, 4 oder 5 Studiotagen.
- **Doppelte Progression:** Erst Wiederholungen bis zur Obergrenze steigern, dann Gewicht erhöhen.
- **Rekorde:** geschätztes Maximum nach Epley (Gewicht × (1 + Wdh./30)).
- **Wochenvolumen:** Zielmuskel zählt 1 Satz, Hilfsmuskel 0,5; Zielbereich 10–20 Sätze.

## Neue Übung anlegen
Eintrag in `data/gym-*.js` ergänzen und per `fig: ['vorlage', { optionen }]` eine Bewegungsvorlage
aus `figs.js` wählen. Danach `npm test` — die Datenprüfung meldet fehlende Felder.

## Lokal starten
```bash
npm install
```
```bash
npm run dev
```
Die App läuft dann unter http://localhost:8787. Der Service Worker ist lokal aus
(nur unter `https:`), Änderungen sind sofort sichtbar.

## Testen
```bash
npm test
```

## Deployen
```bash
npx wrangler login
```
```bash
npm run deploy
```
Vor dem Deploy prüfen:
- **Richtiger Cloudflare-Account** — der, dem `bonni-jason.workers.dev` gehört. In einem anderen
  Account entsteht ein neuer Worker unter anderer Adresse, und die dort gespeicherten Daten fehlen.
- `compatibility_date` in `wrangler.jsonc` ist geschätzt und sollte mit dem Dashboard abgeglichen werden.
- Bei jeder Änderung `VERSION` in `public/sw.js` erhöhen, sonst zeigen installierte Apps alte Dateien.
- Vorher am Gerät im Profil eine Sicherung herunterladen.

## Offen
- Geräte-Abgleich (Sync) und Konto
- Geräteliste des eigenen Studios (aktuell: übliche Vollausstattung angenommen)
- Aufwärmsätze, Supersätze und Notizen im Logger
- Laufen: Plan je Wochentag und Eintrag (Art, Strecke, Dauer), aber noch kein Lauf-Trainingsplan mit Steigerung
