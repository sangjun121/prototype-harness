export const INTERVIEW_QUESTION_TYPES = Object.freeze({
  pastBehavior: "past-behavior",
  recentStory: "recent-story",
  workaround: "workaround",
  cost: "cost",
  prototypeReaction: "prototype-reaction",
  silencePrompt: "silence-prompt"
});

export const FORBIDDEN_QUESTION_PATTERNS = Object.freeze([
  "Would you use this?",
  "Do you like this?",
  "Would you pay for this?",
  "Is this a good idea?"
]);

export function generateInterviewGuide(input) {
  const runId = input.runId ?? input.sessionId ?? "interview-guide";
  const hypothesis = input.prototypeIntent?.primaryHypothesis ?? "the core hypothesis";
  const minimumValidationMethod =
    input.prototypeIntent?.minimumValidationMethod ?? "the minimum validation method";

  return {
    runId,
    principle:
      "Ask about past behavior and specific recent stories. Do not treat compliments or future intent as evidence.",
    hypothesis,
    minimumValidationMethod,
    questions: [
      question(
        INTERVIEW_QUESTION_TYPES.pastBehavior,
        "When was the most recent time you experienced this problem?"
      ),
      question(
        INTERVIEW_QUESTION_TYPES.recentStory,
        "Walk me through that specific moment from beginning to end. What happened first?"
      ),
      question(
        INTERVIEW_QUESTION_TYPES.workaround,
        "What did you actually do to solve or work around it at that time?"
      ),
      question(
        INTERVIEW_QUESTION_TYPES.cost,
        "How much time, money, effort, or help did that workaround require?"
      ),
      question(
        INTERVIEW_QUESTION_TYPES.prototypeReaction,
        "While using this prototype, where did you hesitate, stop, or feel that something did not match your situation?"
      ),
      question(
        INTERVIEW_QUESTION_TYPES.silencePrompt,
        "What happened right before that? Take your time and describe the scene."
      )
    ],
    forbiddenQuestions: FORBIDDEN_QUESTION_PATTERNS,
    evidenceToCapture: [
      "specific recent story",
      "actual behavior",
      "tool or workaround used",
      "time, money, effort, or help spent",
      "prototype hesitation point",
      "actionable observation"
    ]
  };
}

function question(type, text) {
  return {
    type,
    text,
    asksPastBehavior: type !== INTERVIEW_QUESTION_TYPES.prototypeReaction,
    avoidsFutureIntent: true
  };
}
