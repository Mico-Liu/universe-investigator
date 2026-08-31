# Environment & Capability Governance

统一生命周期：

```text
BOOTSTRAP → READY → NORMAL USE → CHANGE / FAILURE / EXPIRY → REVALIDATE
```

适用于 runtime、package manager、test runtime、browser、Git、Git hosting auth、CI、artifact access、cloud credentials 等。

Revalidation Trigger：new machine/environment、account/repo changed、token expired、tool policy changed、capability/permission failure。

原则：Stable capability → reuse；Failure/change/expiry → revalidate。
