# Smelly A.F. Shopify theme

A Smelly A.F. storefront built on this checkout of Shopify Horizon. The theme uses the linked Branding Brainstorm’s cream and candy-pink direction, bold serif headings, handwritten notes, original candle photographs and four illustrated A.F. ranges.

## Included

- Editable homepage sections: hero, candle details, featured products, ranges, story, journal and questions.
- Compact, centred header wordmark, pink navigation and basket accents, and spaced mobile controls. An uploaded logo takes precedence over the text wordmark. The newsletter footer uses the same branding.
- A coordinated hero entrance, responsive button arrows, gentle product-photo zoom, moving range illustrations and animated FAQ answers. Motion uses CSS and follows the visitor’s reduced-motion preference.
- About (`page.about`) and scent guide (`page.scents`) templates.
- Horizon’s existing product, collection, search, basket, contact, journal and article templates, with the shared brand palette and typography.
- Shopify product forms for featured products, including sold-out states. Products with variants or selling plans link to the product page for selection. Direct adds start at the variant’s minimum order quantity, round the resulting basket quantity to its required increment, and respect maximums and managed stock. Each submission takes shoppers to the basket.
- A Shopify customer newsletter form with error and success messages, an explicit marketing notice and the store’s privacy-policy link when configured.

## Store setup

1. Upload the supplied theme ZIP as a new, unpublished theme in **Online Store → Themes**. Keep the live theme until the preview has been checked.
2. In the theme editor, select the featured-product collection. If none is selected, the section uses the store’s all-products collection. With no products, it displays the supplied photographs as an editorial gallery, without invented prices or purchasing controls.
3. Connect **Spooky A.F.**, **Festive A.F.**, **Sweet A.F.** and **Fresh A.F.** to the appropriate collections. Unassigned range cards link to all products.
4. Create or select the About and Scents pages, assign their matching templates, and select the About page in the homepage story section to show its button. Page titles and page content come from Shopify.
5. Configure the header’s existing `main-menu` with Shop, Scents, About, Journal and Contact links to the actual store resources. Select the footer menu and contact page. The theme does not create or change navigation, products, collections, pages, blog articles or policies.
6. Select a blog in the homepage journal section. That section stays hidden from shoppers until the selected blog has articles.
7. Review editable copy, set the shop’s name, upload a final logo/favicon if available, and configure the store’s policies and payment methods. Check email marketing settings and any confirmation flow required by the store.
8. Preview a real product with variants, an unavailable product, search, Add to basket, basket quantity changes, contact submission and newsletter signup on desktop and mobile before publishing.

## Brand controls and content

`Smelly A.F. branding` in Theme settings enables the text wordmark and classic serif headings. The header’s solid and transparent states and the footer honour this setting; uploaded logos take precedence, and disabling branding falls back to the store name. Horizon’s existing colour palette, button and spacing controls remain available. Brand sections use the shared `assets/smelly-af.css` palette; their text, images and resource links are editable in the theme editor.

The five `assets/smelly-*.jpg` files are exact copies of the supplied product photographs. They show Pink Bubblegum, Pumpkin Spice, Candy Cane, Parma Violets and Christmas Spice. Image layout may crop the surrounding photograph; the image files, labels, wax colours, lids and jar proportions have not been retouched. Every photographed candle is unlit with its lid on.

Hand-poured soy wax and 150g are supported by the supplied labels. No mock prices, reviews, discounts, testimonials, burn times, delivery promises or vegan/plastic-free claims have been added. Replace the proposed brand copy where necessary before launch.

New interface strings are in the `smelly` namespace in storefront locale files. They use UK English as an explicit fallback in the inherited languages; translate those strings before enabling another storefront language. Existing Horizon translations are preserved.

## Local verification

Run `shopify theme check` from the theme root, then `shopify theme package` to create the upload ZIP. This repository has no lint, typecheck, test or build scripts in `assets/package.json`.

Theme Check passes with **0 errors and 6 warnings** using the installed Shopify CLI 4.9.3 and current Shopify Liquid definitions. The warnings concern the header’s setting count and five unused LiquidDoc parameters in the existing divider snippet.

The previously reported 141 errors were false positives from a stale local definition cache, not invalid Horizon code. The cached files dated from February 2026 and did not recognise colour placeholders, the global colour palette or the two newer Liquid filters. On 20 October 2026, the cache was backed up and refreshed through Theme Check’s built-in downloader to Shopify definition revision `40f966fc7793462726d9f8573c8d522f8ab44c54`. The same standard checks then passed. No checks were disabled and no theme features were removed.

