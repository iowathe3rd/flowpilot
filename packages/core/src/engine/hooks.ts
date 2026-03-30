import type {
  BeforeEnterHook,
  AfterEnterHook,
  BeforeLeaveHook,
  FlowStartHook,
  FlowCompleteHook,
  FlowSkipHook,
  FlowErrorHook,
} from '../types';

/**
 * Execute a hook safely with error handling
 */
async function executeHook(
  hook: (() => void | Promise<void>) | undefined,
  errorContext: string
): Promise<void> {
  if (!hook) return;

  try {
    const result = hook();
    if (result instanceof Promise) {
      await result;
    }
  } catch (error) {
    console.error(`Error in ${errorContext}:`, error);
    throw error; // Re-throw to allow caller to handle
  }
}

/**
 * Execute step before enter hook
 */
export async function executeBeforeEnter(
  hook: BeforeEnterHook | undefined,
  stepId: string
): Promise<void> {
  return executeHook(hook, `step "${stepId}" beforeEnter hook`);
}

/**
 * Execute step after enter hook
 */
export async function executeAfterEnter(
  hook: AfterEnterHook | undefined,
  stepId: string
): Promise<void> {
  return executeHook(hook, `step "${stepId}" afterEnter hook`);
}

/**
 * Execute step before leave hook
 */
export async function executeBeforeLeave(
  hook: BeforeLeaveHook | undefined,
  stepId: string
): Promise<void> {
  return executeHook(hook, `step "${stepId}" beforeLeave hook`);
}

/**
 * Execute flow start hook
 */
export async function executeFlowStart(
  hook: FlowStartHook | undefined,
  flowId: string
): Promise<void> {
  return executeHook(hook, `flow "${flowId}" onStart hook`);
}

/**
 * Execute flow complete hook
 */
export async function executeFlowComplete(
  hook: FlowCompleteHook | undefined,
  flowId: string
): Promise<void> {
  return executeHook(hook, `flow "${flowId}" onComplete hook`);
}

/**
 * Execute flow skip hook
 */
export async function executeFlowSkip(
  hook: FlowSkipHook | undefined,
  flowId: string
): Promise<void> {
  return executeHook(hook, `flow "${flowId}" onSkip hook`);
}

/**
 * Execute flow error hook
 */
export async function executeFlowError(
  hook: FlowErrorHook | undefined,
  flowId: string,
  error: Error
): Promise<void> {
  if (!hook) return;

  try {
    const result = hook(error);
    if (result instanceof Promise) {
      await result;
    }
  } catch (hookError) {
    console.error(`Error in flow "${flowId}" onError hook:`, hookError);
    // Don't throw - error hook errors shouldn't cascade
  }
}
