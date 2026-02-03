import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { MfePageComponent } from "./mfe-page.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "orders",
    component: MfePageComponent,
    data: { mfeKey: "mfeOrders", title: "Orders" }
  },
  {
    path: "customers",
    component: MfePageComponent,
    data: { mfeKey: "mfeCustomers", title: "Customers" }
  },
  { path: "**", redirectTo: "" }
];
