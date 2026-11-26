# Smelly A.F. design

Smelly A.F. pairs cosy home fragrance with a cheeky British voice. Warm cream, candy pink, bold serif headings and real candle photography give the shop its personality. Keep the shopping journey easy to scan, from choosing a scent to checking out.

## Voice

Write in conversational UK English. Use the full **Smelly A.F.** name and preserve the punctuation in all four range names. Put the cheekier lines in headlines and handwritten notes. Keep actions plain and specific, such as “Shop all scents” and “Add to basket”. Use confirmed product details, customer-supplied reviews and delivery terms the shop can support. [Homepage copy](templates/index.json) · [Interface labels](locales/en.default.json)

## Colour and type

Use the shared tokens so new sections belong to the storefront. The values below describe the current palette. [Brand stylesheet](assets/smelly-af.css)

| Token | Value | Role |
| --- | --- | --- |
| `--smelly-cream` | `#fff9ef` | Warm section backgrounds, cards and artwork frames |
| `--smelly-ink` | `#261a21` | Primary text and dark outlines |
| `--smelly-pink` | `#cb1952` | Primary actions, focus indicators and small brand accents |
| `--smelly-blush` | `#f9dce6` | Soft backgrounds for stories, testimonials and selected accents |
| `--smelly-lilac` | `#e8dff5` | A secondary pastel for alternating journal artwork backgrounds |
| `--smelly-line` | `#e7d9ce` | Subtle borders and dividers |

Use `--smelly-serif` for bold Georgia-led headings and the wordmark. Keep body copy, prices, labels and controls in Horizon’s body type. Use `.smelly-handwritten` for short notes, captions and signatures. The centred wordmark pairs a pink flame with a small, widely spaced descriptor. Uploaded logos take precedence, including the inverse logo on transparent headers when set. [Brand stylesheet](assets/smelly-af.css) · [Header logo](blocks/_header-logo.liquid)

## Layout and components

- Use `.smelly-shell` and `.smelly-section-space` for the shared editorial width and rhythm. Give headlines and photographs room to breathe. On mobile, stack editorial content in reading order and keep the primary action near the copy or price it supports.
- Use a pink pill button for the primary action and an outlined treatment for a secondary action. Underline links in prose and keep keyboard focus visible on all controls. Preserve the header’s centred logo and 44 px touch targets for its main controls.
- Make product photography, title and price easy to find in product cards. Keep availability and purchasing controls legible even when names run long. Use warm editorial accents around catalogue results and basket summaries, while keeping filters, quantities and checkout actions clear.
- Give the range cards arched colour panels and cream artwork backdrops. Use one link for the whole card and place the Explore label beneath the divider, so each card has one keyboard stop. The full range grid uses four columns from 990 px and two columns below that when all four ranges are present. Centre shorter rows. [Range section](sections/smelly-ranges.liquid) · [Brand stylesheet](assets/smelly-af.css)

## Photography and illustration

Use the supplied candle photographs as the reference for labels, wax colours, gold lids and jar proportions. Keep the bundled product scenes true to the unlit, lidded candles. The homepage hero uses separate desktop, tablet and mobile compositions. Leave clear space for editable HTML copy on the left of wide scenes and above the candles on mobile. Keep the product labels legible in tighter crops. [Hero section](sections/smelly-hero.liquid)

Use the studio photographs on neutral backgrounds for individual candles in the editorial sections. Keep the full jar in view in square and portrait frames. The Scents guide shows the full set. [Scents template](templates/page.scents.json)

| Range | Artwork and panel |
| --- | --- |
| Spooky A.F. | Pumpkin with a crescent on warm orange |
| Festive A.F. | Ribbon-tied candy cane and holly on dusty pink |
| Sweet A.F. | Swirled sweet on candy pink |
| Fresh A.F. | Daisy with a golden centre on sage green |

Use rounded ink outlines and cream highlights on the range artwork. Keep small pouring-jug, soy-sprig, jar and heart illustrations simpler, with heavier strokes that stay readable at their display size. Treat those illustrations as decorative where adjacent text already conveys the meaning. [Shared illustrations](snippets/smelly-illustration.liquid) · [Brand stylesheet](assets/smelly-af.css)

## Motion

Use short entrance and hover effects to support the composition. The hero photograph stays steady, with a brief entrance for its copy. Arrow movement, small card lifts and a gentle photo zoom are enough feedback for shopping actions. Restrict hover effects to fine pointers, give keyboard focus equally clear feedback, and keep motion optional through `prefers-reduced-motion`. Content and controls must remain visible and usable with motion disabled or unsupported. [Brand stylesheet](assets/smelly-af.css)
