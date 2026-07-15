import { FAILURE_TYPES } from "./schema.js";

export function classifyFailures(input, gate, intentGate, interviewGate, score) {
  const failures = [];

  if (!gate.passed) {
    failures.push(blocking(FAILURE_TYPES.requirement, "Requirement gate failed."));
  }

  if (!intentGate.passed) {
    failures.push(blocking(FAILURE_TYPES.prototypeIntent, "Prototype intent gate failed."));
  }

  if (!interviewGate.passed) {
    failures.push(blocking(FAILURE_TYPES.interview, "Interview evidence gate failed."));
  }

  for (const failure of interviewGate.failures ?? []) {
    if (failure.code === "FUTURE_INTENT_QUESTION" || failure.code === "TOO_MUCH_FUTURE_OPINION") {
      failures.push(blocking(FAILURE_TYPES.futureOpinion, failure.message));
    }

    if (failure.code === "LEADING_QUESTION") {
      failures.push(blocking(FAILURE_TYPES.leadingQuestion, failure.message));
    }

    if (
      failure.code === "NO_PAST_BEHAVIOR_EVIDENCE" ||
      failure.code === "NO_RECENT_STORY_EVIDENCE" ||
      failure.code === "NO_ACTIONABLE_OBSERVATION"
    ) {
      failures.push(blocking(FAILURE_TYPES.interviewEvidence, failure.message));
    }
  }

  if (input.checks?.securityScanPassed !== true) {
    failures.push(blocking(FAILURE_TYPES.security, "Security scan did not pass."));
  }

  if (input.checks?.buildPassed !== true) {
    failures.push(blocking(FAILURE_TYPES.technical, "Build check did not pass."));
  }

  if (input.checks?.coreFlowPassed !== true) {
    failures.push(blocking(FAILURE_TYPES.flow, "Core flow check did not pass."));
  }

  if ((input.checks?.deadCtaCount ?? 0) > 0 || input.checks?.stateChangePassed === false) {
    failures.push(nonBlocking(FAILURE_TYPES.interaction, "Interaction quality issue detected."));
  }

  if ((input.checks?.layoutIssueCount ?? 0) > 0) {
    failures.push(nonBlocking(FAILURE_TYPES.visual, "Layout issue detected."));
  }

  if ((input.humanReview?.dummyDataRealismScore ?? 5) < 4) {
    failures.push(nonBlocking(FAILURE_TYPES.data, "Dummy data realism score is below target."));
  }

  if ((input.humanReview?.intentMatchScore ?? 0) < 4) {
    failures.push(blocking(FAILURE_TYPES.intent, "Intent match score is below 4.0."));
  }

  if ((input.humanReview?.feedbackSpecificityScore ?? 5) < 4) {
    failures.push(nonBlocking(FAILURE_TYPES.feedback, "Feedback specificity score is below target."));
  }

  if (score.total < 80) {
    failures.push(blocking("ScoreFailure", "Overall score is below 80."));
  }

  return {
    blockingFailures: failures.filter((failure) => failure.blocking),
    nonBlockingFailures: failures.filter((failure) => !failure.blocking),
    all: failures
  };
}

function blocking(type, message) {
  return {
    type,
    message,
    blocking: true
  };
}

function nonBlocking(type, message) {
  return {
    type,
    message,
    blocking: false
  };
}
