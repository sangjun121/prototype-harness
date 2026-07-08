# 오픈소스 공개 보안 기준

## 1. 목적

이 저장소는 GitHub에 오픈소스로 공개될 수 있다.

따라서 모든 변경 이후에는 민감 파일, 로컬 메타데이터, API 키, 토큰, 개인 인증 정보가 포함되지 않았는지 검사해야 한다.

## 2. 기본 원칙

- `.env`, 개인 키, 인증서, 서비스 계정 파일은 저장소에 커밋하지 않는다.
- 예시 환경 변수 파일은 `.env.example` 또는 `.env.sample`만 허용한다.
- 실제 토큰, API 키, 비밀번호, 인증 정보는 문서에도 적지 않는다.
- macOS `.DS_Store` 같은 로컬 메타데이터도 커밋하지 않는다.
- 모든 변경 후 `scripts/security-scan.sh`를 실행한다.
- Git hook과 GitHub Actions에서 같은 검사를 실행한다.

## 3. 현재 제공되는 검사

로컬 검사:

```bash
bash scripts/security-scan.sh
```

검사 대상:

- 민감 파일명
- `.DS_Store`
- 개인 키 본문
- OpenAI 스타일 API 키
- AWS access key id
- GitHub token
- Slack token
- Google API key
- Notion 스타일 secret
- 일반적인 credential assignment

## 4. Git hook으로 강제할 수 있는가

가능하다.

이 저장소에는 `.githooks/pre-commit` 템플릿을 둔다.

Git 저장소를 초기화한 뒤 다음 명령으로 훅 경로를 연결한다.

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit scripts/security-scan.sh
```

이후 커밋할 때마다 `scripts/security-scan.sh`가 실행된다.

주의할 점:

- Git hook은 로컬 설정이라 각 개발자 환경에서 설정해야 한다.
- 사용자가 `--no-verify`로 우회할 수 있다.
- 그래서 GitHub Actions 같은 CI 검사도 같이 둬야 한다.

## 5. CI 강제

`.github/workflows/security-scan.yml`은 push와 pull request에서 보안 검사를 실행한다.

오픈소스 저장소에서는 이 CI를 필수 체크로 걸어야 한다.

GitHub에서 설정할 항목:

```text
Settings
→ Branches
→ Branch protection rule
→ Require status checks to pass before merging
→ Security Scan 선택
```

로컬 hook은 빠른 차단 장치고, CI는 저장소 차원의 강제 장치다.

## 6. 한계

현재 스캐너는 의존성 없는 기본 검사다.

나중에 저장소가 커지면 다음 도구를 추가하는 것이 낫다.

- gitleaks
- trufflehog
- detect-secrets
- GitHub secret scanning

하지만 초기 하네스에서는 외부 의존성 없이 실행되는 기본 스캐너를 먼저 둔다.
