export type ManifestEntry = { version: string; tagName: string; entry: string };
export type MfeManifest = Record<string, ManifestEntry>;

const loadedScripts = new Set<string>();
let importMapLoaded = false;

export async function loadImportMap(url: string): Promise<void> {
  if (importMapLoaded) return;

  const txt = await fetch(url).then(r => {
    if (!r.ok) throw new Error(`Failed to fetch import map: ${url}`);
    return r.text();
  });

  const s = document.createElement("script");
  s.type = "importmap";
  s.textContent = txt;
  document.head.appendChild(s);
  importMapLoaded = true;
}

export async function loadMfeEntryScript(url: string): Promise<void> {
  if (loadedScripts.has(url)) return;

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load MFE entry: ${url}`));
    document.head.appendChild(s);
  });

  loadedScripts.add(url);
}
