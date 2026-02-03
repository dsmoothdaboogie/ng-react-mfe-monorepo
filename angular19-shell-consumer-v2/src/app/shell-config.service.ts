import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

export interface ShellConfig { runtimeImportMapUrl: string; manifestUrl: string; }

@Injectable({ providedIn: "root" })
export class ShellConfigService {
  private cached?: ShellConfig;
  constructor(private http: HttpClient) {}
  async getConfig(): Promise<ShellConfig> {
    if (this.cached) return this.cached;
    this.cached = await firstValueFrom(this.http.get<ShellConfig>("/assets/shell-config.json"));
    return this.cached;
  }
}
