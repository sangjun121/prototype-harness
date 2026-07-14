#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { evaluateRun } from "../evaluation/evaluate.js";
import { writeRunReport } from "../evaluation/report.js";

const [, , inputPath, outputRoot = "runs"] = process.argv;

if (!inputPath) {
  console.error("Usage: npm run evaluate -- <evaluation-input.json> [output-root]");
  process.exit(2);
}

try {
  const raw = await readFile(inputPath, "utf8");
  const input = JSON.parse(raw);
  const evaluation = evaluateRun(input);

  if (!evaluation.ok) {
    console.error("Evaluation input is invalid:");
    for (const error of evaluation.validationErrors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const paths = await writeRunReport(evaluation.result, outputRoot);

  console.log(`Evaluation ${evaluation.result.passed ? "passed" : "failed"}.`);
  console.log(`Score: ${evaluation.result.score.total} (${evaluation.result.score.grade})`);
  console.log(`JSON: ${paths.jsonPath}`);
  console.log(`Report: ${paths.markdownPath}`);

  process.exit(evaluation.result.passed ? 0 : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
