# TASK_004_WALKING_SKELETON.md
# TASK 004｜Walking Skeleton

**状态：QUEUED**

## Goal

第一次把Web、Core、Content、Investigation、Persistence连接成可玩的端到端流程。

## Flow

```text
NEXUS
→ START TEST CASE
→ BRIEFING
→ OBSERVE
→ SCAN
→ EVIDENCE
→ SELECT HYPOTHESIS
→ CLAIM
→ VERIFY
→ COMPLETE
```

## Visual

只用：
- box
- sphere
- text
- 基础lighting

## Persistence

首次实现：
- localStorage
- `schemaVersion: 1`

## E2E

Playwright完成：
1. 进入游戏
2. 开始测试案
3. 发现Evidence
4. 选择Hypothesis
5. 提交支持的Claim
6. 完成
7. reload
8. 完成状态仍存在

## Non-goals

- 正式CASE01
- NOVA
- 科学模拟
- 正式美术

## Acceptance

这是第一个真正的端到端可玩能力。
