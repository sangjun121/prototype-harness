# Prototype Harness

An evaluation-first harness for turning clarified ideas into interactive prototypes.

Prototype Harness is not intended to be a simple UI generator. Its goal is to reduce the gap between what a user imagines and what a prototype actually does. The harness is designed to ask for missing requirements, block unsafe assumptions, generate a prototype only after the brief is confirmed, and evaluate the result with repeatable quality gates.

> Status: design and bootstrap stage. The repository currently contains the operating principles, evaluation model, security gate, and personal build notes. The implementation will start from the evaluation system before prototype generation.

## Languages

- [한국어](docs/readme/README.ko.md)
- [日本語](docs/readme/README.ja.md)
- [简体中文](docs/readme/README.zh-CN.md)

## Core Principles

- Do not assume implementation-impacting requirements.
- Ask clarification questions until the required brief is confirmed.
- Treat prototypes as learning instruments, not incomplete products.
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
  prototype-harness-design.md
  prototype-harness-evaluation.md
  open-source-security.md
  readme/
packages/
  personal-trial-log/
scripts/
  security-scan.sh
```

## Current Scope

The next implementation milestone is the evaluation system, not the prototype generator.

Planned first implementation order:

1. `evaluation-schema`
2. `requirement-gate`
3. `score-calculator`
4. `failure-classifier`
5. `human-review-form`
6. `run-report`
7. `trend-summary`
8. prototype generator

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
- [Open Source Security](docs/open-source-security.md)
- [Personal Build Log](packages/personal-trial-log/README.md)

## License

No license has been selected yet. Until a license is added, this repository is not automatically open for reuse.
