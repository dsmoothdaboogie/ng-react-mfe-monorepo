import { Component, inject, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

import { ShellConfigService } from "./shell-config.service";
import { MfeRegistryService } from "./mfe-registry.service";
import { MfeHostComponent } from "./mfe-host.component";
import { loadImportMap, loadMfeEntryScript } from "../../packages/mfe-platform/src/index";

@Component({
  standalone: true,
  imports: [CommonModule, MfeHostComponent],
  template: `
    <div class="card">
      <h2>{{ title }}</h2>
      <div *ngIf="loading">Loading…</div>
      <div *ngIf="error" style="color:#b00020"><strong>Error:</strong> {{ error }}</div>
      <div style="color:#666">Import map: <code>{{ runtimeImportMapUrl }}</code></div>
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
  private cfgSvc = inject(ShellConfigService);
  private registry = inject(MfeRegistryService);
  private zone = inject(NgZone);

  title = "";
  loading = true;
  ready = false;
  error?: string;

  runtimeImportMapUrl = "";
  tagName = "";
  version = "";

  orderId = "A123";
  customerId = "C456";

  constructor() { this.init(); }

  private async init() {
    try {
      const mfeKey = this.route.snapshot.data["mfeKey"] as string;
      this.title = this.route.snapshot.data["title"] as string;

      const cfg = await this.cfgSvc.getConfig();
      this.runtimeImportMapUrl = cfg.runtimeImportMapUrl;

      await loadImportMap(cfg.runtimeImportMapUrl);

      const entry = await this.registry.getEntry(cfg.manifestUrl, mfeKey);
      this.tagName = entry.tagName;
      this.version = entry.version;

      await loadMfeEntryScript(entry.entry);

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
    console.log("MFE event", detail);
  }
}
