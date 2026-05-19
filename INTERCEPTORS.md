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

### Documented behavior

Honey injects a checkout overlay at supported merchants. When activated by the
user, the overlay communicates with Honey's servers and the merchant's affiliate
system. Independent technical analysis and publisher reports have documented
that this process can result in a different affiliate attribution tag being
recorded with the merchant order.

### Detection signatures

| Type | Signal |
|---|---|
| DOM element | `#honey-bar` |
| DOM element | `#honey-iframe` |
| DOM element | `[id^="HoneyContainer"]` |
| DOM element | `[id^="honey-"]` |
| Custom element | `honey-button` |
| Global variable | `window.honey` |
| Global variable | `window.HoneyBEX` |

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
