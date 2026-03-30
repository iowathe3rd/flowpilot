export type TargetSelector = string;
export type TargetResolver = () => unknown | null;
export type TargetSpec = TargetSelector | unknown | TargetResolver | null;

export type MissingTargetStrategy = 'wait' | 'skip' | 'error';

export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'
  | 'center';

export interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ResolvedTarget {
  element: unknown;
  rect: TargetRect;
  isInViewport: boolean;
  isVisible: boolean;
}
