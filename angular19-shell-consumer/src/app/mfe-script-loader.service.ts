import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MfeScriptLoaderService {
  private loaded = new Set<string>();

  async loadModuleScript(url: string): Promise<void> {
    if (this.loaded.has(url)) return;

    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = url;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load MFE entry: ${url}`));
      document.head.appendChild(s);
    });

    this.loaded.add(url);
  }
}
