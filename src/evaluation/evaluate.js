import { validateEvaluationInput, createEvaluationResult } from "./schema.js";
import { evaluateRequirementGate } from "./requirement-gate.js";
import { evaluatePrototypeIntentGate } from "./prototype-intent-gate.js";
import { calculateScore } from "./score-calculator.js";
import { classifyFailures } from "./failure-classifier.js";

export function evaluateRun(input) {
  const validationErrors = validateEvaluationInput(input);

  if (validationErrors.length > 0) {
    return {
      ok: false,
      validationErrors
    };
  }

  const gate = evaluateRequirementGate(input);
  const intentGate = evaluatePrototypeIntentGate(input);
  const score = calculateScore(input, gate, intentGate);
  const failures = classifyFailures(input, gate, intentGate, score);

  return {
    ok: true,
    result: createEvaluationResult(input, gate, intentGate, score, failures)
  };
}
