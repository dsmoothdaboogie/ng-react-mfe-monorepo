import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { NgIf } from "@angular/common";

/**
 * Renders a custom element tag at runtime and bridges events back to Angular.
 * We deliberately avoid binding complex objects as attributes; use primitives or events.
 */
@Component({
  selector: "app-mfe-host",
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap: 12px;">
        <div>
          <strong>MFE:</strong> <code>{{ tagName }}</code>
          <span style="margin-left:8px; color:#666">version {{ version }}</span>
        </div>
        <div style="color:#666">
          Listening for <code>mfe:event</code>
        </div>
      </div>

      <div #mount style="margin-top:12px;"></div>

      <div *ngIf="lastEvent" style="margin-top:12px;">
        <strong>Last event:</strong>
        <pre>{{ lastEvent }}</pre>
      </div>
    </div>
  `
})
export class MfeHostComponent implements OnChanges {
  @Input({ required: true }) tagName!: string;
  @Input({ required: true }) version!: string;

  // Example attribute inputs:
  @Input() orderId?: string;
  @Input() customerId?: string;

  @Output() mfeEvent = new EventEmitter<unknown>();

  @ViewChild("mount", { static: true }) mountRef!: ElementRef<HTMLDivElement>;

  lastEvent?: string;
  private currentEl?: HTMLElement;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tagName"] && this.tagName) {
      this.renderElement();
    }

    if (this.currentEl) {
      if (this.orderId) this.currentEl.setAttribute("order-id", this.orderId);
      if (this.customerId) this.currentEl.setAttribute("customer-id", this.customerId);
    }
  }

  private renderElement() {
    this.mountRef.nativeElement.innerHTML = "";

    const el = document.createElement(this.tagName);

    if (this.orderId) el.setAttribute("order-id", this.orderId);
    if (this.customerId) el.setAttribute("customer-id", this.customerId);

    el.addEventListener("mfe:event", (e: Event) => {
      const ce = e as CustomEvent;
      this.lastEvent = JSON.stringify(ce.detail, null, 2);
      this.mfeEvent.emit(ce.detail);
    });

    this.mountRef.nativeElement.appendChild(el);
    this.currentEl = el;
  }
}
