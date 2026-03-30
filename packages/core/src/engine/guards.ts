import type { StepConfig, StepGuard } from '../types';

/**
 * Evaluate a step guard to determine if step should be included
 */
export async function evaluateGuard(
  guard: StepGuard | undefined
): Promise<boolean> {
  if (!guard) {
    return true; // No guard means step is included
  }

  try {
    const result = guard();
    // Handle both sync and async guards
    return result instanceof Promise ? await result : result;
  } catch (error) {
    // Guard errors mean step is excluded
    console.error('Error evaluating step guard:', error);
    return false;
  }
}

/**
 * Filter steps based on their when conditions
 */
export async function filterSteps(
  steps: StepConfig[]
): Promise<StepConfig[]> {
  const results = await Promise.all(
    steps.map(async (step) => ({
      step,
      included: await evaluateGuard(step.when),
    }))
  );

  return results.filter((r) => r.included).map((r) => r.step);
}

/**
 * Check if a step should be included (sync version for performance)
 */
export function shouldIncludeStep(step: StepConfig): boolean {
  if (!step.when) {
    return true;
  }

  try {
    const result = step.when();
    // Only support sync guards in sync check
    return result instanceof Promise ? true : result;
  } catch {
    return false;
  }
}
