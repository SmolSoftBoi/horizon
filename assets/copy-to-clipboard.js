import { Component } from '@theme/component';

/**
 * Handles copying text to clipboard, from an event like a click.
 * Reports the result to an optional status element.
 * @extends {Component}
 */
class CopyToClipboardComponent extends Component {
  connectedCallback() {
    super.connectedCallback();
    if (this.refs.copyButton instanceof HTMLButtonElement && navigator.clipboard?.writeText) {
      this.refs.copyButton.hidden = false;
    }
  }

  async copyToClipboard() {
    const copyContent = this.getAttribute('text-to-copy');
    const { copyMessage } = this.refs;

    if (!copyContent || !navigator.clipboard?.writeText) return;
    if (copyMessage instanceof Element) copyMessage.textContent = '';

    try {
      await navigator.clipboard.writeText(copyContent);
      if (copyMessage instanceof Element) copyMessage.textContent = this.dataset.copySuccess ?? '';
    } catch {
      if (copyMessage instanceof Element) copyMessage.textContent = this.dataset.copyError ?? '';
    }
  }
}

if (!customElements.get('copy-to-clipboard-component')) {
  customElements.define('copy-to-clipboard-component', CopyToClipboardComponent);
}
