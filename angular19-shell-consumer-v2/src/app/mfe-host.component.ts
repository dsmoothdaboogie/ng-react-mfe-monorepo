import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-mfe-host",
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div><strong>MFE:</strong> <code>{{ tagName }}</code> <span style="color:#666">v{{ version }}</span></div>
        <div style="color:#666">listening for <code>mfe:event</code></div>
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
  @Input() orderId?: string;
  @Input() customerId?: string;
  @Output() mfeEvent = new EventEmitter<unknown>();
  @ViewChild("mount", { static: true }) mountRef!: ElementRef<HTMLDivElement>;

  lastEvent?: string;
  private el?: HTMLElement;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tagName"] && this.tagName) this.render();
    if (this.el) {
      if (this.orderId) this.el.setAttribute("order-id", this.orderId);
      if (this.customerId) this.el.setAttribute("customer-id", this.customerId);
    }
  }

  private render() {
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
    this.el = el;
  }
}
