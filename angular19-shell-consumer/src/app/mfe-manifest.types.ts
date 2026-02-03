export type MfeKey = "mfeOrders" | "mfeCustomers";

export interface ManifestEntry {
  version: string;
  tagName: string;
  entry: string; // URL to assets/entry.js
}

export type MfeManifest = Record<string, ManifestEntry>;
