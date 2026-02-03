import { Component, inject, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MfeRegistryService } from "./mfe-registry.service";
import { MfeScriptLoaderService } from "./mfe-script-loader.service";
import { MfeHostComponent } from "./mfe-host.component";

@Component({
  standalone: true,
  imports: [CommonModule, MfeHostComponent],
  template: `
    <div class="card">
      <h2>{{ title }}</h2>
      <p class="muted">
        Loads the MFE entry script from the manifest, then renders the corresponding custom element.
      </p>
      <div *ngIf="error" style="color:#b00020">
        <strong>Error:</strong> {{ error }}
      </div>
      <div *ngIf="loading">Loading MFE…</div>
    </div>

    <app-mfe-host
      *ngIf="ready"
      [tagName]="tagName"
      [version]="version"
      [orderId]="orderId"
      [customerId]="customerId"
      (mfeEvent)="onMfeEvent($event)">
    </app-mfe-host>
  `
})
export class MfePageComponent {
  private route = inject(ActivatedRoute);
  private registry = inject(MfeRegistryService);
  private loader = inject(MfeScriptLoaderService);
  private zone = inject(NgZone);

  title = "";
  loading = true;
  ready = false;
  error?: string;

  tagName = "";
  version = "";

  // demo inputs
  orderId = "A123";
  customerId = "C456";

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const mfeKey = this.route.snapshot.data["mfeKey"] as string;
      this.title = this.route.snapshot.data["title"] as string;

      const entry = await this.registry.getEntry(mfeKey);
      this.tagName = entry.tagName;
      this.version = entry.version;

      await this.loader.loadModuleScript(entry.entry);

      // Ensure state updates happen in Angular zone
      this.zone.run(() => {
        this.loading = false;
        this.ready = true;
      });
    } catch (e: any) {
      this.zone.run(() => {
        this.loading = false;
        this.error = e?.message ?? String(e);
      });
    }
  }

  onMfeEvent(detail: unknown) {
    // In real life: validate envelope here and route it to analytics/state.
    // This is called from inside Angular because the host component emits an Angular EventEmitter.
    console.log("MFE event detail", detail);
  }
}
