import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <h1>Angular 19 Shell</h1>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/customers" routerLinkActive="active">Customers</a>
      </nav>

      <router-outlet />
    </div>
  `
})
export class AppComponent {}
