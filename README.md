# Prototype Harness

An evaluation-first harness for turning clarified ideas into interactive prototypes.

Prototype Harness is not intended to be a simple UI generator. Its goal is to reduce the gap between what a user imagines and what a prototype actually does. The harness is designed to ask for missing requirements, block unsafe assumptions, generate a prototype only after the brief is confirmed, and evaluate the result with repeatable quality gates.

> Status: early implementation stage. The repository now includes the operating principles, evaluation model, security gate, personal build notes, and the first dependency-free evaluation CLI. Prototype generation has not started yet.

## Languages

- [한국어](docs/readme/README.ko.md)
- [日本語](docs/readme/README.ja.md)
- [简体中文](docs/readme/README.zh-CN.md)

## Core Principles

- Do not assume implementation-impacting requirements.
- Ask clarification questions until the required brief is confirmed.
- Treat prototypes as learning instruments, not incomplete products.
- Start from the most important hypothesis and valid user feedback.
- Build interactive flows, not static landing pages.
- Evaluate generated prototypes before expanding templates or features.
- Keep security checks in the local workflow and CI.

## Intended Workflow

```text
Idea input
→ Intent recovery
→ Clarification questions
→ Confirmed requirements
→ Prototype brief
→ Interactive prototype
→ Automated checks
→ Human review
→ Evaluation report
→ Iteration
```

## Evaluation-First Design

The harness must prove that its output is useful. A generated prototype is not considered valid only because it builds or looks polished.

The current evaluation model covers:

- requirement confirmation quality
- intent match
- core flow completion
- feedback specificity
- visual and information structure quality
- technical quality
- iteration improvement speed
- security scan status

See [Prototype Harness Evaluation](docs/prototype-harness-evaluation.md).

## Quick Start

Run the tests:

```bash
npm test
```

Run the security scan:

```bash
npm run security:scan
```

Run intake on an incomplete idea:

```bash
npm run intake -- examples/intake-session.incomplete.json
```

Run intake on a complete brief:

```bash
npm run intake -- examples/intake-session.complete.json
```

Generate an interview guide:

```bash
npm run interview:guide -- examples/evaluation-run.valid.json
```

Evaluate an example run:

```bash
npm run evaluate -- examples/evaluation-run.valid.json
```

The intake and evaluation CLIs write:

```text
runs/<runId>/evaluation-result.json
runs/<runId>/evaluation-report.md
runs/<sessionId>/intake-result.json
runs/<sessionId>/intake-report.md
runs/<runId>/interview-guide.json
runs/<runId>/interview-guide.md
```

## Security Gate

This repository is intended to be open source. Sensitive files and secrets must not be committed.

The repository includes:

- `.gitignore` rules for common secret and local metadata files
- `scripts/security-scan.sh`
- `.githooks/pre-commit`
- `.github/workflows/security-scan.yml`

Run the local scan:

```bash
bash scripts/security-scan.sh
```

Enable the local pre-commit hook:

```bash
git config core.hooksPath .githooks
```

See [Open Source Security](docs/open-source-security.md).

## Repository Structure

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

## Current Scope

The current implementation milestone is the evaluation system, not the prototype generator.

Implemented so far:

1. `evaluation-schema`
2. `requirement-gate`
3. `score-calculator`
4. `failure-classifier`
5. `run-report`
6. evaluation CLI
7. `intake-session`
8. intake CLI
9. interview guide generator
10. interview evidence gate

Next implementation order:

1. prototype brief validator
2. feedback evidence schema
3. human-review-form
4. trend-summary
5. benchmark input runner
6. prototype generator

## Non-Goals for the First Version

- production backend
- authentication
- payments
- real deployment automation
- analytics SDK
- long-term data storage
- template marketplace

## Documentation

- [Design Document](docs/prototype-harness-design.md)
- [Evaluation Model](docs/prototype-harness-evaluation.md)
- [Prototyping Principles](docs/prototyping-principles.md)
- [Open Source Security](docs/open-source-security.md)
- [Personal Build Log](packages/personal-trial-log/README.md)

## License

No license has been selected yet. Until a license is added, this repository is not automatically open for reuse.
