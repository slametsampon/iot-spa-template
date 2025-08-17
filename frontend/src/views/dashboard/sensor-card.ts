import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sensor-card')
export class SensorCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() label = 'Temperature';
  @property() value = '25.3';
  @property() unit = '°C';

  render() {
    return html`
      <div class="p-4 border rounded shadow bg-white">
        <div class="text-sm text-gray-600">${this.label}</div>
        <div class="text-xl font-bold">
          ${this.value} <span class="text-sm font-normal">${this.unit}</span>
        </div>
      </div>
    `;
  }
}
