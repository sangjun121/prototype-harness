import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createIntakeSession } from "../src/intake/intake-session.js";
import { writeIntakeReport } from "../src/intake/report.js";

const completeInput = {
  sessionId: "intake-test",
  inputIdea: "Build an app for study members to record learning.",
  answers: {
    targetUser: "Small peer study groups",
    painPoint: "Members forget to record what they learned.",
    primaryHypothesis: "A one-minute flow will increase consistent recording.",
    successSignal: "Users complete a realistic record without explanation.",
    minimumValidationMethod: "Interactive web prototype with realistic dummy data.",
    prototypeFormat: "interactive-web"
  }
};

test("complete intake can proceed and produces confirmed requirements", () => {
  const intake = createIntakeSession(completeInput);

  assert.equal(intake.ok, true);
  assert.equal(intake.result.canProceed, true);
  assert.equal(intake.result.requirements.unresolved.length, 0);
  assert.equal(intake.result.requirements.confirmed.length, 6);
  assert.equal(intake.result.prototypeIntent.prototypeFormat, "interactive-web");
});

test("intake does not infer missing requirements from the idea text", () => {
  const intake = createIntakeSession({
    sessionId: "no-inference",
    inputIdea:
      "Build an app for weekly study members who forget to record what they learned.",
    answers: {}
  });

  assert.equal(intake.ok, true);
  assert.equal(intake.result.canProceed, false);
  assert.ok(intake.result.missingFields.includes("targetUser"));
  assert.ok(intake.result.missingFields.includes("painPoint"));
  assert.equal(intake.result.requirements.confirmed.length, 0);
});

test("partial intake returns only unanswered clarification questions", () => {
  const intake = createIntakeSession({
    sessionId: "partial",
    inputIdea: "Build a study record app.",
    answers: {
      targetUser: "Small peer study groups",
      painPoint: "Members forget to record learning."
    }
  });

  assert.equal(intake.result.canProceed, false);
  assert.deepEqual(intake.result.missingFields, [
    "primaryHypothesis",
    "successSignal",
    "minimumValidationMethod",
    "prototypeFormat"
  ]);
  assert.equal(intake.result.clarificationQuestions.length, 4);
});

test("unsupported prototype format blocks intake", () => {
  const intake = createIntakeSession({
    ...completeInput,
    sessionId: "invalid-format",
    answers: {
      ...completeInput.answers,
      prototypeFormat: "native-mobile-app"
    }
  });

  assert.equal(intake.result.canProceed, false);
  assert.equal(intake.result.invalidAnswers[0].fieldId, "prototypeFormat");
});

test("invalid intake input returns validation errors", () => {
  const intake = createIntakeSession({
    sessionId: "",
    inputIdea: "",
    answers: []
  });

  assert.equal(intake.ok, false);
  assert.ok(intake.validationErrors.length >= 3);
});

test("intake report writes json and markdown", async () => {
  const intake = createIntakeSession(completeInput);
  const outputRoot = await mkdtemp(join(tmpdir(), "prototype-intake-test-"));

  try {
    const paths = await writeIntakeReport(intake.result, outputRoot);
    const json = JSON.parse(await readFile(paths.jsonPath, "utf8"));
    const markdown = await readFile(paths.markdownPath, "utf8");

    assert.equal(json.sessionId, "intake-test");
    assert.match(markdown, /# Intake Report: intake-test/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
