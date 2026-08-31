# Delivery Governance

```text
Commit
→ Push
→ PR
→ CI
→ Merge Gate
→ Merge
→ Verify Target Branch
→ Delete Remote Branch
→ Delete Local Branch / Worktree
→ Finalize Task
→ DONE
```

Push 不是完成点。

## Merge Gate

required review PASS、required integration PASS、required CI PASS、no blocking findings、mergeable、target branch correct、no protected/frozen violation、no unresolved human gate。

## Merge != Release

Kernel 预留：

```text
Delivery → Merge
Release Extension → Deploy → Smoke → Observe → Rollback
```

## Delivery Capability

采用：

```text
Bootstrap once → reuse → revalidate on change/failure/expiry
```
