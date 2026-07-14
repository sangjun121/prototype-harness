# Prototype Harness

確認済みのアイデアを操作可能なプロトタイプに変換するための、評価優先のハーネスです。

Prototype Harness は単なる UI 生成器ではありません。目的は、ユーザーが頭の中で想像したものと、実際に動くプロトタイプとのズレを小さくすることです。このハーネスは、不足している要件を質問し、危険な推測を防ぎ、ブリーフが確定した後にだけプロトタイプを生成し、再現可能な品質ゲートで結果を評価するように設計されます。

> 現在の状態: 初期実装段階です。このリポジトリには、運用原則、評価モデル、セキュリティゲート、個人用の制作記録、そして外部依存のない最初の評価 CLI が含まれています。プロトタイプ生成器はまだ実装していません。

## Languages

- [English](../../README.md)
- [한국어](README.ko.md)
- [简体中文](README.zh-CN.md)

## 基本原則

- 実装に影響する要件を推測しません。
- 必要なブリーフが確定するまで確認質問を行います。
- プロトタイプを未完成の製品ではなく、学習のための道具として扱います。
- 静的なランディングページではなく、操作可能なフローを作ります。
- テンプレートや機能を増やす前に、生成結果を評価します。
- ローカルワークフローと CI にセキュリティチェックを置きます。

## 想定ワークフロー

```text
アイデア入力
→ 意図の復元
→ 確認質問
→ 確定要件
→ プロトタイプブリーフ
→ 操作可能なプロトタイプ
→ 自動検証
→ 人によるレビュー
→ 評価レポート
→ 反復改善
```

## 評価優先の設計

このハーネスは、生成物が本当に有用かどうかを証明する必要があります。ビルドできることや見た目が整っていることだけでは、良いプロトタイプとは見なしません。

現在の評価モデルは次を扱います。

- 要件確認の品質
- 意図との一致度
- コアフローの完了性
- フィードバックの具体性
- 視覚および情報構造の品質
- 技術品質
- 反復改善の速度
- セキュリティスキャン状態

詳細は [Prototype Harness Evaluation](../prototype-harness-evaluation.md) を参照してください。

## Quick Start

テストを実行:

```bash
npm test
```

セキュリティスキャンを実行:

```bash
npm run security:scan
```

サンプル評価を実行:

```bash
npm run evaluate -- examples/evaluation-run.valid.json
```

評価 CLI は次のファイルを生成します。

```text
runs/<runId>/evaluation-result.json
runs/<runId>/evaluation-report.md
```

## セキュリティゲート

このリポジトリはオープンソース公開を前提にしています。機密ファイルや secret をコミットしてはいけません。

このリポジトリには次が含まれています。

- 一般的な secret とローカルメタデータを防ぐ `.gitignore`
- `scripts/security-scan.sh`
- `.githooks/pre-commit`
- `.github/workflows/security-scan.yml`

ローカルスキャン:

```bash
bash scripts/security-scan.sh
```

pre-commit hook の有効化:

```bash
git config core.hooksPath .githooks
```

詳細は [Open Source Security](../open-source-security.md) を参照してください。

## リポジトリ構造

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

## 現在のスコープ

現在の実装マイルストーンは、プロトタイプ生成器ではなく評価システムです。

現在実装済み:

1. `evaluation-schema`
2. `requirement-gate`
3. `score-calculator`
4. `failure-classifier`
5. `run-report`
6. evaluation CLI

次の実装順序:

1. `human-review-form`
2. `trend-summary`
3. benchmark input runner
4. prototype brief validator
5. prototype generator

## 初期バージョンの非目標

- 本番用バックエンド
- 認証
- 決済
- 実際のデプロイ自動化
- 分析 SDK
- 長期データ保存
- テンプレートマーケットプレイス

## ドキュメント

- [Design Document](../prototype-harness-design.md)
- [Evaluation Model](../prototype-harness-evaluation.md)
- [Open Source Security](../open-source-security.md)
- [Personal Build Log](../../packages/personal-trial-log/README.md)

## ライセンス

ライセンスはまだ選択されていません。ライセンスが追加されるまでは、このリポジトリは自動的に再利用可能な状態ではありません。
