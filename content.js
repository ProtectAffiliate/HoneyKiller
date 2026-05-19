/**
 * HoneyKiller — content.js
 *
 * Runs at document_start on merchant checkout pages.
 * Detects and removes every known commission-stealing extension's injected UI
 * before it can fire and replace your affiliate tag.
 *
 * V1: zero server calls. Nothing leaves the browser.
 */

'use strict';

// ─── Known affiliate tracking parameters ─────────────────────────────────────

const AFFILIATE_PARAMS = [
  'tag', 'ref', 'aff_id', 'affiliate_id', 'cjevent', 'irclickid',
  'subid', 'via', 'ranMID', 'clickid', 'pid', 'sid', 'affid',
  'aid', 'partner_id', 'publisher_id', 'tracking_id'
];

// ─── Extensions known to override affiliate attribution ──────────────────────
//
// Each entry has:
//   name     — human-readable name shown in the popup
//   owner    — the parent company
//   detect() — returns true if the extension's DOM fingerprint is present
//   suppress()— removes the extension's injected elements and freezes its globals
//
// Detection order matters: most widely installed extensions are checked first.

const INTERCEPTORS = [
  {
    name: 'Honey',
    owner: 'PayPal',
    detect() {
      return !!(
        document.getElementById('honey-bar') ||
        document.getElementById('honey-iframe') ||
        document.getElementById('HoneyContainer') ||
        document.querySelector('[id^="HoneyContainer"]') ||
        document.querySelector('[id^="honey-"]') ||
        document.querySelector('[class*="honey-extension"]') ||
        document.querySelector('honey-button') ||
        window.honey !== undefined ||
        window.HoneyBEX !== undefined ||
        window.__honey !== undefined
      );
    },
    suppress() {
      [
        '#honey-bar',
        '#honey-iframe',
        '#HoneyContainer',
        '[id^="HoneyContainer"]',
        '[id^="honey-"]',
        '[class*="honey-extension"]',
        'honey-button'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('honey');
      _freeze('HoneyBEX');
      _freeze('__honey');
    }
  },

  {
    name: 'Capital One Shopping',
    owner: 'Capital One',
    detect() {
      return !!(
        window.CapOne !== undefined ||
        window.__capital_one_shopping__ !== undefined ||
        document.querySelector('[id^="cos-extension"]') ||
        document.querySelector('capital-one-shopping-extension') ||
        document.querySelector('[class*="capital-one-shopping"]') ||
        document.getElementById('coupons-sidebar') ||
        document.querySelector('[data-cos]')
      );
    },
    suppress() {
      [
        '[id^="cos-extension"]',
        'capital-one-shopping-extension',
        '[class*="capital-one-shopping"]',
        '#coupons-sidebar',
        '[data-cos]'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('CapOne');
      _freeze('__capital_one_shopping__');
    }
  },

  {
    name: 'Rakuten',
    owner: 'Rakuten Group',
    detect() {
      // Intentionally narrow: only the extension's own injected bar elements.
      // [id^="rakuten-"] and [id*="ebates"] were removed — Amazon loads Rakuten
      // affiliate partner widgets transiently that match those broad patterns,
      // causing false positives via the MutationObserver.
      return !!(        
        document.getElementById('pe-bar') ||
        document.querySelector('[class*="rakuten-ext"]') ||
        document.querySelector('rakuten-extension-bar')
      );
    },
    suppress() {
      let removed = 0;
      [
        '#pe-bar',
        '[class*="rakuten-ext"]',
        'rakuten-extension-bar'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => { el.remove(); removed++; });
      });
      if (removed > 0) _freeze('pe_data');
      return removed > 0;
    }
  },

  {
    name: 'RetailMeNot',
    owner: 'Ziff Davis',
    detect() {
      return !!(
        document.getElementById('rmnSavingsBar') ||
        document.querySelector('[id^="rmn-ext"]') ||
        document.querySelector('[class*="rmn-extension"]') ||
        document.querySelector('[id^="retailmenot-"]')
      );
    },
    suppress() {
      [
        '#rmnSavingsBar',
        '[id^="rmn-ext"]',
        '[class*="rmn-extension"]',
        '[id^="retailmenot-"]'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
    }
  },

  {
    name: 'Piggy',
    owner: 'Piggy Ltd',
    detect() {
      return !!(
        window.__PIG_EXTENSION__ !== undefined ||
        document.querySelector('[id^="piggy-extension"]') ||
        document.querySelector('[class*="piggy-ext"]') ||
        document.querySelector('[id^="piggy-"]')
      );
    },
    suppress() {
      [
        '[id^="piggy-extension"]',
        '[class*="piggy-ext"]',
        '[id^="piggy-"]'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('__PIG_EXTENSION__');
    }
  },

  {
    name: 'Coupert',
    owner: 'Coupert',
    detect() {
      return !!(
        window.__coupert__ !== undefined ||
        document.querySelector('[id^="coupert-ext"]') ||
        document.querySelector('[class*="coupert"]')
      );
    },
    suppress() {
      [
        '[id^="coupert-ext"]',
        '[class*="coupert"]'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('__coupert__');
    }
  },

  {
    name: 'DealFinder',
    owner: 'DealFinder',
    detect() {
      return !!(
        window.__DEALFINDER__ !== undefined ||
        document.querySelector('[id^="dealfinder-ext"]') ||
        document.querySelector('[class*="deal-finder-ext"]') ||
        document.querySelector('[id^="dealfinder-"]')
      );
    },
    suppress() {
      [
        '[id^="dealfinder-ext"]',
        '[class*="deal-finder-ext"]',
        '[id^="dealfinder-"]'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('__DEALFINDER__');
    }
  },

  {
    name: 'Cently',
    owner: 'Cently',
    detect() {
      return !!(
        window.__CENTLY__ !== undefined ||
        document.querySelector('[id^="cently-"]') ||
        document.querySelector('[class*="cently-ext"]')
      );
    },
    suppress() {
      [
        '[id^="cently-"]',
        '[class*="cently-ext"]'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('__CENTLY__');
    }
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Attempt to freeze a window global so the extension cannot re-set it.
 * Fails silently — some globals cannot be overwritten.
 */
function _freeze(globalName) {
  try {
    Object.defineProperty(window, globalName, {
      value: undefined,
      writable: false,
      configurable: false
    });
  } catch (_) {
    // Page may not allow redefining certain globals — that's fine.
  }
}

// ─── Block tracking ───────────────────────────────────────────────────────────

/** Set of extension names already reported for this page load — avoids duplicate counts. */
const _reported = new Set();

function reportBlock(interceptor) {
  if (_reported.has(interceptor.name)) return;
  _reported.add(interceptor.name);

  try {
    chrome.runtime.sendMessage({
      type: 'BLOCK_DETECTED',
      thief: interceptor.name,
      merchant: location.hostname,
      timestamp: Date.now()
    });
  } catch (_) {
    // Extension context may not be available on some edge cases — fail silently.
  }
}

// ─── Core scan ────────────────────────────────────────────────────────────────

function scan() {
  for (const interceptor of INTERCEPTORS) {
    try {
      if (interceptor.detect()) {
        const suppressed = interceptor.suppress();
        // Only report if suppress() actually removed DOM elements or froze globals.
        // This prevents false positives from transient DOM mutations on merchant pages.
        if (suppressed !== false) reportBlock(interceptor);
      }
    } catch (_) {
      // Never let a single entry's error stop the rest of the scan.
    }
  }
}

// ─── MutationObserver — catch late-injected overlays ─────────────────────────
//
// Affiliate-overriding extensions typically inject their checkout overlay
// after the page loads. The MutationObserver re-scans on every DOM change
// so we catch them no matter when they inject.

const _observer = new MutationObserver(scan);

_observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// ─── Affiliate tag capture ────────────────────────────────────────────────────
//
// Snapshot any affiliate params present in the URL at page load.
// Used for future detection of param tampering (V2 feature).

(function captureCurrentTags() {
  try {
    const url = new URL(location.href);
    const tags = {};
    AFFILIATE_PARAMS.forEach(p => {
      if (url.searchParams.has(p)) tags[p] = url.searchParams.get(p);
    });
    // Store for potential future use — not sent anywhere in V1.
    window.__hk_captured_tags = Object.freeze(tags);
  } catch (_) {}
})();

// ─── Initial scan ─────────────────────────────────────────────────────────────
//
// Runs immediately at document_start. The MutationObserver handles anything
// that arrives later.

scan();
