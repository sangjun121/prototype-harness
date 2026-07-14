export const PROTOTYPE_FORMATS = Object.freeze([
  "interactive-web",
  "static-screen",
  "paper-prototype",
  "demo-video-script",
  "manual-concierge",
  "role-play-script",
  "existing-tool-experiment"
]);

export const NEXT_DECISIONS = Object.freeze([
  "keep",
  "revise",
  "discard",
  "validate-again"
]);

export function evaluatePrototypeIntentGate(input) {
  const failures = [];
  const intent = input.prototypeIntent ?? {};

  if (!isNonEmptyString(intent.primaryHypothesis)) {
    failures.push({
      code: "MissingPrimaryHypothesis",
      message: "A primary hypothesis is required before prototype evaluation."
    });
  }

  if (!isNonEmptyString(intent.minimumValidationMethod)) {
    failures.push({
      code: "MissingMinimumValidationMethod",
      message: "A minimum validation method is required before prototype evaluation."
    });
  }

  if (!PROTOTYPE_FORMATS.includes(intent.prototypeFormat)) {
    failures.push({
      code: "InvalidPrototypeFormat",
      message: `prototypeFormat must be one of: ${PROTOTYPE_FORMATS.join(", ")}.`
    });
  }

  if (!Array.isArray(intent.nextDecisionOptions) || intent.nextDecisionOptions.length === 0) {
    failures.push({
      code: "MissingNextDecisionOptions",
      message: "At least one next decision option is required."
    });
  } else {
    const invalidOptions = intent.nextDecisionOptions.filter(
      (option) => !NEXT_DECISIONS.includes(option)
    );

    if (invalidOptions.length > 0) {
      failures.push({
        code: "InvalidNextDecisionOptions",
        message: `Invalid next decision options: ${invalidOptions.join(", ")}.`
      });
    }
  }

  if (intent.cheaperValidationConsidered !== true) {
    failures.push({
      code: "CheaperValidationNotConsidered",
      message: "The harness must consider cheaper validation methods before choosing the prototype format."
    });
  }

  return {
    passed: failures.length === 0,
    primaryHypothesis: intent.primaryHypothesis ?? null,
    minimumValidationMethod: intent.minimumValidationMethod ?? null,
    prototypeFormat: intent.prototypeFormat ?? null,
    cheaperValidationConsidered: intent.cheaperValidationConsidered === true,
    failures
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
