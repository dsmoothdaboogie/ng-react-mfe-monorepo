# react-mfe-turborepo-example

Example **React MFE monorepo** using:
- **TurboRepo**
- **Vite + React**
- **r2wc** (React → Web Component) with **Shadow DOM**
- Shared **design system** + **contracts**
- **Independent container deploy** per MFE (static assets served by Nginx)
- **Manifest-based loading** in an external Angular shell

## Requirements
- Node 20+
- pnpm 9+ (Corepack recommended)
- Docker (optional, for container examples)

## Install
```bash
corepack enable
pnpm i
```

## Dev (runs both MFEs)
```bash
pnpm dev
```
- Orders dev host: http://localhost:5173
- Customers dev host: http://localhost:5174

## Build (all MFEs)
```bash
pnpm build
```

## Container build (per MFE)
**Important:** build context must be the repo root so workspace packages are available.

```bash
docker build -f apps/mfe-orders/Dockerfile -t mfe-orders:local .
docker run --rm -p 8081:8080 mfe-orders:local
# http://localhost:8081
```

```bash
docker build -f apps/mfe-customers/Dockerfile -t mfe-customers:local .
docker run --rm -p 8082:8080 mfe-customers:local
# http://localhost:8082
```

## Angular shell integration
The Angular shell lives in a separate repo. It should:
1) Fetch a manifest (see `manifests/manifest.example.json`)
2) Load the MFE entry script as `type="module"`
3) Render the custom element in route templates
4) Listen for `mfe:event` CustomEvents (versioned envelope)

See: `docs/angular-shell-integration.md`
