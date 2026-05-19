## What does this PR do?

<!-- One sentence summary -->

---

## Type of change

- [ ] New extension detection (add to `INTERCEPTORS.md` + `content.js`)
- [ ] Fix / improve existing detection signature
- [ ] Add merchant domain to `manifest.json`
- [ ] Bug fix
- [ ] Documentation update

---

## New extension details (if applicable)

| Field | Value |
|---|---|
| Extension name | |
| Owner / company | |
| Chrome extension ID | |
| Estimated user count | |
| Chrome Web Store URL | |

---

## Detection signatures added

<!-- List the DOM IDs, class names, or window globals you found -->

- `document.querySelector(...)` — 
- `window.xxx` — 

---

## How I verified this

- [ ] Installed the extension in an isolated Chrome profile
- [ ] Visited a merchant checkout page: <!-- which one? -->
- [ ] Confirmed the overlay appears without HoneyKiller
- [ ] Confirmed the overlay is removed with HoneyKiller active
- [ ] Confirmed the page functions normally after suppression (can still check out)

---

## Checklist

- [ ] My changes are in `content.js` and/or `INTERCEPTORS.md` only
- [ ] No `fetch`, `XMLHttpRequest`, or external network calls added
- [ ] No new permissions added to `manifest.json`
- [ ] Language in `INTERCEPTORS.md` is factual and neutral (no legal accusations)
- [ ] I tested with the extension loaded unpacked in Chrome
