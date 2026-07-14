import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { evaluateRun } from "../src/evaluation/evaluate.js";
import { writeRunReport } from "../src/evaluation/report.js";

const validInput = {
  runId: "test-run",
  inputIdea: "A tool for study members to record weekly learning.",
  prototypeIntent: {
    primaryHypothesis: "Study members will record weekly learning more consistently if the flow is short.",
    minimumValidationMethod: "Interactive web prototype with realistic dummy data.",
    prototypeFormat: "interactive-web",
    cheaperValidationConsidered: true,
    nextDecisionOptions: ["keep", "revise", "discard", "validate-again"]
  },
  requirements: {
    confirmed: ["Team study records are in scope."],
    unresolved: [],
    clarificationQuestions: ["Is it personal or shared?"],
    delegatedDecisions: []
  },
  checks: {
    buildPassed: true,
    coreFlowPassed: true,
    securityScanPassed: true,
    deadCtaCount: 0,
    stateChangePassed: true,
    consoleErrorCount: 0,
    layoutIssueCount: 0
  },
  humanReview: {
    intentMatchScore: 4.5,
    coreIdeaReflectedScore: 4.2,
    feedbackSpecificityScore: 4.2,
    firstScreenActionClarityScore: 4.1,
    informationStructureScore: 4.0,
    dummyDataRealismScore: 4.2
  },
  metrics: {
    questionCount: 1,
    unnecessaryQuestionCount: 0,
    missedCoreQuestionCount: 0
  },
  feedback: {
    items: [{ text: "Show action item status in the list.", actionable: true }]
  }
};

test("valid run passes minimum criteria", () => {
  const evaluation = evaluateRun(validInput);

  assert.equal(evaluation.ok, true);
  assert.equal(evaluation.result.passed, true);
  assert.equal(evaluation.result.score.grade, "A");
});

test("unresolved requirements block the run", () => {
  const evaluation = evaluateRun({
    ...validInput,
    runId: "blocked-run",
    requirements: {
      ...validInput.requirements,
      unresolved: ["Target user is not confirmed."]
    }
  });

  assert.equal(evaluation.ok, true);
  assert.equal(evaluation.result.passed, false);
  assert.equal(evaluation.result.gate.passed, false);
  assert.equal(evaluation.result.failures.blockingFailures[0].type, "RequirementFailure");
});

test("prototype intent gate blocks missing next decision options", () => {
  const evaluation = evaluateRun({
    ...validInput,
    runId: "intent-gate-failure",
    prototypeIntent: {
      ...validInput.prototypeIntent,
      nextDecisionOptions: []
    }
  });

  assert.equal(evaluation.ok, true);
  assert.equal(evaluation.result.passed, false);
  assert.equal(evaluation.result.intentGate.passed, false);
  assert.ok(
    evaluation.result.failures.blockingFailures.some(
      (failure) => failure.type === "PrototypeIntentFailure"
    )
  );
});

test("prototype intent gate requires cheaper validation consideration", () => {
  const evaluation = evaluateRun({
    ...validInput,
    runId: "cheaper-validation-not-considered",
    prototypeIntent: {
      ...validInput.prototypeIntent,
      cheaperValidationConsidered: false
    }
  });

  assert.equal(evaluation.ok, true);
  assert.equal(evaluation.result.passed, false);
  assert.equal(evaluation.result.intentGate.passed, false);
});

test("technical failures are classified", () => {
  const evaluation = evaluateRun({
    ...validInput,
    runId: "technical-failure",
    checks: {
      ...validInput.checks,
      buildPassed: false
    }
  });

  assert.equal(evaluation.result.passed, false);
  assert.ok(
    evaluation.result.failures.blockingFailures.some((failure) => failure.type === "TechnicalFailure")
  );
});

test("invalid input returns validation errors", () => {
  const evaluation = evaluateRun({
    runId: "",
    inputIdea: "",
    requirements: {
      confirmed: [],
      unresolved: []
    },
    checks: {
      buildPassed: true,
      coreFlowPassed: true,
      securityScanPassed: true
    },
    humanReview: {
      intentMatchScore: 6
    }
  });

  assert.equal(evaluation.ok, false);
  assert.ok(evaluation.validationErrors.length > 0);
});

test("run report writes json and markdown", async () => {
  const evaluation = evaluateRun(validInput);
  const outputRoot = await mkdtemp(join(tmpdir(), "prototype-harness-test-"));

  try {
    const paths = await writeRunReport(evaluation.result, outputRoot);
    const json = JSON.parse(await readFile(paths.jsonPath, "utf8"));
    const markdown = await readFile(paths.markdownPath, "utf8");

    assert.equal(json.runId, "test-run");
    assert.match(markdown, /# Evaluation Report: test-run/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
