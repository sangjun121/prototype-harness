import { INTERVIEW_QUESTION_TYPES } from "./question-generator.js";

export function evaluateInterviewEvidenceGate(input) {
  const interview = input.interview ?? {};
  const plannedQuestions = interview.plannedQuestions ?? [];
  const evidence = interview.evidence ?? {};
  const failures = [];

  if (!Array.isArray(plannedQuestions) || plannedQuestions.length === 0) {
    failures.push(failure("NO_INTERVIEW_GUIDE", "Interview questions were not planned."));
  }

  if (!hasQuestionType(plannedQuestions, INTERVIEW_QUESTION_TYPES.pastBehavior)) {
    failures.push(failure("NO_PAST_BEHAVIOR_QUESTION", "No past behavior question was planned."));
  }

  if (!hasQuestionType(plannedQuestions, INTERVIEW_QUESTION_TYPES.recentStory)) {
    failures.push(failure("NO_RECENT_STORY_QUESTION", "No recent-story replay question was planned."));
  }

  if (!hasQuestionType(plannedQuestions, INTERVIEW_QUESTION_TYPES.prototypeReaction)) {
    failures.push(failure("NO_PROTOTYPE_REACTION_QUESTION", "No prototype reaction question was planned."));
  }

  if ((interview.futureIntentQuestionCount ?? 0) > 0) {
    failures.push(
      failure("FUTURE_INTENT_QUESTION", "Interview plan includes future-intent questions.")
    );
  }

  if ((interview.leadingQuestionCount ?? 0) > 0) {
    failures.push(failure("LEADING_QUESTION", "Interview plan includes leading questions."));
  }

  if ((evidence.interviewCount ?? 0) < 1) {
    failures.push(failure("NO_INTERVIEWS", "No interview evidence was recorded."));
  }

  if ((evidence.pastBehaviorExampleCount ?? 0) < 1) {
    failures.push(failure("NO_PAST_BEHAVIOR_EVIDENCE", "No past behavior evidence was captured."));
  }

  if ((evidence.recentStoryCount ?? 0) < 1) {
    failures.push(failure("NO_RECENT_STORY_EVIDENCE", "No specific recent story was captured."));
  }

  if ((evidence.actionableObservationCount ?? 0) < 1) {
    failures.push(
      failure("NO_ACTIONABLE_OBSERVATION", "No actionable interview observation was captured.")
    );
  }

  if ((evidence.futureOpinionAnswerCount ?? 0) > (evidence.pastBehaviorExampleCount ?? 0)) {
    failures.push(
      failure(
        "TOO_MUCH_FUTURE_OPINION",
        "Future opinion answers outnumber past behavior examples."
      )
    );
  }

  if ((evidence.praiseOnlyFeedbackCount ?? 0) > 0 && (evidence.actionableObservationCount ?? 0) === 0) {
    failures.push(
      failure("PRAISE_ONLY_FEEDBACK", "Praise-only feedback was recorded without actionable evidence.")
    );
  }

  return {
    passed: failures.length === 0,
    plannedQuestionCount: Array.isArray(plannedQuestions) ? plannedQuestions.length : 0,
    interviewCount: evidence.interviewCount ?? 0,
    pastBehaviorExampleCount: evidence.pastBehaviorExampleCount ?? 0,
    recentStoryCount: evidence.recentStoryCount ?? 0,
    futureOpinionAnswerCount: evidence.futureOpinionAnswerCount ?? 0,
    praiseOnlyFeedbackCount: evidence.praiseOnlyFeedbackCount ?? 0,
    actionableObservationCount: evidence.actionableObservationCount ?? 0,
    failures
  };
}

function hasQuestionType(questions, type) {
  return Array.isArray(questions) && questions.some((question) => question.type === type);
}

function failure(code, message) {
  return {
    code,
    message
  };
}
