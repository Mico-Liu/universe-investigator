# Human Attention Policy

```text
Only interrupt when machine cannot safely decide.
```

## Triggers

product decision、architecture conflict、domain/science/security/compliance ambiguity、spec conflict、same-class HIGH escalation、scope expansion、unsafe merge、explicit human gate、credential/external authority、irreversible action outside contract。

## Non-interrupting

format、lint、ordinary typecheck、ordinary unit test、first retry、testable reviewer finding、bounded transient CI failure、routine PR、safe cleanup。

## Attention Payload

What happened / Why automation stopped / Evidence / Options / Trade-offs / Decision required / What resumes after decision。
