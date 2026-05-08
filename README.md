# Resilient Body — Workout Display

Live display app that reads a Google Sheet of training-session workouts and renders it in the Resilient Body aesthetic. Edit the sheet during a session — the app reflects changes within ~1s. With the optional Apps Script backend, edits made *in the app* also write back to the sheet.

**Live:** https://resilient-body-workouts.vercel.app

## How it works

- Single-file `index.html` (Tailwind via CDN, no build step).
- Two modes:
  - **Read-only (default):** polls the sheet's public `gviz/tq?tqx=out:json` endpoint and pairs xlsx names with htmlview gids.
  - **Two-way (with Apps Script):** all reads + writes go through an Apps Script Web App bound to the sheet.
- Detects `WARM-UP`, `STRENGTH BLOCK`, `FINISHER` section banners by content.
- Strength blocks render as a grid: movement on the left, one column per client.

## Enable two-way editing (one-time, ~5 min)

1. Open the workout Google Sheet → **Extensions → Apps Script**.
2. Delete the boilerplate. Paste the contents of [`apps-script.gs`](./apps-script.gs).
3. Replace the `TOKEN` constant in the script with a long random string (30+ chars).
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy. Authorize when prompted (Advanced → Allow).
5. Copy the resulting `/exec` URL.
6. In `index.html`, set the two constants near the top of the `<script>` block:

   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
   const WRITE_TOKEN = 'same-random-string-as-in-the-script';
   ```

7. `vercel --prod` → `git push`.

After this:
- The "Edit Mode" badge appears in the header.
- Click any value (movement name, client header, weight note, date, day, section banner, finisher) → it becomes editable. Enter saves; Esc cancels.
- Saves go to the sheet. Other browsers / the sheet itself catch up within ~1 second.

## Updating the Apps Script later

Edit `apps-script.gs` in this repo (for source of truth), then in the Apps Script editor:

- Paste the new code
- **Deploy → Manage deployments** → pencil icon → **Version: New version** → Deploy

The same `/exec` URL keeps working.

## Edit the data

Just edit the Google Sheet (or click cells in the app once Apps Script is wired). No app rebuild needed.

## Edit the design

Edit `index.html` → `vercel --prod` → `git push`.

## Deploy

```sh
vercel --prod
git push
```