Shopify documents these features in [input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), [standard event data](https://shopify.dev/docs/api/liquid/filters/standard_event_data) and [applicable disclosures](https://shopify.dev/docs/api/liquid/filters/applicable_disclosures). If these false positives recur on another machine, check that Theme Check can refresh its local Shopify definitions before changing valid theme code.

A local visual preview cannot verify Shopify’s server rendering, live catalogue, checkout, newsletter subscription or store configuration. Those checks require an authenticated store preview.

Checks completed for this customisation:

- Theme Check: passed with 0 errors and 6 warnings after refreshing the stale definition cache. The standard schema, JSON and unknown-filter checks remain enabled.
- Local Liquid rendering: available and sold-out products, variant links, varying prices, empty and populated catalogue states, hidden empty journal, and newsletter error/success states.
- Product-card regressions: quantity minima, increments, maximums, existing basket quantities, managed-stock limits, continue-selling and untracked stock, sold-out states, and variant/selling-plan selection. Starting prices, compare-at prices and unit prices use the same variant and preserve the currency-display setting.
- Native form checks against a local HTTP fixture: rapid repeated submissions produced two requests before the guard and one after it. The variant, quantity and basket return path remain intact; back/forward restoration unlocks submitted forms without enabling sold-out buttons. Native submission also works with JavaScript disabled.
- Branding and accessibility regressions: 34 Liquid assertions cover the product cards, branding settings, uploaded-logo precedence, privacy opt-out icons and a single H1 with the actual header and homepage hero rendered together. Browser checks confirm transparent-to-sticky wordmark visibility, unchanged hero typography at 320, 390, 750 and 1440px, natural privacy-icon dimensions beside its link, and 5.94:1 story-eyebrow contrast.
- Browser checks with Horizon’s real base CSS at 320, 390 and 1440px: hero, story and FAQ rich-text links stay underlined while buttons retain their styling. Uploaded footer logos render at 200px wide and shrink proportionally inside narrower containers.
- Browser checks on locally rendered sections: all seven photographs load with alternative text, working question accordions and email-format validation. No horizontal overflow at 320, 360, 390, 768, 1024, 1440 or 1920px.
- Motion checks with Horizon’s base CSS: all four hero animations run once and finish within 750ms; keyboard focus remains visible; button arrows, linked product photographs, range illustrations and FAQ answers respond to interaction. Switching to reduced motion immediately cancels the entrance and disables these effects. Content and native FAQ controls remain usable with JavaScript disabled. No horizontal overflow at 320, 390, 768 or 1440px.
- Header checks use the real Horizon Liquid blocks, base CSS and existing header JavaScript with local menu, account and logo fixtures. All 36 layouts from 320–1920px passed with accounts on/off, search off and uploaded logos: the logo stays centred and controls do not overlap. Keyboard focus, current-page underlines, search hover, sticky behaviour, longer menus, touch navigation and opening/closing the mobile drawer were also checked.
- Compact height: 16 Standard/Compact comparisons at 320, 390, 750 and 1440px passed with the wordmark, uploaded logos, accounts disabled and two-row menus. Standard retains its previous height; the default wordmark measures 78px Compact versus 89px Standard on desktop, and 61px versus 77px on mobile. Controls retain 44px targets without overlap or clipping. Touch drawer navigation at 1024px, keyboard focus, sticky behaviour and mobile drawer opening/Escape closing also passed.
- The full homepage preview uses a header shell; the separate header preview uses the real header components. The heading regression renders the real header and hero together. All use fixtures for Shopify-only primitives. They verify local layout, conditional rendering and native submission mechanics; authenticated Shopify rendering, account services, search results, cart operations and form processing still need a store preview.
- ZIP structure and original photograph hashes checked. No production dependencies added.

The separate Shopify validator was unavailable in earlier checks because its bundled `@shopify/theme-check-common` dependency was missing. For the header update, automatic approval review blocked the remote validator because it could transmit repository files. The installed local Shopify CLI supplied the Theme Check results above.

Horizon’s original licence and upstream theme information are retained. This is a merchant theme customisation; Horizon-derived themes are not eligible for Shopify Theme Store submission.
