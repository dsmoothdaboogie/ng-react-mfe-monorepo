import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import type { MfeManifest, ManifestEntry } from "../../packages/mfe-platform/src/index";

@Injectable({ providedIn: "root" })
export class MfeRegistryService {
  private manifest?: MfeManifest;
  constructor(private http: HttpClient) {}
  async loadManifest(url: string): Promise<MfeManifest> {
    if (this.manifest) return this.manifest;
    this.manifest = await firstValueFrom(this.http.get<MfeManifest>(url));
    return this.manifest;
  }
  async getEntry(manifestUrl: string, key: string): Promise<ManifestEntry> {
    const m = await this.loadManifest(manifestUrl);
    const entry = m[key];
    if (!entry) throw new Error(`Unknown MFE key: ${key}`);
    return entry;
  }
}
