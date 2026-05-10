# Jobs Package Architectural Refactor Plan

This plan outlines the transition of the `@vpa/jobs` package from a collection of fragmented fetchers to a robust, data-driven system.

## Phase 1: Test Stabilization & Fixtures
**Goal:** Create a deterministic safety net for refactoring.

- [ ] Create `packages/jobs/src/__fixtures__/` directory.
- [ ] Capture raw API responses (JSON) for all 4 providers.
- [ ] Implement `MockFetcher` or use `msw`/`vitest` to intercept network requests.
- [ ] Refactor existing tests to run against static fixtures instead of live network.
- [ ] Add "Edge Case" titles to fixtures to verify filtering (e.g., "Senior", "Manager", "In Training").

## Phase 2: Core Logic Consolidation
**Goal:** Eliminate "Filtering Sprawl" and unify business logic.

- [ ] Create `src/matcher.ts` to encapsulate job relevance logic.
- [ ] Define global `JOB_CRITERIA` (keywords, exclusions, categories).
- [ ] Create `BaseFetcher` abstract class to handle network boilerplate and error logging.
- [ ] Refactor Medtronic, Abbott, Boston, and Biotronik to use `BaseFetcher` and `matcher.ts`.

## Phase 3: Schema Safety & Robustness
**Goal:** Prevent silent failures from upstream API changes.

- [ ] Introduce `zod` for runtime schema validation of provider responses.
- [ ] Standardize the `JobPost` ID format to `provider:external_id`.
- [ ] Enhance error reporting: log specifically *why* a fetch failed (Schema mismatch vs Network error).

## Phase 4: Performance & Extensibility
**Goal:** Support 10+ providers and faster execution.

- [ ] Parallelize `fetchAllJobs` using `Promise.allSettled`.
- [ ] Implement provider-level throttling/rate-limiting.
- [ ] Add `firstSeen` and `raw` data fields to `JobPost` for better downstream tracking.

## Phase 5: Verification & Cleanup
- [ ] Run full test suite against both fixtures and (optionally) live "Smoke Tests".
- [ ] Update README and documentation for adding new providers.
- [ ] Final sync to Google Sheets and Marketing Site.
