export function evaluateRequirementGate(input) {
  const failures = [];
  const confirmed = input.requirements?.confirmed ?? [];
  const unresolved = input.requirements?.unresolved ?? [];

  if (!input.inputIdea || input.inputIdea.trim().length === 0) {
    failures.push({
      code: "MissingInputIdea",
      message: "inputIdea must be present before evaluation."
    });
  }

  if (confirmed.length === 0) {
    failures.push({
      code: "NoConfirmedRequirements",
      message: "At least one confirmed requirement is required."
    });
  }

  if (unresolved.length > 0) {
    failures.push({
      code: "UnresolvedRequirements",
      message: "Unresolved requirements block prototype generation.",
      items: unresolved
    });
  }

  return {
    passed: failures.length === 0,
    confirmedRequirementCount: confirmed.length,
    unresolvedRequirementCount: unresolved.length,
    failures
  };
}
