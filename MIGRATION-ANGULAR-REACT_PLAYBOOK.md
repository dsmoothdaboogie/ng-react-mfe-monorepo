# Angular 18 → React 19 Migration Playbook (Agent-Executable)

> Audience: AI coding agents (Copilot, Devin.ai) and human reviewers.
> Objective: Migrate Angular 18 applications to React 19 with consistent architecture, minimal drift, and predictable outputs.
> Style: Strict on invariants and boundaries; flexible on local implementation where justified.

---

## Table of Contents
1. Goals & Non-Negotiables
2. Strategy Selection
3. Target Architecture
4. Concept Mapping (Angular → React)
5. Hooks-First State Policy (Mandatory)
6. Cross-Boundary Contracts
7. Routing & Navigation
8. Data Access & Server State
9. Forms & Validation
10. Styling & Design System
11. Error Handling & Observability
12. Testing & Quality Gates
13. Migration Algorithm (Step-by-step)
14. Definition of Done (Per Route/Domain)
15. Common Pitfalls & How to Avoid Them
16. Required Docs & Templates
17. Agent Prompt Templates

---

## 1) Goals & Non-Negotiables

### Goals
- Safely convert Angular 18 codebases to React 19.
- Ensure consistent folder structure and component standards across features.
- Prefer hooks and local ownership over global stores.
- Preserve RxJS pipelines where appropriate without translating them into Redux.
- Enable incremental migration and safe cutover.

### Non-Negotiables (Hard Invariants)
1. **Layering/Boundaries are enforced**
   - `shared/*` MUST NOT import `features/*`
   - `features/A` MUST NOT import `features/B` except through `shared/contracts/*`
2. **State taxonomy is mandatory**
   - Every state element must be classified: server, local UI, shared client, streaming/evented.
3. **Hooks-first**
   - Default to hooks (`useState/useReducer/custom hooks`) over central stores.
4. **RxJS stays RxJS**
   - Do NOT convert RxJS streams into Redux/Zustand reducers/actions.
   - Wrap RxJS behind hooks.
5. **No I/O inside UI components**
   - No `fetch/axios` in components.
   - All I/O through domain `api/` layers or shared http client.
6. **Cross-boundary comms are contract-based**
   - Versioned event envelope.
   - Runtime validation in dev/stage.
7. **Cleanup is required**
   - Subscriptions/listeners/timers MUST be cleaned on unmount.
8. **Each migrated slice must be testable**
   - At least one component test per migrated flow + contract tests for new contracts.

---

## 2) Strategy Selection

The agent MUST pick one strategy and record it in:
- `docs/migration/strategy.md`

### Strategy A: Strangler (Recommended)
- Angular remains host.
- Migrate domain routes progressively.
- React pages mount in Angular.

### Strategy B: MFE Strangler
- Each domain becomes a React MFE.
- Angular loads MFEs (e.g., web components).

### Strategy C: Big Bang
- Rebuild everything in React.
- Use only when features can be frozen.

Decision rule:
- If app is multi-team or enterprise-scale → A or B.

---

## 3) Target Architecture

### 3.1 Required folder layout

```
src/
  app/
    providers/            # auth, telemetry, flags, query client
    routes/               # route registry + lazy loading
    shell/                # app chrome (nav/header/footer)
    error/                # error boundary, error pages
  features/
    <domain>/
      api/                # domain I/O, DTO mapping
      model/              # types, schemas, mapping helpers
      hooks/              # domain hooks (data + orchestration)
      streams/            # optional RxJS pipelines (keep here)
      components/         # reusable components within domain
      pages/              # route components only
      index.ts            # domain public exports (minimal)
  shared/
    contracts/            # versioned events and schemas
    ui/                   # shared primitives only (thin)
    utils/                # http client, formatters, helpers
    styles/               # tokens, css vars, global base styles
```

### 3.2 Layering rules (enforced)
- `shared/*` cannot import `features/*`.
- `features/<domain>/*` cannot import another domain directly.
- `pages/` can import within domain and shared.
- `components/` should not import `api/` directly; use hooks.

### 3.3 Component taxonomy (required)
- **Page components (`pages/`)**
  - Route-aware, orchestrate hooks, handle loading/error/empty.
