# Prototype Harness

명확히 확인된 아이디어를 조작 가능한 프로토타입으로 바꾸기 위한 평가 우선 하네스입니다.

Prototype Harness는 단순한 UI 생성기가 아닙니다. 목표는 사용자가 머릿속으로 떠올린 모습과 실제 프로토타입 사이의 차이를 줄이는 것입니다. 이 하네스는 부족한 요구사항을 질문하고, 위험한 가정을 막고, 브리프가 확정된 뒤에만 프로토타입을 만들고, 반복 가능한 품질 게이트로 결과물을 평가하도록 설계됩니다.

> 현재 상태: 설계 및 초기 부트스트랩 단계입니다. 이 저장소에는 운영 원칙, 평가 모델, 보안 게이트, 개인 제작 기록이 들어 있습니다. 구현은 프로토타입 생성기가 아니라 평가 시스템부터 시작합니다.

## 다른 언어

- [English](../../README.md)
- [日本語](README.ja.md)
- [简体中文](README.zh-CN.md)

## 핵심 원칙

- 구현에 영향을 주는 요구사항은 가정하지 않습니다.
- 필요한 브리프가 확정될 때까지 확인 질문을 던집니다.
- 프로토타입을 미완성 제품이 아니라 학습 장치로 봅니다.
- 정적 랜딩 페이지가 아니라 조작 가능한 흐름을 만듭니다.
- 템플릿이나 기능을 늘리기 전에 결과물을 평가합니다.
- 로컬 작업 흐름과 CI에 보안 검사를 둡니다.

## 목표 흐름

```text
아이디어 입력
→ 의도 복원
→ 확인 질문
→ 확정 요구사항
→ 프로토타입 브리프
→ 조작 가능한 프로토타입
→ 자동 검증
→ 사람 평가
→ 평가 리포트
→ 반복 개선
```

## 평가 우선 설계

하네스는 결과물이 실제로 유용한지 증명해야 합니다. 빌드가 되거나 보기 좋다는 이유만으로 좋은 프로토타입이라고 보지 않습니다.

현재 평가 모델은 다음을 다룹니다.

- 요구사항 확인 품질
- 의도 일치도
- 핵심 흐름 완결성
- 피드백 구체성
- 시각 및 정보 구조 품질
- 기술 품질
- 반복 개선 속도
- 보안 스캔 상태

자세한 내용은 [프로토타입 하네스 검증 체계](../prototype-harness-evaluation.md)를 참고하세요.

## 보안 게이트

이 저장소는 오픈소스 공개를 전제로 합니다. 민감 파일과 secret은 커밋하면 안 됩니다.

저장소에는 다음이 포함되어 있습니다.

- 일반적인 secret 및 로컬 메타데이터 파일을 막는 `.gitignore`
- `scripts/security-scan.sh`
- `.githooks/pre-commit`
- `.github/workflows/security-scan.yml`

로컬 검사:

```bash
bash scripts/security-scan.sh
```

pre-commit hook 활성화:

```bash
git config core.hooksPath .githooks
```

자세한 내용은 [오픈소스 공개 보안 기준](../open-source-security.md)을 참고하세요.

## 저장소 구조

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

## 현재 범위

다음 구현 마일스톤은 프로토타입 생성기가 아니라 평가 시스템입니다.

첫 구현 순서:

1. `evaluation-schema`
2. `requirement-gate`
3. `score-calculator`
4. `failure-classifier`
5. `human-review-form`
6. `run-report`
7. `trend-summary`
8. prototype generator

## 첫 버전에서 제외하는 것

- 프로덕션 백엔드
- 인증
- 결제
- 실제 배포 자동화
- 분석 SDK
- 장기 데이터 저장
- 템플릿 마켓플레이스

## 문서

- [설계 문서](../prototype-harness-design.md)
- [평가 모델](../prototype-harness-evaluation.md)
- [오픈소스 보안](../open-source-security.md)
- [개인 제작 기록](../../packages/personal-trial-log/README.md)

## 라이선스

아직 라이선스를 정하지 않았습니다. 라이선스가 추가되기 전까지 이 저장소는 자동으로 재사용 허가된 상태가 아닙니다.
