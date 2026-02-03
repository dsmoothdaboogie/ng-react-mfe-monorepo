import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <div class="card">
      <h2>Manifest-based MFE loading</h2>
      <p>
        This shell loads React MFEs (as Web Components) by reading
        <code>src/assets/mfe-manifest.json</code>.
      </p>
      <ol>
        <li>Navigate to <code>/orders</code> or <code>/customers</code></li>
        <li>The route loads the MFE entry script as <code>type="module"</code></li>
        <li>The page renders the custom element and listens for <code>mfe:event</code></li>
      </ol>
    </div>
  `
})
export class HomeComponent {}
