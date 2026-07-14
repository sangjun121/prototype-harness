import { SCORE_WEIGHTS, isScore } from "./schema.js";

export function calculateScore(input, gate, intentGate) {
  const sections = {
    requirementQuality: scoreRequirementQuality(input, gate, intentGate),
    intentMatch: scoreIntentMatch(input),
    coreFlow: scoreCoreFlow(input),
    feedbackQuality: scoreFeedbackQuality(input),
    visualInformationQuality: scoreVisualInformationQuality(input),
    technicalQuality: scoreTechnicalQuality(input)
  };

  const total = round(
    Object.values(sections).reduce((sum, section) => sum + section.score, 0)
  );

  const intentAverage = averageScores([
    input.humanReview?.intentMatchScore,
    input.humanReview?.coreIdeaReflectedScore
  ]);

  const passed =
    total >= 80 &&
    gate.passed &&
    intentGate.passed &&
    input.checks?.buildPassed === true &&
    input.checks?.coreFlowPassed === true &&
    input.checks?.securityScanPassed === true &&
    intentAverage >= 4;

  return {
    total,
    grade: gradeFor(total),
    passed,
    sections,
    minimumCriteria: {
      overallScoreAtLeast80: total >= 80,
      buildPassed: input.checks?.buildPassed === true,
      coreFlowPassed: input.checks?.coreFlowPassed === true,
      securityScanPassed: input.checks?.securityScanPassed === true,
      noUnresolvedRequirements: gate.unresolvedRequirementCount === 0,
      prototypeIntentPassed: intentGate.passed,
      intentMatchAtLeast4: intentAverage >= 4
    }
  };
}

function scoreRequirementQuality(input, gate, intentGate) {
  if (!gate.passed) {
    return section(0, "Requirement gate failed.");
  }

  const questionCount = input.metrics?.questionCount ?? input.requirements?.clarificationQuestions?.length ?? 0;
  const unnecessaryQuestionCount = input.metrics?.unnecessaryQuestionCount ?? 0;
  const missedCoreQuestionCount = input.metrics?.missedCoreQuestionCount ?? 0;

  let score = SCORE_WEIGHTS.requirementQuality;

  if (!intentGate.passed) {
    score -= 8;
  }

  if (questionCount > 0) {
    const unnecessaryRatio = unnecessaryQuestionCount / questionCount;
    score -= Math.min(6, unnecessaryRatio * 10);
  }

  score -= Math.min(8, missedCoreQuestionCount * 4);

  return section(clamp(score, 0, SCORE_WEIGHTS.requirementQuality), "Requirement confirmation quality.");
}

function scoreIntentMatch(input) {
  const average = averageScores([
    input.humanReview?.intentMatchScore,
    input.humanReview?.coreIdeaReflectedScore
  ]);

  return weightedScore(average, SCORE_WEIGHTS.intentMatch, "User intent match.");
}

function scoreCoreFlow(input) {
  let score = 0;

  if (input.checks?.coreFlowPassed) {
    score += 12;
  }

  if ((input.checks?.deadCtaCount ?? 0) === 0) {
    score += 4;
  }

  if (input.checks?.stateChangePassed !== false) {
    score += 4;
  }

  return section(clamp(score, 0, SCORE_WEIGHTS.coreFlow), "Core flow completion.");
}

function scoreFeedbackQuality(input) {
  const reviewScore = input.humanReview?.feedbackSpecificityScore;
  const feedbackItems = input.feedback?.items ?? [];

  if (isScore(reviewScore)) {
    return weightedScore(reviewScore, SCORE_WEIGHTS.feedbackQuality, "Feedback specificity.");
  }

  if (feedbackItems.length === 0) {
    return section(0, "No feedback items were provided.");
  }

  const actionableCount = feedbackItems.filter((item) => item.actionable === true).length;
  return section(
    round((actionableCount / feedbackItems.length) * SCORE_WEIGHTS.feedbackQuality),
    "Actionable feedback ratio."
  );
}

function scoreVisualInformationQuality(input) {
  const average = averageScores([
    input.humanReview?.firstScreenActionClarityScore,
    input.humanReview?.informationStructureScore,
    input.humanReview?.dummyDataRealismScore
  ]);

  return weightedScore(average, SCORE_WEIGHTS.visualInformationQuality, "Visual and information quality.");
}

function scoreTechnicalQuality(input) {
  let score = 0;

  if (input.checks?.buildPassed) {
    score += 4;
  }

  if (input.checks?.securityScanPassed) {
    score += 2;
  }

  if ((input.checks?.consoleErrorCount ?? 0) === 0) {
    score += 2;
  }

  if ((input.checks?.layoutIssueCount ?? 0) === 0) {
    score += 2;
  }

  return section(clamp(score, 0, SCORE_WEIGHTS.technicalQuality), "Technical quality.");
}

function weightedScore(value, weight, label) {
  if (!isScore(value)) {
    return section(0, `${label} score was not provided.`);
  }

  return section(round((value / 5) * weight), label);
}

function averageScores(values) {
  const scores = values.filter(isScore);

  if (scores.length === 0) {
    return 0;
  }

  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

function section(score, reason) {
  return {
    score: round(score),
    reason
  };
}

function gradeFor(total) {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}
