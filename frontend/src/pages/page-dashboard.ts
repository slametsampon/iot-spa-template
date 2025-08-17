import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@views/dashboard/sensor-card.ts';
import '@views/dashboard/chart-card.ts';

@customElement('page-dashboard')
export class PageDashboard extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="mt-6 px-4">
        <h1 class="text-2xl font-semibold mb-4">📊 Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <sensor-card label="Suhu" value="25.3" unit="°C"></sensor-card>
          <sensor-card label="Kelembapan" value="60" unit="%"></sensor-card>
          <sensor-card label="pH Tanah" value="6.5" unit="pH"></sensor-card>
        </div>

        <chart-card></chart-card>
      </section>
    `;
  }
}
