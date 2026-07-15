import { readFile } from "node:fs/promises";
import { createIntakeSession } from "../intake/intake-session.js";
import { writeIntakeReport } from "../intake/report.js";

const [, , inputPath, outputRoot] = process.argv;

if (!inputPath) {
  console.error("Usage: npm run intake -- <input-json-path> [output-root]");
  process.exit(1);
}

try {
  const input = JSON.parse(await readFile(inputPath, "utf8"));
  const intake = createIntakeSession(input);

  if (!intake.ok) {
    console.error("Intake input is invalid.");
    for (const error of intake.validationErrors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const paths = await writeIntakeReport(intake.result, outputRoot);

  if (intake.result.canProceed) {
    console.log("Intake can proceed.");
  } else {
    console.log("Intake needs clarification.");
    for (const question of intake.result.clarificationQuestions) {
      console.log(`- ${question.question}`);
    }
  }

  console.log(`JSON: ${paths.jsonPath}`);
  console.log(`Report: ${paths.markdownPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
