/* HoneyKiller — popup.js */

'use strict';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a human-friendly relative time string.
 * @param {number} timestamp  Unix ms timestamp
 * @returns {string}
 */
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10)  return 'just now';
  if (seconds < 60)  return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Strips 'www.' prefix from a hostname for cleaner display.
 * @param {string} hostname
 * @returns {string}
 */
function stripWWW(hostname) {
  return hostname.replace(/^www\./, '');
}

/**
 * Escapes HTML special characters to prevent XSS in injected content.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

// ─── Render ───────────────────────────────────────────────────────────────────

/**
 * Populates the popup UI with data from chrome.storage.local.
 * @param {number} totalBlocked
 * @param {Array}  blockHistory
 */
function render(totalBlocked, blockHistory) {
  // ── Counter ──────────────────────────────
  document.getElementById('total-blocked').textContent =
    totalBlocked.toLocaleString();

  // ── Recent blocks list ───────────────────
  const list   = document.getElementById('block-list');
  const recent = (blockHistory || [])
    .filter((entry, i, arr) =>
      arr.findIndex(e => e.thief === entry.thief && e.merchant === entry.merchant) === i
    )
    .slice(0, 5);

  if (recent.length === 0) {
    list.innerHTML =
      '<li class="block-empty">No blocks detected yet.<br />HoneyKiller is watching.</li>';
    return;
  }

  list.innerHTML = recent.map(entry => `
    <li class="block-item">
      <div class="block-info">
        <span class="block-thief">${escapeHtml(entry.thief)}</span>
        <span class="block-merchant">${escapeHtml(stripWWW(entry.merchant))}</span>
      </div>
      <span class="block-time">${escapeHtml(timeAgo(entry.timestamp))}</span>
    </li>
  `).join('');
}

// ─── Review prompt ───────────────────────────────────────────────────────────

function showReviewPrompt() {
  const section = document.getElementById('review-prompt');
  if (!section) return;

  // Build the Chrome Web Store review URL using this extension's own ID
  const reviewUrl = `https://chromewebstore.google.com/detail/${chrome.runtime.id}/reviews`;
  document.getElementById('review-yes').href = reviewUrl;

  section.style.display = 'block';

  document.getElementById('review-yes').addEventListener('click', () => {
    chrome.storage.local.set({ reviewGiven: true, pendingReviewPrompt: false });
    // Popup closes naturally when the new tab opens
  });

  document.getElementById('review-no').addEventListener('click', () => {
    section.style.display = 'none';
    chrome.storage.local.set({ pendingReviewPrompt: false });
  });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

chrome.storage.local.get(['totalBlocked', 'blockHistory', 'pendingReviewPrompt', 'reviewGiven'], (data) => {
  render(data.totalBlocked || 0, data.blockHistory || []);

  if (data.pendingReviewPrompt && !data.reviewGiven) {
    showReviewPrompt();
    // Clear the flag so it won't show again until background triggers the next one
    chrome.storage.local.set({ pendingReviewPrompt: false });
  }
});
