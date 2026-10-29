# brew.ai-web

Web-Frontend von Brew.ai: die Landingpage zur Crowdfunding-Kampagne ("Dein Geschmack. Dein Bier.").

Dieses Repository ist als Git-Submodule unter `web/` im Hauptrepository [Brew.ai](https://github.com/mbe209/brew.ai) eingebunden. Jeder Push auf `main` stößt dort automatisch eine Aktualisierung des Submodules an.

Marke, Farben, Sorten und Rewards kommen aus dem Konzept in `mbe209/brew.ai` (`docs/01-marke-und-design.md`, `docs/03-kickstarter-und-marketing.md`).

## Lokal ansehen

Reines HTML/CSS/JS ohne Build-Schritt:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Läuft so auch auf jedem statischen Hosting (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Die komplette Landingpage |
| `public/css/styles.css` | Design-Tokens (aus dem Markenkonzept) und Layout, inkl. Dark Mode |
| `public/js/config.js` | **Kampagnen-Einstellungen**: Link zur Kampagne, Startdatum, eingesammelter Betrag, Newsletter-Endpunkt |
| `public/js/main.js` | Flavor-Engine-Demo (regelbasiert), Fortschrittsbalken, Countdown, Artwork-Loader |
| `public/img/` | Vektor-Platzhalter, bis die Artworks da sind |
| `public/art/` | Generierte Artworks (`NN-name.webp`) und `manifest.json` |
| `art/prompts.json` | Alle Nano-Banana-Prompts mit Stil-Suffix und Seitenverhältnis |
| `scripts/generate-artworks.mjs` | Erzeugt die Artworks über die Gemini API |

## Artworks mit Nano Banana erzeugen

Die Seite zeigt automatisch die Bilder aus `public/art/`, sobald sie in `manifest.json` stehen, sonst die Platzhalter.

**Über GitHub Actions (empfohlen):**

1. API-Key in [Google AI Studio](https://aistudio.google.com/apikey) anlegen.
2. In diesem Repo unter *Settings → Secrets and variables → Actions* ein Secret `GEMINI_API_KEY` anlegen. Den Key nirgends sonst posten.
3. *Actions → "Artworks mit Nano Banana erzeugen" → Run workflow*. Optional einzelne IDs oder ein anderes Modell (z. B. `gemini-3-pro-image-preview` für Nano Banana Pro) angeben.
4. Der Workflow öffnet einen Pull Request mit den Bildern. Prüfen, gute Varianten mergen.

Damit der Workflow den PR anlegen darf: *Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"* aktivieren.

**Lokal:**

```bash
GEMINI_API_KEY=... node scripts/generate-artworks.mjs                 # nur fehlende
GEMINI_API_KEY=... node scripts/generate-artworks.mjs --only 01-hero  # einzelne
GEMINI_API_KEY=... node scripts/generate-artworks.mjs --force         # alle neu
```

Ist `cwebp` installiert, werden die Bilder als WebP gespeichert, sonst als PNG.

## Vor dem Launch offen

- Plattform entscheiden (Startnext oder Kickstarter, Kickstarter erlaubt kein Bier als Reward). Die Seite ist bis dahin plattformneutral formuliert.
- `campaignUrl` und `signupEndpoint` in `public/js/config.js` eintragen (z. B. Brevo oder Mailchimp für die Warteliste).
- Impressum und Datenschutzerklärung ergänzen (Pflicht in Deutschland, vor allem mit Newsletter-Formular).
- Echte Namen und Fotos der drei Gründer einsetzen.
- Logo als Vektor reinzeichnen und die Wortmarke im Header ersetzen.
