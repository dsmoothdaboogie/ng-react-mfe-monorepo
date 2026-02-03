# Angular Shell Integration (separate repo)

The Angular shell is **not** included here. This is the recommended pattern:

## 1) Fetch manifest
Example shape: `manifests/manifest.example.json`

The shell maps **route → MFE** and obtains an `entry` URL to load.

## 2) Load entry script (ES module) once
```ts
const loaded = new Set<string>();

export async function loadMfeEntry(url: string) {
  if (loaded.has(url)) return;

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(s);
  });

  loaded.add(url);
}
```

## 3) Render the web component
Example Angular template usage:
```html
<mfe-orders [attr.order-id]="orderId"></mfe-orders>
```

## 4) Listen for MFE events
MFEs emit `mfe:event` as a **bubbling + composed** CustomEvent (crosses Shadow DOM boundary).

Example:
```ts
// Ideally bind at a wrapper element around the WC
onMfeEvent(e: CustomEvent) {
  this.ngZone.run(() => {
    // e.detail is the versioned envelope
  });
}
```

## 5) React runtime governance
With a shared React design system, treat React major (and usually minor during migration) as a **platform contract**.
