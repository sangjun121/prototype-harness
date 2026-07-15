import { PROTOTYPE_FORMATS } from "../evaluation/prototype-intent-gate.js";

export const REQUIRED_INTAKE_FIELDS = Object.freeze([
  {
    id: "targetUser",
    label: "Target user",
    question: "Who is the first specific user group that should try this prototype?"
  },
  {
    id: "painPoint",
    label: "Pain point",
    question: "What concrete inconvenience or problem should this prototype address?"
  },
  {
    id: "primaryHypothesis",
    label: "Primary hypothesis",
    question: "What is the most important hypothesis this prototype should test?"
  },
  {
    id: "successSignal",
    label: "Success signal",
    question: "What observable user behavior or feedback would count as a useful signal?"
  },
  {
    id: "minimumValidationMethod",
    label: "Minimum validation method",
    question: "What is the cheapest way to let users experience or react to the core idea?"
  },
  {
    id: "prototypeFormat",
    label: "Prototype format",
    question: `Which prototype format should be used? Allowed values: ${PROTOTYPE_FORMATS.join(", ")}.`
  }
]);

export function validateIntakeInput(input) {
  const errors = [];

  if (!input || typeof input !== "object") {
    return ["input must be a JSON object"];
  }

  if (!isNonEmptyString(input.sessionId)) {
    errors.push("sessionId is required");
  }

  if (!isNonEmptyString(input.inputIdea)) {
    errors.push("inputIdea is required");
  }

  if (input.answers !== undefined && !isPlainObject(input.answers)) {
    errors.push("answers must be an object when provided");
  }

  return errors;
}

export function isValidPrototypeFormat(value) {
  return PROTOTYPE_FORMATS.includes(value);
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
