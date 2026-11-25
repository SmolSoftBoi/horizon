import { Component } from '@theme/component';
import { morphSection } from '@theme/section-renderer';
import { StandardEvents } from '@shopify/events';

class ProductRecommendations extends Component {
  /**
   * The observer for the product recommendations
   * @type {IntersectionObserver}
   */
  #intersectionObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries[0]?.isIntersecting) return;

      observer.disconnect();
      this.#loadRecommendations();
    },
    { rootMargin: '0px 0px 400px 0px' }
  );

  /**
   * Observing changes to the elements attributes
   * @type {MutationObserver}
   */
  #mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Only attribute changes are interesting
      if (mutation.target !== this || mutation.type !== 'attributes') continue;

      // Ignore error attribute changes
      if (mutation.attributeName === 'data-error') continue;

      // Ignore addition of hidden class because it means there's an error with the display
      if (mutation.attributeName === 'class' && this.classList.contains('hidden')) continue;

      // Ignore when the data-recommendations-performed attribute has been set to 'true'
      if (
        mutation.attributeName === 'data-recommendations-performed' &&
        this.dataset.recommendationsPerformed === 'true'
      )
        continue;

      // All other attribute changes trigger a reload
      this.#loadRecommendations();
      break;
    }
  });

  /**
   * The cached recommendations
   * @type {Record<string, string>}
   */
  #cachedRecommendations = {};

  /**
   * An abort controller for the active fetch (if there is one)
   * @type {AbortController | null}
   */
  #activeFetch = null;

  /** @param {import('@shopify/events').CartLinesUpdateEvent} event */
  static refreshAfterCartUpdate = async (event) => {
    if (!event.promise) return;

    try {
      const { detail } = await event.promise;
      if (detail?.didError) return;
    } catch {
      return;
    }

    ProductRecommendations.#refreshBasketRecommendations();
  };

  /** @param {PageTransitionEvent} event */
  static refreshAfterHistoryRestore = (event) => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!event.persisted && navigation?.type !== 'back_forward') return;

    ProductRecommendations.#refreshBasketRecommendations();
  };

  static #refreshBasketRecommendations() {
    // Select the current elements after the update in case a product changed during it.
    for (const element of document.querySelectorAll('product-recommendations[data-refresh-on-cart-update]')) {
      if (element instanceof ProductRecommendations) element.#loadRecommendations(true);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.#intersectionObserver.observe(this);
    this.#mutationObserver.observe(this, { attributes: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#intersectionObserver.disconnect();
    this.#mutationObserver.disconnect();
    this.#activeFetch?.abort();
    this.#activeFetch = null;
  }

  /**
   * Load the product recommendations
   * @param {boolean} [refresh] - Reload the section after a basket change or history restore.
   */
  #loadRecommendations(refresh = false) {
    if (!this.isConnected) return;

    const { productId, recommendationsPerformed, sectionId, intent } = this.dataset;

    if (!productId || !sectionId) {
      throw new Error('Product ID and a section ID are required');
    }

    // If the recommendations have already been loaded, accounts for the case where the Theme Editor
    // is loaded the section from the editor's visual preview context.
    if (recommendationsPerformed === 'true' && !refresh) {
      return;
    }

    this.#activeFetch?.abort();
    const request = new AbortController();
    this.#activeFetch = request;
    const isCurrent = () =>
      this.isConnected &&
      this.#activeFetch === request &&
      this.dataset.productId === productId &&
      this.dataset.sectionId === sectionId;
    const url = `${this.dataset.url}&product_id=${productId}&section_id=${sectionId}&intent=${intent}`;
    const useCache = !this.hasAttribute('data-refresh-on-cart-update');

    this.#fetchRecommendations(url, request.signal, useCache)
      .then((result) => {
        if (!isCurrent()) return;

        if (!result.success) {
          // The Theme Editor will place a section element element in the DOM whose section_id is not available
          // to the Section Renderer API. In this case, we can safely ignore the error.
          if (!Shopify.designMode) {
            this.#handleError(new Error(`Server returned ${result.status}`));
          }
          return;
        }

        if (result.data?.trim().length) {
          this.dataset.recommendationsPerformed = 'true';
          return morphSection(sectionId, result.data, { mode: 'hydration', injectStylesheet: true });
        } else {
          this.#handleError(new Error('No recommendations available'));
        }
      })
      .catch((e) => {
        if (isCurrent() && e?.name !== 'AbortError') this.#handleError(e);
      })
      .finally(() => {
        if (this.#activeFetch === request) this.#activeFetch = null;
      });
  }

  /**
   * Fetches the recommendations and cached the result for future use
   * @param {string} url
   * @param {AbortSignal} signal
   * @param {boolean} useCache - Whether the rendered cards are independent of the basket.
   * @returns {Promise<{ success: true, data: string } | { success: false, status: number }>}
   */
  async #fetchRecommendations(url, signal, useCache) {
    const cachedResponse = this.#cachedRecommendations[url];
    if (useCache && cachedResponse) {
      return { success: true, data: cachedResponse };
    }

    const response = await fetch(url, useCache ? { signal } : { signal, cache: 'no-store' });
    if (!response.ok) {
      return { success: false, status: response.status };
    }

    const text = await response.text();
    if (useCache && !signal.aborted) this.#cachedRecommendations[url] = text;
    return { success: true, data: text };
  }

  /**
   * Handle errors in a consistent way
   * @param {Error} error
   */
  #handleError(error) {
    console.error('Product recommendations error:', error.message);
    // Real cards link to a product. Loading skeletons and onboarding cards do not.
    if (!this.querySelector('.product-card__link[href], .smelly-product-card__image[href]')) {
      this.classList.add('hidden');
    }
    this.dataset.error = 'Error loading product recommendations';
  }
}

if (!customElements.get('product-recommendations')) {
  customElements.define('product-recommendations', ProductRecommendations);
  document.addEventListener(StandardEvents.cartLinesUpdate, ProductRecommendations.refreshAfterCartUpdate);
  window.addEventListener('pageshow', ProductRecommendations.refreshAfterHistoryRestore);
}
