# Delivery Lifecycle

## 1. Delivery Completion

Push 不是任务完成。

```text
Commit → Push → PR → CI → Merge Gate → Merge → Verify Main → Delete Remote Branch → Delete Local Branch / Worktree → Finalize Task State → DONE
```

## 2. Delivery Integrator Responsibilities

### Pre-merge

validate latest main、approved evidence、diff；commit、push、create/update PR、observe required CI。

### Merge Gate

只有全部满足才允许 merge：

```text
Reviewer PASS when required
AND Integrator PASS when required
AND required CI PASS
AND no blocking findings
AND mergeable
AND target branch correct
AND no protected/frozen violation
AND no unresolved human gate
```

### Post-merge

verify main contains approved change、delete remote branch、update local main、delete local task branch when safe、remove task worktree when applicable、finalize task state、verify clean repo。

## 3. Delivery Failure Policy

- code/repository failure → FIX_REQUIRED
- transient CI infrastructure failure → bounded retry if policy allows
- spec/product/architecture conflict → HUMAN_ATTENTION / DESIGN_ESCALATION
- unsafe cleanup → preserve work; do not delete

## 4. Merge Safety

绝不 merge failed CI、bypass required checks、delete unmerged work、delete main、cleanup dirty worktree without safe handling、为交付机械要求擅改实现。

## 5. Machine Evidence

建议记录：commit_sha、branch、pr_number、ci_run_ids、required_check_status、merge_sha、main_verification、remote_branch_deleted、local_branch_deleted、worktree_removed、repo_clean、task_status。

## 6. Definition of Done as Code

```text
DONE = implementation PASS
  ∧ verify PASS
  ∧ required review PASS
  ∧ required integration PASS
  ∧ PR exists
  ∧ required CI PASS
  ∧ merged
  ∧ main verified
  ∧ cleanup complete
  ∧ task metadata finalized
```

## 7. Delivery Capability Bootstrap & Health Check

完整能力检查不应每 Task 重跑。

### Bootstrap once

仅在 new machine/environment、GitHub account changed、repo changed、bootstrap version changed 时完整检查：git available、gh installed/authenticated、repo/PR/Actions/merge/branch-cleanup capability。

### Normal tasks

普通 Task 直接复用已验证能力；只有 auth/permission failure、token expiry、environment change、delivery command failure 时重新验证。

```text
Stable capability → reuse
Failure/change/expiry → revalidate
```

## 8. Future Deterministic Command

目标：

```text
pnpm task:deliver TASK-XXX
```

职责：ensure commit/push/PR、wait/check CI、validate merge gate、merge、verify main、cleanup、finalize state、emit evidence。
