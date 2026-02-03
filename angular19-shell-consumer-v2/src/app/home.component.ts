import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <div class="card">
      <h2>Import map first</h2>
      <p>Shell loads the React import map before loading any MFE <code>entry.js</code>.</p>
    </div>
  `
})
export class HomeComponent {}
