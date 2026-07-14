# 평가 시스템 1차 구현 계획

## 1. 목표

프로토타입 생성기를 만들기 전에 평가 시스템을 먼저 구현한다.

첫 구현의 목표는 다음이다.

```text
평가 입력 JSON
→ 요구사항 게이트 검사
→ 점수 계산
→ 실패 유형 분류
→ 실행 리포트 생성
```

이 단계에서는 실제 프로토타입 생성기를 만들지 않는다.

## 2. 구현 원칙

- 외부 의존성 없이 Node.js 표준 라이브러리만 사용한다.
- 평가 기준은 `docs/prototype-harness-evaluation.md`의 배점과 최소 통과 기준을 따른다.
- 미확정 요구사항이 있으면 결과를 실패로 처리한다.
- 민감정보 검사는 기존 `scripts/security-scan.sh`를 유지한다.
- 자동 검증과 사람 평가를 같은 실행 리포트에 남긴다.
- 사람이 평가해야 하는 항목은 수동 입력 JSON으로 받는다.

## 3. 1차 범위

### 3.1 evaluation-schema

평가 입력과 출력의 구조를 정의한다.

필수 입력:

- `runId`
- `inputIdea`
- `requirements.confirmed`
- `requirements.unresolved`
- `checks.buildPassed`
- `checks.coreFlowPassed`
- `checks.securityScanPassed`
- `humanReview.intentMatchScore`

### 3.2 requirement-gate

다음 조건을 검사한다.

- 미확정 요구사항이 0개인가
- 확정 요구사항이 1개 이상인가
- 입력 아이디어가 비어 있지 않은가

게이트가 실패하면 프로토타입 생성 단계로 넘어갈 수 없다.

### 3.2.1 prototype-intent-gate

프로토타입 결과물이 프로토타이핑의 정신을 담고 있는지 검사한다.

필수 조건:

- 가장 중요한 가설이 있다.
- 최소 검증 방식이 있다.
- 프로토타입 형식이 허용 목록에 포함된다.
- 앱보다 더 싼 검증 방식이 검토되었다.
- 다음 결정 옵션이 있다.

게이트가 실패하면 결과는 실패로 처리한다.

### 3.3 score-calculator

100점 만점으로 계산한다.

| 영역 | 배점 |
| --- | --- |
| 요구사항 확인 품질 | 20 |
| 의도 일치도 | 25 |
| 핵심 흐름 완결성 | 20 |
| 피드백 가능성 | 15 |
| 시각 및 정보 구조 품질 | 10 |
| 기술 품질 | 10 |

### 3.4 failure-classifier

실패 유형을 분류한다.

- `RequirementFailure`
- `IntentFailure`
- `FlowFailure`
- `InteractionFailure`
- `DataFailure`
- `VisualFailure`
- `TechnicalFailure`
- `FeedbackFailure`
- `SecurityFailure`

### 3.5 run-report

실행 결과를 두 가지 형식으로 저장한다.

- JSON: 기계가 다시 읽기 위한 결과
- Markdown: 사람이 읽기 위한 요약

## 4. CLI

명령:

```bash
npm run evaluate -- examples/evaluation-run.valid.json
```

출력:

```text
runs/<runId>/evaluation-result.json
runs/<runId>/evaluation-report.md
```

## 5. 테스트

Node.js 내장 테스트 러너를 사용한다.

검증할 것:

- 미확정 요구사항이 있으면 게이트 실패
- 점수 계산이 배점 범위 안에 들어감
- 최소 통과 조건을 만족하면 pass
- 빌드 실패나 보안 실패가 있으면 실패 유형이 분류됨
- 리포트가 JSON/Markdown으로 생성됨

## 6. 다음 단계

1차 구현 후 다음 순서로 확장한다.

1. 여러 실행 결과의 trend summary
2. human review 입력 템플릿
3. benchmark input runner
4. prototype brief validator
5. prototype generator