- **Domain components (`components/`)**
  - Presentational + light orchestration, avoid direct I/O.
- **Shared UI primitives (`shared/ui`)**
  - Stateless or near-stateless, no domain logic.

---

## 4) Concept Mapping (Angular → React)

### 4.1 Templates/directives → JSX/composition
Angular:
- `*ngIf`, `*ngFor`, `ngClass`, pipes
React:
- conditionals, `map`, functions, explicit rendering

**Example**
```tsx
export function List({ items }: { items: Item[] }) {
  if (!items.length) return <EmptyState />;
  return <ul>{items.map(i => <Row key={i.id} item={i} />)}</ul>;
}
```

### 4.2 DI services → module singletons + providers + hooks
Angular `@Injectable` becomes:
- Domain API module (`features/<domain>/api/*`)
- App provider (`app/providers/*`)
- Consumption via hooks (`useAuth`, `useFlags`, `useTelemetry`)

### 4.3 Change detection → explicit state updates
Angular hides detection. React requires explicit state/props.
- Side effects via hooks or data libraries.
- Avoid ad-hoc global events mutating random state.

### 4.4 NgRx patterns → hooks + query + minimal store
- Replace most NgRx "effects" with query/mutation hooks + invalidation.
- Keep cross-route UI state in a small store only if needed.

---

## 5) Hooks-First State Policy (Mandatory)

### 5.1 State taxonomy (must classify every state)
Agents MUST classify each Angular state into one bucket:

1) **Server State** (API-backed, cacheable)
2) **Local UI State** (component/page-only)
3) **Shared Client State** (cross-route/cross-feature UI)
4) **Streaming/Evented State** (WebSocket/SSE/device/event pipelines)

### 5.2 Default mapping rules
- Server State → `useQuery` / `useMutation` (TanStack Query)
- Local UI State → `useState` / `useReducer`
- Shared Client State → Zustand or Redux (only when truly shared)
- Streaming/Evented State → RxJS preserved, wrapped by hooks

### 5.3 Hard rule: Do not convert RxJS to Redux/Zustand
RxJS pipelines remain RxJS.
Expose them via hooks.

#### RxJS adapter pattern (preferred): useSyncExternalStore for BehaviorSubject-like values
```ts
import { useSyncExternalStore } from "react";
import type { BehaviorSubject, Subscription } from "rxjs";

export function fromBehaviorSubject<T>(subject: BehaviorSubject<T>) {
  return {
    getSnapshot: () => subject.getValue(),
    subscribe: (onStoreChange: () => void) => {
      const sub: Subscription = subject.subscribe(() => onStoreChange());
      return () => sub.unsubscribe();
    },
  };
}

export function useBehaviorSubjectValue<T>(subject: BehaviorSubject<T>) {
  const store = fromBehaviorSubject(subject);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
```

#### RxJS adapter pattern (simple): useEffect subscription
```ts
import { useEffect, useState } from "react";
import type { Observable, Subscription } from "rxjs";

export function useObservableValue<T>(obs$: Observable<T>, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const sub: Subscription = obs$.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [obs$]);

  return value;
}
```

### 5.4 Store usage policy (Zustand/Redux)
Allowed only for:
- auth snapshot / session metadata
- feature flags
- global toasts/notifications
- shell UI state (nav collapsed, theme)
- rare cross-route state continuity

Not allowed for:
- server cache (use query)
- replacing RxJS pipelines
- domain state that can live locally

---

## 6) Cross-Boundary Contracts

### 6.1 Event envelope (required)
All cross-boundary comms use this envelope:
```ts
export type PlatformEvent<TType extends string, TVersion extends number, TPayload> = {
  type: TType;
  version: TVersion;
  timestamp: string;      // ISO string
  correlationId: string;  // required
  source: string;         // app/mfe id
  payload: TPayload;
};
```

### 6.2 Versioning rules
- Additive fields: ok
- Remove/rename fields: breaking → new version
- Meaning change: breaking → new version

### 6.3 Validation
- Validate payloads in dev/stage using Zod/JSON schema.
- Fail loudly in dev; log errors in stage.

