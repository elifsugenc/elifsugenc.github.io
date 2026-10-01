# invisible in plain sight

An abstract browser-based interactive artwork exploring sexual violence, collective silence, and the way a perpetrator interprets other people's inaction as permission.

Built as a portfolio piece for an MIT Media Lab Media Arts and Sciences application (Critical Matter interest area).

---

## Running Locally

No build step required. The project uses native ES modules.

**Option 1 — VS Code Live Server (recommended)**
Open the project folder in VS Code, install the Live Server extension, and click "Go Live."

**Option 2 — Python**
```bash
python -m http.server 8080
# then open http://localhost:8080
```

**Option 3 — Node.js**
```bash
npx serve .
# then open the printed URL
```

> **Important:** The project must be served over HTTP, not opened as a `file://` URL, because it uses ES modules (`type="module"`). Double-clicking `index.html` in a file manager will not work in most browsers.

---

## Publishing on GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, choose `main` (or `master`), folder `/` (root).
4. Save. GitHub Pages will publish the site at `https://<username>.github.io/<repo>/`.

All asset paths are relative, so no configuration is needed for subdirectory URLs.

---

## Editing the Narrative

Open [`data/narrative.js`](data/narrative.js). Every piece of text in the experience lives there, organized by phase:

| Section | What to edit |
|---|---|
| `NARRATIVE.title` | The project title |
| `NARRATIVE.contentNote` | The content warning text |
| `NARRATIVE.phase1.narratorOpening` | First narrator fragments (Phase 1: The Room) |
| `NARRATIVE.phase2.figureRevealTexts` | Text that appears when a figure is focused (Phase 2: The Background) |
| `NARRATIVE.phase3.narratorFragments` | The narrator's alibi monologue (Phase 3: The Alibi) |
| `NARRATIVE.phase3.contradictions` | What the room reveals against the narrator's account |
| `NARRATIVE.phase4.narratorFragments` | The narrator's justifications under compression (Phase 4: The Weight) |
| `NARRATIVE.phase5.narratorShift` | The narrator's language as responsibility surfaces (Phase 5: The Account) |
| `NARRATIVE.phase5.endingQuestion` | The final question |
| `NARRATIVE.phase5.endingSubtext` | The sentence beneath the question |

---

## Editing Visual Settings

Open [`data/narrative.js`](data/narrative.js) and find the `SETTINGS` export at the bottom:

- **`SETTINGS.palette`** — all colors (background, accent, text tones)
- **`SETTINGS.timing`** — dwell time before a figure reveals, transition durations, grain speed, compression rate
- **`SETTINGS.room`** — total figure count, how many are visually distinct, how many carry contradictions
- **`SETTINGS.typography`** — font stacks

---

## Project Structure

```
invisible-in-plain-sight/
├── index.html            ← Entry point, three-screen layout
├── css/
│   └── style.css         ← All styles (no framework)
├── js/
│   ├── main.js           ← Phase orchestration, event bindings
│   ├── room.js           ← Canvas room, silhouettes, attention logic
│   ├── narrator.js       ← Narrator text sequencer
│   └── audio.js          ← Web Audio API ambient soundscape
├── data/
│   └── narrative.js      ← All text content and visual settings
└── README.md
```

---

## Interaction

| Input | Action |
|---|---|
| Move pointer | Direct attention toward figures |
| Hold pointer still (≈ 1.2 s) | Reveal figure's layer |
| `Tab` / `→` / `↓` | Cycle keyboard focus through figures |
| `Escape` | Leave experience |
| Sound toggle | Mute / unmute ambient audio |
| Reduce motion toggle | Disable grain and non-essential animation |

The experience runs from beginning to end in approximately 5–8 minutes depending on reading pace. No timer enforces this.

---

## Accessibility

- All interactive elements are keyboard-accessible with visible focus rings
- Screen reader announcements via `aria-live` regions for narrator and reveal text
- Reduced-motion mode disables film grain and shortens transitions while preserving the full narrative
- Color contrast meets WCAG AA for all text elements
- All essential narrative is available visually; sound is purely atmospheric

---

## Known Limitations

- **ES module requirement:** Must be served over HTTP (not `file://`). See running locally above.
- **Audio:** Requires a user gesture before the Web Audio API context can start. This is a browser security requirement and intentional in the design.
- **Canvas performance:** On very low-powered devices, the film grain effect may cause minor frame drops. Use the "reduce motion" toggle to disable it.
- **IE / very old browsers:** Not supported. The project targets modern evergreen browsers.

---

## Concept Note

The experience uses a first-person unreliable narrator — a fictional perpetrator whose internal voice minimizes his responsibility and redirects attention to the crowd. The player's role is not to judge or to rescue; it is to look carefully, and to notice what his account omits.

The survivor is absent from his telling. That absence is the piece.

*No real names, real testimony, real case details, or real statistics appear in this work.*
