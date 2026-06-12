# Usage analytics — setup

The site has a tiny built-in event tracker (`track()` in `js/app.js`). It is
**off by default**: until an endpoint is configured it does nothing at all.
When enabled it sends small anonymous JSON events — no names, emails or
device identifiers — so the Digital Strategy team can see what staff actually
use and search for. (Optionally, the [sign-in gate](#identified-usage-google-sign-in)
adds the signed-in staff email to every event — events are then no longer
anonymous, and the sign-in screen says so.)

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
| `login`  | —                       | Each fresh sign-in (gate enabled only)      |

With the sign-in gate enabled every event also carries `user` (the staff
email), recorded in column H of the Sheet.

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
         String(data.on !== undefined ? data.on : ''),
         data.user || ''
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
`timestamp | event | id/query/task | results | type | category | extra | user`

## Identified usage (Google sign-in)

By default the hub is open and analytics are anonymous. To require staff to
sign in with their `@haileybury.com` Google account — and record **who** did
what in the Sheet — enable the gate in `js/auth.js`:

1. Go to [console.cloud.google.com](https://console.cloud.google.com) (signed
   in with a school account) and create a project, e.g. *Training Hub*.
2. **APIs & Services → OAuth consent screen**: choose user type **Internal**
   if available — that locks sign-in to haileybury.com accounts at Google's
   end. (If only **External** is offered, fill in the basics and press
   **Publish app** afterwards; the site's own domain check still applies.)
   App name, support email — no extra scopes needed.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins: the site's origin, e.g.
     `https://twade-ai.github.io` (no path, no trailing slash)
4. Copy the client ID (ends `.apps.googleusercontent.com`) into `CLIENT_ID`
   at the top of `js/auth.js`, commit and merge.
5. In the analytics Sheet, make sure the Apps Script includes the
   `data.user || ''` column (step 2 above) and add `user` to the header row.

Notes:

- The gate never activates on `localhost`, so local development and the CI
  smoke test are unaffected.
- Sessions last 30 days (`SESSION_DAYS` in `js/auth.js`), then staff are
  asked to sign in again — usually a single click thanks to One Tap.
- This identifies users; it does **not** make the content private. The site
  is static, so a determined visitor can read the page source without
  signing in. Don't host confidential material here.
- The sign-in screen tells staff their activity is recorded against their
  name. Keep that notice if you reword the gate.

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