---

## 7) Routing & Navigation

### 7.1 React owns routing
- Use React Router
- Angular removed

### 7.2 Angular owns routing (strangler/MFE)
- React emits navigation intent events.
- Angular performs navigation.
- React should not maintain independent URL state beyond local UI.

Required contract: `shared/contracts/navigation.ts`
Payload includes `{ to, replace? }`.

---

## 8) Data Access & Server State

### 8.1 HTTP client boundary
- `shared/utils/httpClient.ts` is the only fetch wrapper.
- Domain-specific APIs in `features/<domain>/api/*`.
- Components call hooks, not API modules directly.

### 8.2 Query key conventions
- `["<domain>", "<entity>", id]`
- Invalidate narrowly.

---

## 9) Forms & Validation

- Prefer React Hook Form + Zod for client forms.
- Avoid bespoke validation.
- Every form must have: submit pending state, error state, and validation parity.

---

## 10) Styling & Design System

- Tokens via CSS variables in `shared/styles/tokens.css`.
- DS React components used via peer deps.
- If Shadow DOM is used, document styling injection approach (tokens + adopted styles).

---

## 11) Error Handling & Observability

- Each route group has an Error Boundary.
- Errors are logged via telemetry provider.
- Key flows emit “view” + “action” events.

---

## 12) Testing & Quality Gates

Minimum:
- Component tests for key interactions.
- Contract tests for any new events/schemas.
- E2E updated or explicitly deferred.

---

## 13) Migration Algorithm (Step-by-step)

For each migrated route/domain:

1) **Inventory Angular**
   - Create `docs/migration/domains/<domain>.md`:
     - routes
     - components
     - services
     - forms
     - state sources (RxJS, NgRx, local)
2) **Classify state**
   - Add state mapping section in the same doc (server/local/shared/streaming).
3) **Implement model**
   - `features/<domain>/model`: types, schemas, DTO mappers.
4) **Implement API**
   - `features/<domain>/api`: typed functions + error normalization.
5) **Implement hooks**
   - `features/<domain>/hooks`: query/mutation hooks + selectors.
6) **(Optional) Preserve RxJS streams**
   - `features/<domain>/streams`: keep pipelines; expose via hook adapters.
7) **Build pages**
   - `features/<domain>/pages`: handle loading/error/empty.
8) **Extract components**
   - `features/<domain>/components`: reuse within domain.
9) **Wire routing**
   - Add lazy route entry + Error Boundary.
10) **Add tests**
11) **Verify DoD**
12) **Cutover**
   - behind feature flag or routing swap.

---

## 14) Definition of Done (Per Route/Domain)

- [ ] Loading/error/empty states
- [ ] State classification documented
- [ ] No forbidden imports
- [ ] No direct I/O in UI components
- [ ] RxJS (if used) wrapped by hooks
- [ ] Event contracts versioned + validated (if used)
- [ ] Cleanup verified (subscriptions/listeners)
- [ ] Component tests added
- [ ] E2E updated or deferred with note
- [ ] Telemetry integrated
- [ ] Accessibility basics checked

---

## 15) Common Pitfalls

- Over-centralizing state (turning NgRx into Redux everywhere)
- Duplicating server cache in a store
- Letting features import each other directly
- Putting fetch in components
- Forgetting cleanup on unmount
- Weak contract versioning

---

## 16) Required docs & templates

- `docs/migration/strategy.md`
- `docs/migration/domain-map.md`
- `docs/migration/state-policy.md`
- `docs/migration/component-standards.md`
- `docs/migration/definition-of-done.md`
- `docs/adr/*.md` for major choices/deviations

---

## 17) Agent Prompt Templates

### Migrate one domain
> Migrate Angular domain `<domain>` to React 19 under `features/<domain>`. Follow MIGRATION_PLAYBOOK.md. Inventory the domain, classify state, implement model/api/hooks/pages/components, preserve RxJS streams behind hooks, add tests, and enforce import boundaries.

### Implement streaming state
> Keep RxJS pipelines under `features/<domain>/streams`. Expose values via hook adapters (`useSyncExternalStore` preferred). Do not convert streams to Redux/Zustand.