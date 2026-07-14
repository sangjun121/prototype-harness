import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function writeRunReport(result, outputRoot = "runs") {
  const outputDir = join(outputRoot, result.runId);
  await mkdir(outputDir, { recursive: true });

  const jsonPath = join(outputDir, "evaluation-result.json");
  const markdownPath = join(outputDir, "evaluation-report.md");

  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderMarkdownReport(result), "utf8");

  return {
    outputDir,
    jsonPath,
    markdownPath
  };
}

export function renderMarkdownReport(result) {
  const blocking = result.failures.blockingFailures;
  const nonBlocking = result.failures.nonBlockingFailures;

  return `# Evaluation Report: ${result.runId}

## Summary

- Passed: ${result.passed ? "yes" : "no"}
- Overall score: ${result.score.total}
- Grade: ${result.score.grade}
- Input idea: ${result.inputIdea}
- Primary hypothesis: ${result.prototypeIntent?.primaryHypothesis ?? "not provided"}
- Minimum validation method: ${result.prototypeIntent?.minimumValidationMethod ?? "not provided"}

## Minimum Criteria

| Criteria | Passed |
| --- | --- |
${Object.entries(result.score.minimumCriteria)
  .map(([key, value]) => `| ${key} | ${value ? "yes" : "no"} |`)
  .join("\n")}

## Score Sections

| Section | Score | Reason |
| --- | ---: | --- |
${Object.entries(result.score.sections)
  .map(([key, section]) => `| ${key} | ${section.score} | ${section.reason} |`)
  .join("\n")}

## Requirement Gate

- Passed: ${result.gate.passed ? "yes" : "no"}
- Confirmed requirements: ${result.gate.confirmedRequirementCount}
- Unresolved requirements: ${result.gate.unresolvedRequirementCount}

## Prototype Intent Gate

- Passed: ${result.intentGate.passed ? "yes" : "no"}
- Prototype format: ${result.intentGate.prototypeFormat ?? "not provided"}
- Cheaper validation considered: ${result.intentGate.cheaperValidationConsidered ? "yes" : "no"}

${renderGateFailureList(result.intentGate.failures)}

${renderFailureList("Blocking Failures", blocking)}

${renderFailureList("Non-Blocking Failures", nonBlocking)}
`;
}

function renderFailureList(title, failures) {
  if (failures.length === 0) {
    return `## ${title}\n\nNone.\n`;
  }

  return `## ${title}\n\n${failures
    .map((failure) => `- ${failure.type}: ${failure.message}`)
    .join("\n")}\n`;
}

function renderGateFailureList(failures) {
  if (failures.length === 0) {
    return "Intent gate failures: none.\n";
  }

  return `Intent gate failures:\n\n${failures
    .map((failure) => `- ${failure.code}: ${failure.message}`)
    .join("\n")}\n`;
}
