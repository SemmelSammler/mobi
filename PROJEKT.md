# mobi — Beweglich in den Tag

> **Aus der Live-Version rekonstruiert am 16.11.2026** von https://mobi.bonni-jason.workers.dev
> (SW-Cache-Version `mobi-v5.0.0`). Der Quellcode lag lokal nicht mehr vor.

## Zweck
PWA für eine tägliche Mobilitäts- und Dehnroutine: Morgen- und Abendroutine, Endgrad-Kraft,
„Zwischendurch“ am Schreibtisch, Fokustage, Kalender mit Serie und Sportplan, animierte Strichfiguren.
66 Übungen in 13 Blöcken.

## Aufbau
```
public/                    ← wird 1:1 als Static Assets ausgeliefert (kein Build-Schritt)
  index.html               App-Shell: 4 Views (Heute, Übungen, Kalender, Profil) + Tabbar, Player-Overlay, Sheet
  css/app.css              gesamtes Styling
  js/app.js                Einstieg (ES-Modul): Rendering der Tabs, Player, Events, SW-Registrierung
  js/data.js               Übungsdatenbank: Blöcke, Pläne je Dauer, Übungen inkl. Posen, typische Fehler
  js/routine.js            erzeugt die Tagesroutine (fester Kern + rotierende Decks, Zeit-Skalierung, Fokustage)
  js/store.js              Persistenz (localStorage mit In-Memory-Fallback)
  js/figure.js             SVG-Strichfiguren, Posen-Interpolation A↔B
  sw.js                    Service Worker (Offline-Cache)
  manifest.webmanifest     PWA-Manifest
  icons/                   favicon.svg, apple-touch-icon, 192/512, maskable-512
wrangler.jsonc             Worker-Konfiguration (reiner Assets-Worker, kein Server-Code)
package.json               nur wrangler als Dev-Abhängigkeit
```
Kein Framework, kein Bundler: native ES-Module im Browser.

## Datenfluss
```
data.js ──► routine.js (buildRoutine: Datum, Dauer, Art) ──► app.js (Render + Player)
                ▲                                              │
                └──── store.js (Einstellungen, Decks, Blacklist) ◄┘ markDone / setSetting / …
```
Alles läuft im Browser. Der Worker liefert nur Dateien aus. Es gibt keine API-Aufrufe.
Externe Quellen: Google Fonts (Instrument Sans); YouTube-Suchlinks zu den Übungen.

## Speicherung (nur lokal im Browser, `localStorage`)
| Schlüssel | Inhalt |
|---|---|
| `mobi.settings` | Name, Dauern, Ton, PNF, Krafttage, Fokustage, Wochen-Sportplan |
| `mobi.history` | `{ "YYYY-MM-DD": { morgen|abend|kraft|…: {minutes, at, …} } }` (v1-Format wird migriert) |
| `mobi.decks` | Rotations-Decks je Block (Ziehen ohne Zurücklegen) |
| `mobi.blacklist` | ausgeblendete Übungen |
| `mobi.assessments` | Selbsttests je Datum |

⚠️ Die Daten liegen **pro Gerät und Browser**. Es gibt kein Backup und keinen Sync. Werden die Browserdaten
gelöscht, ist auch der Verlauf weg.

## Lokal starten
```bash
npm install
npm run dev        # http://localhost:8787
```
Hinweis: Der Service Worker wird nur unter `https:` registriert (siehe Ende von `app.js`). Lokal gibt es also
keinen Offline-Cache, und Änderungen sind sofort sichtbar.

## Deployen
```bash
npx wrangler login
npm run deploy
```
Vor dem ersten Deploy:
- `compatibility_date` in `wrangler.jsonc` mit dem Dashboard abgleichen (Wert ist geschätzt).
- In den richtigen Cloudflare-Account deployen (der, dem die Subdomain `bonni-jason.workers.dev` gehört).
- Nach Änderungen an Dateien `VERSION` in `public/sw.js` erhöhen. Sonst liefern installierte PWAs
  weiter alte Dateien aus dem Cache (Stale-while-revalidate für Assets).
