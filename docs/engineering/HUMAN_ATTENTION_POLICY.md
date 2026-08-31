# Human Attention Policy

## 1. Goal

```text
Only interrupt when machine cannot safely decide.
```

## 2. Human Attention Triggers

默认只在以下情况打断：

- product decision
- architecture conflict
- science ambiguity
- spec conflict
- same-class HIGH escalation
- repeated design pressure
- required scope expansion
- unsafe merge state
- explicit human merge gate
- credential / external authority required
- irreversible action outside approved contract

## 3. Non-interrupting Failures

以下通常不应找人：format、lint、ordinary typecheck failure、ordinary unit test failure、first implementation retry、testable reviewer finding、transient CI failure within retry budget、safe branch cleanup、routine PR creation、routine merge after gates pass。

## 4. Attention Payload

需要人工介入时必须给出：What happened、Why automation stopped、Evidence、Options、Trade-offs、Recommended decision boundary、What resumes after decision。

## 5. Noise Suppression

同一根因不得重复报警：

```text
same root cause → one attention item → all dependent automation paused
```

## 6. Human Gate Policy

```yaml
human_gate:
  required: true | false
  reason: ''
  stage: preflight | premerge | product | science
```

只有明确 Contract 要求时才执行人工 gate。

## 7. Future Human Attention Queue

建议记录 Attention ID、Task、Category、Severity、Evidence、Blocked stage、Decision required、Created at、Resolved at。
