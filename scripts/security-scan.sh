#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

failures=0

print_failure() {
  printf '%s\n' "SECURITY SCAN FAILURE: $1"
  failures=$((failures + 1))
}

list_files() {
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git ls-files --cached --others --exclude-standard
  else
    find . -type f \
      -not -path './.git/*' \
      -not -path './node_modules/*' \
      -not -path './dist/*' \
      -not -path './build/*' \
      | sed 's#^\./##'
  fi
}

is_text_file() {
  grep -Iq . "$1"
}

check_sensitive_filenames() {
  local file
  while IFS= read -r file; do
    case "$file" in
      .env.example|.env.sample)
        continue
        ;;
    esac

    if printf '%s\n' "$file" | grep -Eiq '(^|/)(\.env(\..*)?|id_rsa(\..*)?|id_ed25519(\..*)?|credentials\.json|service-account.*\.json|secrets?\..*|.*\.secret|.*\.(pem|key|p12|pfx))$'; then
      print_failure "sensitive filename detected: $file"
    fi

    if printf '%s\n' "$file" | grep -Eq '(^|/)\.DS_Store$'; then
      print_failure "macOS metadata file detected: $file"
    fi
  done < <(list_files)
}

check_secret_patterns() {
  local file
  while IFS= read -r file; do
    [ -f "$file" ] || continue
    is_text_file "$file" || continue

    if grep -En -e '-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----' "$file" >/dev/null; then
      print_failure "private key content detected: $file"
    fi

    if grep -En 'sk-(proj-)?[A-Za-z0-9_-]{20,}' "$file" >/dev/null; then
      print_failure "OpenAI-style API key detected: $file"
    fi

    if grep -En 'AKIA[0-9A-Z]{16}' "$file" >/dev/null; then
      print_failure "AWS access key id detected: $file"
    fi

    if grep -En 'gh[pousr]_[A-Za-z0-9_]{30,}' "$file" >/dev/null; then
      print_failure "GitHub token detected: $file"
    fi

    if grep -En 'xox[baprs]-[A-Za-z0-9-]{20,}' "$file" >/dev/null; then
      print_failure "Slack token detected: $file"
    fi

    if grep -En 'AIza[0-9A-Za-z_-]{35}' "$file" >/dev/null; then
      print_failure "Google API key detected: $file"
    fi

    if grep -En 'secret_[A-Za-z0-9]{20,}' "$file" >/dev/null; then
      print_failure "Notion-style secret detected: $file"
    fi

    if grep -En '(password|passwd|pwd|token|api[_-]?key|secret)[[:space:]]*[:=][[:space:]]*["'\'']?[A-Za-z0-9_./+=:-]{12,}' "$file" >/dev/null; then
      print_failure "generic credential assignment detected: $file"
    fi
  done < <(list_files)
}

check_sensitive_filenames
check_secret_patterns

if [ "$failures" -gt 0 ]; then
  printf '%s\n' "Security scan failed with $failures issue(s)."
  exit 1
fi

printf '%s\n' "Security scan passed."
