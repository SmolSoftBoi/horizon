/**
 * @typedef {Object} VariantDrainState
 * @property {string | null} [resolvedVariantId] - The variant id resolved from the queued entry's
 *   own server-side section fetch. This binds a queued click to the selection that was active when
 *   the buyer clicked Add, even if the visible picker has since moved on.
 * @property {string | null} [intendedVariantId] - The variant picker's intended variant id, read
 *   from the checked radio/option's `data-variant-id`. Present for single-option products and
 *   authoritative because it never lags behind the user's selection.
 * @property {string | null} [hiddenInputValue] - The hidden `input[name="id"]` value. For
 *   multi-option products the in-flight section fetch resolves this server-side; it is only
 *   trustworthy once that fetch has been awaited (otherwise it lags the selection).
 * @property {boolean} [available] - Whether the current selection is purchasable. `false` means
 *   the selection is sold out / unavailable and must never be POSTed.
 */

/**
 * Resolve which variant id a queued add-to-cart should POST, at queue-drain time.
 *
 * Pure decision logic extracted so it can be unit-tested without a DOM/component harness.
 * It encodes the #2756 fix: prefer the queued entry's own server-resolved variant, then the
 * picker's intended variant (never lags), then the hidden input (authoritative only after the
 * section fetch is awaited). Return `null` when nothing resolves or the selection is unavailable
 * so the caller can abort instead of POSTing a stale, empty, or maxed variant id.
 *
 * @param {VariantDrainState} drainState
 * @returns {string | null} The variant id to add, or `null` to abort the queued add.
 */
export function resolveVariantId(drainState) {
  if (!drainState || drainState.available === false) return null;

  const resolved = normalizeVariantId(drainState.resolvedVariantId);
  if (resolved) return resolved;

  const intended = normalizeVariantId(drainState.intendedVariantId);
  if (intended) return intended;

  const hidden = normalizeVariantId(drainState.hiddenInputValue);
  if (hidden) return hidden;

  return null;
}

/**
 * @typedef {object} QuantityConstraints
 * @property {string} min
 * @property {string | null} max
 * @property {string} step
 * @property {string | null} cartQuantity
 *
 * @typedef {object} PurchaseSelection
 * @property {string | null} variantId
 * @property {boolean} available
 * @property {QuantityConstraints | null} quantityConstraints
 */

/**
 * Reads the purchase state of a child product whose page omits the variant picker.
 * @param {Document} html - The section response before morphing the page.
 * @param {URL} productUrl - The requested selection, including the child product path.
 * @returns {PurchaseSelection}
 */
export function readMainPurchaseSelection(html, productUrl) {
  const handle = productUrl.pathname.match(/\/products\/([^/]+)\/?$/)?.[1];
  if (!handle) return { variantId: null, available: false, quantityConstraints: null };

  const forms = html.querySelectorAll('main .product-details product-form-component[data-product-url]');
  const productForm = Array.from(forms).find((element) => {
    const formUrl = element.getAttribute('data-product-url');
    if (!formUrl) return false;

    const url = new URL(formUrl, productUrl.origin);
    // The option and purchase form URLs may use different locale prefixes for the same product.
    return url.origin === productUrl.origin && url.pathname.match(/\/products\/([^/]+)\/?$/)?.[1] === handle;
  });
  const input = productForm?.querySelector('form input[name="id"][ref="variantId"]');
  const form = input?.closest('form');
  const button = form?.querySelector('button[ref="addToCartButton"]');
  const variantId = input instanceof HTMLInputElement ? input.value.trim() : '';
  const available = Boolean(variantId && button && !button.matches(':disabled'));

  return { variantId: available ? variantId : null, available, quantityConstraints: readQuantityConstraints(form) };
}

/**
 * @param {Document | Element | null | undefined} html
 * @returns {QuantityConstraints | null}
 */
export function readQuantityConstraints(html) {
  const input = html?.querySelector('quantity-selector-component input[ref="quantityInput"]');
  if (!(input instanceof HTMLInputElement)) return null;

  return {
    min: input.min,
    max: input.max || null,
    step: input.step,
    cartQuantity: input.getAttribute('data-cart-quantity'),
  };
}

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
function normalizeVariantId(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}
