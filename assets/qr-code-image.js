import { QRCode } from '@theme/qr-code-generator';

class QRCodeImage extends HTMLElement {
  connectedCallback() {
    const identifier = this.dataset.identifier;
    if (!identifier || this.firstElementChild) return;

    try {
      // SVG renders synchronously, including when the browser blocks canvas readback.
      new QRCode(this, { text: identifier, useSVG: true });
    } catch {
      this.replaceChildren();
      return;
    } finally {
      this.removeAttribute('title');
    }

    this.hidden = false;
    this.ownerDocument.getElementById(this.dataset.scanInstructions ?? '')?.removeAttribute('hidden');
    this.ownerDocument.getElementById(this.dataset.manualInstructions ?? '')?.setAttribute('hidden', '');
  }
}

if (!customElements.get('qr-code-image')) {
  customElements.define('qr-code-image', QRCodeImage);
}
