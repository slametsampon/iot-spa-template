import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-footer')
export class AppFooter extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <footer class="p-4 bg-gray-200 text-center text-sm text-gray-600 mt-auto">
        © ${new Date().getFullYear()} IoT SPA Template. All rights reserved.
      </footer>
    `;
  }
}
