import { readFile } from "node:fs/promises";
import { generateInterviewGuide } from "../interview/question-generator.js";
import { writeInterviewGuide } from "../interview/report.js";

const [, , inputPath, outputRoot] = process.argv;

if (!inputPath) {
  console.error("Usage: npm run interview:guide -- <input-json-path> [output-root]");
  process.exit(1);
}

try {
  const input = JSON.parse(await readFile(inputPath, "utf8"));
  const guide = generateInterviewGuide(input);
  const paths = await writeInterviewGuide(guide, outputRoot);

  console.log("Interview guide generated.");
  console.log(`Questions: ${guide.questions.length}`);
  console.log(`JSON: ${paths.jsonPath}`);
  console.log(`Report: ${paths.markdownPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
