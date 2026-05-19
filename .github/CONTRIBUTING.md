# Contributing to HoneyKiller

Thank you for helping protect affiliate attribution!

The most impactful contribution is adding detection signatures for newly
documented affiliate-overriding extensions.

---

## How to Submit a Pull Request (step-by-step)

If you are new to open source, here is the exact workflow:

### 1. Fork the repository

Click **Fork** (top-right of the GitHub page). This creates your own copy at
`github.com/YOUR-USERNAME/HoneyKiller`.

### 2. Clone your fork locally

```bash
git clone https://github.com/YOUR-USERNAME/HoneyKiller.git
cd HoneyKiller
```

### 3. Create a branch

Always work on a branch — never commit directly to `main`:

```bash
git checkout -b add-detection-extensionname
```

Use a descriptive branch name, e.g. `add-detection-shophunter` or
`fix-rakuten-selector`.

### 4. Make your changes

Edit `content.js` and `INTERCEPTORS.md` following the guide below.

### 5. Test locally

Load the extension as unpacked in Chrome:
1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the repo folder
4. Visit a merchant checkout page and confirm the overlay is blocked

### 6. Commit and push

```bash
git add content.js INTERCEPTORS.md
git commit -m "Add detection: ExtensionName (OwnerName)"
git push origin add-detection-extensionname
```

### 7. Open a Pull Request

Go to `github.com/YOUR-USERNAME/HoneyKiller` — GitHub will show a prompt to
open a PR. Click it. Fill in the PR template that appears automatically.

A maintainer will review it, may ask questions, and merge it when it passes.

---

## Review Process

PRs are reviewed by [@lalitntaparia](https://github.com/lalitntaparia).

**What we check:**
- Detection signatures are accurate (no false positives)
- `suppress()` removes only the extension's own elements — nothing else
- No server calls, no data collection, no new permissions required
- Language in `INTERCEPTORS.md` is factual and neutral

**Timeline:** We aim to review within 7 days. If your PR has been open longer
with no response, ping us in the issue thread.

---

## Code of Conduct

All descriptions of extension behavior must be:
- Based on independent technical analysis or credible published reports
- Factually accurate and neutral in tone
- Free of legal accusations or defamatory language

We describe *what extensions do technically*, not legal characterizations of intent.

---

## How to Add a New Extension

### 1. Identify the extension

Find the Chrome extension ID in the Chrome Web Store URL:

```
https://chrome.google.com/webstore/detail/honey/bmnlcjabgnpnenekpadlanbbkooimhnj
                                                         ^^^^^^^^^^^^^^^^^^^^^^^^^
                                                         This is the ID
```

### 2. Find its DOM signatures

Install the extension in a **clean, isolated browser profile**. Visit a merchant
checkout page (Amazon, eBay, etc.) with the extension active.

Open DevTools (F12) and inspect for injected elements:

**DOM elements:**
```javascript
// In the Console — look for injected elements:
document.querySelectorAll('[id*="extensionname"]')
document.querySelectorAll('[class*="extensionname"]')
```

**Global variables:**
```javascript
// Look for globals the extension sets on window:
Object.keys(window).filter(k => k.toLowerCase().includes('extensionname'))
```

**Custom elements:**
```javascript
// Extensions often register custom HTML elements:
customElements.get('extension-element-name')
```

### 3. Verify the behavior

Confirm that:
- The extension injects DOM elements at checkout
- Those elements can interfere with affiliate attribution parameters in the URL
  or the checkout session

Document your test methodology in the PR description.

### 4. Add to INTERCEPTORS.md

Add a new section with:
- Extension name, owner, estimated user count, Chrome extension ID
- Brief factual description of documented behavior (neutral language only)
- Every detection signal you found

### 5. Add to content.js

Add a new entry to the `INTERCEPTORS` array:

```javascript
{
  name: 'Extension Name',
  owner: 'Company Name',
  detect() {
    return !!(
      window.someGlobal !== undefined ||
      document.querySelector('[id^="some-id"]')
    );
  },
  suppress() {
    document.querySelectorAll('[id^="some-id"]').forEach(el => el.remove());
    try {
      Object.defineProperty(window, 'someGlobal', {
        value: undefined,
        writable: false,
        configurable: false
      });
    } catch (_) {}
  }
},
```

### 6. Open a Pull Request

PR title: `Add detection: ExtensionName (OwnerName)`

Include in the PR description:
- Chrome / Firefox extension ID
- How you verified the detection (which merchant page, what you observed)
- Confirmation the `suppress()` function removes the overlay without breaking the page

---

## Security & Privacy Rules — Non-Negotiable

Every contribution must follow these rules:

1. **Detection only** — `detect()` reads DOM and `window` globals. Nothing else.
2. **Suppression only** — `suppress()` removes DOM elements and freezes globals. Nothing else.
3. **No server calls** — V1 sends zero data. Any PR adding `fetch`/`XHR` will not be merged.
4. **No credentials** — Never commit API keys, URLs, or infrastructure details.
5. **No side effects** — The extension must not modify the page in any way except
   removing the targeted overlay elements.

---

## Code Style

- Plain JavaScript (no build step, no dependencies, no TypeScript)
- `'use strict'` at the top of every file
- Try/catch around all DOM operations — pages are unpredictable
- Neutral, factual comments — describe *what* the code does, not legal judgments

---

## Language Guidelines

When writing descriptions in `INTERCEPTORS.md` or PR comments:

| Avoid | Use instead |
|---|---|
| "steals commissions" | "overrides affiliate attribution" |
| "theft" | "attribution override" |
| "rips off" | "replaces tracking parameters" |
| "fraudulent" | "documented to intercept" |

We describe technical behavior. Let users draw their own conclusions.

---

## Questions?

[Open an issue](https://github.com/ProtectAffiliate/HoneyKiller/issues). We respond quickly.
