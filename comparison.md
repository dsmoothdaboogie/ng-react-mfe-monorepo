# Example Repo: TurboRepo React MFEs (Vite) + Web Components (r2wc) + Angular Shell (separate)

This example repository implements the **recommended approach**:

- Put **MFEs + Design System + Contracts** in a **TurboRepo monorepo**
- Keep **independent deploy per MFE** (**container per app**)
- Use **manifest-based loading** in the **Angular shell** (shell is **not** in this repo)
- Standardize **React runtime compatibility** as a **platform contract**:
  - **one major** version (strict)
  - **one minor** version during migration (usually)
- Use **Module Federation only if it directly solves**:
  - shared React runtime / dependency dedupe
  - structured remote loading

## What’s included
- `apps/mfe-orders` – registers `<mfe-orders>` as a Shadow DOM Web Component
- `apps/mfe-customers` – registers `<mfe-customers>` as a Shadow DOM Web Component
- `packages/`:
  - `@acme/contracts` – versioned event envelope + Zod validation
  - `@acme/design-system-styles` – constructed stylesheet for `adoptedStyleSheets`
  - `@acme/design-system-react` – React components (build-time dependency; peer deps on React)
  - `@acme/mfe-runtime` – helpers for style injection + event emission

## Shell integration model (manifest-based)
Angular shell (separate repo) fetches a manifest like `manifests/manifest.example.json`, then:
1. Loads the MFE entry (ES module script) for the active route
2. Renders the custom element (`<mfe-orders>`, `<mfe-customers>`)
3. Listens for `mfe:event` CustomEvents

See `docs/angular-shell-integration.md`.

## Module Federation note (Vite)
This repo does **not** enable Module Federation by default.

If you later adopt a Vite federation plugin, use it **only** for:
- **shared singleton deps** (React/ReactDOM) if import maps/externals aren’t viable
- **structured remote loading** (remote entry orchestration)

Avoid:
- deep cross-MFE imports (distributed monolith risk)
- using federation as a substitute for versioned contracts/events
