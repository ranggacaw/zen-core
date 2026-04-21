## Context
`Modules/DataPegawai` currently delivers two staff-management flows:
- `pegawai-pengajar` handled by `Modules\DataPegawai\App\Http\Controllers\DataPegawaiController`
- `pegawai-non-pengajar` handled by `Modules\DataPegawai\App\Http\Controllers\NonPengajarController`

The module is registered as a standalone nwidart module with alias `datapegawai`, its own service provider, route provider, controllers, views, and menu seed entries. The requested change is not a rename of that module; it is a clone that must coexist beside it under a new top-level menu `Data Tutor` with slug `data-tutor`.

## Goals / Non-Goals
- Goals:
- Add an independently registered `DataTutor` module with its own namespace, alias, views, and routes.
- Mirror the existing `Pengajar` and `Non-Pengajar` user flows under the new module.
- Keep the current `Data Pegawai` module fully available and behaviorally unchanged.
- Use tutor-specific route names and URL segments so navigation and redirects do not collide with existing staff routes.
- Non-Goals:
- Redesign the tutor forms, validation rules, or field layout.
- Consolidate duplicated controller or view logic between `DataPegawai` and `DataTutor` in this change.
- Introduce a brand new tutor-only database schema unless that becomes a separate approved change later.

## Decisions
- Decision: Treat the new module as an independent nwidart module named `DataTutor` with alias `datatutor`.
- Why: The current `DataPegawai` module is wired through module manifests, PSR-4 autoloading, service providers, route providers, and view namespaces. A true clone needs its own module identity to avoid alias and provider collisions.

- Decision: Keep the display label `Data Tutor`, while preserving the existing child labels `Pengajar` and `Non-Pengajar`.
- Why: The user explicitly wants the new parent module to be tutor-focused, but wants the two child workflows to remain recognizable and equivalent to the existing module.

- Decision: Use tutor-specific URLs and route names for the cloned flows.
- Why: Existing flows already occupy `pegawai-pengajar` and `pegawai-non-pengajar`. The clone must use distinct endpoints such as `tutor-pengajar` and `tutor-non-pengajar` so route generation, redirects, menu links, and permissions can coexist safely.

- Decision: Preserve current business behavior first, even if the implementation temporarily reuses existing domain models or shared services.
- Why: The request is to clone an existing module, not redesign its internals. Reusing stable models or upload services is the lowest-risk path as long as the module registration, routes, controllers, views, and navigation are isolated.

## Risks / Trade-offs
- Duplicated logic between `DataPegawai` and `DataTutor` will increase maintenance cost.
Mitigation: Keep the initial clone structurally close to the source module so later refactoring can be proposed separately if needed.

- Reusing the existing `Pegawai` model can make tutor data semantics depend on staff-oriented naming.
Mitigation: Accept this as an implementation constraint for the clone; if tutor data must diverge later, propose a follow-up schema change instead of over-scoping this request.

- Existing integrations may still point at `pegawai-pengajar` routes or `datapegawai::` views.
Mitigation: Limit this change to the new tutor module surface unless a concrete consumer must be repointed during implementation.

## Migration Plan
1. Scaffold `Modules/DataTutor` by cloning the current `DataPegawai` module structure and renaming module metadata, namespaces, aliases, and view references.
2. Add tutor-specific routes and menu entries while leaving all existing `Data Pegawai` routes and menu aliases intact.
3. Verify both tutor submodules render and submit through tutor-specific route names and view namespaces.
4. Run route and manual UI verification to confirm the clone coexists with the original module.

## Open Questions
- None for proposal scope. If later the tutor module needs separate storage from `m_pegawai`, that should be proposed as a follow-up change.
