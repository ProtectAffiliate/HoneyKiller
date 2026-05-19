# HoneyKiller — Session Transfer Document
**Date:** 2026-05-19  
**Repo:** https://github.com/ProtectAffiliate/HoneyKiller  
**Parent product:** ProtectAffiliate (https://protectaffiliate.com)  
**Working directory for this session:** The HoneyKiller repo (cloned locally)

---

## What You Are Building

A **Chrome + Firefox browser extension** called **HoneyKiller** that blocks Honey,
Capital One Shopping, Rakuten, RetailMeNot, Piggy, Coupert and every other
commission-stealing extension from hijacking affiliate commissions at merchant
checkout pages.

This is a **standalone open-source project** — completely separate from the
ProtectAffiliate main app codebase (RevSave). It lives only at:
`github.com/ProtectAffiliate/HoneyKiller`

---

## The Problem It Solves

When a reader with Honey installed clicks an affiliate link on a blogger's site
and reaches Amazon checkout, Honey pops up with "Apply rewards" and replaces the
blogger's affiliate tag (`tag=blogger-20`) with Honey's own tag (`tag=honey-20`).
The blogger earns $0. Honey (owned by PayPal, acquired for $4 billion) earns the
commission instead.

**The same theft is done by:**
- Honey (PayPal) — 17M users
- Capital One Shopping — 10M users
- Rakuten / Ebates — 12M users
- RetailMeNot — 5M users
- Piggy — 3M users
- Coupert — 2M users
- DealFinder — growing

**Combined: ~50 million browsers actively stealing from affiliate bloggers.**

HoneyKiller blocks all of them. On every checkout page. Silently.

---

## Business Strategy — Read This First

### HoneyKiller is FREE and open source. Always.

It is NOT a revenue product. It is the **acquisition channel** for ProtectAffiliate
(the paid SaaS at protectaffiliate.com).

### The viral loop:
1. Blogger discovers HoneyKiller → installs it → sees thefts blocked in dashboard
2. Blogger writes about it on their site (*"I use HoneyKiller to stop Honey stealing my commissions"*)
3. Readers install HoneyKiller from that post
4. HoneyKiller popup has one CTA: **"Full analytics → ProtectAffiliate.com"**
5. Readers who are also bloggers → sign up for ProtectAffiliate
6. Repeat

### Why "Honey" is in the name:
- Honey is the most famous commission thief (17M users, PayPal acquisition)
- "HoneyKiller" ranks for every search about Honey + affiliate commissions
- PayPal spent $4B building that brand awareness — HoneyKiller rides it for free
- Press headline writes itself: *"HoneyKiller takes on PayPal's Honey"*

### Domain: honeykiller.com (owner has registered this)
### GitHub org: github.com/ProtectAffiliate (already created)
### Repo: github.com/ProtectAffiliate/HoneyKiller (already created, empty)

---

## What To Build — In Order

### Step 1: The README (most important, do this first)

The README is the viral document. It must:
- Explain the theft problem with proof (screenshots/GIFs)
- List every extension blocked with detection signatures
- Have a one-click install button for Chrome Web Store
- Link to honeykiller.com and ProtectAffiliate.com
- Be written to make angry bloggers want to share it

### Step 2: The Extension Code

**File structure:**
```
HoneyKiller/
├── manifest.json          ← Chrome Extension Manifest V3
├── content.js             ← runs on merchant pages, detects + blocks thieves
├── background.js          ← service worker, tracks block counts
├── popup/
│   ├── popup.html         ← extension icon popup UI
│   ├── popup.js           ← popup logic
│   └── popup.css          ← popup styles
├── icons/
│   ├── icon16.png         ← bear claw icon (or bee with X)
│   ├── icon48.png
│   └── icon128.png
├── THIEVES.md             ← community-maintained list of all known thieves
├── README.md              ← the viral document
├── LICENSE                ← MIT
└── .github/
    └── CONTRIBUTING.md    ← how community adds new extension detections
```

### Step 3: Submit to Chrome Web Store

Use owner's Google account. Extension name: "HoneyKiller — Commission Protection"

---

## Technical Specification — Content Script

`content.js` runs at `document_start` on all major merchant checkout pages.

### Merchant list (host_permissions in manifest):
```
*://*.amazon.com/*
*://*.amazon.co.uk/*
*://*.amazon.ca/*
*://*.amazon.com.au/*
*://*.amazon.de/*
*://*.amazon.fr/*
*://*.amazon.in/*
*://*.amazon.co.jp/*
*://*.amazon.it/*
*://*.amazon.es/*
*://*.shareasale.com/*
*://*.cj.com/*
*://*.pepperjam.com/*
*://*.awin.com/*
*://*.clickbank.net/*
*://*.impact.com/*
*://*.ebay.com/*
```

### What content.js does:

**1. Detect known commission thieves using DOM signals:**
```javascript
const THIEVES = [
  {
    name: 'Honey',
    owner: 'PayPal',
    detect: () => !!(
      document.getElementById('honey-bar') ||
      document.getElementById('honey-iframe') ||
      window.honey || window.HoneyBEX ||
      document.querySelector('[id^="HoneyContainer"]')
    ),
    suppress: () => {
      // Remove Honey's injected DOM elements
      ['honey-bar','honey-iframe','HoneyContainer'].forEach(id => {
        const el = document.getElementById(id) ||
                   document.querySelector(`[id^="${id}"]`);
        if (el) el.remove();
      });
    }
  },
  {
    name: 'Capital One Shopping',
    owner: 'Capital One',
    detect: () => !!(
      window.CapOne ||
      window.__capital_one_shopping__ ||
      document.querySelector('[id^="cos-extension"]') ||
      document.querySelector('capital-one-shopping-extension')
    ),
    suppress: () => {
      const el = document.querySelector('[id^="cos-extension"]') ||
                 document.querySelector('capital-one-shopping-extension');
      if (el) el.remove();
    }
  },
  {
    name: 'Rakuten',
    owner: 'Rakuten Group',
    detect: () => !!(
      window.pe_data ||
      document.getElementById('pe-bar') ||
      document.querySelector('[class*="rakuten-ext"]')
    ),
    suppress: () => {
      const el = document.getElementById('pe-bar') ||
                 document.querySelector('[class*="rakuten-ext"]');
      if (el) el.remove();
    }
  },
  {
    name: 'RetailMeNot',
    owner: 'Ziff Davis',
    detect: () => !!(
      document.getElementById('rmnSavingsBar') ||
      document.querySelector('[id^="rmn-ext"]')
    ),
    suppress: () => {
      const el = document.getElementById('rmnSavingsBar') ||
                 document.querySelector('[id^="rmn-ext"]');
      if (el) el.remove();
    }
  },
  {
    name: 'Piggy',
    owner: 'Piggy',
    detect: () => !!(
      window.__PIG_EXTENSION__ ||
      document.querySelector('[id^="piggy-extension"]')
    ),
    suppress: () => {
      const el = document.querySelector('[id^="piggy-extension"]');
      if (el) el.remove();
    }
  },
  {
    name: 'Coupert',
    owner: 'Coupert',
    detect: () => !!(
      window.__coupert__ ||
      document.querySelector('[id^="coupert-ext"]')
    ),
    suppress: () => {
      const el = document.querySelector('[id^="coupert-ext"]');
      if (el) el.remove();
    }
  }
];
```

**2. Affiliate param protection:**
```javascript
// Known affiliate tag parameters
const AFFILIATE_PARAMS = ['tag', 'ref', 'aff_id', 'affiliate_id', 'cjevent',
                          'irclickid', 'subid', 'via', 'ranMID'];

// On page load, capture any affiliate params in the current URL
// Store them so we can detect if they get changed
function captureCurrentTags() {
  const url = new URL(location.href);
  const tags = {};
  AFFILIATE_PARAMS.forEach(p => {
    if (url.searchParams.has(p)) tags[p] = url.searchParams.get(p);
  });
  return tags;
}
```

**3. MutationObserver to catch late-injected thief UIs:**
```javascript
// Thieves inject their UI after page load — observe DOM for their elements
const observer = new MutationObserver(() => {
  THIEVES.forEach(thief => {
    if (thief.detect()) {
      thief.suppress();
      reportBlock(thief.name);
    }
  });
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
```

**4. Report blocks to background service worker:**
```javascript
function reportBlock(thiefName) {
  chrome.runtime.sendMessage({
    type: 'BLOCK_DETECTED',
    thief: thiefName,
    merchant: location.hostname,
    timestamp: Date.now()
  });
}
```

---

## Technical Specification — Background Service Worker

`background.js` tracks block counts and manages storage.

```javascript
// Increment block count when content.js reports a block
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'BLOCK_DETECTED') {
    chrome.storage.local.get(['totalBlocked', 'blockHistory'], (data) => {
      const total = (data.totalBlocked || 0) + 1;
      const history = data.blockHistory || [];
      history.unshift({
        thief:     msg.thief,
        merchant:  msg.merchant,
        timestamp: msg.timestamp
      });
      chrome.storage.local.set({
        totalBlocked:  total,
        blockHistory:  history.slice(0, 100), // keep last 100
      });
      // Update badge count
      chrome.action.setBadgeText({ text: String(total) });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    });
  }
});
```

---

## Technical Specification — Popup UI

Shows the user:
- Total thefts blocked this month
- Last 5 blocks (which extension, which merchant)
- CTA to ProtectAffiliate.com

**Popup design (dark, clean):**
```
┌──────────────────────────────────────┐
│  🔪 HoneyKiller                      │
│  Commission Protection               │
│                                      │
│  Thefts blocked this month:          │
│  ┌──────────────────────────────┐    │
│  │         23                   │    │
│  └──────────────────────────────┘    │
│                                      │
│  Recent blocks:                      │
│  • Honey — Amazon checkout    today  │
│  • Capital One — eBay         2d ago │
│  • Rakuten — Amazon           5d ago │
│                                      │
│  ──────────────────────────────────  │
│  Are you a blogger?                  │
│  See full analytics →                │
│  ProtectAffiliate.com                │
└──────────────────────────────────────┘
```

---

## README Content — Write This Exactly

The README must be written as a viral document, not a technical document.
It should make a blogger angry, then relieved, then want to share it.

**Structure:**
1. Hero: the bold theft claim with a GIF showing Honey replacing a tag
2. "Who is stealing from you" — the list of all extensions with company ownership
3. "What HoneyKiller does" — one paragraph, non-technical
4. "Install now" — big Chrome Web Store button
5. "Is it safe?" — answers every trust objection with GitHub link
6. "For bloggers" — link to ProtectAffiliate.com for full analytics
7. "Community" — how to add new extension detections (CONTRIBUTING.md)
8. "Built by ProtectAffiliate" — brand connection

---

## Manifest.json (Manifest V3)

Key settings:
- `"manifest_version": 3`
- `"run_at": "document_start"` — runs before thief extensions can inject
- Permissions: only `"storage"` — no history, no tabs, no all_urls
- Host permissions: only the specific merchant domains listed above
- This minimal permission set is a TRUST SIGNAL — show it prominently in README

---

## Connection to ProtectAffiliate Dashboard (Phase 2 — build later)

When a blogger has a PA account, HoneyKiller can send block events to:
```
POST https://protectaffiliate.com/api/v1/public/hk-event
{
  "hk_key": "user's PA workspace key",
  "thief": "Honey",
  "merchant": "amazon.com",
  "timestamp": 1234567890
}
```

This is NOT needed for v1. Build v1 completely standalone. Add PA integration
in v2 after Chrome Web Store approval and first users.

The PA API endpoint to build later (in RevSave):
`src/app/api/v1/public/hk-event/route.ts`

---

## Chrome Web Store Submission Details

```
Name:           HoneyKiller — Commission Protection
Category:       Productivity
Language:       English
Description:    Blocks Honey, Capital One Shopping, Rakuten and every other
                commission-stealing extension from hijacking your affiliate
                earnings at checkout. Free. Open source. Built by ProtectAffiliate.
Website:        https://honeykiller.com
Privacy policy: https://protectaffiliate.com/privacy
```

**Single purpose statement (required by Chrome):**
"This extension detects and blocks commission-stealing browser extensions
(Honey, Capital One Shopping, Rakuten, etc.) from overriding affiliate tags
on merchant checkout pages."

---

## What NOT To Build In This Repo

- No billing or payments (that's ProtectAffiliate)
- No user accounts (v1 is fully anonymous)
- No backend server (all local storage in v1)
- No link scanning (that's ProtectAffiliate)
- No dashboard (that's ProtectAffiliate)
- No pa.js functionality (separate product)

HoneyKiller does ONE thing: detects and blocks commission thieves on checkout pages.
Everything else lives in ProtectAffiliate.

---

## Owner Information

- GitHub org: https://github.com/ProtectAffiliate
- Repo: https://github.com/ProtectAffiliate/HoneyKiller
- Domain: honeykiller.com (registered)
- Product site: https://protectaffiliate.com
- Owner GitHub: https://github.com/lalitntaparia

---

## Data Architecture — V1 and V2

### Critical rule: open source code NEVER contains credentials

The extension code is public. It must never contain:
- Supabase URL or keys
- Any database credentials
- Table or schema names
- Any private ProtectAffiliate infrastructure details

The extension only ever knows one public URL:
`https://protectaffiliate.com/api/v1/public/hk-event`

What that endpoint does internally is private RevSave code, never in this repo.

---

### V1 — Zero data sent anywhere (build this first)

**Everything stored locally in the browser. Nothing leaves.**

```javascript
// background.js — V1 data storage
// chrome.storage.local only. No server calls. No Supabase.

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'BLOCK_DETECTED') {
    chrome.storage.local.get(['totalBlocked', 'blockHistory'], (data) => {
      const total = (data.totalBlocked || 0) + 1;
      const history = data.blockHistory || [];
      history.unshift({
        thief:     msg.thief,
        merchant:  msg.merchant,
        timestamp: msg.timestamp
      });
      chrome.storage.local.set({
        totalBlocked: total,
        blockHistory: history.slice(0, 50),
      });
      chrome.action.setBadgeText({ text: String(total) });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    });
  }
});
```

**Why V1 sends nothing:**
- Open source = anyone reads the code = maximum scrutiny
- No data collection = no privacy concern = no trust barrier
- Fewer permissions = Chrome Web Store approves faster
- Users install without hesitation
- GDPR compliant by design — zero data collected

**Popup in V1:**
```
Thefts blocked: 23
Last block: Honey — Amazon (2h ago)

[See full analytics → ProtectAffiliate.com]
```

The CTA to ProtectAffiliate.com is the ONLY connection to your business in V1.
This converts HoneyKiller users into PA subscribers without collecting any data.

---

### V2 — Opt-in only, blogger-linked only (build after traction)

**User CHOOSES to connect their PA account. Nothing automatic.**

#### How opt-in works in the popup:

```
┌────────────────────────────────────────────┐
│  HoneyKiller                               │
│  Thefts blocked: 47                        │
│                                            │
│  ──────────────────────────────────────    │
│  Are you a blogger?                        │
│  Link your ProtectAffiliate account to     │
│  see which of your readers are protected.  │
│                                            │
│  PA Workspace Key: [____________] [Link]   │
│                                            │
│  ProtectAffiliate.com → Get your key       │
└────────────────────────────────────────────┘
```

When blogger types their PA key and clicks Link:
- Key stored in `chrome.storage.local`
- From that point, block events are sent to the PA API
- Blogger sees reader theft stats in their PA dashboard

#### What V2 sends (only when PA key is linked):

```javascript
// V2 addition to background.js — only fires when pa_key is set
async function reportToPA(event) {
  const { pa_key } = await chrome.storage.local.get('pa_key');
  if (!pa_key) return; // never send without explicit opt-in

  fetch('https://protectaffiliate.com/api/v1/public/hk-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pa_key,
      thief_name:      event.thief,
      merchant_domain: event.merchant,
      hk_version:      chrome.runtime.getManifest().version
    })
  }).catch(() => {}); // silent — never break the extension
}
```

#### What the payload contains (V2):

```json
{
  "pa_key":         "ws_abc123",
  "thief_name":     "Honey",
  "merchant_domain":"amazon.com",
  "hk_version":     "1.0.0"
}
```

**What it does NOT contain:**
- No user identity
- No full URL (domain only)
- No products being purchased
- No payment information
- No browsing history

---

### Separate Supabase schema for HoneyKiller data

Same Supabase database as ProtectAffiliate. **Completely separate schema.**
HoneyKiller data is NEVER stored in the `revsave` schema.

```sql
-- Migration: honeykiller schema (add to RevSave migrations when building V2)
-- Run in ProtectAffiliate's Supabase — same DB, separate schema

CREATE SCHEMA IF NOT EXISTS honeykiller;

CREATE TABLE honeykiller.block_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    uuid,       -- resolved from pa_key, null if lookup fails
  pa_key          text,       -- the blogger's PA workspace key
  thief_name      text        NOT NULL,
  merchant_domain text        NOT NULL,
  hk_version      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for dashboard queries
CREATE INDEX idx_hk_workspace_created
  ON honeykiller.block_events (workspace_id, created_at DESC);

CREATE INDEX idx_hk_thief_created
  ON honeykiller.block_events (thief_name, created_at DESC);

-- Global stat index (for the public viral counter)
CREATE INDEX idx_hk_created
  ON honeykiller.block_events (created_at DESC);
```

**Why separate schema:**
- `revsave` = paying customers' business data. Never mix.
- If HoneyKiller data is compromised, ProtectAffiliate is unaffected
- Can be dropped, truncated, or restructured without touching PA
- Row-level security policies are independent

---

### RevSave API endpoint for V2 (build in RevSave when ready)

File to create in RevSave: `src/app/api/v1/public/hk-event/route.ts`

```typescript
// Public endpoint — no auth required
// Rate limited: 10 requests per IP per minute
// Validates pa_key against workspaces table
// Writes to honeykiller schema ONLY — never touches revsave

export async function POST(request: Request) {
  const body = await request.json();
  const { pa_key, thief_name, merchant_domain, hk_version } = body;

  // Resolve workspace from pa_key (read-only lookup into revsave)
  let workspace_id = null;
  if (pa_key) {
    const { data } = await supabaseServer
      .schema('revsave').from('workspaces')
      .select('id').eq('public_key', pa_key).maybeSingle();
    workspace_id = data?.id ?? null;
  }

  // Write ONLY to honeykiller schema
  await supabaseServer
    .schema('honeykiller').from('block_events')
    .insert({ workspace_id, pa_key, thief_name, merchant_domain, hk_version });

  return ok({ received: true });
}
```

**Note:** This endpoint is NOT built in this session. It is built in RevSave
when V2 of the extension is ready. V1 does not need it.

---

### What bloggers see in PA dashboard (V2, RevSave work)

New section in the PA dashboard: **"Reader Protection"**

```
Reader Commission Protection (via HoneyKiller)

This month: 47 thefts blocked from your readers
Estimated commissions saved: ~$94

By extension:
  Honey                  31 blocks
  Capital One Shopping    9 blocks
  Rakuten                 7 blocks

234 of your readers don't have HoneyKiller yet.
Share: honeykiller.com?ref=YOUR_KEY
```

This is NOT built in this session. It is a future RevSave feature.
Note it and skip it for now.

---

### Global public counter (V2)

Live on honeykiller.com:
```
HoneyKiller has blocked 1,247,832 commission thefts.
Estimated creator income protected: $2.4M
```

Powered by: `SELECT COUNT(*) FROM honeykiller.block_events`
This is the viral stat. Grows every day. Press story by itself.

---

## First Session Tasks Checklist

- [ ] Clone the repo locally
- [ ] Write README.md (viral document — most important)
- [ ] Write THIEVES.md (list of all known thieves with detection signatures)
- [ ] Write manifest.json (Manifest V3, minimal permissions)
- [ ] Write content.js (detection + blocking, NO server calls in V1)
- [ ] Write background.js (block counting in chrome.storage.local ONLY)
- [ ] Write popup/popup.html + popup.js + popup.css
- [ ] Create placeholder icons (16/48/128px — bear claw or bee with X)
- [ ] Write CONTRIBUTING.md (how community adds new thieves)
- [ ] First commit and push to github.com/ProtectAffiliate/HoneyKiller
- [ ] Submit to Chrome Web Store ($5 one-time Google Developer fee)

## V2 Tasks (do NOT build in first session — RevSave work)

- [ ] Add `workspaces.public_key` column to revsave (or use existing key)
- [ ] Create `honeykiller` schema in Supabase
- [ ] Build `src/app/api/v1/public/hk-event/route.ts` in RevSave
- [ ] Add opt-in PA key input to HoneyKiller popup
- [ ] Add "Reader Protection" section to PA dashboard

---

## The Tagline (use everywhere)

**"One extension. Every commission thief. Killed."**

---

## Context From Previous Session

This extension was conceived as the solution to "checkout-level theft" —
a theft vector that pa.js (ProtectAffiliate's on-site script) CANNOT stop
because it only runs on the blogger's domain. Once a reader navigates to
Amazon, pa.js has no access. HoneyKiller runs inside the reader's browser
and follows them to every checkout page, blocking thieves that pa.js cannot reach.

The /test simulation page (live at protectaffiliate.com/test) demonstrates
the checkout theft problem and converts bloggers into ProtectAffiliate users.
HoneyKiller is the solution those bloggers then share with their readers.
The full cycle: blogger uses ProtectAffiliate → discovers checkout theft →
installs HoneyKiller → shares with readers → readers install → some readers
are bloggers → they sign up for ProtectAffiliate.

---

*Open this document in a new Claude session. Share the repo URL and this document.
Claude will have everything needed to build the complete extension from scratch.*
