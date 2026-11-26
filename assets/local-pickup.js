import { Component } from '@theme/component';

import { morph } from '@theme/morph';
import { StandardEvents, ProductSelectEvent } from '@shopify/events';

class LocalPickup extends Component {
  /** @type {AbortController | undefined} */
  #activeFetch;

  /** @type {HTMLElement | null} */
  #pickupDrawer = null;

  /** @type {Element | null} */
  #productSection = null;

  connectedCallback() {
    super.connectedCallback();

    // Portal the sibling pickup drawer to document.body so its z-index
    // isn't trapped by ancestor stacking contexts on desktop.
    const drawer =
      this.nextElementSibling instanceof HTMLElement && this.nextElementSibling.matches('theme-drawer.pickup-drawer')
        ? this.nextElementSibling
        : null;
    if (drawer) {
      this.#pickupDrawer = drawer;
      document.body.appendChild(drawer);
    }

    this.#productSection = this.closest('.shopify-section, dialog');
    this.#productSection?.addEventListener(StandardEvents.productSelect, this.#handleProductSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#productSection?.removeEventListener(StandardEvents.productSelect, this.#handleProductSelect);
    this.#productSection = null;
    this.#activeFetch?.abort();
    this.#removeDrawer();
  }

  /** @param {ProductSelectEvent} event */
  #handleProductSelect = (event) => {
    if (!(event.target instanceof Element) || event.target.closest('product-card')) return;

    event.promise
      .then(({ detail }) => {
        if (!detail || !this.isConnected) return;

        const { newProduct, resource } = detail;
        if (newProduct) {
          this.dataset.productUrl = newProduct.url;
        }
        if (!resource?.id) {
          this.#activeFetch?.abort();
          delete this.dataset.variantId;
          this.#hideAvailability();
          return;
        }

        // A valid variant can have in-person stock even when Shopify marks it as unavailable online.
        const variantId = String(resource.id);
        // Combined listings may have already moved the widget's markup into the page.
        const morphedFromPage = variantId === this.dataset.variantId;
        this.dataset.variantId = variantId;
        const widget = detail.html && !morphedFromPage ? this.#findWidget(detail.html, variantId) : null;
        if (widget) {
          this.#activeFetch?.abort();
          this.#update(widget);
        } else {
          this.#fetchAvailability(variantId);
        }
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.warn('[local-pickup] Event promise rejected:', error);
      });
  };

  #hideAvailability() {
    this.setAttribute('hidden', '');
    this.#removeDrawer();
  }

  #removeDrawer() {
    this.#pickupDrawer?.remove();
    this.#pickupDrawer = null;
  }

  #createAbortController() {
    if (this.#activeFetch) this.#activeFetch.abort();
    this.#activeFetch = new AbortController();
    return this.#activeFetch;
  }

  /**
   * Finds the widget of this block for a variant. Each buy-buttons block in the section renders its own
   * widget from its own settings, so the widget is matched to this block as well as the variant.
   * @param {ParentNode} html - The rendered page or section.
   * @param {string} variantId - The ID of the variant.
   * @returns {Element | null}
   */
  #findWidget(html, variantId) {
    return html.querySelector(`local-pickup[data-block-id="${this.dataset.blockId}"][data-variant-id="${variantId}"]`);
  }

  /**
   * Updates the widget and its drawer from a rendered widget.
   * @param {Element} wrapper - The rendered widget of this block.
   */
  #update(wrapper) {
    morph(this, wrapper);
    this.toggleAttribute('hidden', wrapper.hasAttribute('hidden'));

    // The sibling belongs to this buy-buttons block and is present when the variant has locations to display.
    const newDrawer =
      wrapper.nextElementSibling instanceof HTMLElement &&
      wrapper.nextElementSibling.matches('theme-drawer.pickup-drawer')
        ? wrapper.nextElementSibling
        : null;
    if (!newDrawer) {
      this.#removeDrawer();
      return;
    }

    if (this.#pickupDrawer) {
      morph(this.#pickupDrawer, newDrawer);
    } else {
      this.#pickupDrawer = newDrawer;
      document.body.appendChild(this.#pickupDrawer);
    }
  }

  /**
   * Fetches the section for a variant and updates the widget from it.
   * @param {string} variantId - The ID of the variant to fetch availability for.
   */
  #fetchAvailability = (variantId) => {
    if (!variantId) return;

    const abortController = this.#createAbortController();

    const url = this.dataset.productUrl;
    fetch(`${url}?variant=${variantId}&section_id=${this.dataset.sectionId}`, {
      signal: abortController.signal,
    })
      .then((response) => response.text())
      .then((text) => {
        if (abortController.signal.aborted) return;

        const html = new DOMParser().parseFromString(text, 'text/html');
        const wrapper = this.#findWidget(html, variantId);
        if (wrapper) {
          this.#update(wrapper);
        } else {
          this.#hideAvailability();
        }
      })
      .catch((_e) => {
        if (abortController.signal.aborted) return;
        this.#hideAvailability();
      });
  };
}

if (!customElements.get('local-pickup')) {
  customElements.define('local-pickup', LocalPickup);
}
