# Anonymous usage analytics — setup

The site has a tiny built-in event tracker (`track()` in `js/app.js`). It is
**off by default**: until an endpoint is configured it does nothing at all.
When enabled it sends small anonymous JSON events — no names, emails or
device identifiers — so the Digital Strategy team can see what staff actually
use and search for.

Events sent:

| Event    | Properties              | Tells you                                  |
|----------|-------------------------|--------------------------------------------|
| `visit`  | —                       | How often the hub is opened                 |
| `open`   | `id`, `type`, `category`| Which resources get opened                  |
| `complete` | `id`, `type`, `category` | Which resources get finished             |
| `search` | `q`, `results`          | What staff look for — **`results: 0` rows are your content to-do list** |
| `task`   | `task`                  | Which "I want to…" shortcuts get used       |
| `suggest`| —                       | How often the suggestion box is used        |
| `gamification-toggle` | `on`       | How many staff opt in to XP/streaks         |

## One-time setup (about 10 minutes)

1. Create a Google Sheet named e.g. *Tech Tips Analytics*.
2. In the Sheet: **Extensions → Apps Script**, replace the default code with:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     try {
       var data = JSON.parse(e.postData.contents);
       sheet.appendRow([
         new Date(),
         data.event || '',
         data.id || data.q || data.task || '',
         data.results !== undefined ? data.results : '',
         data.type || '',
         data.category || '',
         String(data.on !== undefined ? data.on : '')
       ]);
     } catch (err) {
       sheet.appendRow([new Date(), 'parse-error', String(err)]);
     }
     return ContentService.createTextOutput('ok');
   }
   ```

3. **Deploy → New deployment → Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone** (the URL is unguessable; the script only
     appends rows and returns "ok")
4. Copy the web app URL (`https://script.google.com/macros/s/…/exec`).
5. In `js/app.js`, paste it into the constant near the top:

   ```javascript
   const ANALYTICS_ENDPOINT = 'https://script.google.com/macros/s/…/exec';
   ```

6. Commit, push and merge. Done — events appear as rows in the Sheet.

Add a header row to the Sheet for readability:
`timestamp | event | id/query/task | results | type | category | extra`

## Useful views once data arrives

- **Zero-result searches**: filter `event = search`, `results = 0` — these are
  topics staff wanted and couldn't find.
- **Most opened**: pivot `event = open` by `id`.
- **Opt-in rate**: count `gamification-toggle` with `on = true`.

## Topic suggestions

The "Suggest a Topic" box currently composes a pre-filled email to
`t.wade@haileybury.com` (the site is static, so email is the
zero-infrastructure delivery route). If you'd rather collect suggestions
silently in the same Sheet, add a `suggestion` field to the Apps Script
`appendRow` and post the text from `initRequestModal()` in `js/app.js`
instead of opening the mailto link.
