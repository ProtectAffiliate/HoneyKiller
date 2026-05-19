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

console.log('[HoneyKiller] content script running on:', location.href);

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
      // v19+: Honey injects its signature comment nodes at the document level
      // (after </html>). ".__(.)< (MEOW)" is Honey's universal trademark.
      // This is the fastest and most reliable v19 detection signal.
      const commentWalker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
      while (commentWalker.nextNode()) {
        if (commentWalker.currentNode.nodeValue.includes('(MEOW)')) return true;
      }
      // v19 fallback: scan body divs for a closed shadow root containing #honey
      // using the chrome.dom API which can pierce closed shadow roots in extensions.
      if (document.body && typeof chrome !== 'undefined' && chrome.dom && chrome.dom.openOrClosedShadowRoot) {
        for (const el of document.body.querySelectorAll('div')) {
          try {
            const root = chrome.dom.openOrClosedShadowRoot(el);
            if (root && root.getElementById('honey')) return true;
          } catch (e) { /* not a shadow host */ }
        }
      }
      // Legacy v18 signals (kept for older installs)
      return !!(
        document.getElementById('honey-bar') ||
        document.getElementById('honey-iframe') ||
        document.querySelector('[id^="HoneyContainer"]') ||
        document.querySelector('honey-button') ||
        window.honey !== undefined ||
        window.HoneyBEX !== undefined
      );
    },
    suppress() {
      // v19+: find the closed shadow host (body > div > div#shadow-root(closed))
      // and remove its outer wrapper. chrome.dom API pierces closed shadow roots.
      if (document.body && typeof chrome !== 'undefined' && chrome.dom && chrome.dom.openOrClosedShadowRoot) {
        for (const el of document.body.querySelectorAll('div')) {
          try {
            const root = chrome.dom.openOrClosedShadowRoot(el);
            if (root && root.getElementById('honey')) {
              // Remove the outermost anonymous wrapper if it's a direct body child
              const wrapper = el.parentElement;
              if (wrapper && wrapper.tagName === 'DIV' && wrapper.parentElement === document.body) {
                wrapper.remove();
              } else {
                el.remove();
              }
              break;
            }
          } catch (e) { /* not a shadow host */ }
        }
      }
      // Remove Honey's signature comment nodes
      const commentWalker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
      const toRemove = [];
      while (commentWalker.nextNode()) {
        const val = commentWalker.currentNode.nodeValue;
        if (val.includes('(MEOW)') || val.trimStart().startsWith('sp:eh:')) {
          toRemove.push(commentWalker.currentNode);
        }
      }
      toRemove.forEach(n => n.parentNode && n.parentNode.removeChild(n));
      // Legacy v18 cleanup
      [
        '#honey-bar',
        '#honey-iframe',
        '[id^="HoneyContainer"]',
        'honey-button'
      ].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      _freeze('honey');
      _freeze('HoneyBEX');
      _freeze('__honey');
      return true;
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
        console.log(`[HoneyKiller] detected: ${interceptor.name}`);
        const suppressed = interceptor.suppress();
        console.log(`[HoneyKiller] suppressed: ${interceptor.name}`, suppressed);
        // Only report if suppress() actually removed DOM elements or froze globals.
        // This prevents false positives from transient DOM mutations on merchant pages.
        if (suppressed !== false) reportBlock(interceptor);
      }
    } catch (err) {
      console.error(`[HoneyKiller] error scanning ${interceptor.name}:`, err);
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

// ─── Honey v19+ detection via postMessage ─────────────────────────────────────
//
// Honey v19 no longer injects DOM elements on Amazon.
// Instead, its background service worker uses webRequest permissions to
// intercept affiliate tags. It injects requestProxies.js into the page's main
// world, which wraps window.fetch and XMLHttpRequest.prototype.send and
// announces every request via window.postMessage({messageId:"honey:couponResProxy"}).
//
// Chrome content scripts CAN receive window.postMessage events from the main
// world. We listen for this exact message ID — it only fires when Honey is
// actively running and intercepting network requests on this page.

(function listenForHoneyMessages() {
  const honeyInterceptor = INTERCEPTORS.find(i => i.name === 'Honey');
  if (!honeyInterceptor) return;
  window.addEventListener('message', function onHoneyMessage(e) {
    if (!e.data || e.data.messageId !== 'honey:couponResProxy') return;
    // Honey is actively intercepting requests on this page.
    honeyInterceptor.suppress();
    reportBlock(honeyInterceptor);
    // Once detected, no need to keep listening — remove the handler.
    window.removeEventListener('message', onHoneyMessage);
  });
})();

// ─── Initial scan ─────────────────────────────────────────────────────────────
//
// Runs immediately at document_start. The MutationObserver handles anything
// that arrives later.

console.log('[HoneyKiller] running initial scan');
scan();
