# WM 2026 · Tippspiel - …⛱️

Online-Tippspiel mit **gemeinsamem Spielstand**: Tipps von jedem Gerät und Browser
werden zentral gespeichert (Netlify Functions + Netlify Blobs) und überall angezeigt.

## Wichtig
Diese Version braucht die Netlify-Function – einfaches Drag-and-drop einer einzelnen
Datei reicht **nicht** mehr. Nimm einen der beiden Wege unten.

---

## Weg A: Über GitHub (empfohlen, ohne Terminal)

1. Lege dir – falls noch nicht vorhanden – ein kostenloses Konto auf https://github.com an.
2. Erstelle ein neues, leeres Repository (z. B. `wm2026-tippspiel`).
3. Lade **alle Dateien aus diesem Ordner** hoch – die Ordnerstruktur muss erhalten bleiben:
   ```
   index.html
   package.json
   netlify.toml
   netlify/functions/state.js
   ```
   (Im GitHub-Web: „Add file“ → „Upload files“. Den Ordner `netlify/functions`
   bekommst du, indem du beim Hochladen den Pfad `netlify/functions/state.js` behältst –
   am einfachsten die Datei `state.js` per Drag-and-drop in das Upload-Feld ziehen und
   im Dateinamen `netlify/functions/state.js` eintragen, oder den ganzen Ordner hochladen.)
4. Auf https://app.netlify.com → **Add new site** → **Import an existing project** →
   **GitHub** → dein Repository auswählen.
5. Einstellungen einfach bestätigen (Publish directory: `.`) und **Deploy** klicken.
6. Fertig. Netlify installiert automatisch die Abhängigkeit und richtet die Function ein.
   Deine Seite ist unter `https://DEIN-NAME.netlify.app` erreichbar – auf allen Geräten
   mit demselben Spielstand.

## Weg B: Mit der Netlify-CLI (Terminal)

```bash
npm install -g netlify-cli      # einmalig
cd wm2026-tippspiel
npm install
netlify deploy --prod
```
Beim ersten Mal fragt die CLI, ob ein neues Projekt erstellt werden soll – bestätigen.

---

## Spielstand zurücksetzen
In Netlify unter **Project configuration → Blobs** den Store `wm2026-tippspiel` leeren,
oder über die CLI/Netlify-Oberfläche den Eintrag `state` löschen.

## Hinweise
- Netlify Blobs ist automatisch aktiv – keine API-Schlüssel nötig.
- Tipps sind nur **bis zum Anstoss (MESZ)** möglich; danach ist das Spiel gesperrt.
- Ein abgegebener Tipp ist endgültig und wird serverseitig nicht überschrieben.
- Wertung: **3 Punkte** exaktes Ergebnis, **1 Punkt** richtige Tendenz.
