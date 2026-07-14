---
type: process
created: 2026-07-14
tags:
  - implementation
  - prototype-intent
  - quality-gate
source: conversation
visibility: personal
---

# prototype-intent-gate 구현

## 관찰된 제작 프로세스

작성자는 프로토타이핑 정신을 문서에만 두지 않고, 실제 평가 흐름에서 강제되는 게이트로 구현하기 시작했다.

핵심 가설, 최소 검증 방식, 프로토타입 형식, 더 싼 검증 방식 검토 여부, 다음 결정 옵션을 확인하는 별도 게이트를 추가했다.

## 드러난 의사결정 기준

- 하네스는 앱 생성 요청을 그대로 통과시키면 안 된다.
- 결과물은 어떤 가설을 어떤 방식으로 검증하려는지 설명할 수 있어야 한다.
- 웹 앱보다 더 싼 검증 방식이 있는지 확인해야 한다.
- 평가 시스템의 원칙은 문서가 아니라 코드 게이트로도 강제되어야 한다.

## 공식 설계와의 관계

공식 평가 흐름에 `prototype-intent-gate`가 추가되었다.

이 게이트가 실패하면 평가 결과도 실패하며, 실패 유형은 `PrototypeIntentFailure`로 분류된다.

## 반복 가능성

높다.

앞으로 하네스에 새로운 원칙이 추가될 때마다 문서만 작성하는 것이 아니라, 실제 게이트로 강제할 수 있는지 검토할 가능성이 크다.

## 다음 관찰 포인트

- prototype format 허용 목록이 충분한지
- `cheaperValidationConsidered`가 단순 boolean으로 충분한지
- 최소 검증 방식 추천기와 이 게이트를 어떻게 연결할지
