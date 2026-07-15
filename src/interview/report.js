import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function writeInterviewGuide(guide, outputRoot = "runs") {
  const outputDir = join(outputRoot, guide.runId);
  await mkdir(outputDir, { recursive: true });

  const jsonPath = join(outputDir, "interview-guide.json");
  const markdownPath = join(outputDir, "interview-guide.md");

  await writeFile(jsonPath, `${JSON.stringify(guide, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderInterviewGuideMarkdown(guide), "utf8");

  return {
    outputDir,
    jsonPath,
    markdownPath
  };
}

export function renderInterviewGuideMarkdown(guide) {
  return `# Interview Guide: ${guide.runId}

## Principle

${guide.principle}

## Hypothesis

${guide.hypothesis}

## Minimum Validation Method

${guide.minimumValidationMethod}

## Questions

${guide.questions.map((question) => `- [${question.type}] ${question.text}`).join("\n")}

## Do Not Ask

${guide.forbiddenQuestions.map((question) => `- ${question}`).join("\n")}

## Evidence To Capture

${guide.evidenceToCapture.map((item) => `- ${item}`).join("\n")}
`;
}
