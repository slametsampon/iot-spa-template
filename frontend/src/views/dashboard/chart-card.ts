import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('chart-card')
export class ChartCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="p-4 border rounded shadow bg-white">
        <div class="text-sm text-gray-600 mb-2">Realtime Chart</div>
        <div
          class="w-full h-32 bg-gradient-to-r from-blue-200 to-blue-400 rounded animate-pulse"
        ></div>
      </div>
    `;
  }
}
