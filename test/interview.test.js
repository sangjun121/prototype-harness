import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateInterviewGuide } from "../src/interview/question-generator.js";
import { evaluateInterviewEvidenceGate } from "../src/interview/evidence-gate.js";
import { writeInterviewGuide } from "../src/interview/report.js";

test("interview guide asks for past behavior and recent stories", () => {
  const guide = generateInterviewGuide({
    runId: "guide-test",
    prototypeIntent: {
      primaryHypothesis: "Users need a shorter study record flow.",
      minimumValidationMethod: "Interactive web prototype."
    }
  });

  assert.equal(guide.questions.length, 6);
  assert.ok(guide.questions.some((question) => question.type === "past-behavior"));
  assert.ok(guide.questions.some((question) => question.type === "recent-story"));
  assert.ok(guide.questions.some((question) => question.type === "prototype-reaction"));
  assert.ok(guide.forbiddenQuestions.includes("Would you use this?"));
});

test("interview evidence gate passes with past behavior evidence", () => {
  const gate = evaluateInterviewEvidenceGate({
    interview: {
      plannedQuestions: [
        { type: "past-behavior", text: "When was the most recent time?" },
        { type: "recent-story", text: "Walk me through it." },
        { type: "prototype-reaction", text: "Where did you hesitate?" }
      ],
      futureIntentQuestionCount: 0,
      leadingQuestionCount: 0,
      evidence: {
        interviewCount: 2,
        pastBehaviorExampleCount: 2,
        recentStoryCount: 1,
        futureOpinionAnswerCount: 0,
        praiseOnlyFeedbackCount: 0,
        actionableObservationCount: 2
      }
    }
  });

  assert.equal(gate.passed, true);
});

test("interview evidence gate fails without recent story evidence", () => {
  const gate = evaluateInterviewEvidenceGate({
    interview: {
      plannedQuestions: [{ type: "past-behavior", text: "When was the most recent time?" }],
      futureIntentQuestionCount: 0,
      leadingQuestionCount: 0,
      evidence: {
        interviewCount: 1,
        pastBehaviorExampleCount: 1,
        recentStoryCount: 0,
        futureOpinionAnswerCount: 0,
        praiseOnlyFeedbackCount: 0,
        actionableObservationCount: 1
      }
    }
  });

  assert.equal(gate.passed, false);
  assert.ok(gate.failures.some((failure) => failure.code === "NO_RECENT_STORY_QUESTION"));
  assert.ok(gate.failures.some((failure) => failure.code === "NO_RECENT_STORY_EVIDENCE"));
});

test("interview guide report writes json and markdown", async () => {
  const guide = generateInterviewGuide({ runId: "guide-report-test" });
  const outputRoot = await mkdtemp(join(tmpdir(), "prototype-interview-test-"));

  try {
    const paths = await writeInterviewGuide(guide, outputRoot);
    const json = JSON.parse(await readFile(paths.jsonPath, "utf8"));
    const markdown = await readFile(paths.markdownPath, "utf8");

    assert.equal(json.runId, "guide-report-test");
    assert.match(markdown, /# Interview Guide: guide-report-test/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
