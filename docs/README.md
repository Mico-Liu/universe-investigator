# Documentation

This directory is the entrypoint for human-readable, long-lived project knowledge.

- [`product/`](product/) contains product truth, including the frozen V6 product specifications and future case specifications.
- [`architecture/`](architecture/) contains architecture truth and architecture decision records.
- [`governance/`](governance/) contains the reusable Generic Governance framework.
- [`engineering/`](engineering/) contains current project engineering documentation and existing governance material pending later migration review.
- [`tasks/`](tasks/) contains human-readable task specifications.

Repository-level operational artifacts remain outside `docs/`:

- [`tasks/`](../tasks/) contains machine-readable task metadata and state.
- [`project-governance/`](../project-governance/) contains the current project governance profile.
- [`architecture-standards/`](../architecture-standards/) is the extension point for future reusable architecture standards.
- [`agents/`](../agents/) contains agent role contracts.
- [`scripts/`](../scripts/) contains executable governance, validators, and tooling.
- [`.github/`](../.github/) contains CI and delivery automation.

The authoritative placement rule is defined in [Documentation Information Architecture](engineering/README.md#documentation-information-architecture).
