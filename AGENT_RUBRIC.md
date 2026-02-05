# Agent Rubric — Angular 18 → React 19 Migration (Strict Shape, Flexible Tools)

> Pass/Fail rubric for AI agent outputs and PR review.
> Strict on boundaries, state taxonomy, and cleanup. Flexible on local implementation with justification.

---

## 1) Hard Rules (Fail if violated)

### 1.1 Boundaries & Structure
- Uses required folder layout (features/shared/app).
- `shared/*` does NOT import `features/*`.
- `features/A` does NOT import `features/B` except via `shared/contracts/*`.
- `pages/` orchestrate; `components/` are reusable; no API calls in components.

### 1.2 Hooks-First State Policy (Mandatory)
- Every state classified: server/local/shared/streaming.
- Default is hooks and local ownership.
- Shared store is used ONLY for cross-route/cross-feature UI state.

### 1.3 RxJS policy (Mandatory)
- RxJS pipelines are NOT converted into Redux/Zustand.
- RxJS lives in `features/<domain>/streams` or `shared/streams`.
- UI consumes RxJS via hook adapters only.

### 1.4 Side effects & cleanup
- No side effects in presentational components.
- All subscriptions/listeners/timers cleaned up on unmount.
- Fetch cancellation uses AbortController where appropriate.

### 1.5 Data access
- No `fetch` in components.
- All API calls under `features/<domain>/api` or shared http client.
- Server state uses query/mutation hooks (unless justified).

### 1.6 Contracts
- Cross-boundary comms use versioned envelopes.
- Payloads validated in dev/stage.
- No passing callbacks across Angular/React boundary.

### 1.7 Testing minimum
- At least one component test for the migrated flow.
- Contract tests added for new event/schema.
- E2E updated OR explicitly deferred with reason.

### 1.8 Documentation
- Domain inventory doc updated (`docs/migration/domains/<domain>.md`).
- State classification recorded.
- ADR added for major deviations from defaults.

---

## 2) Guided Defaults (Allowed to Deviate With Justification)

### Defaults
- Server state: TanStack Query
- Local state: `useState`, `useReducer`
- Shared client state: Zustand (Redux only when required for tooling/governance)
- Streaming/evented state: RxJS preserved behind hooks
- Forms: React Hook Form + Zod OR React 19 native patterns

### Deviation policy
If deviating, include a “Deviation Note” in PR:
- What was deviated from
- Why default didn’t fit
- How bounded and tested

---

## 3) Hook-First Implementation Checklist

### 3.1 Server state (expected)
- `features/<domain>/hooks/useX.ts` exports `useQuery` / `useMutation`
- UI reads `isLoading/isError/data`

### 3.2 Local UI state (expected)
- Use `useState/useReducer`
- Avoid pushing local UI state into global stores

### 3.3 Shared store (rare)
Allowed only for:
- auth session snapshot
- feature flags
- global toasts
- shell UI state (nav/theme)
- cross-route state continuity (rare)

Not allowed for:
- server caches
- RxJS stream replacement
- domain state that can be local

### 3.4 RxJS stream adapters (expected)
Use one of:

#### Preferred: useSyncExternalStore adapter (BehaviorSubject-like)
- Provides consistent updates in concurrent rendering

#### Acceptable: useEffect subscription
- Only when concurrency edge cases are not relevant

---

## 4) PR Checklist (Agent must include)

- [ ] Folder layout and boundaries respected
- [ ] State taxonomy completed for migrated pieces
- [ ] RxJS preserved behind hooks (if any)
- [ ] No direct I/O in components
- [ ] Loading/error/empty states included
- [ ] Cleanup verified (subs/listeners)
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] Deviation notes (if any)

---

## 5) Anti-patterns (Instant Fail)

- Turning NgRx into a global Redux store for everything
- Converting RxJS pipelines into reducers/actions
- Cross-feature deep imports
- Fetch in components
- Unversioned contract changes
- Missing cleanup on unmount
- No tests for migrated flow

---

## 6) Canonical Agent Prompts

### Migrate one domain
> Migrate Angular domain `<domain>` to React 19 using MIGRATION_PLAYBOOK.md and this rubric. Create model/api/hooks/pages/components. Preserve RxJS streams behind hooks. Add tests. Update domain inventory doc. Enforce boundaries.

### Implement streaming state
> Keep RxJS streams in `features/<domain>/streams`. Provide hook adapters. Do not translate streams into Redux/Zustand.