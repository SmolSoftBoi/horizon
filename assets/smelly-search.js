class SmellySearchResults extends HTMLElement {
  #collectionsState = 'idle';

  connectedCallback() {
    this.collectionsTab = this.querySelector('[data-collections-tab]');
    this.collectionsPanel = this.querySelector('[data-collections-panel]');
    this.nativeTab = this.querySelector('[data-native-tab]');
    this.queryForm = this.closest('.smelly-search')?.querySelector('.smelly-search__form');
    this.skipLink = this.querySelector('.skip-to-content-link');
    this.collectionsTab.href = `#${this.collectionsPanel.id}`;
    if (this.nativeTab) this.nativeTab.href = '#SearchResults';

    this.addEventListener('change', this.#handleSort);
    this.queryForm?.addEventListener('submit', this.#preserveSearchView);
    this.setAttribute('data-auto-sort', '');
    window.addEventListener('hashchange', this.#updateView);
    this.#updateView();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#handleSort);
    this.queryForm?.removeEventListener('submit', this.#preserveSearchView);
    window.removeEventListener('hashchange', this.#updateView);
  }

  #handleSort = (event) => {
    const select = event.target;
    if (select instanceof HTMLSelectElement && select.hasAttribute('data-search-sort')) {
      select.form?.requestSubmit();
    }
  };

  #preserveSearchView = (event) => {
    const form = event.currentTarget;
    const action = new URL(form.action);
    action.hash = location.hash === this.collectionsTab.hash ? this.collectionsTab.hash : '';
    form.action = action.href;
  };

  #updateView = () => {
    const showCollections = location.hash === this.collectionsTab.hash;
    this.toggleAttribute('data-collections-active', showCollections);
    this.collectionsPanel.hidden = !showCollections;
    this.skipLink.hash = showCollections ? this.collectionsTab.hash : '#SearchResults';

    if (showCollections) {
      this.collectionsTab.setAttribute('aria-current', 'page');
      this.nativeTab?.removeAttribute('aria-current');
      this.#loadCollections();
    } else {
      this.collectionsTab.removeAttribute('aria-current');
      this.nativeTab?.setAttribute('aria-current', 'page');
    }
  };

  async #loadCollections() {
    if (this.#collectionsState !== 'idle') return;
    this.#collectionsState = 'loading';

    const messages = this.querySelector('[data-collections-messages]').content;
    const status = this.querySelector('[data-collections-status]');
    const grid = this.querySelector('[data-collections-grid]');
    const card = this.querySelector('[data-collection-card]');
    status.textContent = messages.querySelector('[data-loading]').textContent;

    try {
      const url = new URL(`${this.dataset.collectionsUrl}.json`, location.origin);
      url.searchParams.set('q', this.dataset.query);
      url.searchParams.set('resources[type]', 'collection');

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Collection search returned ${response.status}`);
      const { resources } = await response.json();
      const collections = resources.results.collections;

      const cards = document.createDocumentFragment();
      for (const collection of collections) {
        const item = card.content.cloneNode(true);
        item.querySelector('a').href = collection.url;
        item.querySelector('h3').textContent = collection.title;
        if (collection.featured_image?.url) {
          const photo = item.querySelector('img');
          const photoUrl = new URL(collection.featured_image.url, location.origin);
          photoUrl.searchParams.set('width', '400');
          photo.src = photoUrl.href;
          photoUrl.searchParams.set('width', '800');
          photo.srcset = `${photo.src} 1x, ${photoUrl.href} 2x`;
          photo.hidden = false;
        }
        cards.append(item);
      }

      grid.replaceChildren(cards);
      grid.hidden = collections.length === 0;
      status.textContent = collections.length > 0
        ? messages.querySelector('[data-count]').textContent.replace('[count]', collections.length)
        : messages.querySelector('[data-empty]').textContent;
      if (collections.length < 10) {
        this.collectionsTab.querySelector('[data-collection-tab-count]').textContent = ` (${collections.length})`;
      }
      this.#collectionsState = 'loaded';
    } catch {
      status.textContent = messages.querySelector('[data-error]').textContent;
      this.#collectionsState = 'idle';
    }
  }
}

if (!customElements.get('smelly-search-results')) {
  customElements.define('smelly-search-results', SmellySearchResults);
}
