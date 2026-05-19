# Known Affiliate-Overriding Extensions

Community-maintained list of browser extensions documented to override, replace,
or intercept affiliate attribution parameters at merchant checkout pages.

Detection signatures used by `content.js` are documented here.

> **Disclaimer:** All extension behaviors described here are based on independent
> technical analysis and publicly available publisher reports. HoneyKiller makes
> no legal determinations about any company's conduct. All trademarks belong to
> their respective owners.

**Found a newly documented extension? [Open a PR](.github/CONTRIBUTING.md)**

---

## Honey (PayPal)

**Status:** Blocked ✅
**Owner:** PayPal Inc. (acquired 2019)
**Estimated users:** 17 million
**Chrome extension ID:** `bmnlcjabgnpnenekpadlanbbkooimhnj`
**Tested against version:** 19.3.0

### What this means for creators

Honey's browser extension is installed by millions of shoppers. When a shopper
visits a merchant after clicking a creator's affiliate link, Honey silently
injects a panel into the page. If the user interacts with it — or if Honey
activates automatically — Honey's affiliate tag replaces the creator's tag in
the order. The creator loses the commission they earned.

**HoneyKiller removes Honey's panel before the user ever sees it.** The shopper's
session is unaffected. Honey's toolbar icon remains green (Honey detects the store
and sets its own badge — HoneyKiller cannot suppress that). But the injected page
panel is gone, so passive hijacking cannot occur. The creator gets paid.

### What this means for shoppers

HoneyKiller does not uninstall Honey or disable its coupon features. If you
deliberately click the Honey toolbar icon, Honey's popup will still open normally.
HoneyKiller only suppresses the panel Honey injects into the page automatically —
the part that replaces the creator's affiliate attribution without the shopper
knowingly choosing it.

### Documented behavior

Honey's background service worker (`h0.js`) detects supported merchant pages and
injects a React-based checkout overlay panel into the page DOM. The panel uses a
**closed shadow root** which is not accessible via normal `querySelector` from the
page. When the user interacts with the panel, or when Honey activates automatically,
the commission is attributed to Honey's PayPal affiliate account rather than the
creator whose link the shopper originally used.

Independent technical analysis confirms that Honey makes the following network
calls from its service worker on every supported merchant page visit:

| Domain | Purpose |
|--------|---------|
| `v.joinhoney.com` | Recipe/store detection API, GraphQL product queries |
| `s.joinhoney.com` | Commission success reporting |
| `d.joinhoney.com` | Data/analytics API |
| `cdn-checkout.joinhoney.com` | Version config for checkout features |
| `o.honey.io` / `out.honey.io` | Outbound affiliate redirect (where commission is claimed) |
| `cdn.honey.io` | CDN — `framework-selectors.json` store activation list, UI assets |

HoneyKiller blocks all requests to `*.joinhoney.com` and the `*.honey.io` redirect
domains via `declarativeNetRequest` rules, in addition to removing the DOM panel.

### Detection signatures (v19.3.0, confirmed)

| Type | Signal | Notes |
|---|---|---|
| Comment node | `<!-- .__(.)< (MEOW) -->` at document level | **Primary signal** — injected by Honey after `</html>`. Fastest and most reliable. |
| Closed shadow root | `document.body > div > div` containing `#shadow-root(closed)` with `div#honey` inside | **v19 fallback** — found via `chrome.dom.openOrClosedShadowRoot()` API |
| Custom element | `honey-button` | v18 legacy |
| DOM element | `#honey-bar` | v18 legacy |
| DOM element | `#honey-iframe` | v18 legacy |
| DOM element | `[id^="HoneyContainer"]` | v18 legacy |
| Global variable | `window.honey` | v18 legacy |
| Global variable | `window.HoneyBEX` | v18 legacy |

### v19 DOM structure (confirmed via DevTools inspection)

