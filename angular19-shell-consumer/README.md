# Angular 19 Shell (consumer) for React Web Component MFEs (manifest-based)

This is a **minimal Angular 19** SPA shell that:
- fetches an MFE **manifest.json**
- lazy-loads each MFE `entry.js` as an **ES module script**
- renders the MFE as a **custom element** (web component)
- listens for `mfe:event` (bubbling + composed) CustomEvents from Shadow DOM MFEs

## How it matches your recommended approach
- Angular shell is a **separate app/repo** from the TurboRepo MFE monorepo
- MFEs are independently deployed; the shell discovers them via a **manifest**
- Contracts are versioned envelopes (shell can validate if desired)

## Prereqs
- Node 20+
- pnpm or npm
- Angular CLI 19+

## Install
```bash
npm i
```

## Dev
```bash
npm start
```

Then update `src/assets/mfe-manifest.json` to point at your MFE dev servers or deployed URLs.

### Using the example TurboRepo MFEs (local dev)
If your MFEs run at:
- Orders: http://localhost:5173/assets/entry.js
- Customers: http://localhost:5174/assets/entry.js

set `src/assets/mfe-manifest.json` accordingly (already prefilled).

## Routes
- `/orders` renders `<mfe-orders order-id="A123"></mfe-orders>`
- `/customers` renders `<mfe-customers customer-id="C456"></mfe-customers>`

## Event handling
MFEs emit:
- `CustomEvent("mfe:event", { bubbles: true, composed: true, detail: <envelope> })`

The shell captures those in `MfeHostComponent` and displays the latest event in the UI.
