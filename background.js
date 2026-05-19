/**
 * HoneyKiller — background.js
 *
 * Service worker. Receives block events from content.js and persists
 * block counts + history in chrome.storage.local.
 *
 * V1: nothing is sent to any server. All data stays local in the browser.
 */

'use strict';

// ─── Handle incoming block events ────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'BLOCK_DETECTED') return false;

  chrome.storage.local.get(['totalBlocked', 'blockHistory'], (data) => {
    const total   = (data.totalBlocked  || 0) + 1;
    const history = (data.blockHistory  || []);

    history.unshift({
      thief:     msg.thief,
      merchant:  msg.merchant,
      timestamp: msg.timestamp
    });

    chrome.storage.local.set({
      totalBlocked: total,
      blockHistory: history.slice(0, 50)   // keep last 50 events
    });

    // Badge shows the lifetime block count
    chrome.action.setBadgeText({ text: String(total) });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  });

  sendResponse({ ok: true });
  return true;  // keep the message channel open for the async callback
});

// ─── Restore badge on startup / update ───────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('totalBlocked', ({ totalBlocked }) => {
    const count = totalBlocked || 0;
    chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get('totalBlocked', ({ totalBlocked }) => {
    const count = totalBlocked || 0;
    chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  });
});
