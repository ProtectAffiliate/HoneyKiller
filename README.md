<p align="center">
  <img src="icons/icon128.png" width="96" alt="HoneyKiller">
</p>

# HoneyKiller — Support Your Creators

**Some browser extensions quietly reroute your affiliate commission at checkout — without lowering the buyer's price by a single cent. The creator gets nothing. The extension gets paid instead.**

HoneyKiller blocks every extension that overrides affiliate attribution at checkout. The creator gets credited. You pay the exact same price you always would.

Free. Open source. Zero tracking. Built by [ProtectAffiliate](https://protectaffiliate.com).

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Install%20Free-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](#install)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Install%20Free-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](#install)
[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/lalitntaparia)
[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/honeykiller)
[![GitHub Stars](https://img.shields.io/github/stars/ProtectAffiliate/HoneyKiller?style=for-the-badge&color=ef4444)](https://github.com/ProtectAffiliate/HoneyKiller)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## What Is Actually Happening at Checkout

You spent hours making a video, writing a review, or curating a recommendation. Your audience trusted you, clicked your link, and landed on the product page with your affiliate tag in the URL:

```
https://amazon.com/dp/B09XYZ123?tag=yourchannel-20
```

Then a "coupon finder" extension pops up. *"I found you a reward!"* Your viewer clicks it. The extension's checkout overlay runs. By the time the order goes through, your affiliate tag has been silently replaced.

**Your commission: $0. The extension's commission: theirs.**

These extensions replace the affiliate attribution in your audience's browser at checkout with their own tag. This practice has been widely documented by publishers and content creators across the industry.

> An independent investigation published in late 2024 documented exactly how these checkout overlays work and reached over 10 million views. **Tens of millions of people worldwide have these extensions installed.**

---

## Extensions That Override Affiliate Attribution

The following browser extensions are documented to replace or override affiliate
attribution parameters at merchant checkout pages.

| Extension | Est. Users | Behavior at Checkout |
|---|---|---|
| **Honey** | 17M | May override affiliate attribution |
| **Capital One Shopping** | 10M | May override affiliate referral IDs |
| **Rakuten** | 12M | Injects checkout overlay |
| **RetailMeNot** | 5M | May replace tracking parameters |
| **Piggy** | 3M | Intercepts checkout sessions |
| **Coupert** | 2M | May override affiliate attribution |
| **DealFinder** | 1M+ | May replace affiliate tags |
| **Cently** | 500K+ | May substitute affiliate attribution |

**Combined: ~50 million browsers that can override affiliate attribution at checkout.**

HoneyKiller blocks every one of them, on every supported merchant checkout page,
with zero configuration.

> *All user estimates are sourced from publicly available Chrome Web Store and
> Firefox Add-ons listing data. Documented behaviors are based on independent
> technical analysis and publisher reports.*

---

## What HoneyKiller Does

HoneyKiller runs silently in your browser. The moment you reach a supported
merchant checkout page (Amazon, eBay, ShareASale, CJ, Impact, Awin, and more),
it scans for every known affiliate-overriding extension and removes their
checkout overlays before the user ever sees them.

No UI pops up. Nothing asks you to click anything. The override overlay simply
never appears — and your affiliate tag stays exactly where you put it.

**With HoneyKiller installed, Honey and similar extensions cannot silently change
affiliate credits. They can only affect a purchase if the user deliberately opens
the extension themselves.**

Honey's toolbar icon may still appear green (Honey detects the merchant page and
sets its own badge — that is controlled by Honey, not this extension). But the
panel Honey injects into the page is removed. Passive, silent commission hijacking
cannot occur.

**One job. Done silently. Every time.**

---

## Install

### Chrome

> **[Chrome Web Store listing](https://chrome.google.com/webstore) — coming soon.**
> [⭐ Star this repo](https://github.com/ProtectAffiliate/HoneyKiller) to be notified when it launches.

**Install manually right now (takes 60 seconds):**

1. [Download the latest release ZIP](https://github.com/ProtectAffiliate/HoneyKiller/releases) and unzip it
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle, top-right)
4. Click **Load unpacked** → select the unzipped folder
5. Done. HoneyKiller is protecting every checkout.

### Firefox

> Firefox Add-ons listing coming soon.

---

## Supported Merchants

HoneyKiller runs on all major affiliate merchant checkout domains:

`amazon.com` · `amazon.co.uk` · `amazon.ca` · `amazon.com.au` · `amazon.de`
· `amazon.fr` · `amazon.in` · `amazon.co.jp` · `amazon.it` · `amazon.es`
· `ebay.com` · `shareasale.com` · `cj.com` · `pepperjam.com` · `awin.com`
· `clickbank.net` · `impact.com`

More merchants are added in each release. [Open an issue](https://github.com/ProtectAffiliate/HoneyKiller/issues)
to request one.

---

## Is It Safe? Read Every Line of Code.

A security extension must be beyond reproach. Here is exactly what HoneyKiller
does and does not do:

| Question | Answer |
|---|---|
| Does it read my browsing history? | **No.** The `history` permission is not requested. |
| Does it access all my tabs? | **No.** The `tabs` permission is not requested. |
| Does it send any data anywhere? | **No.** V1 sends zero data. Everything stays local in `chrome.storage.local`. |
| What permissions does it need? | `storage` (count blocks locally) · `declarativeNetRequest` (block Honey's affiliate redirect domains at the network level — no data is read or sent) |
| What sites does it run on? | Only the [specific merchant domains](manifest.json) listed in `manifest.json`. Not on every website. |
| Who can verify this? | **Everyone.** [Read every line of the source code here.](https://github.com/ProtectAffiliate/HoneyKiller) |

**HoneyKiller's minimal permission set is not a limitation — it is the point.**

Compare this to extensions that typically request access to *all websites you visit*, your complete browsing history, and data on every tab you have open.

---

## I'm Just a Viewer/Reader. Why Should I Install This?

Because **these extensions don't actually save you money** — and most people don't know that.

When one of these extensions shows its "I found you a reward!" overlay at checkout, the retailer's price does not change. The number you pay is identical whether the extension is there or not.

What *does* change is who gets credited for sending you there:

| Without HoneyKiller | With HoneyKiller |
|---|---|
| Extension overlay runs | Overlay is silently removed |
| Commission goes to the extension | Commission goes to the creator |
| Your price: the same | Your price: the same |

**You pay exactly the same either way. The only question is whether the person who helped you find the product gets paid for it.**

YouTubers, bloggers, podcasters, newsletter writers, and review sites earn a small commission when you click their link and buy something. That is how independent content creation is funded. These extensions intercept that attribution at checkout and redirect it to themselves — without the retailer lowering your price by even a cent.

Installing HoneyKiller costs you nothing. It means every creator you follow actually gets credited for their recommendation.

---

## Are You a Creator? Share This With Your Audience

Whether you're a YouTuber, blogger, podcaster, newsletter writer, TikToker, or any kind of content creator — your audience is the single most powerful way to protect your income.

**Here's the reality:** Some of your viewers and readers have browser extensions installed that quietly reroute your affiliate commission at checkout. The link worked. They bought the product you recommended. You just didn't get paid for it.

When your audience installs HoneyKiller, their checkout is protected — and your commission comes back to you, automatically, every time.

### How to share it

Copy this into your next video description, blog post, newsletter, or caption:

> *"If you buy through my links, please take 30 seconds to install*
> *[HoneyKiller](https://github.com/ProtectAffiliate/HoneyKiller) —*
> *it's free, open source, and makes sure I actually get credited when you shop.*
> *Costs you nothing. Means everything to me."*

Or share the direct [install link](#install) with your audience.

**Every person in your audience who installs it is a commission you keep.**

---

## For Creators: Full Analytics

HoneyKiller's popup shows how many attribution overrides have been blocked on your own device.

If you want to see **which of your audience members are protected** — and how much commission has been saved across your entire following — that is [ProtectAffiliate.com](https://protectaffiliate.com).

ProtectAffiliate is the analytics platform behind HoneyKiller:

- A lightweight script you add to your site or link in your bio (like Google Analytics)
- Real-time data: which audience members have attribution-overriding extensions installed
- Estimated commission value at risk, by post, video, or episode and by extension
- A shareable *"My audience is protected"* badge for your site or channel

**HoneyKiller is always free. ProtectAffiliate is the upgrade.**

---

## Detection Signatures

HoneyKiller detects each extension using DOM element IDs, CSS class names, custom
HTML elements, and `window` globals injected at checkout. Every signature is
documented in [INTERCEPTORS.md](INTERCEPTORS.md).

**Know an affiliate-overriding extension not on this list?**
[Open an issue](https://github.com/ProtectAffiliate/HoneyKiller/issues/new)
or submit a PR — see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the guide.

---

## Contributing

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide.

The most impactful contribution is adding detection signatures for newly
documented affiliate-overriding extensions. The guide walks through exactly
how to find an extension's DOM fingerprint and submit a PR.

---

## Support the Project

HoneyKiller is free, open source, and always will be. No paid tier. No ads.
No data collection.

**GitHub Sponsors** — preferred (zero fees, shows on the repo, recurring or one-time):

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/lalitntaparia)

**Ko-fi** — quick one-time support (0% fees):

[![Support on Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/honeykiller)

Or [star the repo on GitHub](https://github.com/ProtectAffiliate/HoneyKiller) —
that helps more people find it.

---

## Built By

[ProtectAffiliate](https://protectaffiliate.com) — affiliate commission analytics
for content publishers.

HoneyKiller is our open-source contribution to the affiliate publishing community.
It is free forever and will never have a paid tier.

---

## Legal

HoneyKiller uses brand names solely to describe which extensions it is
compatible with (nominative fair use). HoneyKiller is not affiliated with,
endorsed by, or sponsored by any of the companies mentioned. All trademarks
belong to their respective owners.

HoneyKiller does not make legal determinations about the conduct of any
company. All descriptions of extension behavior are based on independent
technical analysis and publicly available publisher reports.

---

## License

MIT © [ProtectAffiliate](https://protectaffiliate.com)
