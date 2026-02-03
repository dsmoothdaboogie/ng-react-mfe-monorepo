import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { MfeManifest, ManifestEntry } from "./mfe-manifest.types";

@Injectable({ providedIn: "root" })
export class MfeRegistryService {
  private manifest?: MfeManifest;

  constructor(private http: HttpClient) {}

  async getManifest(): Promise<MfeManifest> {
    if (this.manifest) return this.manifest;
    const m = await firstValueFrom(this.http.get<MfeManifest>("/assets/mfe-manifest.json"));
    this.manifest = m;
    return m;
  }

  async getEntry(key: string): Promise<ManifestEntry> {
    const m = await this.getManifest();
    const entry = m[key];
    if (!entry) throw new Error(`Unknown MFE key: ${key}`);
    return entry;
  }
}
