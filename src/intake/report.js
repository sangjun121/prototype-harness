import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function writeIntakeReport(result, outputRoot = "runs") {
  const runDir = join(outputRoot, result.sessionId);
  await mkdir(runDir, { recursive: true });

  const jsonPath = join(runDir, "intake-result.json");
  const markdownPath = join(runDir, "intake-report.md");

  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
  await writeFile(markdownPath, formatIntakeMarkdown(result));

  return { jsonPath, markdownPath };
}

export function formatIntakeMarkdown(result) {
  const questionLines =
    result.clarificationQuestions.length === 0
      ? "- None"
      : result.clarificationQuestions.map((item) => `- ${item.question}`).join("\n");

  const confirmedLines =
    result.requirements.confirmed.length === 0
      ? "- None"
      : result.requirements.confirmed.map((item) => `- ${item}`).join("\n");

  const unresolvedLines =
    result.requirements.unresolved.length === 0
      ? "- None"
      : result.requirements.unresolved.map((item) => `- ${item}`).join("\n");

  return `# Intake Report: ${result.sessionId}

## Summary

- Can proceed: ${result.canProceed ? "yes" : "no"}
- Assumption mode: ${result.policy.assumptionMode}
- User answer required: ${result.policy.userAnswerRequired ? "yes" : "no"}

## Input Idea

${result.inputIdea}

## Clarification Questions

${questionLines}

## Confirmed Requirements

${confirmedLines}

## Unresolved Requirements

${unresolvedLines}
`;
}
