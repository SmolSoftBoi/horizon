# Smelly A.F. theme development

Smelly A.F. is a Shopify Horizon storefront. Read [DESIGN.md](DESIGN.md) before changing copy, imagery, layout, styling or motion. Update it when you change the underlying design decisions.

## Find the right file

- Start with the relevant JSON template and follow its section and block types. The homepage is in `templates/index.json`. The collection, collections directory and search templates use `sections/smelly-*.liquid` sections.
- The product and basket pages build on Horizon’s `product-information` and `main-cart` sections. Catalogue surfaces reuse the branded product card snippet. [Product information](sections/product-information.liquid) · [Main cart](sections/main-cart.liquid) · [Product card](snippets/smelly-product-card.liquid)
- The shared layout loads the header and footer groups and applies `.smelly-theme` when `settings.smelly_branding` is enabled. The password page and issued gift card have their own entry points. [theme.liquid](layout/theme.liquid) · [password.liquid](layout/password.liquid) · [gift_card.liquid](templates/gift_card.liquid)
- Reuse the shared classes and tokens in `assets/smelly-af.css`. Follow the existing section-specific styles for changes confined to one surface, such as the basket or search.

## Extend the existing patterns

- Render content in Liquid. Use sections for merchant-editable page areas, blocks for configurable items within them and snippets for reusable markup. For section-defined blocks, keep `block.shopify_attributes` on the element the merchant selects.
- Preserve section and block types, instance IDs and setting keys used by saved templates. Keep copy, images and links configurable. Hide empty optional content on the storefront and keep a selectable editor state where the section needs setup.
- Build navigation from Shopify `routes` and selected resource URLs. Escape plain text and attribute values, and render formatted content from `richtext` settings. Reuse the existing link helper when accepting free-form web URLs. [smelly-link-href.liquid](snippets/smelly-link-href.liquid)
- Translate interface strings with `t` and format prices with Shopify’s money filters. Follow the `smelly` namespace for brand interface strings and reuse equivalent Horizon translations. Keep default editorial copy in UK English. [Default storefront strings](locales/en.default.json)
- Use `image_url` and `image_tag` for merchant images. Set responsive sizes to match their actual layout and preserve alt text and focal points. Prioritise the leading hero image and lazy-load images below the fold where practical.

## Preserve storefront behaviour

- Keep Shopify’s product, basket, search and contact forms and their native submission paths. Use Shopify data for prices, availability, recommendations and review counts. Keep variant and selling-plan selection on the product page when a card cannot add the item directly.
- For direct adds, preserve quantity rules, existing basket quantities, stock limits and desktop and mobile quick-add settings. Keep shared card behaviour consistent across the pages that render it. [Product card](snippets/smelly-product-card.liquid)
- Use JavaScript to enhance the Liquid output. When extending a Horizon component, reuse its module, section rendering and event patterns. Preserve focus and usable controls after a section refresh. [Component base](assets/component.js) · [Theme events](assets/events.js)

## Verify and sync

- Run `shopify theme check`. For storefront changes, check the affected page in a development or unpublished theme with desktop and mobile widths, keyboard navigation and the relevant theme editor settings. Exercise empty states, reduced motion and right-to-left layouts when they apply. Test changed purchase flows with Shopify product and basket data.
- Shopify CLI 4.8.4 or newer includes these root Markdown files in theme pulls, pushes and packages. Sidekick in Canvas can edit `DESIGN.md`. When using the Shopify GitHub integration, check the connected branch for synced edits. [Shopify theme context files](https://shopify.dev/docs/storefronts/themes/agentic-workflows#developer-tools-and-resources)
- In Git, use `smelly-af` as the base for Smelly A.F. work. `main` tracks Shopify’s Horizon upstream. The Git checkout also contains the merchant setup guide. [SMELLY-AF-SETUP.md](SMELLY-AF-SETUP.md)
