# Prototype Harness

一个以评估为先的 harness，用于把已澄清的想法转化为可交互的原型。

Prototype Harness 不是简单的 UI 生成器。它的目标是缩小用户脑中设想与实际可操作原型之间的差距。这个 harness 会先询问缺失的需求，阻止有风险的假设，只在 brief 被确认后生成原型，并用可重复的质量门禁评估结果。

> 当前状态：早期实现阶段。当前仓库包含运行原则、评估模型、安全门禁、个人构建记录，以及第一个无外部依赖的评估 CLI。原型生成器尚未开始实现。

## Languages

- [English](../../README.md)
- [한국어](README.ko.md)
- [日本語](README.ja.md)

## 核心原则

- 不假设会影响实现的需求。
- 在必要 brief 被确认前持续提出澄清问题。
- 把原型看作学习工具，而不是未完成的产品。
- 构建可交互流程，而不是静态 landing page。
- 在扩展模板或功能前先评估生成结果。
- 在本地工作流和 CI 中加入安全检查。

## 目标流程

```text
想法输入
→ 意图恢复
→ 澄清问题
→ 已确认需求
→ 原型 brief
→ 可交互原型
→ 自动检查
→ 人工评审
→ 评估报告
→ 迭代
```

## 评估优先设计

这个 harness 必须证明它的输出是有用的。仅仅能构建成功或看起来精致，并不足以说明它是一个好的原型。

当前评估模型覆盖：

- 需求确认质量
- 意图匹配度
- 核心流程完成度
- 反馈具体性
- 视觉和信息结构质量
- 技术质量
- 迭代改进速度
- 安全扫描状态

详情见 [Prototype Harness Evaluation](../prototype-harness-evaluation.md)。

## Quick Start

运行测试：

```bash
npm test
```

运行安全扫描：

```bash
npm run security:scan
```

运行示例评估：

```bash
npm run evaluate -- examples/evaluation-run.valid.json
```

评估 CLI 会生成：

```text
runs/<runId>/evaluation-result.json
runs/<runId>/evaluation-report.md
```

## 安全门禁

这个仓库以开源发布为前提。敏感文件和 secret 不应被提交。

仓库包含：

- 用于阻止常见 secret 和本地元数据文件的 `.gitignore`
- `scripts/security-scan.sh`
- `.githooks/pre-commit`
- `.github/workflows/security-scan.yml`

运行本地扫描：

```bash
bash scripts/security-scan.sh
```

启用 pre-commit hook：

```bash
git config core.hooksPath .githooks
```

详情见 [Open Source Security](../open-source-security.md)。

## 仓库结构

```text
docs/
  evaluation-system-implementation-plan.md
  prototype-harness-design.md
  prototype-harness-evaluation.md
  open-source-security.md
  readme/
examples/
packages/
  personal-trial-log/
scripts/
  security-scan.sh
src/
  cli/
  evaluation/
test/
```

## 当前范围

当前实现里程碑是评估系统，而不是原型生成器。

目前已实现：

1. `evaluation-schema`
2. `requirement-gate`
3. `score-calculator`
4. `failure-classifier`
5. `run-report`
6. evaluation CLI

下一步实现顺序：

1. `human-review-form`
2. `trend-summary`
3. benchmark input runner
4. prototype brief validator
5. prototype generator

## 第一版不包含

- 生产后端
- 认证
- 支付
- 真实部署自动化
- 分析 SDK
- 长期数据存储
- 模板市场

## 文档

- [Design Document](../prototype-harness-design.md)
- [Evaluation Model](../prototype-harness-evaluation.md)
- [Open Source Security](../open-source-security.md)
- [Personal Build Log](../../packages/personal-trial-log/README.md)

## License

尚未选择许可证。在添加许可证之前，本仓库并不会自动授予复用权限。
