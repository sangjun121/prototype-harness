export const SCORE_WEIGHTS = Object.freeze({
  requirementQuality: 20,
  intentMatch: 25,
  coreFlow: 20,
  feedbackQuality: 15,
  visualInformationQuality: 10,
  technicalQuality: 10
});

export const FAILURE_TYPES = Object.freeze({
  requirement: "RequirementFailure",
  prototypeIntent: "PrototypeIntentFailure",
  interview: "InterviewFailure",
  interviewEvidence: "InterviewEvidenceFailure",
  futureOpinion: "FutureOpinionFailure",
  leadingQuestion: "LeadingQuestionFailure",
  intent: "IntentFailure",
  flow: "FlowFailure",
  interaction: "InteractionFailure",
  data: "DataFailure",
  visual: "VisualFailure",
  technical: "TechnicalFailure",
  feedback: "FeedbackFailure",
  security: "SecurityFailure"
});

export function createEvaluationResult(input, gate, intentGate, interviewGate, score, failures) {
  return {
    runId: input.runId,
    date: input.date ?? new Date().toISOString(),
    inputIdea: input.inputIdea,
    passed:
      gate.passed &&
      intentGate.passed &&
      interviewGate.passed &&
      score.passed &&
      failures.blockingFailures.length === 0,
    gate,
    intentGate,
    interviewGate,
    score,
    failures,
    summary: {
      confirmedRequirementCount: input.requirements?.confirmed?.length ?? 0,
      unresolvedRequirementCount: input.requirements?.unresolved?.length ?? 0,
      buildPassed: Boolean(input.checks?.buildPassed),
      coreFlowPassed: Boolean(input.checks?.coreFlowPassed),
      securityScanPassed: Boolean(input.checks?.securityScanPassed),
      interviewEvidencePassed: interviewGate.passed,
      intentMatchScore: input.humanReview?.intentMatchScore ?? null,
      feedbackSpecificityScore: input.humanReview?.feedbackSpecificityScore ?? null,
      overallScore: score.total,
      grade: score.grade,
      majorFailureReason: failures.blockingFailures[0]?.type ?? null
    },
    prototypeIntent: input.prototypeIntent ?? null,
    interview: input.interview ?? null
  };
}

export function validateEvaluationInput(input) {
  const errors = [];

  if (!input || typeof input !== "object") {
    return ["input must be a JSON object"];
  }

  if (!isNonEmptyString(input.runId)) {
    errors.push("runId is required");
  }

  if (!isNonEmptyString(input.inputIdea)) {
    errors.push("inputIdea is required");
  }

  if (!isNonEmptyString(input.prototypeIntent?.primaryHypothesis)) {
    errors.push("prototypeIntent.primaryHypothesis is required");
  }

  if (!isNonEmptyString(input.prototypeIntent?.minimumValidationMethod)) {
    errors.push("prototypeIntent.minimumValidationMethod is required");
  }

  if (!isNonEmptyString(input.prototypeIntent?.prototypeFormat)) {
    errors.push("prototypeIntent.prototypeFormat is required");
  }

  if (!Array.isArray(input.requirements?.confirmed)) {
    errors.push("requirements.confirmed must be an array");
  }

  if (!Array.isArray(input.requirements?.unresolved)) {
    errors.push("requirements.unresolved must be an array");
  }

  for (const key of ["buildPassed", "coreFlowPassed", "securityScanPassed"]) {
    if (typeof input.checks?.[key] !== "boolean") {
      errors.push(`checks.${key} must be a boolean`);
    }
  }

  for (const key of ["intentMatchScore"]) {
    if (!isScore(input.humanReview?.[key])) {
      errors.push(`humanReview.${key} must be a number between 1 and 5`);
    }
  }

  return errors;
}

export function isScore(value) {
  return typeof value === "number" && value >= 1 && value <= 5;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
