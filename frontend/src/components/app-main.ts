import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import '@pages/page-home.ts';
import '@pages/page-dashboard.ts';
import '@pages/page-login.ts';
import '@pages/page-about.ts';

@customElement('app-main')
export class AppMain extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() basePath: string = '/';

  private _router?: Router;

  firstUpdated() {
    const outlet =
      this.shadowRoot?.getElementById('outlet') ??
      this.querySelector('#outlet');
    if (!outlet) return;

    const router = new Router(outlet);
    router.setRoutes([
      { path: '/', component: 'page-home' },
      { path: '/dashboard', component: 'page-dashboard' },
      { path: '/login', component: 'page-login' },
      { path: '/about', component: 'page-about' },
    ]);

    // @ts-ignore
    router.subscribe((ctx) => {
      this.dispatchEvent(
        new CustomEvent('route-changed', {
          detail: { path: ctx.pathname },
          bubbles: true,
          composed: true,
        })
      );
    });

    this._router = router;
  }

  navigate(path: string) {
    Router.go(path); // ✅ OK
  }

  render() {
    return html`<div id="outlet" class="p-4"></div>`;
  }
}
