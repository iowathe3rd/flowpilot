import type { TargetSpec, Placement, MissingTargetStrategy } from './target';

export type StepGuard = () => boolean | Promise<boolean>;
export type BeforeEnterHook = () => void | Promise<void>;
export type AfterEnterHook = () => void | Promise<void>;
export type BeforeLeaveHook = () => void | Promise<void>;

export interface StepConfig {
  id: string;
  target?: TargetSpec;
  when?: StepGuard;
  onMissingTarget?: MissingTargetStrategy;
  placement?: Placement;
  waitForTarget?: number;
  beforeEnter?: BeforeEnterHook;
  afterEnter?: AfterEnterHook;
  beforeLeave?: BeforeLeaveHook;
  next?: string;
  meta?: Record<string, unknown>;
}

export interface Step extends StepConfig {
  index: number;
  isActive: boolean;
  isVisited: boolean;
  isCompleted: boolean;
}
