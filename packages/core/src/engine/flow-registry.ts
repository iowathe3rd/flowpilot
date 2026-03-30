import type { Flow, FlowConfig } from '../types';

/**
 * Validates and creates a Flow from FlowConfig
 */
function createFlow(config: FlowConfig): Flow {
  // Validate flow has steps
  if (!config.steps || config.steps.length === 0) {
    throw new Error(`Flow "${config.id}" must have at least one step`);
  }

  // Validate unique step IDs
  const stepIds = new Set<string>();
  for (const step of config.steps) {
    if (stepIds.has(step.id)) {
      throw new Error(`Duplicate step ID "${step.id}" in flow "${config.id}"`);
    }
    stepIds.add(step.id);
  }

  // Validate initialStep exists
  if (config.initialStep && !stepIds.has(config.initialStep)) {
    throw new Error(
      `Initial step "${config.initialStep}" not found in flow "${config.id}"`
    );
  }

  // Validate next step references
  for (const step of config.steps) {
    if (step.next && !stepIds.has(step.next)) {
      throw new Error(
        `Step "${step.id}" references non-existent next step "${step.next}"`
      );
    }
  }

  // Create step map for O(1) lookup
  const stepMap = new Map(config.steps.map((step) => [step.id, step]));

  return {
    ...config,
    stepMap,
  };
}

/**
 * Registry for managing multiple flows
 */
export class FlowRegistry {
  private flows: Map<string, Flow> = new Map();

  /**
   * Register a new flow
   */
  register(config: FlowConfig): Flow {
    if (this.flows.has(config.id)) {
      throw new Error(`Flow "${config.id}" is already registered`);
    }

    const flow = createFlow(config);
    this.flows.set(config.id, flow);
    return flow;
  }

  /**
   * Get a flow by ID
   */
  get(flowId: string): Flow | undefined {
    return this.flows.get(flowId);
  }

  /**
   * Check if a flow exists
   */
  has(flowId: string): boolean {
    return this.flows.has(flowId);
  }

  /**
   * Unregister a flow
   */
  unregister(flowId: string): boolean {
    return this.flows.delete(flowId);
  }

  /**
   * Get all registered flow IDs
   */
  getFlowIds(): string[] {
    return Array.from(this.flows.keys());
  }

  /**
   * Clear all flows
   */
  clear(): void {
    this.flows.clear();
  }

  /**
   * Get flow count
   */
  size(): number {
    return this.flows.size;
  }
}
