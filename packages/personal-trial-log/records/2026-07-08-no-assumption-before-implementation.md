---
type: trial
created: 2026-07-08
tags:
  - requirement
  - clarification
  - prototype-brief
source: conversation
visibility: personal
---

# 구현 전 요구사항 가정 금지

## 상황

초기 설계에서는 사용자가 적게 말해도 하네스가 합리적으로 빈칸을 채우고, 채운 가정을 표시하는 방향을 잡았다.

## 문제

이 접근은 빠르게 프로토타입을 만들 수는 있지만, 사용자가 떠올린 모습과 다른 결과물을 만들 위험이 크다. 특히 구현에 영향을 주는 요구사항을 하네스가 임의로 정하면, 이후 피드백은 디자인 수정이 아니라 방향 수정이 된다.

## 바뀐 판단

구현에 앞선 요구사항은 하네스가 절대 가정하지 않는다.

애매한 요구사항은 모두 사용자에게 다시 묻고, 사용자가 답한 내용만 확정 요구사항으로 기록한다. 사용자가 명시적으로 "네가 정해줘"라고 위임한 경우에만 하네스가 선택안을 제안하거나 결정할 수 있다.

## 설계 반영

- `가정 목록`을 `확인 질문`, `확정 요구사항`, `미확정 항목`으로 바꿨다.
- 내부 파이프라인에 `ClarificationQuestions`, `ConfirmedRequirements` 단계를 추가했다.
- `PrototypeBrief` 타입에서 `assumptions`, `inferredRequirements`를 제거하고, `clarificationQuestions`, `confirmedRequirements`, `delegatedDecisions`, `unresolvedRequirements`를 추가했다.

## 다음에 조심할 점

속도를 높인다는 이유로 사용자 의도를 대신 정하지 말 것.

프로토타입 하네스에서 빠르다는 것은 질문을 생략한다는 뜻이 아니다. 구현 전에 필요한 질문을 정확히 골라내고, 답변 이후 빠르게 만드는 쪽이 맞다.