```
document
└── <html>
    ├── <head>
    └── <body>
        └── <div>                        ← outer wrapper (direct body child)
            └── <div>                    ← shadow host
                └── #shadow-root (closed)
                    └── <div id="honey"> ← Honey's React panel root
<!-- .__(.)< (MEOW) -->                  ← injected AFTER </html>
```

The shadow root is **closed**, meaning standard `querySelector` cannot reach
`div#honey`. HoneyKiller uses the `chrome.dom.openOrClosedShadowRoot()` Chrome
extension API to pierce the closed root, then removes the outer wrapper div.

> **Previous incorrect signal (now fixed):** Earlier versions of HoneyKiller
> documented `html > div[data-reactroot]` as the v19 detection signal. This was
> wrong — in v19.3.0, Honey's container div is inside `<body>`, not a sibling of
> it. The MEOW comment and `chrome.dom` API are the correct signals.

---

## Capital One Shopping

**Status:** Blocked ✅
**Owner:** Capital One Financial Corporation
**Estimated users:** 10 million
**Chrome extension ID:** `nenlahapcbofgnanklpelkaejcehkggg`

### Documented behavior

Capital One Shopping injects a checkout sidebar or overlay. Publisher reports
document that this can result in affiliate referral IDs being overridden with
Capital One Shopping's own attribution identifiers.

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `[id^="cos-extension"]` |
| Custom element | `capital-one-shopping-extension` |
| DOM element | `[class*="capital-one-shopping"]` |
| DOM element | `#coupons-sidebar` |
| Global variable | `window.CapOne` |
| Global variable | `window.__capital_one_shopping__` |

---

## Rakuten / Ebates

**Status:** Blocked ✅
**Owner:** Rakuten Group (Japan)
**Estimated users:** 12 million
**Chrome extension ID:** `chhjbpecpancjgfef`

### Documented behavior

Rakuten injects a checkout notification bar. Publisher reports document that
this overlay's activation can override the affiliate attribution present in
the session.

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `#pe-bar` |
| DOM element | `[class*="rakuten-ext"]` |
| DOM element | `[id*="ebates"]` |
| Custom element | `rakuten-extension-bar` |
| Global variable | `window.pe_data` |

---

## RetailMeNot

**Status:** Blocked ✅
**Owner:** Ziff Davis
**Estimated users:** 5 million

### Documented behavior

RetailMeNot injects a savings bar at checkout. Publisher reports document
that this can replace tracking parameters in the checkout session.

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `#rmnSavingsBar` |
| DOM element | `[id^="rmn-ext"]` |
| DOM element | `[class*="rmn-extension"]` |

---

## Piggy

**Status:** Blocked ✅
**Owner:** Piggy Ltd
**Estimated users:** 3 million

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `[id^="piggy-extension"]` |
| DOM element | `[id^="piggy-"]` |
| Global variable | `window.__PIG_EXTENSION__` |

---

## Coupert

**Status:** Blocked ✅
**Owner:** Coupert
**Estimated users:** 2 million

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `[id^="coupert-ext"]` |
| DOM element | `[class*="coupert"]` |
| Global variable | `window.__coupert__` |

---

## DealFinder

**Status:** Blocked ✅
**Owner:** Various
**Estimated users:** 1 million+

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `[id^="dealfinder-ext"]` |
| DOM element | `[class*="deal-finder-ext"]` |
| Global variable | `window.__DEALFINDER__` |

---

## Cently

**Status:** Blocked ✅
**Owner:** Cently
**Estimated users:** 500K+

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `[id^="cently-"]` |
| DOM element | `[class*="cently-ext"]` |
| Global variable | `window.__CENTLY__` |

---

## How to Add a New Entry

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide.

Quick summary:
1. Find the extension's Chrome ID
2. Install it in a test browser profile
3. Visit a merchant checkout page
4. Open DevTools → inspect DOM for injected elements
5. Note any `window.*` globals set by the extension
6. Open a PR adding the detection signature to this file and to `content.js`
