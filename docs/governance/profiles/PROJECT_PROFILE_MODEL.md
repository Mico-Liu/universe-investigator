# Project Profile Model

Project Profile 把 Generic Governance 映射到具体项目。

负责：module/path mappings、selected architecture profiles、product/domain assurances、protected artifacts、task conventions、delivery target、project fitness functions。

```yaml
project:
  id: example-project
architecture_profiles: []
modules: {}
assurance_modules:
  architecture: enabled
  product: enabled
delivery:
  default_branch: main
protected_artifacts: []
```

新项目接入：Reuse Kernel → Select Profiles → Create Project Profile → Define Task Contract。
