import {
  REQUIRED_INTAKE_FIELDS,
  isNonEmptyString,
  isValidPrototypeFormat,
  validateIntakeInput
} from "./intake-schema.js";

export function createIntakeSession(input) {
  const validationErrors = validateIntakeInput(input);

  if (validationErrors.length > 0) {
    return {
      ok: false,
      validationErrors
    };
  }

  const answers = normalizeAnswers(input.answers ?? {});
  const missingFields = findMissingFields(answers);
  const invalidAnswers = findInvalidAnswers(answers);
  const unresolvedRequirements = [
    ...missingFields.map((field) => `${field.label} is not confirmed.`),
    ...invalidAnswers.map((answer) => answer.reason)
  ];

  const clarificationQuestions = [
    ...missingFields.map((field) => ({
      fieldId: field.id,
      question: field.question,
      required: true
    })),
    ...invalidAnswers.map((answer) => ({
      fieldId: answer.fieldId,
      question: answer.repairQuestion,
      required: true
    }))
  ];

  const canProceed = unresolvedRequirements.length === 0;

  return {
    ok: true,
    result: {
      sessionId: input.sessionId,
      inputIdea: input.inputIdea,
      canProceed,
      policy: {
        assumptionMode: "no-assumptions",
        userAnswerRequired: true
      },
      answers,
      missingFields: missingFields.map((field) => field.id),
      invalidAnswers,
      clarificationQuestions,
      requirements: {
        confirmed: canProceed ? createConfirmedRequirements(answers) : [],
        unresolved: unresolvedRequirements,
        clarificationQuestions: clarificationQuestions.map((item) => item.question),
        delegatedDecisions: []
      },
      prototypeIntent: canProceed ? createPrototypeIntent(answers) : null
    }
  };
}

export function findMissingFields(answers) {
  return REQUIRED_INTAKE_FIELDS.filter((field) => !isNonEmptyString(answers[field.id]));
}

function findInvalidAnswers(answers) {
  if (!isNonEmptyString(answers.prototypeFormat)) {
    return [];
  }

  if (isValidPrototypeFormat(answers.prototypeFormat)) {
    return [];
  }

  return [
    {
      fieldId: "prototypeFormat",
      value: answers.prototypeFormat,
      reason: `Prototype format is not supported: ${answers.prototypeFormat}.`,
      repairQuestion:
        "Choose one supported prototype format before generation can continue."
    }
  ];
}

function createConfirmedRequirements(answers) {
  return [
    `Target user: ${answers.targetUser}`,
    `Pain point: ${answers.painPoint}`,
    `Primary hypothesis: ${answers.primaryHypothesis}`,
    `Success signal: ${answers.successSignal}`,
    `Minimum validation method: ${answers.minimumValidationMethod}`,
    `Prototype format: ${answers.prototypeFormat}`
  ];
}

function createPrototypeIntent(answers) {
  return {
    primaryHypothesis: answers.primaryHypothesis,
    minimumValidationMethod: answers.minimumValidationMethod,
    prototypeFormat: answers.prototypeFormat,
    cheaperValidationConsidered: true,
    nextDecisionOptions: ["keep", "revise", "discard", "validate-again"]
  };
}

function normalizeAnswers(answers) {
  return Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value
    ])
  );
}
