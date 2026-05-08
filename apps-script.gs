/**
 * Resilient Body Workouts — Apps Script backend
 *
 * SETUP (one-time, ~5 minutes):
 *  1. In your Google Sheet → Extensions → Apps Script
 *  2. Delete the boilerplate. Paste this entire file.
 *  3. Replace the TOKEN value below with a long random string (any 30+ char
 *     mash of letters/numbers). Save the script.
 *  4. Click "Deploy" → "New deployment" → gear icon → "Web app".
 *      - Description: anything (e.g. "rb workouts")
 *      - Execute as: Me (your account)
 *      - Who has access: Anyone
 *     → Deploy. Authorize when prompted (Advanced → Go to … → Allow).
 *  5. Copy the Web app URL (ends in /exec). Paste BOTH the URL and the TOKEN
 *     into the matching constants in index.html (top of the <script> block).
 *  6. After any change to this file, redeploy via Deploy → Manage deployments
 *     → pencil icon → Version: New version → Deploy.
 *
 * GET  ?action=list                          → {sheets: [{name, gid}, ...]}
 * GET  ?action=data&gid=N                    → {rows: [[displayValues]], sig}
 * POST {gid, row, col, value, token}         → {ok: true}  (1-indexed row/col)
 */

const TOKEN = 'REPLACE_WITH_LONG_RANDOM_STRING';

function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'data';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'list') {
      const sheets = ss.getSheets().map(s => ({
        name: s.getName(),
        gid: String(s.getSheetId()),
      }));
      return json({ sheets });
    }

    if (action === 'data') {
      const gid = e.parameter.gid;
      const sheet = gid
        ? ss.getSheets().find(s => String(s.getSheetId()) === String(gid))
        : ss.getSheets()[0];
      if (!sheet) return json({ error: 'sheet_not_found' });
      const range = sheet.getDataRange();
      const rows = range.getDisplayValues();
      // tiny fingerprint so the client can short-circuit unchanged data
      const sig = rows.length + ':' + rows.flat().join('|').length;
      return json({ rows, sig });
    }

    return json({ error: 'unknown_action' });
  } catch (err) {
    return json({ error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.token !== TOKEN) return json({ error: 'auth' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets().find(s => String(s.getSheetId()) === String(body.gid));
    if (!sheet) return json({ error: 'sheet_not_found' });

    const row = parseInt(body.row, 10);
    const col = parseInt(body.col, 10);
    if (!row || !col) return json({ error: 'bad_coords' });

    sheet.getRange(row, col).setValue(body.value == null ? '' : String(body.value));
    return json({ ok: true });
  } catch (err) {
    return json({ error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
