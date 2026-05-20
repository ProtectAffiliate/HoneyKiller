# Privacy Policy — HoneyKiller

**Last updated: May 20, 2026**

## Summary

HoneyKiller collects no user data. Period.

## Data Collection

HoneyKiller does not collect, transmit, store, or share any personal data, browsing history, or user information of any kind.

The extension stores a single numeric counter locally on your device using `chrome.storage.local`. This counter tracks how many times Honey's panel was blocked, and is displayed in the extension popup. It never leaves your browser.

## Permissions

| Permission | Why it is needed |
|---|---|
| `declarativeNetRequest` | Blocks outbound requests to Honey's affiliate servers at the browser level |
| `storage` | Stores the local block counter shown in the popup |
| Host permissions | Injects a content script on supported shopping sites to remove Honey's injected panel |

## Third Parties

HoneyKiller does not communicate with any server. There are no analytics, no telemetry, no crash reporting, and no external APIs.

## Changes

If this policy ever changes, the updated version will be published at this URL with a new date.

## Contact

[github.com/protectaffiliate/honeykiller](https://github.com/protectaffiliate/honeykiller)
