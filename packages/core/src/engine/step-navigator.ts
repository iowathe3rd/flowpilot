import type { Flow, StepConfig } from '../types';

/**
 * Navigator for managing step progression within a flow
 */
export class StepNavigator {
  private flow: Flow;
  private currentIndex: number;

  constructor(flow: Flow, initialStepId?: string) {
    this.flow = flow;
    
    // Determine starting index
    if (initialStepId) {
      const index = flow.steps.findIndex((s) => s.id === initialStepId);
      if (index === -1) {
        throw new Error(`Initial step "${initialStepId}" not found`);
      }
      this.currentIndex = index;
    } else {
      this.currentIndex = 0;
    }
  }

  /**
   * Get current step
   */
  getCurrentStep(): StepConfig | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.flow.steps.length) {
      return null;
    }
    return this.flow.steps[this.currentIndex];
  }

  /**
   * Get current index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get total step count
   */
  getTotalSteps(): number {
    return this.flow.steps.length;
  }

  /**
   * Check if can go to next step
   */
  canNext(): boolean {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return false;
    
    // If step has explicit next, check if it exists
    if (currentStep.next) {
      return this.flow.stepMap.has(currentStep.next);
    }
    
    // Otherwise check if there's a next step in sequence
    return this.currentIndex < this.flow.steps.length - 1;
  }

  /**
   * Check if can go to previous step
   */
  canPrev(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if on first step
   */
  isFirst(): boolean {
    return this.currentIndex === 0;
  }

  /**
   * Check if on last step
   */
  isLast(): boolean {
    return this.currentIndex === this.flow.steps.length - 1;
  }

  /**
   * Move to next step
   */
  next(): StepConfig | null {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return null;

    // If step has explicit next, jump to it
    if (currentStep.next) {
      const nextIndex = this.flow.steps.findIndex(
        (s) => s.id === currentStep.next
      );
      if (nextIndex !== -1) {
        this.currentIndex = nextIndex;
        return this.getCurrentStep();
      }
      return null;
    }

    // Otherwise move to next in sequence
    if (this.canNext()) {
      this.currentIndex++;
      return this.getCurrentStep();
    }

    return null;
  }

  /**
   * Move to previous step
   */
  prev(): StepConfig | null {
    if (this.canPrev()) {
      this.currentIndex--;
      return this.getCurrentStep();
    }
    return null;
  }

  /**
   * Go to specific step by ID
   */
  goTo(stepId: string): StepConfig | null {
    const index = this.flow.steps.findIndex((s) => s.id === stepId);
    if (index === -1) {
      return null;
    }
    this.currentIndex = index;
    return this.getCurrentStep();
  }

  /**
   * Go to specific index
   */
  goToIndex(index: number): StepConfig | null {
    if (index < 0 || index >= this.flow.steps.length) {
      return null;
    }
    this.currentIndex = index;
    return this.getCurrentStep();
  }

  /**
   * Reset to first step
   */
  reset(): StepConfig | null {
    this.currentIndex = 0;
    return this.getCurrentStep();
  }

  /**
   * Get step by ID
   */
  getStep(stepId: string): StepConfig | undefined {
    return this.flow.stepMap.get(stepId);
  }

  /**
   * Get all steps
   */
  getAllSteps(): StepConfig[] {
    return [...this.flow.steps];
  }
}
